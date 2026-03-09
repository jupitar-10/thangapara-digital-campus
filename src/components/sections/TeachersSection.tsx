import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Users, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Teacher {
  id: string;
  name: string;
  subject: string;
  designation: string | null;
  photo_url: string | null;
}

const TeachersSection = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      const { data } = await supabase
        .from("teachers")
        .select("id, name, subject, designation, photo_url")
        .order("display_order")
        .limit(6);
      setTeachers(data || []);
      setLoading(false);
    };
    fetchTeachers();
  }, []);

  if (!loading && teachers.length === 0) return null;

  return (
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

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {teachers.map((teacher, i) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow border-border">
                  <CardContent className="pt-6">
                    {teacher.photo_url ? (
                      <img src={teacher.photo_url} alt={teacher.name} className="w-20 h-20 rounded-full mx-auto mb-3 object-cover" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-3 flex items-center justify-center">
                        <User className="h-8 w-8 text-primary" />
                      </div>
                    )}
                    <h3 className="font-heading font-semibold text-foreground">{teacher.name}</h3>
                    <p className="text-sm text-secondary font-medium">{teacher.subject}</p>
                    {teacher.designation && (
                      <p className="text-xs text-muted-foreground mt-1">{teacher.designation}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TeachersSection;
