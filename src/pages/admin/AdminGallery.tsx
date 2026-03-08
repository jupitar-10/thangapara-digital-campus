import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "@/components/admin/ImageUpload";

interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  category: string | null;
  event_date: string | null;
}

const emptyForm = { title: "", image_url: "", category: "", event_date: "" };

const AdminGallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showNew, setShowNew] = useState(false);

  const fetchItems = async () => {
    const { data } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleCreate = async () => {
    if (!form.title.trim() || !form.image_url.trim()) { toast.error("Title and image URL are required"); return; }
    const { error } = await supabase.from("gallery").insert([{
      title: form.title, image_url: form.image_url, category: form.category || null, event_date: form.event_date || null,
    }]);
    if (error) toast.error("Failed to create"); else { toast.success("Image added"); setShowNew(false); setForm(emptyForm); fetchItems(); }
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase.from("gallery").update({
      title: form.title, image_url: form.image_url, category: form.category || null, event_date: form.event_date || null,
    }).eq("id", id);
    if (error) toast.error("Failed to update"); else { toast.success("Updated"); setEditing(null); fetchItems(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) toast.error("Failed to delete"); else { toast.success("Deleted"); fetchItems(); }
  };

  const startEdit = (item: GalleryItem) => {
    setEditing(item.id);
    setForm({ title: item.title, image_url: item.image_url, category: item.category || "", event_date: item.event_date || "" });
    setShowNew(false);
  };

  const FormFields = () => (
    <div className="space-y-3">
      <Input placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={200} />
      <ImageUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="gallery" placeholder="Gallery Image" />
      <div className="grid grid-cols-2 gap-3">
        <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} maxLength={50} />
        <Input type="date" placeholder="Event Date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} />
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Manage Gallery</h1>
        <Button onClick={() => { setShowNew(!showNew); setEditing(null); setForm(emptyForm); }} className="gap-1"><Plus className="h-4 w-4" />Add Image</Button>
      </div>

      {showNew && (
        <Card className="mb-6 border-secondary">
          <CardHeader><CardTitle className="text-lg font-heading">Add Gallery Image</CardTitle></CardHeader>
          <CardContent>
            <FormFields />
            <div className="flex gap-2 mt-3">
              <Button onClick={handleCreate} className="gap-1"><Save className="h-3.5 w-3.5" />Save</Button>
              <Button variant="ghost" onClick={() => setShowNew(false)}><X className="h-3.5 w-3.5" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />)}</div>
      ) : items.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">No gallery images yet.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-video">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
              </div>
              {editing === item.id ? (
                <CardContent className="pt-3">
                  <FormFields />
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={() => handleUpdate(item.id)} className="gap-1"><Save className="h-3.5 w-3.5" />Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(null)}><X className="h-3.5 w-3.5" /></Button>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="pt-3">
                  <h3 className="font-heading font-semibold text-sm text-foreground truncate">{item.title}</h3>
                  {item.category && <p className="text-xs text-muted-foreground">{item.category}</p>}
                  <div className="flex gap-1 mt-2">
                    <Button size="icon" variant="ghost" onClick={() => startEdit(item)} className="h-7 w-7"><Pencil className="h-3 w-3" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)} className="h-7 w-7 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
