import React, { useState } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  aspectRatio?: '1/1' | '4/3' | '16/9' | '3/4' | '2/3';
  priority?: boolean;
  className?: string;
  sizes?: string;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  aspectRatio = '4/3',
  priority = false,
  className = '',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Derive responsive srcSet URLs for Unsplash
  const getSrcWithWidth = (width: number) => {
    if (src.includes('unsplash.com')) {
      const baseUrl = src.split('?')[0];
      return `${baseUrl}?auto=format&fit=crop&w=${width}&q=80`;
    }
    return src;
  };

  const srcSet = `
    ${getSrcWithWidth(400)} 400w,
    ${getSrcWithWidth(800)} 800w,
    ${getSrcWithWidth(1200)} 1200w
  `;

  // Aspect ratio classes to guarantee zero CLS
  const aspectClass = {
    '1/1': 'aspect-square',
    '4/3': 'aspect-[4/3]',
    '16/9': 'aspect-video',
    '3/4': 'aspect-[3/4]',
    '2/3': 'aspect-[2/3]',
  }[aspectRatio];

  return (
    <div
      className={`relative overflow-hidden bg-creme-surface/60 ${aspectClass} ${className}`}
      style={{ contain: 'layout paint' }}
    >
      {/* Shimmer Skeleton Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-0 bg-stone-200/50 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-stone-100/60 to-transparent animate-shimmer-sweep" />
        </div>
      )}

      {/* Offline/Error Graceful Artisan Fallback */}
      {hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-3 text-center bg-stone-100/90 text-espresso-deep">
          <span className="text-2xl mb-1">🥐</span>
          <p className="text-[10px] font-bold uppercase tracking-wider text-espresso-deep/80 line-clamp-1">{alt}</p>
          <span className="text-[9px] text-terracotta font-medium mt-0.5">Maison Dorée Paris VIIe</span>
        </div>
      )}

      {/* Picture & Image */}
      {!hasError && (
        <picture>
          <source
            type="image/webp"
            srcSet={srcSet}
            sizes={sizes}
          />
          <img
            src={getSrcWithWidth(800)}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            // @ts-expect-error fetchpriority standard attribute in modern browsers
            fetchpriority={priority ? 'high' : 'auto'}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover transition-all duration-700 ease-out ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          />
        </picture>
      )}
    </div>
  );
};

export default ResponsiveImage;
