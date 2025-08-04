import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';
import { useImageUpload, BucketName } from '@/hooks/useImageUpload';

interface ImageUploaderProps {
  bucketName: BucketName;
  folder?: string;
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  onImageRemoved?: () => void;
  className?: string;
  buttonText?: string;
  accept?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  bucketName,
  folder,
  currentImageUrl,
  onImageUploaded,
  onImageRemoved,
  className = '',
  buttonText = 'رفع صورة',
  accept = 'image/*'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, isUploading } = useImageUpload();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadImage(file, bucketName, folder);
    if (imageUrl) {
      onImageUploaded(imageUrl);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    if (onImageRemoved) {
      onImageRemoved();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {currentImageUrl && (
        <div className="relative inline-block">
          <img
            src={currentImageUrl}
            alt="صورة مرفوعة"
            className="w-32 h-32 object-cover rounded-lg border border-border"
          />
          {onImageRemoved && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
              onClick={handleRemoveImage}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      )}

      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
        
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              جاري الرفع...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 ml-2" />
              {buttonText}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};