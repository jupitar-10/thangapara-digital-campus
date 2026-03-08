import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";

interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  is_active: boolean;
}

const AdminNotices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", content: "", date: "", is_active: true });
  const [showNew, setShowNew] = useState(false);

  const fetchNotices = async () => {
    const { data } = await supabase.from("notices").select("*").order("date", { ascending: false });
    setNotices(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchNotices(); }, []);

  const handleCreate = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    const { error } = await supabase.from("notices").insert([{
      title: form.title,
      content: form.content,
      date: form.date || new Date().toISOString().split("T")[0],
      is_active: form.is_active,
    }]);
    if (error) {
      toast.error("Failed to create notice");
    } else {
      toast.success("Notice created");
      setShowNew(false);
      setForm({ title: "", content: "", date: "", is_active: true });
      fetchNotices();
    }
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase.from("notices").update({
      title: form.title,
      content: form.content,
      date: form.date,
      is_active: form.is_active,
    }).eq("id", id);
    if (error) {
      toast.error("Failed to update notice");
    } else {
      toast.success("Notice updated");
      setEditing(null);
      fetchNotices();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this notice?")) return;
    const { error } = await supabase.from("notices").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete notice");
    } else {
      toast.success("Notice deleted");
      fetchNotices();
    }
  };

  const startEdit = (notice: Notice) => {
    setEditing(notice.id);
    setForm({ title: notice.title, content: notice.content, date: notice.date, is_active: notice.is_active });
    setShowNew(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Manage Notices</h1>
        <Button onClick={() => { setShowNew(!showNew); setEditing(null); setForm({ title: "", content: "", date: "", is_active: true }); }} className="gap-1">
          <Plus className="h-4 w-4" />
          New Notice
        </Button>
      </div>

      {/* New Notice Form */}
      {showNew && (
        <Card className="mb-6 border-secondary">
          <CardHeader><CardTitle className="text-lg font-heading">Create Notice</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={200} />
            <Textarea placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} maxLength={2000} rows={4} />
            <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              <span className="text-sm text-muted-foreground">Active</span>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} className="gap-1"><Save className="h-3.5 w-3.5" />Save</Button>
              <Button variant="ghost" onClick={() => setShowNew(false)}><X className="h-3.5 w-3.5" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notices List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />)}
        </div>
      ) : notices.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">No notices yet. Create your first notice.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {notices.map((notice) => (
            <Card key={notice.id} className="border-border">
              {editing === notice.id ? (
                <CardContent className="pt-4 space-y-3">
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={200} />
                  <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} maxLength={2000} rows={3} />
                  <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  <div className="flex items-center gap-2">
                    <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
                    <span className="text-sm text-muted-foreground">Active</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleUpdate(notice.id)} className="gap-1"><Save className="h-3.5 w-3.5" />Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(null)}><X className="h-3.5 w-3.5" /></Button>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-heading font-semibold text-foreground">{notice.title}</h3>
                        <Badge variant={notice.is_active ? "default" : "secondary"} className="text-xs">
                          {notice.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{notice.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">{format(new Date(notice.date), "dd MMM yyyy")}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="icon" variant="ghost" onClick={() => startEdit(notice)} className="h-8 w-8">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(notice.id)} className="h-8 w-8 text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
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

export default AdminNotices;
