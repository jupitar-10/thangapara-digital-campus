import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Search, Award, Loader2, BookOpen, User, GraduationCap } from "lucide-react";
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-primary py-16">
          <div className="container text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground">
              Check <span className="text-secondary">Results</span>
            </h1>
            <p className="text-primary-foreground/70 mt-2">
              Search your examination results by Roll Number
            </p>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container max-w-3xl">
            {/* Search Form */}
            <Card className="mb-8 border-secondary/30">
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Search Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Roll Number *</Label>
                    <Input
                      placeholder="Enter your Roll Number"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      maxLength={20}
                      required
                    />
                  </div>
                  <div className="sm:w-32">
                    <Label className="text-xs text-muted-foreground">Year (optional)</Label>
                    <Input
                      placeholder="e.g. 2026"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      maxLength={4}
                    />
                  </div>
                  <div className="sm:self-end">
                    <Button type="submit" disabled={loading} className="w-full sm:w-auto gap-1">
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                      Search
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Results Display */}
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
                <p className="text-muted-foreground">Searching results...</p>
              </div>
            ) : searched && results.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                    No Results Found
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    No results found for Roll Number "{rollNumber}".
                    Please check and try again.
                  </p>
                </CardContent>
              </Card>
            ) : (
              results.map((result, idx) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="mb-6"
                >
                  <Card className="overflow-hidden">
                    {/* Student Info Header */}
                    <div className="bg-primary px-6 py-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="font-heading text-lg font-bold text-primary-foreground">
                            {result.exam_name} — {result.year}
                          </h3>
                          <p className="text-primary-foreground/70 text-sm">
                            {result.class}
                          </p>
                        </div>
                        <Badge
                          className={`text-sm px-3 py-1 ${
                            result.status === "pass"
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "bg-destructive text-destructive-foreground"
                          }`}
                        >
                          {result.status === "pass" ? "PASSED" : "FAILED"}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="pt-4">
                      {/* Student Details */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5 p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">Student Name</p>
                            <p className="text-sm font-semibold text-foreground">{result.student_name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">Roll Number</p>
                            <p className="text-sm font-semibold text-foreground">{result.roll_number}</p>
                          </div>
                        </div>
                        {result.grade && (
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-secondary shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground">Grade</p>
                              <p className="text-sm font-semibold text-foreground">{result.grade}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Subjects Table */}
                      {result.subjects.length > 0 && (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Subject</TableHead>
                              <TableHead className="text-right">Full Marks</TableHead>
                              <TableHead className="text-right">Obtained</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {result.subjects.map((sub, si) => (
                              <TableRow key={si}>
                                <TableCell className="font-medium">{sub.subject}</TableCell>
                                <TableCell className="text-right">{sub.full_marks}</TableCell>
                                <TableCell className="text-right">{sub.obtained}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}

                      {/* Summary */}
                      {(result.total_marks || result.obtained_marks || result.percentage) && (
                        <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-border">
                          {result.total_marks != null && result.obtained_marks != null && (
                            <div>
                              <p className="text-xs text-muted-foreground">Total Marks</p>
                              <p className="text-lg font-bold text-foreground">
                                {result.obtained_marks} / {result.total_marks}
                              </p>
                            </div>
                          )}
                          {result.percentage != null && (
                            <div>
                              <p className="text-xs text-muted-foreground">Percentage</p>
                              <p className="text-lg font-bold text-secondary">
                                {Number(result.percentage).toFixed(2)}%
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Results;
