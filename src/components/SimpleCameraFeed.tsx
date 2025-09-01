"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const SimpleCameraFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState('');
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);

  // Function to stop media tracks
  const stopMediaTracks = (stream: MediaStream | null) => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
    }
  };

  // Start camera function - simplified like HTML version
  const startCamera = async () => {
    setError('');
    // Stop any existing stream before starting a new one
    stopMediaTracks(currentStream);

    try {
      // Request access to the user's camera - exactly like HTML
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          // Request a higher resolution for better quality
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }, 
        audio: false // We don't need audio for this app
      });

      setCurrentStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsActive(true);

    } catch (err: any) {
      console.error("Error accessing the camera: ", err);
      setError('Could not access the camera. Please ensure you have a camera connected and have granted permission in your browser.');
    }
  };

  // Stop camera function - simplified like HTML version
  const stopCamera = () => {
    stopMediaTracks(currentStream);
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsActive(false);
    setCurrentStream(null);
    setError('');
  };

  // Clean up when the user leaves the page
  useEffect(() => {
    return () => {
      stopMediaTracks(currentStream);
    };
  }, [currentStream]);

  return (
    <div className="w-full max-w-4xl p-4 sm:p-6 md:p-8 mx-auto">
      <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-700 flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-400 mb-2 sm:mb-0">Live Camera Feed</h1>
          {isActive && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-300">LIVE</span>
            </div>
          )}
        </div>

        {/* Video container */}
        <div className="relative bg-black aspect-video">
          <video 
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            style={{ display: isActive ? 'block' : 'none' }}
          />
          
          {!isActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <svg className="w-16 h-16 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />
              </svg>
              <p className="text-lg">Your camera feed will appear here</p>
              <p className="text-sm text-gray-500">Click the button below to start</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-6 bg-gray-800/50 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          {!isActive ? (
            <Button 
              onClick={startCamera}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
            >
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />
              </svg>
              <span>Start Camera</span>
            </Button>
          ) : (
            <Button 
              onClick={stopCamera}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2 focus:outline-none focus:ring-4 focus:ring-red-500/50"
            >
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" />
              </svg>
              <span>Stop Camera</span>
            </Button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 m-6 bg-red-900/50 border border-red-700 rounded-lg text-center">
            <p className="font-medium">Could not access the camera.</p>
            <p className="text-sm text-red-300">Please ensure you have a camera connected and have granted permission in your browser.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleCameraFeed;