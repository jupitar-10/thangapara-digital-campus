import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  is_active: boolean;
}

const NoticeBoard = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      const { data } = await supabase
        .from("notices")
        .select("*")
        .eq("is_active", true)
        .order("date", { ascending: false });
      setNotices(data || []);
      setLoading(false);
    };
    fetchNotices();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-primary py-16">
          <div className="container text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground">
              Notice <span className="text-secondary">Board</span>
            </h1>
            <p className="text-primary-foreground/70 mt-2">Stay updated with latest school announcements</p>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container max-w-3xl">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : notices.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-heading">No notices available at the moment.</p>
                <p className="text-sm text-muted-foreground mt-1">Check back later for updates.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notices.map((notice, i) => (
                  <motion.div
                    key={notice.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow border-border">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg font-heading">{notice.title}</CardTitle>
                          <Badge variant="outline" className="shrink-0 gap-1 text-xs">
                            <CalendarDays className="h-3 w-3" />
                            {format(new Date(notice.date), "dd MMM yyyy")}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{notice.content}</p>
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

export default NoticeBoard;
