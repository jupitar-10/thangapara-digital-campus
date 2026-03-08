import { motion } from "framer-motion";
import { Camera } from "lucide-react";

const galleryItems = [
  { title: "Sports Day", img: "/placeholder.svg" },
  { title: "Independence Day", img: "/placeholder.svg" },
  { title: "Annual Function", img: "/placeholder.svg" },
  { title: "Saraswati Puja", img: "/placeholder.svg" },
];

const GallerySection = () => (
  <section className="py-16 bg-background" id="gallery">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 bg-secondary/20 text-primary px-4 py-1.5 rounded-full mb-4">
          <Camera className="h-4 w-4" />
          <span className="text-sm font-heading font-semibold">Photo Gallery</span>
        </div>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          School <span className="text-primary">Gallery</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {galleryItems.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="relative group overflow-hidden rounded-lg aspect-square bg-muted"
          >
            <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-primary-foreground font-heading font-semibold text-sm">{item.title}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default GallerySection;
