import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const NoticeTicker = () => {
  const [notices, setNotices] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    const fetchNotices = async () => {
      const { data } = await supabase
        .from("notices")
        .select("id, title")
        .eq("is_active", true)
        .order("date", { ascending: false })
        .limit(5);
      if (data && data.length > 0) {
        setNotices(data);
      } else {
        setNotices([
          { id: "1", title: "Welcome to Thangapara High School — Admissions Open for 2026-27" },
          { id: "2", title: "Annual Sports Day coming soon!" },
          { id: "3", title: "Mid-term exam schedule released — check Notice Board" },
        ]);
      }
    };
    fetchNotices();
  }, []);

  if (notices.length === 0) return null;

  return (
    <div className="bg-secondary text-secondary-foreground py-2 overflow-hidden">
      <div className="container flex items-center gap-3">
        <div className="flex items-center gap-1 shrink-0 bg-secondary-foreground/10 px-3 py-1 rounded-full">
          <Bell className="h-3.5 w-3.5" />
          <span className="text-xs font-heading font-semibold uppercase">Notices</span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="animate-ticker whitespace-nowrap flex gap-12">
            {notices.map((n) => (
              <span key={n.id} className="text-sm font-medium">{n.title}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeTicker;
