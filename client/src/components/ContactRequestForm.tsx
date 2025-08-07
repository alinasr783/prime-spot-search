import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Phone, Mail, MessageSquare, Loader2 } from "lucide-react";

interface ContactRequestFormProps {
  propertyId: string;
  propertyTitle: string;
  trigger?: React.ReactNode;
}

export const ContactRequestForm = ({ propertyId, propertyTitle, trigger }: ContactRequestFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    inquiry_type: "استفسار عام"
  });
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiRequest('/api/inquiries', {
        method: 'POST',
        body: JSON.stringify({
          property_id: propertyId,
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone || null,
          message: `${formData.message}\n\nالعقار: ${propertyTitle}`,
          inquiry_type: formData.inquiry_type,
          status: 'جديد'
        })
      });

      // Invalidate inquiries cache
      queryClient.invalidateQueries({ queryKey: ['/api/admin/inquiries'] });

      toast({
        title: "تم إرسال طلبك بنجاح",
        description: "سنتواصل معك في أقرب وقت ممكن",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        inquiry_type: "استفسار عام"
      });
      setOpen(false);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من إرسال طلبك. حاول مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full" size="lg">
            <MessageSquare className="w-5 h-5 ml-2" />
            طلب تواصل
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">طلب تواصل - {propertyTitle}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم الكامل *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="أدخل اسمك الكامل"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="01xxxxxxxxx"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inquiry_type">نوع الاستفسار</Label>
            <Select value={formData.inquiry_type} onValueChange={(value) => setFormData({ ...formData, inquiry_type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="استفسار عام">استفسار عام</SelectItem>
                <SelectItem value="حجز معاينة">طلب معاينة</SelectItem>
                <SelectItem value="استفسار سعر">استفسار عن السعر</SelectItem>
                <SelectItem value="طلب تفاوض">طلب تفاوض</SelectItem>
                <SelectItem value="معلومات إضافية">معلومات إضافية</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">الرسالة *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              rows={4}
              placeholder="اكتب رسالتك هنا..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
              إرسال الطلب
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};