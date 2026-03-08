import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  category: string | null;
  event_date: string | null;
}

const Gallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
      setItems(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))];
  const filtered = filter === "All" ? items : items.filter((i) => i.category === filter);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-primary py-16">
          <div className="container text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground">
              Photo <span className="text-secondary">Gallery</span>
            </h1>
            <p className="text-primary-foreground/70 mt-2">Moments from our school life</p>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container">
            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-8 justify-center">
                {categories.map((c) => (
                  <Button key={c} size="sm" variant={filter === c ? "default" : "outline"} onClick={() => setFilter(c as string)}>
                    {c}
                  </Button>
                ))}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No photos available yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="cursor-pointer group"
                    onClick={() => setSelected(item)}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden relative">
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors flex items-end">
                        <p className="text-primary-foreground text-sm font-medium p-3 opacity-0 group-hover:opacity-100 transition-opacity">{item.title}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-3xl p-2">
          {selected && (
            <div>
              <img src={selected.image_url} alt={selected.title} className="w-full rounded-lg" />
              <p className="text-center font-heading font-semibold mt-2 text-foreground">{selected.title}</p>
              {selected.category && <p className="text-center text-xs text-muted-foreground">{selected.category}</p>}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Gallery;
