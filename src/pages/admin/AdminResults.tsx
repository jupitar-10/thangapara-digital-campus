import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Save, X, Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SubjectEntry {
  subject: string;
  full_marks: string;
  obtained: string;
}

interface ResultItem {
  id: string;
  student_name: string;
  roll_number: string;
  class: string;
  exam_name: string;
  year: string;
  subjects: any[];
  total_marks: number | null;
  obtained_marks: number | null;
  percentage: number | null;
  grade: string | null;
  status: string;
}

interface CsvRow {
  student_name: string;
  roll_number: string;
  class: string;
  exam_name: string;
  year: string;
  grade: string;
  status: string;
  subjects: { subject: string; full_marks: number; obtained: number }[];
  total_marks: number;
  obtained_marks: number;
  percentage: number;
}

const emptySubject: SubjectEntry = { subject: "", full_marks: "100", obtained: "" };

const emptyForm = {
  student_name: "",
  roll_number: "",
  class_name: "",
  exam_name: "",
  year: new Date().getFullYear().toString(),
  grade: "",
  status: "pass",
  subjects: [{ ...emptySubject }] as SubjectEntry[],
};

function parseCsv(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };
  const parse = (line: string) => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === "," && !inQuotes) { result.push(current.trim()); current = ""; continue; }
      current += ch;
    }
    result.push(current.trim());
    return result;
  };
  const headers = parse(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, "_"));
  const rows = lines.slice(1).map(parse);
  return { headers, rows };
}

function processCsvRows(headers: string[], rows: string[][]): { data: CsvRow[]; errors: string[] } {
  const errors: string[] = [];
  const data: CsvRow[] = [];

  // Identify subject columns (pairs of subject_name and subject_obtained)
  const requiredCols = ["student_name", "roll_number", "class", "exam_name", "year"];
  const missing = requiredCols.filter((c) => !headers.includes(c));
  if (missing.length > 0) {
    errors.push(`Missing required columns: ${missing.join(", ")}`);
    return { data, errors };
  }

  // Find subject columns: any column ending with _full or _obtained, or subject pairs
  const subjectCols: { name: string; fullIdx: number; obtIdx: number }[] = [];
  const subjectNames = new Set<string>();

  headers.forEach((h) => {
    const match = h.match(/^(.+?)_(full_marks|full|marks|obtained|score)$/);
    if (match) subjectNames.add(match[1]);
  });

  // If no subject pattern found, look for subjects column (JSON or semicolon-separated)
  const hasSubjectsCol = headers.includes("subjects");

  subjectNames.forEach((name) => {
    const fullIdx = headers.findIndex((h) => h === `${name}_full` || h === `${name}_full_marks` || h === `${name}_marks`);
    const obtIdx = headers.findIndex((h) => h === `${name}_obtained` || h === `${name}_score`);
    if (obtIdx !== -1) {
      subjectCols.push({
        name: name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        fullIdx,
        obtIdx,
      });
    }
  });

  rows.forEach((row, ri) => {
    const lineNum = ri + 2;
    const get = (col: string) => {
      const idx = headers.indexOf(col);
      return idx !== -1 && idx < row.length ? row[idx] : "";
    };

    const student_name = get("student_name");
    const roll_number = get("roll_number");
    const className = get("class");
    const exam_name = get("exam_name");
    const year = get("year");
    const grade = get("grade") || "";
    const status = (get("status") || "pass").toLowerCase();

    if (!student_name || !roll_number || !className || !exam_name || !year) {
      errors.push(`Row ${lineNum}: Missing required fields (name, roll, class, exam, year)`);
      return;
    }

    let subjects: { subject: string; full_marks: number; obtained: number }[] = [];

    if (subjectCols.length > 0) {
      subjects = subjectCols.map((sc) => ({
        subject: sc.name,
        full_marks: sc.fullIdx !== -1 && sc.fullIdx < row.length ? parseFloat(row[sc.fullIdx]) || 100 : 100,
        obtained: parseFloat(row[sc.obtIdx]) || 0,
      }));
    } else if (hasSubjectsCol) {
      // Try parsing subjects as "Subject:Full:Obtained;..." format
      const raw = get("subjects");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) subjects = parsed;
        } catch {
          raw.split(";").forEach((s) => {
            const parts = s.trim().split(":");
            if (parts.length >= 2) {
              subjects.push({
                subject: parts[0].trim(),
                full_marks: parts.length >= 3 ? parseFloat(parts[1]) || 100 : 100,
                obtained: parseFloat(parts[parts.length - 1]) || 0,
              });
            }
          });
        }
      }
    }

    const total_marks = subjects.reduce((s, sub) => s + sub.full_marks, 0);
    const obtained_marks = subjects.reduce((s, sub) => s + sub.obtained, 0);
    const percentage = total_marks > 0 ? Math.round((obtained_marks / total_marks) * 10000) / 100 : 0;

    data.push({
      student_name,
      roll_number,
      class: className,
      exam_name,
      year,
      grade,
      status: status === "fail" ? "fail" : "pass",
      subjects,
      total_marks,
      obtained_marks,
      percentage,
    });
  });

  return { data, errors };
}

const AdminResults = () => {
  const [items, setItems] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showNew, setShowNew] = useState(false);
  const [search, setSearch] = useState("");
  const [showCsvImport, setShowCsvImport] = useState(false);
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    const { data } = await supabase
      .from("results")
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as ResultItem[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const calcTotals = (subjects: SubjectEntry[]) => {
    const total = subjects.reduce((s, sub) => s + (parseFloat(sub.full_marks) || 0), 0);
    const obtained = subjects.reduce((s, sub) => s + (parseFloat(sub.obtained) || 0), 0);
    const pct = total > 0 ? (obtained / total) * 100 : 0;
    return { total_marks: total, obtained_marks: obtained, percentage: Math.round(pct * 100) / 100 };
  };

  const buildPayload = () => {
    const { total_marks, obtained_marks, percentage } = calcTotals(form.subjects);
    return {
      student_name: form.student_name.trim(),
      roll_number: form.roll_number.trim(),
      class: form.class_name.trim(),
      exam_name: form.exam_name.trim(),
      year: form.year.trim(),
      subjects: form.subjects
        .filter((s) => s.subject.trim())
        .map((s) => ({
          subject: s.subject,
          full_marks: parseFloat(s.full_marks) || 0,
          obtained: parseFloat(s.obtained) || 0,
        })),
      total_marks,
      obtained_marks,
      percentage,
      grade: form.grade || null,
      status: form.status,
    };
  };

  const handleCreate = async () => {
    if (!form.student_name.trim() || !form.roll_number.trim() || !form.class_name.trim() || !form.exam_name.trim()) {
      toast.error("Name, roll number, class and exam name are required");
      return;
    }
    const { error } = await supabase.from("results").insert([buildPayload()]);
    if (error) toast.error("Failed to create result");
    else {
      toast.success("Result added");
      setShowNew(false);
      setForm(emptyForm);
      fetchItems();
    }
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase.from("results").update(buildPayload()).eq("id", id);
    if (error) toast.error("Failed to update");
    else {
      toast.success("Result updated");
      setEditing(null);
      fetchItems();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this result?")) return;
    const { error } = await supabase.from("results").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else {
      toast.success("Deleted");
      fetchItems();
    }
  };

  const startEdit = (r: ResultItem) => {
    setEditing(r.id);
    setShowNew(false);
    setForm({
      student_name: r.student_name,
      roll_number: r.roll_number,
      class_name: r.class,
      exam_name: r.exam_name,
      year: r.year,
      grade: r.grade || "",
      status: r.status,
      subjects: r.subjects.length > 0
        ? r.subjects.map((s: any) => ({ subject: s.subject, full_marks: String(s.full_marks), obtained: String(s.obtained) }))
        : [{ ...emptySubject }],
    });
  };

  const updateSubject = (index: number, field: keyof SubjectEntry, value: string) => {
    const updated = [...form.subjects];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, subjects: updated });
  };

  const addSubject = () => setForm({ ...form, subjects: [...form.subjects, { ...emptySubject }] });
  const removeSubject = (i: number) => setForm({ ...form, subjects: form.subjects.filter((_, idx) => idx !== i) });

  const filtered = search
    ? items.filter((r) => r.roll_number.toLowerCase().includes(search.toLowerCase()) || r.student_name.toLowerCase().includes(search.toLowerCase()))
    : items;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      toast.error("Please select a CSV file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large (max 5MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const { headers, rows } = parseCsv(text);
      if (headers.length === 0) {
        toast.error("Could not parse CSV file");
        return;
      }
      const { data, errors } = processCsvRows(headers, rows);
      setCsvData(data);
      setCsvErrors(errors);
      if (data.length === 0 && errors.length > 0) {
        toast.error("No valid rows found in CSV");
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const handleCsvImport = async () => {
    if (csvData.length === 0) return;
    setImporting(true);

    const payload = csvData.map((row) => ({
      student_name: row.student_name,
      roll_number: row.roll_number,
      class: row.class,
      exam_name: row.exam_name,
      year: row.year,
      grade: row.grade || null,
      status: row.status,
      subjects: row.subjects,
      total_marks: row.total_marks,
      obtained_marks: row.obtained_marks,
      percentage: row.percentage,
    }));

    const { error } = await supabase.from("results").insert(payload);
    setImporting(false);

    if (error) {
      toast.error("Import failed: " + error.message);
    } else {
      toast.success(`Successfully imported ${csvData.length} results`);
      setCsvData([]);
      setCsvErrors([]);
      setShowCsvImport(false);
      fetchItems();
    }
  };

  const handleCancelCsv = () => {
    setCsvData([]);
    setCsvErrors([]);
    setShowCsvImport(false);
  };

  const FormFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs">Student Name *</Label><Input value={form.student_name} onChange={(e) => setForm({ ...form, student_name: e.target.value })} maxLength={100} /></div>
        <div><Label className="text-xs">Roll Number *</Label><Input value={form.roll_number} onChange={(e) => setForm({ ...form, roll_number: e.target.value })} maxLength={20} /></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div><Label className="text-xs">Class *</Label><Input value={form.class_name} onChange={(e) => setForm({ ...form, class_name: e.target.value })} maxLength={20} /></div>
        <div><Label className="text-xs">Exam Name *</Label><Input value={form.exam_name} onChange={(e) => setForm({ ...form, exam_name: e.target.value })} maxLength={100} /></div>
        <div><Label className="text-xs">Year</Label><Input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} maxLength={4} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs">Grade</Label><Input value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} maxLength={10} placeholder="e.g. A+" /></div>
        <div>
          <Label className="text-xs">Status</Label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pass">Pass</SelectItem>
              <SelectItem value="fail">Fail</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Subjects */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-xs font-semibold">Subjects</Label>
          <Button type="button" size="sm" variant="outline" onClick={addSubject} className="h-7 text-xs gap-1">
            <Plus className="h-3 w-3" /> Add Subject
          </Button>
        </div>
        <div className="space-y-2">
          {form.subjects.map((sub, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input placeholder="Subject" value={sub.subject} onChange={(e) => updateSubject(i, "subject", e.target.value)} className="flex-1" maxLength={50} />
              <Input placeholder="Full" value={sub.full_marks} onChange={(e) => updateSubject(i, "full_marks", e.target.value)} className="w-20" type="number" />
              <Input placeholder="Got" value={sub.obtained} onChange={(e) => updateSubject(i, "obtained", e.target.value)} className="w-20" type="number" />
              {form.subjects.length > 1 && (
                <Button type="button" size="icon" variant="ghost" onClick={() => removeSubject(i)} className="h-8 w-8 shrink-0 text-destructive">
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Manage Results</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => { setShowCsvImport(!showCsvImport); setShowNew(false); setEditing(null); setCsvData([]); setCsvErrors([]); }}
            className="gap-1"
          >
            <Upload className="h-4 w-4" /> Import CSV
          </Button>
          <Button onClick={() => { setShowNew(!showNew); setEditing(null); setForm(emptyForm); setShowCsvImport(false); }} className="gap-1">
            <Plus className="h-4 w-4" /> Add Result
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input placeholder="Search by roll number or name..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
      </div>

      {/* CSV Import Panel */}
      {showCsvImport && (
        <Card className="mb-6 border-secondary">
          <CardHeader>
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-secondary" />
              Bulk Import from CSV
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {csvData.length === 0 ? (
              <>
                <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
                  <p className="font-semibold text-foreground">CSV Format Instructions:</p>
                  <p className="text-muted-foreground">Required columns: <code className="bg-muted px-1 rounded text-xs">student_name, roll_number, class, exam_name, year</code></p>
                  <p className="text-muted-foreground">Optional columns: <code className="bg-muted px-1 rounded text-xs">grade, status</code></p>
                  <p className="text-muted-foreground">
                    <strong>Subjects</strong> — use column pairs like <code className="bg-muted px-1 rounded text-xs">bengali_obtained, bengali_full</code> or a <code className="bg-muted px-1 rounded text-xs">subjects</code> column with format: <code className="bg-muted px-1 rounded text-xs">Bengali:100:82;English:100:75</code>
                  </p>
                </div>

                <div
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-secondary hover:bg-muted/30 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="font-medium text-foreground">Click to select CSV file</p>
                  <p className="text-xs text-muted-foreground mt-1">Maximum 5MB</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileSelect}
                />

                <div className="flex justify-end">
                  <Button variant="ghost" onClick={handleCancelCsv} className="gap-1">
                    <X className="h-3.5 w-3.5" /> Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Errors */}
                {csvErrors.length > 0 && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 space-y-1">
                    <p className="text-sm font-semibold text-destructive flex items-center gap-1.5">
                      <AlertCircle className="h-4 w-4" /> {csvErrors.length} warning(s)
                    </p>
                    {csvErrors.slice(0, 5).map((err, i) => (
                      <p key={i} className="text-xs text-destructive/80">• {err}</p>
                    ))}
                    {csvErrors.length > 5 && (
                      <p className="text-xs text-destructive/60">...and {csvErrors.length - 5} more</p>
                    )}
                  </div>
                )}

                {/* Preview */}
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="font-medium text-foreground">{csvData.length} results ready to import</span>
                </div>

                <div className="border rounded-lg overflow-auto max-h-64">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Name</TableHead>
                        <TableHead className="text-xs">Roll</TableHead>
                        <TableHead className="text-xs">Class</TableHead>
                        <TableHead className="text-xs">Exam</TableHead>
                        <TableHead className="text-xs">Year</TableHead>
                        <TableHead className="text-xs text-right">Marks</TableHead>
                        <TableHead className="text-xs text-right">%</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {csvData.slice(0, 20).map((row, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-xs font-medium">{row.student_name}</TableCell>
                          <TableCell className="text-xs">{row.roll_number}</TableCell>
                          <TableCell className="text-xs">{row.class}</TableCell>
                          <TableCell className="text-xs">{row.exam_name}</TableCell>
                          <TableCell className="text-xs">{row.year}</TableCell>
                          <TableCell className="text-xs text-right">{row.obtained_marks}/{row.total_marks}</TableCell>
                          <TableCell className="text-xs text-right">{row.percentage}%</TableCell>
                          <TableCell>
                            <Badge variant={row.status === "pass" ? "default" : "destructive"} className="text-[10px]">
                              {row.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {csvData.length > 20 && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      Showing 20 of {csvData.length} rows
                    </p>
                  )}
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" onClick={handleCancelCsv} disabled={importing}>
                    <X className="h-3.5 w-3.5 mr-1" /> Cancel
                  </Button>
                  <Button onClick={handleCsvImport} disabled={importing} className="gap-1">
                    {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {importing ? "Importing..." : `Import ${csvData.length} Results`}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {showNew && (
        <Card className="mb-6 border-secondary">
          <CardHeader><CardTitle className="text-lg font-heading">Add Student Result</CardTitle></CardHeader>
          <CardContent>
            <FormFields />
            <div className="flex gap-2 mt-4">
              <Button onClick={handleCreate} className="gap-1"><Save className="h-3.5 w-3.5" /> Save</Button>
              <Button variant="ghost" onClick={() => setShowNew(false)}><X className="h-3.5 w-3.5" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />)}</div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">{search ? "No results match your search." : "No results yet. Add your first result."}</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <Card key={r.id}>
              {editing === r.id ? (
                <CardContent className="pt-4">
                  <FormFields />
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" onClick={() => handleUpdate(r.id)} className="gap-1"><Save className="h-3.5 w-3.5" /> Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(null)}><X className="h-3.5 w-3.5" /></Button>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-heading font-semibold text-foreground">{r.student_name}</h3>
                        <Badge variant={r.status === "pass" ? "default" : "destructive"} className="text-xs">
                          {r.status === "pass" ? "Pass" : "Fail"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Roll: {r.roll_number} • Class: {r.class} • {r.exam_name} ({r.year})
                      </p>
                      {r.percentage != null && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Marks: {r.obtained_marks}/{r.total_marks} ({Number(r.percentage).toFixed(1)}%)
                          {r.grade && ` • Grade: ${r.grade}`}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="icon" variant="ghost" onClick={() => startEdit(r)} className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(r.id)} className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminResults;
