import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const downloadItems = [
  { title: "Admission Form", category: "Admission" },
  { title: "Exam Routine 2026", category: "Exam" },
  { title: "Holiday List 2026", category: "General" },
];

const DownloadsSection = () => (
  <section className="py-16 bg-muted" id="downloads">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Important <span className="text-primary">Downloads</span>
        </h2>
      </motion.div>

      <div className="max-w-2xl mx-auto space-y-3">
        {downloadItems.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="flex items-center justify-between bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="font-heading font-semibold text-sm text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.category}</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="gap-1">
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default DownloadsSection;
