import { useEffect, useState } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { GraduationCap, LayoutDashboard, FileText, LogOut, Home } from "lucide-react";
import { toast } from "sonner";

const AdminLayout = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin");
        return;
      }
      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/admin");
    });

    checkAuth();
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out");
    navigate("/admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-primary-foreground flex flex-col shrink-0 hidden md:flex">
        <div className="p-4 border-b border-primary-foreground/10">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-secondary" />
            <span className="font-heading font-bold text-sm">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-primary-foreground/10 transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            to="/admin/dashboard/notices"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-primary-foreground/10 transition-colors"
          >
            <FileText className="h-4 w-4" />
            Notices
          </Link>
        </nav>
        <div className="p-4 border-t border-primary-foreground/10 space-y-2">
          <Link to="/">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10">
              <Home className="h-4 w-4" />
              View Website
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile top bar */}
        <header className="md:hidden bg-primary text-primary-foreground p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-secondary" />
            <span className="font-heading font-bold text-sm">Admin</span>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/dashboard" className="text-xs px-2 py-1 rounded bg-primary-foreground/10">Dashboard</Link>
            <Link to="/admin/dashboard/notices" className="text-xs px-2 py-1 rounded bg-primary-foreground/10">Notices</Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-primary-foreground/70 p-1">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
