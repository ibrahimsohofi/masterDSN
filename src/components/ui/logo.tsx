"use client";

import { BookOpen, Shield } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({
  size = "md",
  showText = true,
  className = "",
}: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const iconSize = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  const textClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative ${sizeClasses[size]} animate-scale-in`}>
        {/* Bouclier de protection en arrière-plan */}
        <Shield
          size={iconSize[size]}
          className="absolute inset-0 text-blue-600 z-10 animate-glow"
          fill="currentColor"
        />
        {/* Livre ouvert au premier plan */}
        <BookOpen
          size={iconSize[size] * 0.7}
          className="absolute inset-0 m-auto text-blue-400 z-20"
        />
      </div>

      {showText && (
        <div className="animate-fade-in">
          <h1
            className={`font-bold text-gradient ${textClasses[size]} leading-tight`}
          >
            Master DSN
          </h1>
          <p className="text-xs text-muted-foreground -mt-1">
            Droit & Sécurité Numériques
          </p>
        </div>
      )}
    </div>
  );
}
