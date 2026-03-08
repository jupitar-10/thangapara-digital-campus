import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const HeadmasterSection = () => (
  <section className="py-16 bg-muted" id="headmaster">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid md:grid-cols-[240px_1fr] gap-8 items-center max-w-4xl mx-auto"
      >
        <div className="mx-auto">
          <div className="w-48 h-48 rounded-full bg-primary/10 border-4 border-secondary flex items-center justify-center overflow-hidden">
            <img
              src="/placeholder.svg"
              alt="Headmaster"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-center mt-3 font-heading font-semibold text-foreground">Headmaster</p>
          <p className="text-center text-sm text-muted-foreground">Thangapara High School</p>
        </div>
        <div>
          <Quote className="h-8 w-8 text-secondary mb-3" />
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
            Headmaster's Message
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Dear Students, Parents, and Well-wishers,
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            It is with great pride and joy that I welcome you to Thangapara High School. Our institution is committed
            to providing a nurturing environment where students can grow academically, socially, and morally. We believe
            every child has the potential to achieve greatness, and it is our mission to guide them on this journey.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Together with our dedicated teachers and supportive parents, we strive to build a brighter future for our community.
            I invite you to explore our school and become part of our growing family.
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HeadmasterSection;
