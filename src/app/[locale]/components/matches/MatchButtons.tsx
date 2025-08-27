"use client";

import { motion } from "framer-motion";
import { Heart, X } from "lucide-react";

interface MatchButtonsProps {
  onLike: () => void;
  onPass: () => void;
}

export default function MatchButtons({ onLike, onPass }: MatchButtonsProps) {
  return (
    <div className="flex items-center justify-center space-x-4 sm:space-x-6 lg:space-x-8">
      {/* Pass Button */}
      <motion.button
        onClick={onPass}
        className="group relative w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 bg-white border-2 border-gray-300 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:border-red-400"
        whileHover={{ scale: 1.1, rotate: -5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        <X className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 text-gray-400 group-hover:text-red-500 mx-auto transition-colors duration-300" />
        
        {/* Ripple effect */}
        <motion.span 
          className="absolute inset-0 rounded-full bg-red-400 opacity-0 group-hover:opacity-30 group-active:opacity-50 transition-opacity duration-150"
          animate={{ scale: [1, 1.5, 1], opacity: [0, 0.3, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeOut" }}
        />
      </motion.button>

      {/* Like Button */}
      <motion.button
        onClick={onLike}
        className="group relative w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 xl:w-22 xl:h-22 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:from-pink-600 hover:to-rose-600"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
      >
        <div className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        <Heart className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 text-white mx-auto transition-transform duration-300 group-hover:scale-110" />
        
        {/* Pulse effect */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0, 0.2, 0] 
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        {/* Sparkle effect */}
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
          animate={{ 
            scale: [1, 1.5, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      </motion.button>
    </div>
  );
}