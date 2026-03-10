
import React, { useState, useEffect, useRef } from 'react';
import { Movie } from '../types';
import { Play, X, Check } from 'lucide-react';
import Badge from './Badge';

interface ReelsViewProps {
  movies: Movie[];
  onClose: () => void;
}

const ReelsView: React.FC<ReelsViewProps> = ({ movies, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  
  // Swipe State
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cycle through movies if we run out
  const currentMovie = movies[currentIndex % movies.length];
  const nextMovie = movies[(currentIndex + 1) % movies.length];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
        const newSet = new Set(likedIds);
        newSet.add(currentMovie.id);
        setLikedIds(newSet);
    }
    
    // Reset state and move to next
    setDragX(0);
    setCurrentIndex(prev => prev + 1);
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') handleSwipe('left');
        if (e.key === 'ArrowRight') handleSwipe('right');
        if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, likedIds]);

  // Touch/Mouse Handlers
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    startXRef.current = clientX;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const delta = clientX - startXRef.current;
    setDragX(delta);
  };

  const handleEnd = () => {
    setIsDragging(false);
    if (dragX > 100) {
      handleSwipe('right');
    } else if (dragX < -100) {
      handleSwipe('left');
    } else {
      setDragX(0); // Snap back
    }
  };

  if (!currentMovie) return <div className="text-white text-center pt-20">Loading Reels...</div>;

  // Dynamic styles for the active card
  const rotation = dragX * 0.05;
  const opacity = Math.max(0.5, 1 - Math.abs(dragX) / 500);
  const cardStyle = {
    transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
    opacity: opacity,
    transition: isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s',
    cursor: isDragging ? 'grabbing' : 'grab'
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex justify-center items-center overflow-hidden">
      
      {/* Desktop Background Blur Context */}
      <div 
        className="absolute inset-0 -z-10 bg-cover bg-center blur-2xl opacity-20 scale-110 transition-all duration-700" 
        style={{ backgroundImage: `url(${currentMovie.imageUrl})` }}
      />

      {/* Mobile-first vertical container */}
      <div className="relative w-full h-full md:w-[400px] md:h-[85vh] md:rounded-2xl bg-zinc-900 shadow-2xl border border-zinc-800 flex flex-col">
        
        {/* Header */}
        <div className="absolute top-0 left-0 w-full z-30 p-4 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
             <div className="flex flex-col drop-shadow-md">
                <span className="font-bold text-lg tracking-tighter text-netflix-red">Clips</span>
             </div>
             <button onClick={onClose} className="pointer-events-auto text-white bg-black/30 backdrop-blur px-3 py-1 rounded-full text-xs font-medium hover:bg-white/20 border border-white/10">
                Exit
             </button>
        </div>

        {/* Card Stack Container */}
        <div className="relative flex-grow overflow-hidden bg-black">
            
            {/* Next Card (Background Layer) - Only visible when dragging top card */}
            <div className="absolute inset-0 flex items-center justify-center scale-95 opacity-50">
                 <div 
                    className="w-full h-full bg-cover bg-center opacity-60"
                    style={{ backgroundImage: `url(${nextMovie.imageUrl})` }}
                />
            </div>

            {/* Active Card (Foreground) */}
            <div 
                ref={containerRef}
                className="absolute inset-0 w-full h-full bg-black"
                style={cardStyle}
                onMouseDown={(e) => handleStart(e.clientX)}
                onMouseMove={(e) => handleMove(e.clientX)}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={(e) => handleStart(e.touches[0].clientX)}
                onTouchMove={(e) => handleMove(e.touches[0].clientX)}
                onTouchEnd={handleEnd}
            >
                 {/* Image Layer */}
                <div 
                    className="w-full h-full bg-cover bg-center pointer-events-none"
                    style={{ backgroundImage: `url(${currentMovie.imageUrl})` }}
                />
                
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 pointer-events-none" />

                {/* Swipe Indicators (Overlays) */}
                {dragX > 50 && (
                    <div className="absolute top-1/3 left-8 border-4 border-green-500 text-green-500 font-bold text-4xl px-4 py-2 rounded-lg transform -rotate-12 opacity-80 pointer-events-none">
                        MY LIST
                    </div>
                )}
                {dragX < -50 && (
                    <div className="absolute top-1/3 right-8 border-4 border-red-500 text-red-500 font-bold text-4xl px-4 py-2 rounded-lg transform rotate-12 opacity-80 pointer-events-none">
                        PASS
                    </div>
                )}

                {/* Play Icon Center */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play fill="white" size={32} />
                    </div>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 w-full p-6 z-20 pb-24 pointer-events-none">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge type="imdb" value={currentMovie.reviews.imdbRating} />
                        <Badge type="rt" value={currentMovie.reviews.rtScore} />
                        {currentMovie.reviews.redditTrending && <Badge type="reddit" isMinimal />}
                    </div>
                    
                    <h2 className="text-3xl font-bold mb-1 drop-shadow-lg text-white leading-tight">{currentMovie.title}</h2>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-200 mb-3 font-medium">
                        <span>{currentMovie.genre}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-green-400 font-bold">{currentMovie.matchScore}% Match</span>
                    </div>
                    
                    {/* Structured Comments for Reels */}
                    {currentMovie.reviews.redditComments && currentMovie.reviews.redditComments.length > 0 ? (
                       <div className="space-y-2 mt-3">
                          {currentMovie.reviews.redditComments.slice(0, 1).map((comment, idx) => (
                             <div key={idx} className="bg-black/40 p-3 rounded-lg border-l-4 border-netflix-red backdrop-blur-sm">
                                <p className="text-sm text-gray-100 font-medium italic mb-1">"{comment.text}"</p>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                  <span className="text-white">{comment.emoji}</span>
                                  <span className="text-blue-400">{comment.author}</span>
                                  <span>•</span>
                                  <span>{comment.upvotes} upvotes</span>
                                </div>
                             </div>
                          ))}
                       </div>
                    ) : (
                      <p className="text-sm text-gray-300 line-clamp-3 drop-shadow-md leading-relaxed max-w-[90%]">
                          {currentMovie.description}
                      </p>
                    )}
                </div>
            </div>
        </div>

        {/* Bottom Action Bar (Static) */}
        <div className="absolute bottom-6 left-0 w-full px-8 z-40 flex justify-center items-center gap-8 pointer-events-none">
            <button 
                onClick={() => handleSwipe('left')}
                className="pointer-events-auto w-14 h-14 bg-zinc-800/80 backdrop-blur border border-red-500/30 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500/20 hover:scale-110 transition-all shadow-xl"
                aria-label="Pass"
            >
                <X size={28} strokeWidth={3} />
            </button>
            
            <button 
                onClick={() => handleSwipe('right')}
                className="pointer-events-auto w-14 h-14 bg-zinc-800/80 backdrop-blur border border-green-500/30 text-green-500 rounded-full flex items-center justify-center hover:bg-green-500/20 hover:scale-110 transition-all shadow-xl"
                aria-label="Add to My List"
            >
                <Check size={28} strokeWidth={3} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ReelsView;
