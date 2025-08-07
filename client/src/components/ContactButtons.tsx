import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";
import { useContactSettings } from "@/hooks/useContactSettings";

interface ContactButtonsProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcons?: boolean;
  direction?: "horizontal" | "vertical";
  propertyTitle?: string;
  propertyId?: string;
}

export const ContactButtons = ({
  variant = "default",
  size = "md",
  className = "",
  showIcons = true,
  direction = "horizontal",
  propertyTitle,
  propertyId
}: ContactButtonsProps) => {
  const { settings } = useContactSettings();

  if (!settings) return null;

  const buttonSize = size === "sm" ? "sm" : size === "lg" ? "lg" : "default";
  const iconSize = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5";
  
  const containerClass = direction === "vertical" 
    ? "flex flex-col gap-3" 
    : "flex flex-wrap gap-3";

  const subject = propertyTitle 
    ? `استفسار عن العقار: ${propertyTitle}` 
    : "استفسار عام";

  const whatsappMessage = propertyTitle 
    ? `مرحباً، أريد الاستفسار عن العقار: ${propertyTitle}` 
    : "مرحباً، أريد الاستفسار عن خدماتكم العقارية";

  return (
    <div className={`${containerClass} ${className}`}>
      {/* زر الاتصال */}
      {settings.phone && (
        <Button 
          variant={variant} 
          size={buttonSize}
          className="flex-1 min-w-fit"
          asChild
        >
          <a href={`tel:${settings.phone}`}>
            {showIcons && <Phone className={`${iconSize} ml-2`} />}
            اتصل الآن
          </a>
        </Button>
      )}

      {/* زر واتساب */}
      {settings.whatsapp_number && (
        <Button 
          variant={variant} 
          size={buttonSize}
          className="flex-1 min-w-fit bg-green-600 hover:bg-green-700 text-white border-green-600"
          asChild
        >
          <a 
            href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {showIcons && <MessageCircle className={`${iconSize} ml-2`} />}
            واتساب
          </a>
        </Button>
      )}

      {/* زر الإيميل */}
      {settings.email && (
        <Button 
          variant={variant} 
          size={buttonSize}
          className="flex-1 min-w-fit"
          asChild
        >
          <a href={`mailto:${settings.email}?subject=${encodeURIComponent(subject)}`}>
            {showIcons && <Mail className={`${iconSize} ml-2`} />}
            إرسال إيميل
          </a>
        </Button>
      )}

      {/* زر العنوان/الموقع */}
      {settings.address && (
        <Button 
          variant="outline" 
          size={buttonSize}
          className="flex-1 min-w-fit"
          asChild
        >
          <a 
            href={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {showIcons && <MapPin className={`${iconSize} ml-2`} />}
            الموقع
          </a>
        </Button>
      )}
    </div>
  );
};

export default ContactButtons;