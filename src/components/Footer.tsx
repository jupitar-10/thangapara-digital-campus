import { Link } from "react-router-dom";
import { GraduationCap, MapPin, Phone, Mail, Facebook, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* School Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8 text-secondary" />
              <div>
                <h3 className="font-heading text-lg font-bold">THANGAPARA HIGH SCHOOL</h3>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Shaping the Future Through Education. Providing quality education to students of Thangapara and surrounding areas.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="h-9 w-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4 text-secondary">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: "About Us", href: "/about" },
                { label: "Notice Board", href: "/notices" },
                { label: "Contact Us", href: "/contact" },
                { label: "Admin Login", href: "/admin" },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4 text-secondary">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-primary-foreground/70">
                <MapPin className="h-4 w-4 mt-0.5 text-secondary shrink-0" />
                <span>Village: Thangapara, P.S: Gangarampur, South Dinajpur, West Bengal, India</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Phone className="h-4 w-4 text-secondary shrink-0" />
                <span>+91 XXXXX XXXXX</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Mail className="h-4 w-4 text-secondary shrink-0" />
                <span>info@thangaparahs.edu.in</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-4">
        <p className="text-center text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} THANGAPARA HIGH SCHOOL. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
