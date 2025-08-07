import { Link } from "react-router-dom";
import { useContactSettings } from "@/hooks/useContactSettings";
import ContactButtons from "@/components/ContactButtons";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  const { settings } = useContactSettings();
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* شعار الشركة */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">
              {settings?.company_name || "شركة إنسباير العقارية"}
            </h3>
            <p className="text-muted-foreground">
              منصة العقارات الرائدة في مصر لأفضل العقارات والخدمات العقارية
            </p>
            
            {/* معلومات التواصل */}
            <div className="space-y-2">
              {settings?.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{settings.phone}</span>
                </div>
              )}
              {settings?.email && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{settings.email}</span>
                </div>
              )}
              {settings?.address && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{settings.address}</span>
                </div>
              )}
            </div>
            
            {/* أزرار التواصل */}
            <ContactButtons size="sm" variant="outline" />
          </div>

          {/* روابط سريعة */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">روابط سريعة</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link></li>
              <li><Link to="/properties" className="hover:text-primary transition-colors">العقارات</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">من نحن</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">تواصل معنا</Link></li>
            </ul>
          </div>

          {/* الخدمات */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">خدماتنا</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>بيع العقارات</li>
              <li>إيجار العقارات</li>
              <li>الاستشارات العقارية</li>
              <li>إدارة العقارات</li>
            </ul>
          </div>

          {/* التواصل الاجتماعي */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">تابعنا على</h4>
            <div className="flex flex-wrap gap-3">
              {settings?.facebook_url && (
                <a 
                  href={settings.facebook_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <Facebook className="w-5 h-5 text-primary" />
                </a>
              )}
              {settings?.instagram_url && (
                <a 
                  href={settings.instagram_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <Instagram className="w-5 h-5 text-primary" />
                </a>
              )}
              {settings?.twitter_url && (
                <a 
                  href={settings.twitter_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <Twitter className="w-5 h-5 text-primary" />
                </a>
              )}
              {settings?.linkedin_url && (
                <a 
                  href={settings.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <Linkedin className="w-5 h-5 text-primary" />
                </a>
              )}
              {settings?.youtube_url && (
                <a 
                  href={settings.youtube_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <Youtube className="w-5 h-5 text-primary" />
                </a>
              )}
            </div>
            
            <div className="pt-4 border-t border-border">
              <Link 
                to="/admin/login" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                لوحة التحكم
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 {settings?.company_name || "شركة إنسباير العقارية"}. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;