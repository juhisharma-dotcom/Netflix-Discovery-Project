import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ReelsView from './components/ReelsView';
import { Movie, ViewMode } from './types';
import { fetchGeneratedMovies } from './services/geminiService';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.QUICK_PICK); // Default to Quick Pick per solution logic
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchGeneratedMovies();
      setMovies(data);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-netflix-dark text-white font-sans">
      
      {/* Conditional Navigation */}
      {viewMode !== ViewMode.REELS && (
        <Navbar 
          currentMode={viewMode} 
          onModeChange={setViewMode} 
        />
      )}

      {/* Content Area */}
      <main>
        {loading ? (
          <div className="h-screen flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 animate-pulse">Curating your experience...</p>
          </div>
        ) : (
          <>
            {viewMode === ViewMode.REELS ? (
              <ReelsView 
                movies={movies} 
                onClose={() => setViewMode(ViewMode.QUICK_PICK)} 
              />
            ) : (
              <Dashboard 
                movies={movies} 
                viewMode={viewMode} 
                setViewMode={setViewMode} 
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;