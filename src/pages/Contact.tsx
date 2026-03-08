import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/sections/ContactSection";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-primary py-16">
          <div className="container text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground">
              Contact <span className="text-secondary">Us</span>
            </h1>
            <p className="text-primary-foreground/70 mt-2">Get in touch with Thangapara High School</p>
          </div>
        </section>
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
