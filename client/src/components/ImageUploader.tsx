import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';

interface ImageUploaderProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export const ImageUploader = ({ 
  value = '', 
  onChange, 
  label = 'رابط الصورة',
  placeholder = 'أدخل رابط الصورة أو رفع صورة'
}: ImageUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState(value);

  const handleInputChange = (url: string) => {
    onChange(url);
    setPreviewUrl(url);
  };

  const handleClear = () => {
    onChange('');
    setPreviewUrl('');
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            type="url"
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1"
          />
          {value && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleClear}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        {previewUrl && (
          <div className="mt-2">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-32 object-cover rounded-md border"
              onError={() => {
                // If image fails to load, show placeholder
                setPreviewUrl('');
              }}
            />
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          يمكنك لصق رابط صورة من الإنترنت أو رفع صورة إلى خدمة استضافة صور
        </div>
      </div>
    </div>
  );
};