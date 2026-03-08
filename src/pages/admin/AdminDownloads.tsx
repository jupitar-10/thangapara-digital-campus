import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";

interface DownloadItem {
  id: string;
  title: string;
  file_url: string;
  category: string | null;
}

const emptyForm = { title: "", file_url: "", category: "" };

const AdminDownloads = () => {
  const [items, setItems] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showNew, setShowNew] = useState(false);

  const fetchItems = async () => {
    const { data } = await supabase.from("downloads").select("*").order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleCreate = async () => {
    if (!form.title.trim() || !form.file_url.trim()) { toast.error("Title and file URL are required"); return; }
    const { error } = await supabase.from("downloads").insert([{
      title: form.title, file_url: form.file_url, category: form.category || null,
    }]);
    if (error) toast.error("Failed to create"); else { toast.success("Download added"); setShowNew(false); setForm(emptyForm); fetchItems(); }
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase.from("downloads").update({
      title: form.title, file_url: form.file_url, category: form.category || null,
    }).eq("id", id);
    if (error) toast.error("Failed to update"); else { toast.success("Updated"); setEditing(null); fetchItems(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this download?")) return;
    const { error } = await supabase.from("downloads").delete().eq("id", id);
    if (error) toast.error("Failed to delete"); else { toast.success("Deleted"); fetchItems(); }
  };

  const startEdit = (item: DownloadItem) => {
    setEditing(item.id);
    setForm({ title: item.title, file_url: item.file_url, category: item.category || "" });
    setShowNew(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Manage Downloads</h1>
        <Button onClick={() => { setShowNew(!showNew); setEditing(null); setForm(emptyForm); }} className="gap-1"><Plus className="h-4 w-4" />Add Download</Button>
      </div>

      {showNew && (
        <Card className="mb-6 border-secondary">
          <CardHeader><CardTitle className="text-lg font-heading">Add Download</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={200} />
            <Input placeholder="File URL *" value={form.file_url} onChange={(e) => setForm({ ...form, file_url: e.target.value })} />
            <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} maxLength={50} />
            <div className="flex gap-2">
              <Button onClick={handleCreate} className="gap-1"><Save className="h-3.5 w-3.5" />Save</Button>
              <Button variant="ghost" onClick={() => setShowNew(false)}><X className="h-3.5 w-3.5" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />)}</div>
      ) : items.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">No downloads yet.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}>
              {editing === item.id ? (
                <CardContent className="pt-4 space-y-3">
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={200} />
                  <Input value={form.file_url} onChange={(e) => setForm({ ...form, file_url: e.target.value })} />
                  <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} maxLength={50} placeholder="Category" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleUpdate(item.id)} className="gap-1"><Save className="h-3.5 w-3.5" />Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(null)}><X className="h-3.5 w-3.5" /></Button>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-heading font-semibold text-foreground">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.category || "General"} • <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="text-primary underline">View file</a></p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="icon" variant="ghost" onClick={() => startEdit(item)} className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)} className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
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

export default AdminDownloads;
