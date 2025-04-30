import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Video, Clock, Menu, X } from 'lucide-react';
import Footer from './Footer';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#0f172a] border-b border-[#334155] sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-white">
            <Video className="h-6 w-6 text-[#3b82f6]" />
            <span className="font-semibold text-lg">Galaxy.ai</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex space-x-1">
              <Link 
                to="/" 
                className={`px-4 py-2 rounded-md transition-colors ${
                  isActive('/') 
                    ? 'bg-[#1e293b] text-white' 
                    : 'text-[#94a3b8] hover:text-white hover:bg-[#1e293b]'
                }`}
              >
                Transform Video
              </Link>
              <Link 
                to="/history" 
                className={`px-4 py-2 rounded-md transition-colors ${
                  isActive('/history') 
                    ? 'bg-[#1e293b] text-white' 
                    : 'text-[#94a3b8] hover:text-white hover:bg-[#1e293b]'
                }`}
              >
                History
              </Link>
            </nav>
          </div>
          
          <button 
            className="md:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0f172a] border-b border-[#334155]">
            <nav className="flex flex-col p-4">
              <Link 
                to="/" 
                className={`px-4 py-3 rounded-md transition-colors ${
                  isActive('/') 
                    ? 'bg-[#1e293b] text-white' 
                    : 'text-[#94a3b8] hover:text-white hover:bg-[#1e293b]'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Transform Video
              </Link>
              <Link 
                to="/history" 
                className={`px-4 py-3 mt-1 rounded-md transition-colors ${
                  isActive('/history') 
                    ? 'bg-[#1e293b] text-white' 
                    : 'text-[#94a3b8] hover:text-white hover:bg-[#1e293b]'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                History
              </Link>
            </nav>
          </div>
        )}
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;