import Navbar from "@/components/Navbar";
import NoticeTicker from "@/components/NoticeTicker";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import HeadmasterSection from "@/components/sections/HeadmasterSection";
import TeachersSection from "@/components/sections/TeachersSection";
import StudentCornerSection from "@/components/sections/StudentCornerSection";
import AchievementsSection from "@/components/sections/AchievementsSection";
import GallerySection from "@/components/sections/GallerySection";
import DownloadsSection from "@/components/sections/DownloadsSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NoticeTicker />
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <HeadmasterSection />
        <TeachersSection />
        <StudentCornerSection />
        <AchievementsSection />
        <GallerySection />
        <DownloadsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
