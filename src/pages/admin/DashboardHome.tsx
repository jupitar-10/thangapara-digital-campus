import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Image, Download, UserPlus, Award } from "lucide-react";

const DashboardHome = () => {
  const [counts, setCounts] = useState({ notices: 0, teachers: 0, gallery: 0, downloads: 0, admissions: 0, results: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      const [n, t, g, d, a, r] = await Promise.all([
        supabase.from("notices").select("id", { count: "exact", head: true }),
        supabase.from("teachers").select("id", { count: "exact", head: true }),
        supabase.from("gallery").select("id", { count: "exact", head: true }),
        supabase.from("downloads").select("id", { count: "exact", head: true }),
        supabase.from("admissions").select("id", { count: "exact", head: true }),
        supabase.from("results").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        notices: n.count || 0, teachers: t.count || 0, gallery: g.count || 0,
        downloads: d.count || 0, admissions: a.count || 0, results: r.count || 0,
      });
    };
    fetchCounts();
  }, []);

  const stats = [
    { label: "Notices", icon: FileText, value: counts.notices, color: "text-primary" },
    { label: "Teachers", icon: Users, value: counts.teachers, color: "text-secondary" },
    { label: "Gallery", icon: Image, value: counts.gallery, color: "text-primary" },
    { label: "Downloads", icon: Download, value: counts.downloads, color: "text-secondary" },
    { label: "Admissions", icon: UserPlus, value: counts.admissions, color: "text-primary" },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-heading text-muted-foreground">{s.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <span className="text-2xl font-bold text-foreground">{s.value}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Welcome to the Admin Dashboard. Use the sidebar to manage school content.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
