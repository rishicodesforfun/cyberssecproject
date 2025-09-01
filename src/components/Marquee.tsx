"use client";

import React, { useEffect, useRef } from 'react';
import { Shield, Database, Zap, Lock } from 'lucide-react';

interface MarqueeProps {
  messages: string[];
  speed?: number;
  className?: string;
}

const Marquee: React.FC<MarqueeProps> = ({
  messages,
  speed = 50,
  className = ""
}) => {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    let animationId: number;
    let position = 0;

    const animate = () => {
      position -= speed / 60; // Convert to pixels per frame (assuming 60fps)

      if (Math.abs(position) >= marquee.scrollWidth / 2) {
        position = 0;
      }

      marquee.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [speed]);

  const getIcon = (index: number) => {
    const icons = [<Database key="db" />, <Shield key="shield" />, <Lock key="lock" />];
    return icons[index % icons.length];
  };

  return (
    <div className={`w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-700 dark:via-purple-700 dark:to-blue-700 text-white py-3 overflow-hidden ${className}`}>
      <div className="relative">
        <div
          ref={marqueeRef}
          className="flex items-center space-x-8 whitespace-nowrap"
          style={{ width: '200%' }}
        >
          {/* First set of messages */}
          {messages.map((message, index) => (
            <div key={`first-${index}`} className="flex items-center space-x-2 flex-shrink-0">
              <div className="flex-shrink-0">
                {getIcon(index)}
              </div>
              <span className="text-sm font-medium">{message}</span>
              <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
            </div>
          ))}

          {/* Second set of messages (for seamless loop) */}
          {messages.map((message, index) => (
            <div key={`second-${index}`} className="flex items-center space-x-2 flex-shrink-0">
              <div className="flex-shrink-0">
                {getIcon(index)}
              </div>
              <span className="text-sm font-medium">{message}</span>
              <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Gradient overlays for smooth edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-blue-600 to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-blue-600 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default Marquee;