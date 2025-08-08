
import React, { useState, useEffect } from 'react';
import PatternAnimation from './PatternAnimation';

const Flashcard = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip state when card changes
  useEffect(() => {
    setIsFlipped(false);
  }, [card.id]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className="relative w-full h-96 [perspective:1000px] cursor-pointer group"
      onClick={handleFlip}
    >
      <div
        className={`w-full h-full absolute transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        {/* Front of card */}
        <div className="absolute w-full h-full [backface-visibility:hidden] bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group-hover:scale-[1.02]">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🧠</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {card.title}
            </h2>
            <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
              {card.category}
            </div>
            <div className="mt-4 text-gray-500 dark:text-gray-400 text-sm">
              Click to see details & animation
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute w-full h-full [backface-visibility:hidden] bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 [transform:rotateY(180deg)] group-hover:scale-[1.02] overflow-hidden">
          {/* Animation Section */}
          <div className="h-48 flex items-center justify-center p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="w-full h-full flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-xl">
              <PatternAnimation pattern={card.title} />
            </div>
          </div>

          {/* Content Section */}
          <div className="h-48 p-4 flex flex-col overflow-hidden">
            <div className="flex-1 min-h-0">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200 truncate">
                {card.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed overflow-hidden" style={{
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical'
              }}>
                {card.description}
              </p>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <a
                href={card.exampleProblemUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <span>🔗</span>
                Practice Problem
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
