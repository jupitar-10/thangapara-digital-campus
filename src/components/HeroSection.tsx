import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/school-building.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/90" />

      <div className="container relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-extrabold text-primary-foreground mb-4 tracking-tight">
            THANGAPARA
            <span className="block text-secondary">HIGH SCHOOL</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 font-body mb-8 max-w-2xl mx-auto">
            Shaping the Future Through Education
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-heading font-semibold px-8 shadow-lg">
                Admission Open
              </Button>
            </Link>
            <Link to="/notices">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 font-heading font-semibold px-8">
                View Latest Notices
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
