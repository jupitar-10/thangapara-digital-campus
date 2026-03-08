import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Award, Loader2, BookOpen, User, GraduationCap, Hash, TrendingUp, Printer } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SubjectResult {
  subject: string;
  full_marks: number;
  obtained: number;
}

interface Result {
  id: string;
  student_name: string;
  roll_number: string;
  class: string;
  exam_name: string;
  year: string;
  subjects: SubjectResult[];
  total_marks: number | null;
  obtained_marks: number | null;
  percentage: number | null;
  grade: string | null;
  status: string;
}

const Results = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [year, setYear] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber.trim()) return;

    setLoading(true);
    setSearched(true);

    let query = supabase
      .from("results")
      .select("*")
      .eq("roll_number", rollNumber.trim());

    if (year.trim()) {
      query = query.eq("year", year.trim());
    }

    const { data, error } = await query.order("year", { ascending: false });

    if (error) {
      setResults([]);
    } else {
      setResults(
        (data || []).map((r: any) => ({
          ...r,
          subjects: Array.isArray(r.subjects) ? r.subjects : [],
        }))
      );
    }
    setLoading(false);
  };

  const getGradeColor = (grade: string | null) => {
    if (!grade) return "bg-muted text-muted-foreground";
    const g = grade.toUpperCase();
    if (g.startsWith("A")) return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (g.startsWith("B")) return "bg-blue-100 text-blue-700 border-blue-200";
    if (g.startsWith("C")) return "bg-amber-100 text-amber-700 border-amber-200";
    if (g.startsWith("D")) return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  const getSubjectBarWidth = (obtained: number, full: number) => {
    return full > 0 ? Math.min((obtained / full) * 100, 100) : 0;
  };

  const getSubjectBarColor = (obtained: number, full: number) => {
    const pct = full > 0 ? (obtained / full) * 100 : 0;
    if (pct >= 80) return "bg-emerald-500";
    if (pct >= 60) return "bg-blue-500";
    if (pct >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative bg-primary py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-4 border-secondary" />
            <div className="absolute bottom-10 right-20 w-48 h-48 rounded-full border-4 border-secondary" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-2 border-primary-foreground" />
          </div>
          <div className="container text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                <Award className="h-4 w-4" />
                Examination Results
              </div>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-3">
                Check Your <span className="text-secondary">Results</span>
              </h1>
              <p className="text-primary-foreground/60 text-lg max-w-md mx-auto">
                Enter your roll number to view detailed examination results
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search Section */}
        <section className="relative -mt-8 z-20 pb-16">
          <div className="container max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-xl border-0 bg-card">
                <CardContent className="p-6">
                  <form onSubmit={handleSearch} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 space-y-1.5">
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Roll Number
                        </Label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Enter roll number"
                            value={rollNumber}
                            onChange={(e) => setRollNumber(e.target.value)}
                            maxLength={20}
                            required
                            className="pl-10 h-12 text-base"
                          />
                        </div>
                      </div>
                      <div className="sm:w-36 space-y-1.5">
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Year
                        </Label>
                        <Input
                          placeholder="e.g. 2025"
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          maxLength={4}
                          className="h-12 text-base"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 text-base font-semibold gap-2"
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Search className="h-5 w-5" />
                      )}
                      {loading ? "Searching..." : "Search Results"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results Display */}
            <div className="mt-8">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-16"
                  >
                    <div className="relative inline-flex">
                      <div className="w-16 h-16 rounded-full border-4 border-muted" />
                      <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-t-primary animate-spin" />
                    </div>
                    <p className="text-muted-foreground mt-4 font-medium">Fetching results...</p>
                  </motion.div>
                ) : searched && results.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Card className="border-dashed border-2">
                      <CardContent className="py-16 text-center">
                        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
                          <BookOpen className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                          No Results Found
                        </h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                          We couldn't find results for roll number "<span className="font-semibold text-foreground">{rollNumber}</span>". 
                          Please verify and try again.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    {results.map((result, idx) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.15, type: "spring", stiffness: 100 }}
                      >
                        <Card className="overflow-hidden shadow-lg border-0">
                          {/* Header Banner */}
                          <div className="bg-gradient-to-r from-primary to-deep-blue-dark px-6 py-5">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <p className="text-primary-foreground/50 text-xs font-medium uppercase tracking-wider mb-1">
                                  {result.class}
                                </p>
                                <h3 className="font-heading text-xl font-bold text-primary-foreground">
                                  {result.exam_name}
                                </h3>
                                <p className="text-primary-foreground/60 text-sm mt-0.5">
                                  Academic Year {result.year}
                                </p>
                              </div>
                              <Badge
                                className={`text-sm px-4 py-1.5 font-bold border ${
                                  result.status === "pass"
                                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
                                    : "bg-red-500/20 text-red-300 border-red-400/30"
                                }`}
                              >
                                {result.status === "pass" ? "✓ PASSED" : "✗ FAILED"}
                              </Badge>
                            </div>
                          </div>

                          <CardContent className="p-6">
                            {/* Student Info Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                              <div className="bg-muted/50 rounded-xl p-3.5 text-center">
                                <User className="h-5 w-5 text-primary mx-auto mb-1.5" />
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Name</p>
                                <p className="text-sm font-bold text-foreground mt-0.5 truncate">{result.student_name}</p>
                              </div>
                              <div className="bg-muted/50 rounded-xl p-3.5 text-center">
                                <Hash className="h-5 w-5 text-primary mx-auto mb-1.5" />
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Roll No.</p>
                                <p className="text-sm font-bold text-foreground mt-0.5">{result.roll_number}</p>
                              </div>
                              {result.percentage != null && (
                                <div className="bg-muted/50 rounded-xl p-3.5 text-center">
                                  <TrendingUp className="h-5 w-5 text-secondary mx-auto mb-1.5" />
                                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Percentage</p>
                                  <p className="text-sm font-bold text-secondary mt-0.5">{Number(result.percentage).toFixed(1)}%</p>
                                </div>
                              )}
                              {result.grade && (
                                <div className="bg-muted/50 rounded-xl p-3.5 text-center">
                                  <Award className="h-5 w-5 text-secondary mx-auto mb-1.5" />
                                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Grade</p>
                                  <span className={`inline-block mt-1 text-sm font-bold px-3 py-0.5 rounded-full border ${getGradeColor(result.grade)}`}>
                                    {result.grade}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Subjects with visual bars */}
                            {result.subjects.length > 0 && (
                              <div className="border rounded-xl overflow-hidden">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="bg-muted/30">
                                      <TableHead className="font-heading font-semibold text-xs uppercase tracking-wider">Subject</TableHead>
                                      <TableHead className="text-right font-heading font-semibold text-xs uppercase tracking-wider w-24">Full Marks</TableHead>
                                      <TableHead className="text-right font-heading font-semibold text-xs uppercase tracking-wider w-24">Obtained</TableHead>
                                      <TableHead className="font-heading font-semibold text-xs uppercase tracking-wider w-32 hidden sm:table-cell">Progress</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {result.subjects.map((sub, si) => (
                                      <TableRow key={si} className="hover:bg-muted/20 transition-colors">
                                        <TableCell className="font-medium text-foreground">{sub.subject}</TableCell>
                                        <TableCell className="text-right text-muted-foreground">{sub.full_marks}</TableCell>
                                        <TableCell className="text-right font-semibold text-foreground">{sub.obtained}</TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                            <motion.div
                                              className={`h-full rounded-full ${getSubjectBarColor(sub.obtained, sub.full_marks)}`}
                                              initial={{ width: 0 }}
                                              animate={{ width: `${getSubjectBarWidth(sub.obtained, sub.full_marks)}%` }}
                                              transition={{ delay: 0.3 + si * 0.1, duration: 0.6, ease: "easeOut" }}
                                            />
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>

                                {/* Total Row */}
                                {result.total_marks != null && result.obtained_marks != null && (
                                  <div className="bg-primary/5 border-t px-4 py-3 flex items-center justify-between">
                                    <span className="font-heading font-bold text-sm text-foreground">Total</span>
                                    <span className="font-heading font-bold text-lg text-primary">
                                      {result.obtained_marks} <span className="text-muted-foreground font-normal text-sm">/ {result.total_marks}</span>
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Print Button */}
                            <div className="mt-4 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 text-muted-foreground"
                                onClick={() => window.print()}
                              >
                                <Printer className="h-3.5 w-3.5" />
                                Print Result
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Results;
