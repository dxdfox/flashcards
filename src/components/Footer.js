import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full mt-16 py-8 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-2xl">🧠</span>
          <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Algorithm Flashcards
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Master coding patterns with interactive animations
        </p>
        <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-500">
          <span>Built with React & Tailwind CSS</span>
          <span>•</span>
          <span>© 2024 All rights reserved</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
