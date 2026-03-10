import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Smartphone } from 'lucide-react';
import { ViewMode } from '../types';

interface NavbarProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentMode, onModeChange }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-40 transition-colors duration-300 ${isScrolled ? 'bg-netflix-dark' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="flex items-center justify-between px-4 md:px-12 py-4">
        <div className="flex items-center gap-8">
          <div className="text-netflix-red text-2xl md:text-3xl font-bold tracking-tighter cursor-pointer">NETFLIX</div>
          <ul className="hidden md:flex items-center gap-6 text-sm text-gray-200">
            <li className="font-medium text-white cursor-pointer hover:text-gray-300">Home</li>
            <li className="cursor-pointer hover:text-gray-300">TV Shows</li>
            <li className="cursor-pointer hover:text-gray-300">Movies</li>
            <li className="cursor-pointer hover:text-gray-300">New & Popular</li>
            <li className="cursor-pointer hover:text-gray-300">My List</li>
          </ul>
        </div>

        <div className="flex items-center gap-4 md:gap-6 text-white">
            {/* Solution 3 Entry Point */}
           <button 
             onClick={() => onModeChange(ViewMode.REELS)}
             className="flex items-center gap-2 bg-zinc-800/80 hover:bg-zinc-700 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium border border-white/10 transition-all"
           >
             <Smartphone size={16} className="text-purple-400" />
             <span className="hidden md:inline">Clips</span>
           </button>

          <Search className="cursor-pointer hover:text-gray-300" size={20} />
          <Bell className="cursor-pointer hover:text-gray-300 hidden md:block" size={20} />
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
              <User size={16} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;