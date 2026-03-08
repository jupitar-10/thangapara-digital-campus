import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import NoticeBoard from "./pages/NoticeBoard";
import Contact from "./pages/Contact";
import Teachers from "./pages/Teachers";
import Gallery from "./pages/Gallery";
import Downloads from "./pages/Downloads";
import Students from "./pages/Students";
import Admissions from "./pages/Admissions";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import DashboardHome from "./pages/admin/DashboardHome";
import AdminNotices from "./pages/admin/AdminNotices";
import AdminTeachers from "./pages/admin/AdminTeachers";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminDownloads from "./pages/admin/AdminDownloads";
import AdminAdmissions from "./pages/admin/AdminAdmissions";
import AdminResults from "./pages/admin/AdminResults";
import Results from "./pages/Results";
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
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/students" element={<Students />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/results" element={<Results />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="notices" element={<AdminNotices />} />
            <Route path="teachers" element={<AdminTeachers />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="downloads" element={<AdminDownloads />} />
            <Route path="admissions" element={<AdminAdmissions />} />
            <Route path="results" element={<AdminResults />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
