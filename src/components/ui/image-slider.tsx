"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface Props { images: string[]; alt?: string }

export function ImageSlider({ images, alt = "صورة" }: Props) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = useCallback(() => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1)), [images.length]);
  const next = useCallback(() => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1)), [images.length]);

  if (!images.length) return null;

  return (
    <>
      <div className="relative rounded-3xl overflow-hidden bg-slate-900">
        {/* Main Image */}
        <div className="relative h-80 md:h-[480px]">
          {images.map((src, i) => (
            <div
              key={i}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
              style={{
                backgroundImage: `url(${src})`,
                opacity: i === current ? 1 : 0,
                zIndex: i === current ? 1 : 0,
              }}
              aria-hidden={i !== current}
            />
          ))}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10" />

          {/* Controls */}
          {images.length > 1 && (
            <>
              <button onClick={prev} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/90 transition" aria-label="السابق">
                <ChevronRight className="h-5 w-5 text-[var(--navy)]" />
              </button>
              <button onClick={next} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/90 transition" aria-label="التالي">
                <ChevronLeft className="h-5 w-5 text-[var(--navy)]" />
              </button>
            </>
          )}

          {/* Fullscreen */}
          <button onClick={() => setLightbox(true)} className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-white/90 transition" aria-label="عرض كامل">
            <Maximize2 className="h-4 w-4 text-[var(--navy)]" />
          </button>

          {/* Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`slider-dot ${i === current ? "active" : ""}`}
                  aria-label={`الصورة ${i + 1}`}
                />
              ))}
            </div>
          )}

          {/* Counter */}
          <div className="absolute top-4 right-4 z-20 glass text-xs font-bold text-[var(--navy)] px-2.5 py-1 rounded-full">
            {current + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 p-3 bg-slate-900">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`relative flex-1 h-16 rounded-xl overflow-hidden bg-cover bg-center transition-all duration-200 ${i === current ? "ring-2 ring-[var(--gold)] opacity-100" : "opacity-50 hover:opacity-75"}`}
                style={{ backgroundImage: `url(${src})` }}
                aria-label={`الصورة ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightbox(false)}>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition" onClick={(e) => { e.stopPropagation(); prev(); }}>
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
          <img src={images[current]} alt={alt} className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl" onClick={(e) => e.stopPropagation()} />
          <button className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition" onClick={(e) => { e.stopPropagation(); next(); }}>
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button className="absolute top-4 right-4 text-white/60 hover:text-white text-sm font-bold" onClick={() => setLightbox(false)}>✕ إغلاق</button>
        </div>
      )}
    </>
  );
}
