import React, { useEffect, useState, memo } from 'react';
import patternAnimations from '../patternAnimations';

const PatternAnimation = ({ pattern, speed = 600 }) => {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    if (!pattern || !patternAnimations[pattern]) {
      setFrameIndex(0);
      return;
    }

    const frames = patternAnimations[pattern];

    // Start immediately with first frame
    setFrameIndex(0);

    // Start the animation loop
    const intervalId = setInterval(() => {
      setFrameIndex((prevIndex) => (prevIndex + 1) % frames.length);
    }, speed);

    return () => clearInterval(intervalId);
  }, [pattern, speed]);

  if (!pattern || !patternAnimations[pattern]) {
    return (
      <div className="pattern-animation w-full h-full flex items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg"></div>
        <div className="relative z-10 text-gray-400 dark:text-gray-600">
          <div className="animate-pulse">No animation available</div>
        </div>
      </div>
    );
  }

  const currentFrame = patternAnimations[pattern][frameIndex];

  return (
    <div className="pattern-animation w-full h-full flex items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg"></div>
      <pre className="relative z-10 font-mono text-center select-none" style={{
        fontSize: '1.1em',
        lineHeight: '1.4',
        margin: '0',
        maxWidth: '100%',
        maxHeight: '100%',
        overflow: 'hidden',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        textShadow: '0 1px 2px rgba(0,0,0,0.1)',
        filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))'
      }}>
        {currentFrame}
      </pre>
    </div>
  );
};

export default memo(PatternAnimation);