import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* شعار الشركة */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">شركة إنسباير العقارية</h3>
            <p className="text-muted-foreground">
              منصة العقارات الرائدة في مصر لأفضل العقارات والخدمات العقارية
            </p>
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

          {/* الإدارة */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">الإدارة</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link 
                  to="/admin/login" 
                  className="hover:text-primary transition-colors"
                >
                  لوحة التحكم
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 شركة إنسباير العقارية. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;