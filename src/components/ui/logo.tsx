import React from 'react';

// Import all logo images for standalone version
import logo64png from '@/assets/images/cryptoseed-logo-64.png';
import logo64webp from '@/assets/images/cryptoseed-logo-64.webp';
import logo128png from '@/assets/images/cryptoseed-logo-128.png';
import logo128webp from '@/assets/images/cryptoseed-logo-128.webp';
import logo256png from '@/assets/images/cryptoseed-logo-256.png';
import logo256webp from '@/assets/images/cryptoseed-logo-256.webp';

interface LogoProps {
  size: '64' | '128' | '256';
  className?: string;
  alt?: string;
  width?: string;
  height?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size, 
  className = '', 
  alt = 'Crypto Seed Logo',
  width,
  height 
}) => {
  const getSources = () => {
    switch (size) {
      case '64':
        return { webp: logo64webp, png: logo64png };
      case '128':
        return { webp: logo128webp, png: logo128png };
      case '256':
        return { webp: logo256webp, png: logo256png };
      default:
        return { webp: logo64webp, png: logo64png };
    }
  };

  const sources = getSources();
  
  return (
    <picture>
      <source 
        srcSet={sources.webp} 
        type="image/webp"
      />
      <img 
        src={sources.png}
        alt={alt}
        className={className}
        width={width || size}
        height={height || size}
      />
    </picture>
  );
};
