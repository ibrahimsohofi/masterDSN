import { useState, useEffect } from "react";

interface OptimizedImageOptions {
  quality?: number;
  maxWidth?: number;
  format?: "webp" | "jpeg" | "png";
}

export function useOptimizedImage(
  src: string,
  options: OptimizedImageOptions = {
    quality: 80,
    maxWidth: 800,
    format: "webp",
  },
) {
  const [optimizedSrc, setOptimizedSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    let canvas: HTMLCanvasElement | null = null;
    let objectUrl: string | null = null;

    const cleanup = () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      if (canvas) {
        canvas = null;
      }
    };

    const optimizeImage = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load image
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = src;
        });

        // Create canvas
        canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get canvas context");

        // Calculate dimensions
        let width = img.width;
        let height = img.height;
        if (options.maxWidth && width > options.maxWidth) {
          const ratio = options.maxWidth / width;
          width = options.maxWidth;
          height = height * ratio;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and optimize image
        ctx.drawImage(img, 0, 0, width, height);
        const blob = await new Promise<Blob>((resolve, reject) => {
          if (!canvas) {
            reject(new Error("Canvas is null"));
            return;
          }
          canvas.toBlob(
            (b) =>
              b ? resolve(b) : reject(new Error("Failed to create blob")),
            `image/${options.format}`,
            options.quality ? options.quality / 100 : undefined,
          );
        });

        // Create optimized URL
        objectUrl = URL.createObjectURL(blob);
        setOptimizedSrc(objectUrl);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to optimize image"),
        );
        setLoading(false);
      }
    };

    optimizeImage();
    return cleanup;
  }, [src, options.quality, options.maxWidth, options.format]);

  return { src: optimizedSrc || src, loading, error };
}
