import React from 'react';

interface GlobalShapersLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const GlobalShapersLogo: React.FC<GlobalShapersLogoProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  // Dimensions based on size prop
  const logoSizes = {
    sm: 'h-14 sm:h-16',
    md: 'h-20 sm:h-24',
    lg: 'h-28 sm:h-32'
  };

  const currentHeight = logoSizes[size];

  return (
    <div className={`inline-flex items-center justify-center bg-transparent py-2 px-1 ${className}`}>
      {/* Renders the original official brand logo provided by the user */}
      <img 
        src="/global_shapers_logo.png" 
        alt="Global Shapers Community Colombia y Venezuela Logo" 
        className={`${currentHeight} w-auto object-contain`}
        referrerPolicy="no-referrer"
        onError={(e) => {
          // Fallback message if image is not uploaded yet
          console.warn("Global Shapers logo image not found at /public/global_shapers_logo.png yet.");
        }}
      />
    </div>
  );
};

