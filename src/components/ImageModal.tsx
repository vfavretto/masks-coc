import React, { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface ImageModalProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, alt, isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const openInNewTab = () => {
    window.open(src, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-[90vw] max-h-[90vh] flex flex-col">
        {/* Header with controls */}
        <div className="flex justify-between items-center mb-4 bg-black/50 rounded-t-lg p-3">
          <h3 className="text-white font-medium truncate mr-4">{alt}</h3>
          <div className="flex gap-2">
            <button
              onClick={openInNewTab}
              className="p-2 text-gray-400 hover:text-primary transition-colors rounded"
              title="Open in new tab"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-primary transition-colors rounded"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Image */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-lg border border-primary/20"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
            }}
          />
        </div>
        
        {/* Footer with image URL */}
        <div className="mt-4 bg-black/50 rounded-b-lg p-3">
          <p className="text-gray-400 text-sm truncate">
            <span className="text-gray-500">URL: </span>
            <a 
              href={src} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline"
            >
              {src}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageModal; 