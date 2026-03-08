import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CheckCircle, Loader2 } from "lucide-react";

const Admissions = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    student_name: "", class_applied: "", dob: "", father_name: "", mother_name: "", mobile: "", email: "", address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.student_name.trim() || !form.class_applied.trim()) {
      toast.error("Student name and class are required");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("admissions").insert([{
      student_name: form.student_name.trim(),
      class_applied: form.class_applied.trim(),
      dob: form.dob || null,
      father_name: form.father_name.trim() || null,
      mother_name: form.mother_name.trim() || null,
      mobile: form.mobile.trim() || null,
      email: form.email.trim() || null,
      address: form.address.trim() || null,
    }]);
    setLoading(false);
    if (error) {
      toast.error("Failed to submit application");
    } else {
      setSubmitted(true);
      toast.success("Application submitted successfully!");
    }
  };

  const set = (key: string, val: string) => setForm({ ...form, [key]: val });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-primary py-16">
          <div className="container text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground">
              Online <span className="text-secondary">Admission</span>
            </h1>
            <p className="text-primary-foreground/70 mt-2">Apply for admission at Thangapara High School</p>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container max-w-2xl">
            {submitted ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Application Submitted!</h2>
                  <p className="text-muted-foreground">We will review your application and contact you soon.</p>
                  <Button className="mt-6" onClick={() => { setSubmitted(false); setForm({ student_name: "", class_applied: "", dob: "", father_name: "", mother_name: "", mobile: "", email: "", address: "" }); }}>
                    Submit Another
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Admission Application Form</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><Label>Student Name *</Label><Input value={form.student_name} onChange={(e) => set("student_name", e.target.value)} maxLength={100} required /></div>
                      <div><Label>Class Applied For *</Label><Input value={form.class_applied} onChange={(e) => set("class_applied", e.target.value)} maxLength={20} required /></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><Label>Date of Birth</Label><Input type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} /></div>
                      <div><Label>Mobile Number</Label><Input value={form.mobile} onChange={(e) => set("mobile", e.target.value)} maxLength={15} /></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><Label>Father's Name</Label><Input value={form.father_name} onChange={(e) => set("father_name", e.target.value)} maxLength={100} /></div>
                      <div><Label>Mother's Name</Label><Input value={form.mother_name} onChange={(e) => set("mother_name", e.target.value)} maxLength={100} /></div>
                    </div>
                    <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} maxLength={100} /></div>
                    <div><Label>Address</Label><Textarea value={form.address} onChange={(e) => set("address", e.target.value)} maxLength={500} rows={3} /></div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Submitting...</> : "Submit Application"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Admissions;
