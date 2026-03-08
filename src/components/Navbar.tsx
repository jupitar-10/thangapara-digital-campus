import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Teachers", href: "/teachers" },
  { label: "Students", href: "/students" },
  { label: "Notice Board", href: "/notices" },
  { label: "Gallery", href: "/gallery" },
  { label: "Downloads", href: "/downloads" },
  { label: "Admissions", href: "/admissions" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full bg-primary shadow-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-secondary" />
          <div className="flex flex-col">
            <span className="font-heading text-lg font-bold leading-tight text-primary-foreground">
              THANGAPARA
            </span>
            <span className="text-xs text-secondary font-medium -mt-1">HIGH SCHOOL</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.href
                  ? "bg-secondary text-secondary-foreground"
                  : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/admin">
            <Button size="sm" variant="outline" className="ml-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
              Admin
            </Button>
          </Link>
        </nav>

        {/* Mobile Nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-primary-foreground">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-primary border-primary w-72">
            <div className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-md text-base font-medium transition-colors ${
                    location.pathname === item.href
                      ? "bg-secondary text-secondary-foreground"
                      : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/admin" onClick={() => setOpen(false)}>
                <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  Admin Login
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
