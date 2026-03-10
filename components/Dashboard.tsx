import React from 'react';
import { Movie, ViewMode } from '../types';
import MovieCard from './MovieCard';
import { Layers, Shuffle, Compass } from 'lucide-react';

interface DashboardProps {
  movies: Movie[];
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const Row: React.FC<{ title: string; movies: Movie[]; isLarge?: boolean; subtitle?: string }> = ({ title, movies, isLarge, subtitle }) => (
  <div className="mb-8 animate-fade-in">
    <div className="mb-3 px-4 md:px-12">
        <h2 className="text-lg md:text-xl font-semibold text-white">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mt-1">{subtitle}</p>}
    </div>
    <div className="relative group">
      <div className="flex gap-4 overflow-x-scroll px-4 md:px-12 pb-8 no-scrollbar scroll-smooth">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} isLarge={isLarge} />
        ))}
      </div>
      {/* Fade effect on right */}
      <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-netflix-dark to-transparent pointer-events-none md:block hidden" />
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ movies, viewMode, setViewMode }) => {
  
  // Filter movies for specific rows (Simulating backend logic)
  const recommendedMovies = movies.filter(m => m.category === 'recommended' || m.matchScore > 90);
  const tasteClusterMovies = movies.filter(m => m.category === 'taste_cluster' || m.genre.includes('Thriller'));
  const popularMovies = movies.filter(m => m.category === 'popular' || m.reviews.redditTrending);

  const isQuickPick = viewMode === ViewMode.QUICK_PICK;

  return (
    <div className="pb-20 pt-24">
      
      {/* SOLUTION 2: Explore Toggle Control */}
      <div className="fixed top-20 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none">
        <div className="bg-zinc-900/90 backdrop-blur-md border border-white/10 p-1 rounded-full shadow-2xl pointer-events-auto flex items-center gap-1">
          <button 
            onClick={() => setViewMode(ViewMode.QUICK_PICK)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isQuickPick ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <Shuffle size={16} className={isQuickPick ? 'text-netflix-red' : ''} />
            <span>Quick Pick</span>
          </button>
          <button 
            onClick={() => setViewMode(ViewMode.EXPLORE)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${!isQuickPick ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <Compass size={16} className={!isQuickPick ? 'text-netflix-red' : ''} />
            <span>Explore</span>
          </button>
        </div>
      </div>

      <div className="mt-12">
        {isQuickPick ? (
            // QUICK PICK MODE: 3 Curated Rows Only
            <div className="space-y-4 animate-slide-up">
                <div className="px-4 md:px-12 mb-6 text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Decide in 5 minutes</h1>
                    <p className="text-gray-400 text-sm max-w-md mx-auto">We've narrowed it down to the best 3 categories for you right now.</p>
                </div>

                <Row 
                    title="Because you watched 'Black Mirror'" 
                    subtitle="High Match Probability"
                    movies={recommendedMovies} 
                    isLarge 
                />
                <Row 
                    title="Your Taste Community: Psychological Thrillers" 
                    subtitle="Trending in your cluster"
                    movies={tasteClusterMovies} 
                />
                 <Row 
                    title="National Hits Today" 
                    subtitle="Top 10 in your country"
                    movies={popularMovies} 
                />
                
                <div className="px-4 md:px-12 mt-12 text-center">
                    <p className="text-gray-500 text-sm mb-4">Not feeling these?</p>
                    <button 
                        onClick={() => setViewMode(ViewMode.EXPLORE)}
                        className="border border-gray-600 text-white px-6 py-2 rounded hover:bg-white/10 transition"
                    >
                        Switch to Explore Mode
                    </button>
                </div>
            </div>
        ) : (
            // EXPLORE MODE: Traditional Netflix View
            <div className="space-y-2 animate-fade-in">
                <div className="px-4 md:px-12 mb-2">
                    <h1 className="text-xl font-bold text-gray-200">Browsing All Categories</h1>
                </div>
                <Row title="Trending Now" movies={popularMovies} />
                <Row title="New Releases" movies={movies} isLarge />
                <Row title="Sci-Fi & Fantasy" movies={tasteClusterMovies} />
                <Row title="Critically Acclaimed Movies" movies={recommendedMovies} />
                <Row title="Comedies" movies={[...popularMovies].reverse()} />
                <Row title="Action Thrillers" movies={[...movies].reverse()} />
            </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;