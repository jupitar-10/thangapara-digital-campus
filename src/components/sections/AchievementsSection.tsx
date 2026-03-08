import { motion } from "framer-motion";
import { Trophy, Medal, Star, Target } from "lucide-react";

const achievements = [
  { icon: Trophy, title: "100% Pass Rate", desc: "Consistent Madhyamik results" },
  { icon: Medal, title: "Sports Champions", desc: "District level winners" },
  { icon: Star, title: "Academic Excellence", desc: "Top district rankers" },
  { icon: Target, title: "Holistic Growth", desc: "Co-curricular achievements" },
];

const AchievementsSection = () => (
  <section className="py-16 bg-primary text-primary-foreground">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h2 className="font-heading text-3xl md:text-4xl font-bold">
          Our <span className="text-secondary">Achievements</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {achievements.map((a, i) => (
          <motion.div
            key={a.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="text-center"
          >
            <div className="bg-primary-foreground/10 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <a.icon className="h-7 w-7 text-secondary" />
            </div>
            <h3 className="font-heading font-semibold text-sm mb-1">{a.title}</h3>
            <p className="text-xs text-primary-foreground/70">{a.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AchievementsSection;
