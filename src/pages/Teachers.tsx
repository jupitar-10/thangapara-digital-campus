import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { User } from "lucide-react";

interface Teacher {
  id: string;
  name: string;
  subject: string;
  designation: string | null;
  qualification: string | null;
  photo_url: string | null;
}

const Teachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("teachers").select("*").order("display_order");
      setTeachers(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-primary py-16">
          <div className="container text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground">
              Our <span className="text-secondary">Teachers</span>
            </h1>
            <p className="text-primary-foreground/70 mt-2">Meet our dedicated faculty members</p>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />)}
              </div>
            ) : teachers.length === 0 ? (
              <div className="text-center py-16">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Teacher information coming soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {teachers.map((t, i) => (
                  <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className="text-center hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        {t.photo_url ? (
                          <img src={t.photo_url} alt={t.name} className="w-24 h-24 rounded-full mx-auto mb-3 object-cover" />
                        ) : (
                          <div className="w-24 h-24 rounded-full mx-auto mb-3 bg-primary/10 flex items-center justify-center">
                            <User className="h-10 w-10 text-primary" />
                          </div>
                        )}
                        <h3 className="font-heading font-semibold text-foreground">{t.name}</h3>
                        <p className="text-sm text-secondary font-medium">{t.subject}</p>
                        {t.designation && <p className="text-xs text-muted-foreground">{t.designation}</p>}
                        {t.qualification && <p className="text-xs text-muted-foreground">{t.qualification}</p>}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Teachers;
