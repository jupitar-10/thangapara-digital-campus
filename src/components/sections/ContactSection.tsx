import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ContactSection = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert([form]);
    setLoading(false);
    if (error) {
      toast.error("Failed to send message. Please try again.");
    } else {
      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <section className="py-16 bg-background" id="contact">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Contact <span className="text-primary">Us</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Contact Info + Map */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-secondary mt-0.5" />
                <div>
                  <p className="font-heading font-semibold text-foreground">Address</p>
                  <p className="text-sm text-muted-foreground">
                    THANGAPARA HIGH SCHOOL<br />
                    Village: Thangapara, P.S: Gangarampur<br />
                    District: South Dinajpur, West Bengal, India
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-secondary" />
                <div>
                  <p className="font-heading font-semibold text-foreground">Phone</p>
                  <p className="text-sm text-muted-foreground">+91 XXXXX XXXXX</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-secondary" />
                <div>
                  <p className="font-heading font-semibold text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground">info@thangaparahs.edu.in</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden border border-border h-52">
              <iframe
                title="School Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14367.069724424066!2d88.52!3d25.40!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39faef4b0000001%3A0x1!2sGangarampur%2C+West+Bengal!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border rounded-xl p-6">
            <h3 className="font-heading font-semibold text-lg text-foreground">Send us a message</h3>
            <Input
              placeholder="Your Name *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              maxLength={100}
              required
            />
            <Input
              type="email"
              placeholder="Your Email *"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              maxLength={255}
              required
            />
            <Input
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              maxLength={200}
            />
            <Textarea
              placeholder="Your Message *"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              maxLength={1000}
              rows={4}
              required
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 gap-2" disabled={loading}>
              <Send className="h-4 w-4" />
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
