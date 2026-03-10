import React from 'react';
import { Star, Flame, Percent } from 'lucide-react';

interface BadgeProps {
  type: 'imdb' | 'rt' | 'reddit';
  value?: string | number;
  isMinimal?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ type, value, isMinimal = false }) => {
  if (type === 'imdb') {
    return (
      <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded text-xs font-semibold backdrop-blur-sm border border-yellow-500/30">
        <Star size={12} fill="currentColor" />
        <span>{value}</span>
      </div>
    );
  }

  if (type === 'rt') {
    const numValue = typeof value === 'string' ? parseInt(value) : value as number;
    const isFresh = numValue >= 60;
    return (
      <div className={`flex items-center gap-1 ${isFresh ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'} px-1.5 py-0.5 rounded text-xs font-semibold backdrop-blur-sm border`}>
        {isFresh ? <span className="text-lg leading-3">🍅</span> : <span className="text-lg leading-3">🤢</span>}
        <span>{value}%</span>
      </div>
    );
  }

  if (type === 'reddit') {
    if (isMinimal) return <Flame size={14} className="text-orange-500" fill="currentColor" />;
    
    return (
      <div className="flex items-center gap-1 bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded text-xs font-semibold backdrop-blur-sm border border-orange-500/30">
        <Flame size={12} fill="currentColor" />
        <span>Trending</span>
      </div>
    );
  }

  return null;
};

export default Badge;