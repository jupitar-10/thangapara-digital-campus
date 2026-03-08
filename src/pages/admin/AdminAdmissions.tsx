import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Admission {
  id: string;
  student_name: string;
  class_applied: string;
  dob: string | null;
  father_name: string | null;
  mother_name: string | null;
  mobile: string | null;
  email: string | null;
  address: string | null;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const AdminAdmissions = () => {
  const [items, setItems] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    const { data } = await supabase.from("admissions").select("*").order("created_at", { ascending: false });
    setItems((data as Admission[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleStatusChange = async (id: string, status: string) => {
    const { error } = await supabase.from("admissions").update({ status } as any).eq("id", id);
    if (error) toast.error("Failed to update status"); else { toast.success(`Status updated to ${status}`); fetchItems(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this application?")) return;
    const { error } = await supabase.from("admissions").delete().eq("id", id);
    if (error) toast.error("Failed to delete"); else { toast.success("Deleted"); fetchItems(); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Admission Applications</h1>
        <Badge variant="outline">{items.length} total</Badge>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />)}</div>
      ) : items.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">No admission applications yet.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <Card key={a.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-semibold text-foreground">{a.student_name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[a.status] || ""}`}>{a.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Class: {a.class_applied}</p>
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      {a.father_name && <p>Father: {a.father_name}</p>}
                      {a.mother_name && <p>Mother: {a.mother_name}</p>}
                      {a.mobile && <p>Mobile: {a.mobile}</p>}
                      {a.email && <p>Email: {a.email}</p>}
                      {a.dob && <p>DOB: {format(new Date(a.dob), "dd MMM yyyy")}</p>}
                      {a.address && <p>Address: {a.address}</p>}
                    </div>
                    <p className="text-xs text-muted-foreground">Applied: {format(new Date(a.created_at), "dd MMM yyyy")}</p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Select value={a.status} onValueChange={(v) => handleStatusChange(a.id, v)}>
                      <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(a.id)} className="h-8 w-8 text-destructive self-end"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAdmissions;
