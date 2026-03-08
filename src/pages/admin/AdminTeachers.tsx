import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "@/components/admin/ImageUpload";

interface Teacher {
  id: string;
  name: string;
  subject: string;
  designation: string | null;
  qualification: string | null;
  photo_url: string | null;
  display_order: number | null;
}

const emptyForm = { name: "", subject: "", designation: "", qualification: "", photo_url: "", display_order: "0" };

const AdminTeachers = () => {
  const [items, setItems] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showNew, setShowNew] = useState(false);

  const fetchItems = async () => {
    const { data } = await supabase.from("teachers").select("*").order("display_order");
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleCreate = async () => {
    if (!form.name.trim() || !form.subject.trim()) { toast.error("Name and subject are required"); return; }
    const { error } = await supabase.from("teachers").insert([{
      name: form.name, subject: form.subject, designation: form.designation || null,
      qualification: form.qualification || null, photo_url: form.photo_url || null,
      display_order: parseInt(form.display_order) || 0,
    }]);
    if (error) toast.error("Failed to create"); else { toast.success("Teacher added"); setShowNew(false); setForm(emptyForm); fetchItems(); }
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase.from("teachers").update({
      name: form.name, subject: form.subject, designation: form.designation || null,
      qualification: form.qualification || null, photo_url: form.photo_url || null,
      display_order: parseInt(form.display_order) || 0,
    }).eq("id", id);
    if (error) toast.error("Failed to update"); else { toast.success("Teacher updated"); setEditing(null); fetchItems(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this teacher?")) return;
    const { error } = await supabase.from("teachers").delete().eq("id", id);
    if (error) toast.error("Failed to delete"); else { toast.success("Deleted"); fetchItems(); }
  };

  const startEdit = (t: Teacher) => {
    setEditing(t.id);
    setForm({ name: t.name, subject: t.subject, designation: t.designation || "", qualification: t.qualification || "", photo_url: t.photo_url || "", display_order: String(t.display_order || 0) });
    setShowNew(false);
  };

  const FormFields = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Input placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} />
        <Input placeholder="Subject *" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} maxLength={100} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input placeholder="Designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} maxLength={100} />
        <Input placeholder="Qualification" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} maxLength={100} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input placeholder="Photo URL" value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} />
        <Input type="number" placeholder="Display Order" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} />
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Manage Teachers</h1>
        <Button onClick={() => { setShowNew(!showNew); setEditing(null); setForm(emptyForm); }} className="gap-1"><Plus className="h-4 w-4" />Add Teacher</Button>
      </div>

      {showNew && (
        <Card className="mb-6 border-secondary">
          <CardHeader><CardTitle className="text-lg font-heading">Add Teacher</CardTitle></CardHeader>
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
        <Card><CardContent className="py-8 text-center text-muted-foreground">No teachers yet.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {items.map((t) => (
            <Card key={t.id}>
              {editing === t.id ? (
                <CardContent className="pt-4">
                  <FormFields />
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={() => handleUpdate(t.id)} className="gap-1"><Save className="h-3.5 w-3.5" />Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(null)}><X className="h-3.5 w-3.5" /></Button>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-heading font-semibold text-foreground">{t.name}</h3>
                      <p className="text-sm text-muted-foreground">{t.subject} {t.designation && `• ${t.designation}`}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="icon" variant="ghost" onClick={() => startEdit(t)} className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(t.id)} className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
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

export default AdminTeachers;
