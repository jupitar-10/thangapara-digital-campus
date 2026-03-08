import { motion } from "framer-motion";
import { GraduationCap, ClipboardList, FileText, Award } from "lucide-react";
import { Link } from "react-router-dom";

const items = [
  { icon: GraduationCap, label: "Admission", href: "/contact", color: "bg-primary" },
  { icon: ClipboardList, label: "Class Routine", href: "/notices", color: "bg-deep-blue-dark" },
  { icon: FileText, label: "Exam Routine", href: "/notices", color: "bg-primary" },
  { icon: Award, label: "Results", href: "/notices", color: "bg-deep-blue-dark" },
];

const StudentCornerSection = () => (
  <section className="py-16 bg-muted" id="students">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Student <span className="text-primary">Corner</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Link
              to={item.href}
              className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card border border-border hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className={`${item.color} p-4 rounded-full`}>
                <item.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <span className="font-heading font-semibold text-sm text-foreground">{item.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StudentCornerSection;
