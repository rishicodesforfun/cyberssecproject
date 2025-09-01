"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, X, CheckCircle, AlertCircle, Loader2, Info } from "lucide-react";

const CameraTest: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [debugInfo, setDebugInfo] = useState({
    browser: '',
    permissions: '',
    cameraDevices: '',
    errorDetails: ''
  });

  // Get browser and device info
  useEffect(() => {
    const browserInfo = navigator.userAgent.split(' ').slice(-1)[0];
    setDebugInfo(prev => ({
      ...prev,
      browser: browserInfo || 'Unknown'
    }));

    // Check camera permissions
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'camera' as PermissionName }).then(result => {
        setDebugInfo(prev => ({
          ...prev,
          permissions: result.state
        }));
      }).catch(() => {
        setDebugInfo(prev => ({
          ...prev,
          permissions: 'Not supported'
        }));
      });
    }
  }, []);

  // Get available camera devices
  const getCameraDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setDebugInfo(prev => ({
        ...prev,
        cameraDevices: videoDevices.length > 0 ? `${videoDevices.length} camera(s) found` : 'No cameras found'
      }));
      return videoDevices;
    } catch (error) {
      setDebugInfo(prev => ({
        ...prev,
        cameraDevices: 'Error checking cameras'
      }));
      return [];
    }
  };

  const startCamera = async () => {
    setCameraError('');
    setIsCameraActive(false);
    setDebugInfo(prev => ({ ...prev, errorDetails: '' }));
    
    try {
      console.log('Starting camera test...');
      
      // First, check available devices
      const devices = await getCameraDevices();
      if (devices.length === 0) {
        throw new Error('No camera devices found');
      }
      
      // Try different constraints for better compatibility
      const constraints = {
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: 'user'
        },
        audio: false
      };
      
      console.log('Using constraints:', constraints);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera access granted, stream:', mediaStream);
      
      if (videoRef.current) {
        const video = videoRef.current;
        
        // Clear any existing source
        video.srcObject = null;
        
        // Set up the video element properties
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        
        // Set the stream
        video.srcObject = mediaStream;
        
        console.log('Video element setup complete, waiting for loadedmetadata...');
        
        // Create a promise-based approach for video loading
        const playVideo = () => {
          return new Promise<void>((resolve, reject) => {
            const onLoadedMetadata = () => {
              console.log('Video metadata loaded, dimensions:', video.videoWidth, 'x', video.videoHeight);
              video.removeEventListener('loadedmetadata', onLoadedMetadata);
              video.removeEventListener('error', onError);
              
              // Force a repaint
              video.style.display = 'none';
              video.offsetHeight; // Trigger reflow
              video.style.display = '';
              
              // Try to play the video
              const playPromise = video.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    console.log('Video playing successfully');
                    setIsCameraActive(true);
                    setStream(mediaStream);
                    resolve();
                  })
                  .catch((playError) => {
                    console.error('Error playing video:', playError);
                    // Still set as active since stream is available
                    setIsCameraActive(true);
                    setStream(mediaStream);
                    resolve();
                  });
              } else {
                // Fallback for older browsers
                setIsCameraActive(true);
                setStream(mediaStream);
                resolve();
              }
            };
            
            const onError = (error: Event) => {
              console.error('Video element error:', error);
              video.removeEventListener('loadedmetadata', onLoadedMetadata);
              video.removeEventListener('error', onError);
              reject(new Error('Video playback error'));
            };
            
            video.addEventListener('loadedmetadata', onLoadedMetadata);
            video.addEventListener('error', onError);
            
            // Force load if metadata is already available
            if (video.readyState >= 1) {
              console.log('Video metadata already available');
              onLoadedMetadata();
            }
          });
        };
        
        await playVideo();
      }
      
    } catch (error: any) {
      console.error('Camera error:', error);
      setDebugInfo(prev => ({
        ...prev,
        errorDetails: error.message || 'Unknown error'
      }));
      
      let errorMessage = 'Camera access failed';
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Camera permission denied. Please allow camera access and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Camera constraints not supported. Trying basic constraints...';
        // Try with basic constraints
        try {
          const basicStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          if (videoRef.current) {
            videoRef.current.srcObject = basicStream;
            videoRef.current.muted = true;
            videoRef.current.playsInline = true;
            videoRef.current.autoplay = true;
            
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
              await playPromise;
            }
            setIsCameraActive(true);
            setStream(basicStream);
          }
          return;
        } catch (basicError) {
          setCameraError(errorMessage);
        }
        return;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setCameraError(errorMessage);
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    if (videoRef.current && videoRef.current.srcObject) {
      const mediaStream = videoRef.current.srcObject as MediaStream;
      mediaStream.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind, track.label);
        track.stop();
      });
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setCameraError('');
    setStream(null);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Camera className="h-5 w-5 mr-2" />
          Camera Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative bg-gray-900 rounded-lg overflow-hidden video-container" style={{ height: '200px' }}>
          {cameraError ? (
            <div className="flex items-center justify-center h-full text-red-500">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">{cameraError}</p>
              </div>
            </div>
          ) : isCameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{
                transform: 'scaleX(-1)',
                display: 'block',
                backgroundColor: '#000'
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Camera className="h-8 w-8 mx-auto mb-2" />
                <p>Camera not active</p>
                <p className="text-sm">Click "Start Camera" to begin</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          {!isCameraActive ? (
            <Button onClick={startCamera} className="flex-1">
              <Camera className="h-4 w-4 mr-2" />
              Start Camera
            </Button>
          ) : (
            <Button onClick={stopCamera} variant="outline" className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Stop Camera
            </Button>
          )}
        </div>

        {/* Debug Information */}
        <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center mb-2">
            <Info className="h-3 w-3 mr-1" />
            <span className="font-medium">Debug Information:</span>
          </div>
          <p>Browser: {debugInfo.browser}</p>
          <p>Camera Permissions: {debugInfo.permissions}</p>
          <p>Camera Devices: {debugInfo.cameraDevices}</p>
          <p>Camera Status: {isCameraActive ? 'Active' : 'Inactive'}</p>
          <p>Stream: {stream ? 'Available' : 'None'}</p>
          {debugInfo.errorDetails && (
            <p className="text-red-600">Error: {debugInfo.errorDetails}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraTest;