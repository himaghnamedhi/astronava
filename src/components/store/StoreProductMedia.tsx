import React, { useState } from 'react';
import { Sparkles, Gem, ShieldCheck } from 'lucide-react';
import { GemstoneImage } from '../GemstoneImage.tsx';

interface StoreProductMediaProps {
  name: string;
  categorySlug?: string;
  primaryImage?: string;
  altText?: string;
  className?: string;
  aspectRatio?: string;
  planet?: string;
}

// Map product name or slug to gemstone key if it is a ratna
function getGemstoneId(name: string): string | null {
  const lower = name.toLowerCase();
  if (lower.includes('ruby') || lower.includes('manik')) return 'ruby';
  if (lower.includes('emerald') || lower.includes('panna')) return 'emerald';
  if (lower.includes('yellow sapphire') || lower.includes('pukhraj')) return 'yellow_sapphire';
  if (lower.includes('blue sapphire') || lower.includes('neelam')) return 'blue_sapphire';
  if (lower.includes('coral') || lower.includes('moonga')) return 'red_coral';
  if (lower.includes('pearl') || lower.includes('moti')) return 'pearl';
  if (lower.includes('diamond') || lower.includes('heera')) return 'diamond';
  if (lower.includes('hessonite') || lower.includes('gomed')) return 'hessonite';
  if (lower.includes('cat') || lower.includes('vaidurya')) return 'cats_eye';
  return null;
}

// Fallback high-definition curated imagery for each artifact
function getCuratedImage(name: string, categorySlug?: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('ruby') || lower.includes('manik')) {
    return 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80';
  }
  if (lower.includes('emerald') || lower.includes('panna')) {
    return 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80';
  }
  if (lower.includes('yellow sapphire') || lower.includes('pukhraj')) {
    return 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=800&q=80';
  }
  if (lower.includes('blue sapphire') || lower.includes('neelam')) {
    return 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80';
  }
  if (lower.includes('1 mukhi')) {
    return 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80';
  }
  if (lower.includes('rudraksha') || lower.includes('mala')) {
    return 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=800&q=80';
  }
  if (lower.includes('rose quartz')) {
    return 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80';
  }
  if (lower.includes('clear quartz') || lower.includes('tower')) {
    return 'https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?auto=format&fit=crop&w=800&q=80';
  }
  if (lower.includes('citrine')) {
    return 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80';
  }
  if (lower.includes('tourmaline')) {
    return 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80';
  }
  if (categorySlug === 'gemstones') {
    return 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80';
  }
  if (categorySlug === 'rudraksha') {
    return 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=800&q=80';
  }
  return 'https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?auto=format&fit=crop&w=800&q=80';
}

export const StoreProductMedia: React.FC<StoreProductMediaProps> = ({
  name,
  categorySlug,
  primaryImage,
  altText,
  className = '',
  aspectRatio = 'aspect-square',
  planet,
}) => {
  const [imgError, setImgError] = useState(false);
  const gemId = getGemstoneId(name);
  const curatedUrl = getCuratedImage(name, categorySlug);
  const imageSource = !imgError && primaryImage ? primaryImage : curatedUrl;

  return (
    <div className={`relative w-full ${aspectRatio} overflow-hidden bg-stone-900 flex items-center justify-center select-none ${className}`}>
      {/* Background ambient sacred glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-stone-950 via-stone-900 to-amber-950/40" />

      {/* Primary Image or Vector Gemstone */}
      {!imgError ? (
        <img
          src={imageSource}
          alt={altText || name}
          onError={() => setImgError(true)}
          className="relative w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      ) : gemId ? (
        <div className="relative w-full h-full flex items-center justify-center p-6 bg-gradient-to-b from-stone-950 via-[#1e1008] to-stone-950">
          <div className="w-28 h-28 sm:w-36 sm:h-36 drop-shadow-2xl">
            <GemstoneImage gemId={gemId} size="2xl" />
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-4 bg-stone-950 text-amber-300 space-y-2">
          <Gem className="w-10 h-10 opacity-70 animate-pulse" />
          <span className="text-[11px] font-semibold text-stone-400">Vedic Remedial Artifact</span>
        </div>
      )}

      {/* AI Enhanced Vedic Consecration tag overlay */}
      <div className="absolute bottom-2 left-2 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-semibold bg-stone-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30 shadow-xs">
          <Sparkles className="w-2.5 h-2.5 text-amber-400" />
          <span>Vedic Certified Specimen</span>
        </span>
      </div>
    </div>
  );
};
