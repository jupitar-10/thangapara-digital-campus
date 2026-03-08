import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import NoticeBoard from "./pages/NoticeBoard";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import DashboardHome from "./pages/admin/DashboardHome";
import AdminNotices from "./pages/admin/AdminNotices";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/notices" element={<NoticeBoard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="notices" element={<AdminNotices />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
