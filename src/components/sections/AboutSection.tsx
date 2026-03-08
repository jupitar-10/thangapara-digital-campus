import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

const AboutSection = () => (
  <section className="py-16 bg-background" id="about">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center"
      >
        <div className="inline-flex items-center gap-2 bg-secondary/20 text-primary px-4 py-1.5 rounded-full mb-4">
          <BookOpen className="h-4 w-4" />
          <span className="text-sm font-heading font-semibold">About Our School</span>
        </div>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
          Welcome to <span className="text-primary">Thangapara High School</span>
        </h2>
        <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
          Established as a center of learning in the heart of Thangapara village, our school has been nurturing young minds
          and shaping futures for decades. Located in Gangarampur, South Dinajpur, West Bengal, we provide quality education
          with a strong focus on academic excellence, moral values, and holistic development. Our dedicated teachers and
          supportive community make Thangapara High School a place where every student can thrive.
        </p>
      </motion.div>
    </div>
  </section>
);

export default AboutSection;
