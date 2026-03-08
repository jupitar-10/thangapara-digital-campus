import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";

interface DownloadItem {
  id: string;
  title: string;
  file_url: string;
  category: string | null;
}

const Downloads = () => {
  const [items, setItems] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("downloads").select("*").order("created_at", { ascending: false });
      setItems(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const grouped = items.reduce<Record<string, DownloadItem[]>>((acc, item) => {
    const cat = item.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-primary py-16">
          <div className="container text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground">
              Important <span className="text-secondary">Downloads</span>
            </h1>
            <p className="text-primary-foreground/70 mt-2">Download important school documents</p>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container max-w-3xl">
            {loading ? (
              <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />)}</div>
            ) : items.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No downloads available yet.</p>
              </div>
            ) : (
              Object.entries(grouped).map(([cat, list], ci) => (
                <motion.div key={cat} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.1 }} className="mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-heading">{cat}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {list.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary shrink-0" />
                            <span className="text-sm font-medium text-foreground">{item.title}</span>
                          </div>
                          <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline" className="gap-1">
                              <Download className="h-3.5 w-3.5" />
                              Download
                            </Button>
                          </a>
                        </div>
                      ))}
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

export default Downloads;
