import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-6 bg-[#0f172a] border-t border-[#334155]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-[#94a3b8] text-sm">
              © {new Date().getFullYear()} Galaxy.ai. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a 
              href="#" 
              className="text-[#94a3b8] hover:text-white transition-colors text-sm"
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className="text-[#94a3b8] hover:text-white transition-colors text-sm"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-[#94a3b8] hover:text-white transition-colors text-sm"
            >
              Help Center
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;