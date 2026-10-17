import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'kundli' | 'match' | 'generic';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ variant = 'generic' }) => {
  if (variant === 'kundli') {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="h-6 bg-stone-200 rounded-lg w-1/3 mx-auto"></div>
          <div className="h-4 bg-stone-200 rounded-md w-1/2 mx-auto"></div>
        </div>

        {/* Chart Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 h-96 flex items-center justify-center">
            <div className="w-64 h-64 rounded-full bg-stone-200"></div>
          </div>
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-200 space-y-4">
            <div className="h-5 bg-stone-200 rounded-md w-1/4"></div>
            <div className="space-y-3">
              <div className="h-12 bg-stone-100 rounded-2xl w-full"></div>
              <div className="h-12 bg-stone-100 rounded-2xl w-full"></div>
              <div className="h-12 bg-stone-100 rounded-2xl w-full"></div>
              <div className="h-12 bg-stone-100 rounded-2xl w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'match') {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="h-6 bg-stone-200 rounded-lg w-1/3 mx-auto"></div>
          <div className="h-10 bg-stone-200 rounded-2xl w-1/4 mx-auto"></div>
        </div>

        {/* Guna Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-stone-200 space-y-3">
              <div className="h-4 bg-stone-200 rounded w-1/2"></div>
              <div className="h-6 bg-stone-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 space-y-4 animate-pulse">
      <div className="h-6 bg-stone-200 rounded w-1/3"></div>
      <div className="h-32 bg-stone-200 rounded-2xl w-full"></div>
    </div>
  );
};
