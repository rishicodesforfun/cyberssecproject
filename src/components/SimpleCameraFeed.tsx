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
      console.log('Requesting camera access...');
      // Request access to the user's camera - exactly like HTML
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          // Request a higher resolution for better quality
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false // We don't need audio for this app
      });

      console.log('Camera access granted, setting up video...');
      setCurrentStream(stream);

      if (videoRef.current) {
        const video = videoRef.current;

        // Clear any existing source
        video.srcObject = null;

        // Set up video element properties
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;

        // Set the stream
        video.srcObject = stream;

        // Try to play the video
        try {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            await playPromise;
            console.log('Video started playing successfully');
            setIsActive(true);
          } else {
            console.log('Video play promise undefined, setting active');
            setIsActive(true);
          }
        } catch (playError) {
          console.error('Error playing video:', playError);
          // Still set as active since we have the stream
          setIsActive(true);
          setError('Video loaded but autoplay was prevented. Click anywhere on the page to enable video.');
        }
      } else {
        console.error('Video element not found');
        setError('Video element not found');
      }

    } catch (err: any) {
      console.error("Error accessing the camera: ", err);

      let errorMessage = 'Could not access the camera.';

      if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please click "Allow" when prompted, or enable camera permissions in your browser settings.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No camera found. Please ensure you have a camera connected.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Camera does not support the requested settings.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage = 'Camera access is not supported in this browser or requires HTTPS. Try using Chrome, Firefox, or Edge.';
      } else {
        errorMessage = `Camera error: ${err.message || 'Unknown error'}`;
      }

      setError(errorMessage);
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
            muted
            className="w-full h-full object-cover"
            style={{
              display: isActive ? 'block' : 'none',
              backgroundColor: '#000'
            }}
            onLoadedMetadata={() => {
              console.log('Video metadata loaded');
              if (videoRef.current) {
                console.log('Video dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
              }
            }}
            onCanPlay={() => {
              console.log('Video can play');
            }}
            onPlay={() => {
              console.log('Video started playing');
            }}
            onError={(e) => {
              console.error('Video error:', e);
              setError('Video playback error. Try refreshing the page.');
            }}
            onClick={() => {
              // Handle autoplay issues - try to play on user interaction
              if (videoRef.current && videoRef.current.paused) {
                videoRef.current.play().catch(console.error);
              }
            }}
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
            <p className="text-sm text-red-300 mb-2">{error}</p>
            <div className="text-xs text-red-400 space-y-1">
              <p>• Check browser camera permissions</p>
              <p>• Try Chrome, Firefox, or Edge</p>
              <p>• For development: Some browsers allow HTTP localhost</p>
              <p>• For production: Requires HTTPS connection</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleCameraFeed;