import React, { useEffect, useState } from 'react';
import AnimationPlayer from './AnimationPlayer';
import patternAnimations from '../patternAnimations';

const PatternAnimation = ({ pattern, speed = 1000 }) => {
  const [frame, setFrame] = useState('');
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    if (pattern && patternAnimations[pattern]) {
      const newPlayer = new AnimationPlayer(patternAnimations[pattern], speed);
      setPlayer(newPlayer);
      setFrame(patternAnimations[pattern][0]);

      newPlayer.start();
      return () => newPlayer.stop();
    }
  }, [pattern, speed]);

  useEffect(() => {
    if (player) {
      const updateFrame = () => {
        setFrame(player.getCurrentFrame());
      };

      const intervalId = setInterval(updateFrame, speed);
      return () => clearInterval(intervalId);
    }
  }, [player, speed]);

  return (
    <div className="pattern-animation">
      <pre style={{ 
        fontSize: '1.5em',
        lineHeight: '1.5',
        textAlign: 'center',
        margin: '1em 0'
      }}>
        {frame}
      </pre>
    </div>
  );
};

export default PatternAnimation;