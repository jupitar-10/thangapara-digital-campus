import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

const placeholderTeachers = [
  { id: "1", name: "Sri Ramesh Das", subject: "Mathematics", designation: "Senior Teacher" },
  { id: "2", name: "Smt. Anjali Roy", subject: "Bengali", designation: "Senior Teacher" },
  { id: "3", name: "Sri Sunil Sarkar", subject: "English", designation: "Assistant Teacher" },
  { id: "4", name: "Smt. Priya Ghosh", subject: "Science", designation: "Assistant Teacher" },
  { id: "5", name: "Sri Biswajit Mondal", subject: "History", designation: "Assistant Teacher" },
  { id: "6", name: "Smt. Kabita Sen", subject: "Geography", designation: "Assistant Teacher" },
];

const TeachersSection = () => (
  <section className="py-16 bg-background" id="teachers">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 bg-secondary/20 text-primary px-4 py-1.5 rounded-full mb-4">
          <Users className="h-4 w-4" />
          <span className="text-sm font-heading font-semibold">Our Faculty</span>
        </div>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Meet Our <span className="text-primary">Teachers</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {placeholderTeachers.map((teacher, i) => (
          <motion.div
            key={teacher.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card className="text-center hover:shadow-lg transition-shadow border-border">
              <CardContent className="pt-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-3 flex items-center justify-center">
                  <img src="/placeholder.svg" alt={teacher.name} className="w-full h-full rounded-full object-cover" />
                </div>
                <h3 className="font-heading font-semibold text-foreground">{teacher.name}</h3>
                <p className="text-sm text-secondary font-medium">{teacher.subject}</p>
                <p className="text-xs text-muted-foreground mt-1">{teacher.designation}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TeachersSection;
