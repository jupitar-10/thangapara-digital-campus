import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { GraduationCap, ClipboardList, Calendar, Award, UserPlus } from "lucide-react";

const sections = [
  { icon: UserPlus, title: "Online Admission", desc: "Apply for admission online through our portal.", link: "/admissions", linkText: "Apply Now", color: "text-secondary" },
  { icon: ClipboardList, title: "Class Routine", desc: "View the daily class routine and schedule.", link: null, linkText: null, color: "text-primary" },
  { icon: Calendar, title: "Exam Routine", desc: "Check upcoming examination schedules.", link: null, linkText: null, color: "text-primary" },
  { icon: Award, title: "Results", desc: "Check your examination results.", link: "/results", linkText: "Check Results", color: "text-secondary" },
];

const Students = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      <section className="bg-primary py-16">
        <div className="container text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground">
            Student <span className="text-secondary">Corner</span>
          </h1>
          <p className="text-primary-foreground/70 mt-2">Everything students need in one place</p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container max-w-4xl">
          <div className="grid md:grid-cols-2 gap-6">
            {sections.map((s, i) => (
              <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <s.icon className={`h-6 w-6 ${s.color}`} />
                      </div>
                      <CardTitle className="text-lg font-heading">{s.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{s.desc}</p>
                    {s.link ? (
                      <Link to={s.link}>
                        <Button size="sm">{s.linkText}</Button>
                      </Link>
                    ) : (
                      <Button size="sm" variant="outline" disabled>Coming Soon</Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Students;
