import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Image, Download } from "lucide-react";

const stats = [
  { label: "Notices", icon: FileText, value: "—", color: "text-primary" },
  { label: "Teachers", icon: Users, value: "—", color: "text-secondary" },
  { label: "Gallery", icon: Image, value: "—", color: "text-primary" },
  { label: "Downloads", icon: Download, value: "—", color: "text-secondary" },
];

const DashboardHome = () => {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
