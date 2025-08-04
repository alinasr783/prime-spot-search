import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Menu, Home, Search, Building, Phone, Mail, Sun, Moon } from "lucide-react";
import inspireLogo from "@/assets/inspire-logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const menuItems = [
    { label: "الرئيسية", icon: Home, href: "#" },
    { label: "البحث", icon: Search, href: "#search" },
    { label: "العقارات", icon: Building, href: "#properties" },
    { label: "اتصل بنا", icon: Phone, href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src={inspireLogo} 
              alt="Inspire Logo" 
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">inspire</h1>
              <p className="text-xs text-muted-foreground">التسويق العقاري</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="hidden sm:flex items-center gap-2"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* Contact Button */}
            <Button variant="default" size="sm" className="hidden md:flex">
              <Phone className="w-4 h-4 ml-2" />
              اتصل بنا
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-6 mt-8">
                  {/* Mobile Logo */}
                  <div className="flex items-center gap-3 pb-6 border-b">
                    <img 
                      src={inspireLogo} 
                      alt="Inspire Logo" 
                      className="w-12 h-12 object-contain"
                    />
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">inspire</h1>
                      <p className="text-sm text-muted-foreground">التسويق العقاري</p>
                    </div>
                  </div>

                  {/* Mobile Menu Items */}
                  <div className="space-y-4">
                    {menuItems.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <item.icon className="w-5 h-5 text-primary" />
                        <span className="text-lg font-medium">{item.label}</span>
                      </a>
                    ))}
                  </div>

                  {/* Mobile Action Buttons */}
                  <div className="space-y-3 pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={toggleTheme}
                      className="w-full justify-start gap-3"
                    >
                      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                      {isDarkMode ? 'الوضع الفاتح' : 'الوضع الداكن'}
                    </Button>

                    <Button variant="default" className="w-full">
                      <Phone className="w-5 h-5 ml-2" />
                      اتصل بنا الآن
                    </Button>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>+20 100 123 4567</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-primary" />
                      <span>info@inspire.com</span>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;