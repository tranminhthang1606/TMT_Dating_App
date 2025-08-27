"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, MapPin, Sparkles } from "lucide-react";
import { calculateAge } from "@/lib/helpers/calculate-age";
import type { UserProfile } from "@/app/[locale]/profile/page";

export default function MatchCard({ user }: { user: UserProfile }) {
  return (
    <motion.div 
      className="relative w-full h-full overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Background Image */}
      <div className="relative w-full h-full">
        <Image
          src={user.avatar_url || "/default-avatar.png"}
          alt={user.full_name}
          fill
          className="object-cover transition-all duration-300 hover:scale-105"
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={(e) => {
            console.log('Image failed to load:', user.avatar_url);
            const target = e.target as HTMLImageElement;
            target.src = "/default-avatar.png";
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Badge */}
        <motion.div 
          className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 border border-white/30"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center space-x-1">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
            <span className="text-white text-xs sm:text-sm lg:text-base font-medium">New</span>
          </div>
        </motion.div>

        {/* Profile Info */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="space-y-1.5 sm:space-y-2 lg:space-y-3">
            {/* Name and Age */}
            <motion.div 
              className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <h2 className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white drop-shadow-lg truncate">
                {user.full_name}
              </h2>
              <motion.div 
                className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-white font-semibold text-sm sm:text-base lg:text-lg">{calculateAge(user.birthdate)}</span>
              </motion.div>
            </motion.div>

            {/* Username */}
            <motion.p 
              className="text-white/80 text-sm sm:text-lg lg:text-xl font-medium truncate"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              @{user.username}
            </motion.p>

            {/* Bio */}
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl lg:rounded-2xl p-2 sm:p-3 lg:p-4 border border-white/20"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <p className="text-white text-xs sm:text-sm lg:text-base leading-relaxed line-clamp-2 sm:line-clamp-3">{user.bio}</p>
            </motion.div>

            {/* Tags/Interests */}
            <motion.div 
              className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 flex-wrap"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <motion.div 
                className="bg-pink-500/80 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-white text-xs sm:text-sm lg:text-base font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                  Active
                </span>
              </motion.div>
              <motion.div 
                className="bg-rose-500/80 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-white text-xs sm:text-sm lg:text-base font-medium flex items-center gap-1">
                  <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                  Popular
                </span>
              </motion.div>
            </motion.div>

            {/* Location (if available) */}
            {user.location_lat && user.location_lng && (
              <motion.div 
                className="flex items-center space-x-1 sm:space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 w-fit"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.5, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.05 }}
              >
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                <span className="text-white text-xs sm:text-sm lg:text-base">Nearby</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Bottom Gradient for better text readability */}
        <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-24 lg:h-32 xl:h-40 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Floating particles effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}