
import React, { useState } from 'react';
import { patternAnimations } from '../patternAnimations';

const Flashcard = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const animation = patternAnimations[card.title] || '✨';

  return (
    <div
      className="relative w-full h-64 [perspective:1000px]"
      onClick={handleFlip}
    >
      <div
        className={`w-full h-full absolute transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        <div className="absolute w-full h-full [backface-visibility:hidden] bg-white dark:bg-gray-800 border rounded-lg shadow-lg flex items-center justify-center">
          <h2 className="text-2xl font-bold text-center p-4">{card.title}</h2>
        </div>
        <div className="absolute w-full h-full [backface-visibility:hidden] bg-white dark:bg-gray-800 border rounded-lg shadow-lg flex flex-col items-center justify-center text-center [transform:rotateY(180deg)]">
          <div className="text-4xl mb-4">{animation}</div>
          <p className="p-4">{card.description}</p>
          <a
            href={card.exampleProblemUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Example Problem
          </a>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
