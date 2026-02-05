import { useState } from 'react';
import { Camera } from 'lucide-react';
import ImageModal from '@/components/ImageModal';

// Imports relativos à raiz do projeto
import galleryImg1 from '../../../../assets/img/TelegrafoPeru.jpeg';
import galleryImg2 from '../../../../assets/img/TelegrafoJackson.jpeg';

export function CampaignGallery() {
  const [selectedImage, setSelectedImage] = useState<{src: string, alt: string} | null>(null);

  const images = [
    { src: galleryImg1, alt: "Telegrafo Peru" },
    { src: galleryImg2, alt: "Telegrafo Jackson" }
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-center gap-3 mb-10 justify-center">
        <Camera className="w-8 h-8 text-primary" />
        <h2 className="text-4xl font-bold font-[MedievalSharp] text-primary text-center">
          Visual Records
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <div
            key={i}
            className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer border border-primary/20 hover:border-primary/60 transition-all duration-300"
            onClick={() => setSelectedImage(img)}
          >
            <div className="absolute inset-0 bg-black/50 group-hover:bg-transparent transition-all duration-500 z-10" />
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
          </div>
        ))}
      </div>

      {selectedImage && (
        <ImageModal
          src={selectedImage.src}
          alt={selectedImage.alt}
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </section>
  );
}
