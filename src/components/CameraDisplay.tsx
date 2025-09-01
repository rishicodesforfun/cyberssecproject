"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, X, AlertCircle } from "lucide-react";

const CameraDisplay: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    setCameraError('');
    
    // Stop any existing stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      console.log('Starting camera...');
      
      // Request camera access with simple constraints
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }, 
        audio: false
      });

      console.log('Camera access granted, stream:', mediaStream);
      
      if (videoRef.current) {
        const video = videoRef.current;
        
        // Set the stream to video element
        video.srcObject = mediaStream;
        
        // Set state
        setStream(mediaStream);
        setIsCameraActive(true);
        
        console.log('Camera started successfully');
      }
      
    } catch (error: any) {
      console.error('Camera error:', error);
      
      let errorMessage = 'Could not access the camera.';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please allow camera access and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application.';
      }
      
      setCameraError(errorMessage);
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    
    // Stop all media tracks
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    // Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    // Reset state
    setIsCameraActive(false);
    setCameraError('');
    setStream(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Camera className="h-5 w-5 mr-2" />
          Camera Display
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Camera Preview */}
        <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
          {cameraError ? (
            <div className="flex items-center justify-center h-full text-red-500 min-h-[300px]">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">{cameraError}</p>
              </div>
            </div>
          ) : isCameraActive && stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{
                transform: 'scaleX(-1)',
                minHeight: '300px'
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
                console.log('Video is playing');
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 min-h-[300px]">
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg">Your camera feed will appear here</p>
                <p className="text-sm text-gray-400">Click "Start Camera" to begin</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          {!isCameraActive ? (
            <Button onClick={startCamera} className="px-6 py-3">
              <Camera className="h-4 w-4 mr-2" />
              Start Camera
            </Button>
          ) : (
            <Button onClick={stopCamera} variant="outline" className="px-6 py-3">
              <X className="h-4 w-4 mr-2" />
              Stop Camera
            </Button>
          )}
        </div>

        {/* Status */}
        <div className="text-center text-sm text-gray-600">
          <p>Status: {isCameraActive ? 'Camera Active' : 'Camera Inactive'}</p>
          {stream && <p>Stream: Available</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraDisplay;