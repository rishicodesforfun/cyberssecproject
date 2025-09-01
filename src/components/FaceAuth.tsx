"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, X, CheckCircle, AlertCircle, Loader2, Info } from "lucide-react";

interface FaceAuthProps {
  onAuthSuccess: () => void;
  onAuthError: (error: string) => void;
}

const FaceAuth: React.FC<FaceAuthProps> = ({ onAuthSuccess, onAuthError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStatus, setAuthStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [authMessage, setAuthMessage] = useState('');
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
    setDebugInfo(prev => ({ ...prev, errorDetails: '' }));
    
    // Stop any existing stream before starting a new one
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    try {
      console.log('Starting camera...');
      
      // First, check available devices
      const devices = await getCameraDevices();
      if (devices.length === 0) {
        throw new Error('No camera devices found');
      }
      
      // Request access to the user's camera with high quality settings
      let mediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          },
          audio: false
        });
      } catch (constraintError) {
        console.log('High quality constraints failed, trying basic constraints:', constraintError);
        // Fallback to basic constraints
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      console.log('Camera access granted, stream:', mediaStream);
      console.log('Stream tracks:', mediaStream.getTracks());
      
      if (videoRef.current) {
        const video = videoRef.current;
        
        // Clear any existing source first
        video.srcObject = null;
        
        // Set up video element properties before setting stream
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;

        // Set stream first
        setStream(mediaStream);

        // Clear any existing source
        video.srcObject = null;

        // Set the stream to video element
        video.srcObject = mediaStream;

        // Create a promise to handle video setup
        const setupVideo = new Promise<void>((resolve, reject) => {
          const onLoadedMetadata = () => {
            console.log('Video metadata loaded, dimensions:', video.videoWidth, 'x', video.videoHeight);
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('error', onError);

            // Now set camera as active
            setIsCameraActive(true);

            // Try to play
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.then(() => {
                console.log('Video playing successfully');
                resolve();
              }).catch((playError) => {
                console.error('Error playing video:', playError);
                // Still resolve as camera is active, but show message about autoplay
                setCameraError('Video loaded but autoplay was prevented. Click on the video to enable playback.');
                resolve();
              });
            } else {
              resolve();
            }
          };

          const onError = (error: Event) => {
            console.error('Video error:', error);
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('error', onError);
            reject(error);
          };

          video.addEventListener('loadedmetadata', onLoadedMetadata);
          video.addEventListener('error', onError);

          // If metadata is already loaded
          if (video.readyState >= 1) {
            onLoadedMetadata();
          }
        });

        await setupVideo;
        console.log('Camera started successfully');
      }
      
    } catch (error: any) {
      console.error('Camera error:', error);
      setDebugInfo(prev => ({
        ...prev,
        errorDetails: error.message || 'Unknown error'
      }));
      
      let errorMessage = 'Could not access the camera.';

      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Camera permission denied. Please click "Allow" when prompted, or enable camera permissions in your browser settings.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Camera constraints not supported.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Camera access is not supported in this browser or requires HTTPS. Try using Chrome, Firefox, or Edge.';
      } else {
        errorMessage = `Camera error: ${error.message || 'Unknown error'}`;
      }

      setCameraError(errorMessage);
      onAuthError(errorMessage);
    }
  };

  // Stop camera
  const stopCamera = () => {
    console.log('Stopping camera...');
    
    // Stop all media tracks
    if (stream) {
      stream.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind, track.label);
        track.stop();
      });
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

  // Cleanup on unmount - similar to the HTML version
  useEffect(() => {
    return () => {
      // Clean up when the component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [stream]);

  // Simulate face detection and authentication
  const authenticateFace = async () => {
    if (!isCameraActive) {
      onAuthError('Please start the camera first');
      return;
    }

    setIsAuthenticating(true);
    setAuthStatus('idle');
    setAuthMessage('Analyzing face...');

    try {
      // Simulate face detection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate face detection
      const hasFace = Math.random() > 0.3; // 70% success rate for demo
      
      if (hasFace) {
        setAuthStatus('success');
        setAuthMessage('Face detected successfully!');
        
        // Simulate additional authentication steps
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        onAuthSuccess();
      } else {
        setAuthStatus('error');
        setAuthMessage('No face detected. Please position yourself in the frame.');
      }
    } catch (error) {
      console.error('Face authentication error:', error);
      setAuthStatus('error');
      setAuthMessage('Authentication failed. Please try again.');
      onAuthError('Face authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Camera className="h-5 w-5 mr-2" />
          Face Authentication
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Camera Preview */}
        <div className="relative bg-gray-900 rounded-lg overflow-hidden video-container" style={{ height: '300px' }}>
          {cameraError ? (
            <div className="flex items-center justify-center h-full text-red-500">
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
                display: 'block',
                backgroundColor: '#000'
              }}
              onLoadedMetadata={() => {
                console.log('Video metadata loaded in render');
                if (videoRef.current) {
                  console.log('Video dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
                }
              }}
              onCanPlay={() => {
                console.log('Video can play');
                if (videoRef.current) {
                  videoRef.current.play().catch(console.error);
                }
              }}
              onLoadedData={() => {
                console.log('Video data loaded');
              }}
              onPlay={() => {
                console.log('Video started playing');
              }}
              onError={(e) => {
                console.error('Video error:', e);
                setCameraError('Video playback error. Try refreshing the page.');
              }}
              onClick={() => {
                // Handle autoplay issues - try to play on user interaction
                if (videoRef.current && videoRef.current.paused) {
                  videoRef.current.play().catch(console.error);
                }
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
          
          {/* Loading overlay */}
          {isAuthenticating && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white">
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-2" />
                <p>{authMessage}</p>
              </div>
            </div>
          )}

          {/* Status overlay */}
          {authStatus === 'success' && !isAuthenticating && (
            <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
              <div className="text-center text-white">
                <CheckCircle className="h-12 w-12 mx-auto mb-2" />
                <p className="font-medium">Authentication Successful!</p>
              </div>
            </div>
          )}

          {authStatus === 'error' && !isAuthenticating && (
            <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center">
              <div className="text-center text-white">
                <AlertCircle className="h-12 w-12 mx-auto mb-2" />
                <p className="font-medium">{authMessage}</p>
              </div>
            </div>
          )}
        </div>

        {/* Status Messages */}
        {authStatus === 'success' && !isAuthenticating && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800">{authMessage}</span>
          </div>
        )}

        {authStatus === 'error' && !isAuthenticating && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{authMessage}</span>
          </div>
        )}

        {/* Controls */}
        <div className="flex space-x-2">
          {!isCameraActive ? (
            <Button onClick={startCamera} className="flex-1" disabled={isAuthenticating}>
              <Camera className="h-4 w-4 mr-2" />
              Start Camera
            </Button>
          ) : (
            <Button onClick={stopCamera} variant="outline" className="flex-1" disabled={isAuthenticating}>
              <X className="h-4 w-4 mr-2" />
              Stop Camera
            </Button>
          )}
          
          <Button 
            onClick={authenticateFace} 
            disabled={!isCameraActive || isAuthenticating}
            className="flex-1"
          >
            {isAuthenticating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Authenticating...
              </>
            ) : (
              'Authenticate'
            )}
          </Button>
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

        {/* Instructions */}
        <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-3 rounded-lg">
          <p className="font-medium mb-1">Troubleshooting:</p>
          <p>• Make sure camera permissions are enabled in browser settings</p>
          <p>• Try using Chrome, Firefox, or Edge browsers</p>
          <p>• Ensure your device has a working camera</p>
          <p>• Check if another app is using the camera</p>
          <p>• Refresh the page if permissions were denied</p>
          <p>• For production: Camera requires HTTPS (secure connection)</p>
          <p>• For development: Some browsers allow HTTP localhost</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FaceAuth;