import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { BookOpen, Eye, Target } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="bg-primary py-16">
          <div className="container text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground">
              About <span className="text-secondary">Us</span>
            </h1>
            <p className="text-primary-foreground/70 mt-2">Learn more about Thangapara High School</p>
          </div>
        </section>

        {/* History */}
        <section className="py-16 bg-background">
          <div className="container max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="h-6 w-6 text-secondary" />
                <h2 className="font-heading text-3xl font-bold text-foreground">Our History</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Thangapara High School was established with a vision to bring quality education to the rural community of Thangapara village
                in Gangarampur, South Dinajpur, West Bengal. Over the years, the school has grown from humble beginnings to become
                a respected institution in the district.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our school has produced numerous successful alumni who have gone on to excel in various fields. With a strong foundation
                in academics and moral values, we continue to inspire the next generation of leaders, thinkers, and change-makers.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Affiliated with the West Bengal Board of Secondary Education, Thangapara High School follows a comprehensive curriculum
                designed to foster intellectual curiosity and critical thinking among students from Class V to Class X.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-muted">
          <div className="container max-w-4xl">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-card border border-border rounded-xl p-8"
              >
                <Target className="h-8 w-8 text-secondary mb-4" />
                <h3 className="font-heading text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To provide accessible, quality education that empowers students with knowledge, skills, and values
                  necessary to contribute meaningfully to society. We aim to create a nurturing learning environment
                  where every student can discover and develop their unique potential.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-card border border-border rounded-xl p-8"
              >
                <Eye className="h-8 w-8 text-secondary mb-4" />
                <h3 className="font-heading text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To be the leading educational institution in South Dinajpur, recognized for academic excellence,
                  character building, and community development. We envision a school where tradition meets modern
                  education, preparing students for a globally connected world.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
