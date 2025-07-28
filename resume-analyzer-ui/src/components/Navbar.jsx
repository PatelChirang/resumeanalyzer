// src/components/Navbar.jsx
import React from 'react';
import { RocketIcon } from 'lucide-react'; // if you install lucide

function Navbar() {
  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-2xl font-bold text-blue-700">
          <RocketIcon className="w-6 h-6" />
          ResumeAnalyzer
        </div>
        <div className="text-sm text-gray-500 hidden sm:block">
          Built with 💻 by CHIRANG
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
