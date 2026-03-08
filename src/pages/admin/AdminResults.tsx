import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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

const AdminResults = () => {
  const [items, setItems] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showNew, setShowNew] = useState(false);
  const [search, setSearch] = useState("");

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
        <Button onClick={() => { setShowNew(!showNew); setEditing(null); setForm(emptyForm); }} className="gap-1">
          <Plus className="h-4 w-4" /> Add Result
        </Button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input placeholder="Search by roll number or name..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
      </div>

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
