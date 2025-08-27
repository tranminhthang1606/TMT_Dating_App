"use client";

import { motion } from 'framer-motion';

interface BrandLogoProps {
  text: string;
  className?: string;
  fontStyle?: 'great-vibes' | 'dancing-script' | 'pacifico' | 'satisfy' | 'kaushan-script' | 'playfair' | 'crimson' | 'libre-baskerville' | 'allura' | 'alex-brush' | 'berkshire-swash' | 'petit-formal';
}

export default function BrandLogo({ text, className = "", fontStyle = 'great-vibes' }: BrandLogoProps) {
  const fontFamilies = {
    'great-vibes': "'Great Vibes', cursive",
    'dancing-script': "'Dancing Script', cursive",
    'pacifico': "'Pacifico', cursive",
    'satisfy': "'Satisfy', cursive",
    'kaushan-script': "'Kaushan Script', cursive",
    'playfair': "'Playfair Display', serif",
    'crimson': "'Crimson Text', serif",
    'libre-baskerville': "'Libre Baskerville', serif",
    'allura': "'Allura', cursive",
    'alex-brush': "'Alex Brush', cursive",
    'berkshire-swash': "'Berkshire Swash', cursive",
    'petit-formal': "'Petit Formal Script', cursive"
  };

  return (
    <motion.span 
      className={`text-md sm:text-xl md:text-xl lg:text-xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent hover:from-rose-700 hover:via-pink-700 hover:to-purple-700 transition-all duration-300 ${className}`}
      style={{ 
        fontFamily: fontFamilies[fontStyle],
        letterSpacing: '0.3px'
      }}
      whileHover={{ 
        scale: 1.05,
        textShadow: "0 0 20px rgba(236, 72, 153, 0.3)"
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
    >
      {text}
    </motion.span>
  );
}
