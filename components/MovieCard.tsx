
import React from 'react';
import { Play, Plus, MoreVertical, Info } from 'lucide-react';
import { Movie } from '../types';
import Badge from './Badge';

interface MovieCardProps {
  movie: Movie;
  isLarge?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, isLarge = false }) => {
  return (
    <div className={`group relative flex-none ${isLarge ? 'w-48 md:w-64 h-72 md:h-96' : 'w-36 md:w-56 h-56 md:h-80'} transition-all duration-300 z-10 hover:z-50 hover:scale-110 cursor-pointer`}>
      
      {/* Thumbnail Image */}
      <img 
        src={movie.imageUrl} 
        alt={movie.title} 
        className="w-full h-full object-cover rounded-md shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
      />
      
      {/* Match Score Badge (Top Right) */}
      <div className="absolute top-2 right-2 bg-netflix-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
        {movie.matchScore}% Match
      </div>

      {/* Review Integration Badge - Always visible in corners or minimal */}
      {movie.reviews.redditTrending && (
        <div className="absolute top-2 left-2 group-hover:hidden">
           <Badge type="reddit" isMinimal />
        </div>
      )}

      {/* Hover Card Details (Simulated Expansion) */}
      <div className="absolute inset-0 bg-zinc-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 shadow-xl ring-1 ring-white/20 overflow-hidden">
        
        {/* Background Blur Effect */}
        <div className="absolute inset-0 opacity-20 bg-cover bg-center z-0" style={{ backgroundImage: `url(${movie.imageUrl})` }} />
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="mb-auto">
            <h3 className="font-bold text-white text-sm md:text-base leading-tight mb-1 shadow-black drop-shadow-md">{movie.title}</h3>
            {/* Hide description if we have comments, to save space */}
            {!movie.reviews.redditComments && (
              <p className="text-[10px] text-gray-300 line-clamp-2 mb-2">{movie.description}</p>
            )}
          </div>

          <div className="space-y-2 mt-2">
            {/* SOLUTION 1: Review Integration */}
            {/* Social Proof Row */}
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <Badge type="imdb" value={movie.reviews.imdbRating} />
              <Badge type="rt" value={movie.reviews.rtScore} />
              {movie.reviews.redditTrending && <Badge type="reddit" />}
            </div>

            {/* Detailed Reddit Comments */}
            {movie.reviews.redditComments && movie.reviews.redditComments.length > 0 && (
              <div className="space-y-1.5">
                {movie.reviews.redditComments.slice(0, 2).map((comment, idx) => (
                  <div key={idx} className="bg-black/60 p-1.5 rounded border-l-2 border-white/20 backdrop-blur-md">
                     <div className="flex items-start gap-1.5">
                        <span className="text-xs mt-0.5">{comment.emoji}</span>
                        <div>
                           <p className="text-[9px] text-gray-200 leading-snug line-clamp-3">"{comment.text}"</p>
                           <div className="flex items-center gap-2 mt-0.5">
                             <span className="text-[8px] text-blue-400 font-medium">{comment.author}</span>
                             <span className="text-[8px] text-gray-500">({comment.upvotes} upvotes)</span>
                           </div>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button className="bg-white text-black p-1.5 rounded-full hover:bg-gray-200 transition">
                <Play size={12} fill="currentColor" />
              </button>
              <button className="border border-gray-400 text-white p-1.5 rounded-full hover:border-white hover:bg-white/10 transition">
                <Plus size={12} />
              </button>
              <button className="border border-gray-400 text-white p-1.5 rounded-full hover:border-white hover:bg-white/10 transition">
                <MoreVertical size={12} />
              </button>
              <div className="flex-grow"></div>
              <button className="border border-gray-400 text-white p-1.5 rounded-full hover:border-white hover:bg-white/10 transition">
                <Info size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
