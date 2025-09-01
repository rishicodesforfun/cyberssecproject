"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Shield, Activity } from "lucide-react";

interface IPTrackerProps {
  ipAddress: string;
  location: string;
}

interface VisitLog {
  id: string;
  timestamp: string;
  ipAddress: string;
  location: string;
  userAgent: string;
  visitDuration: number;
}

const IPTracker: React.FC<IPTrackerProps> = ({ ipAddress, location }) => {
  const [visitLogs, setVisitLogs] = useState<VisitLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading visit logs from backend
  useEffect(() => {
    const loadVisitLogs = async () => {
      setIsLoading(true);
      try {
        // Simulate API call to get visit logs
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock visit logs
        const mockLogs: VisitLog[] = [
          {
            id: '1',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            ipAddress: '192.168.1.100',
            location: 'New York, United States',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            visitDuration: 450
          },
          {
            id: '2',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            ipAddress: '10.0.0.50',
            location: 'London, United Kingdom',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            visitDuration: 1200
          },
          {
            id: '3',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            ipAddress: '172.16.0.25',
            location: 'Tokyo, Japan',
            userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
            visitDuration: 800
          }
        ];

        setVisitLogs(mockLogs);
      } catch (error) {
        console.error('Error loading visit logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVisitLogs();
  }, []);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Current Visit Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Current Visit Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Your IP Address:</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-mono text-sm">{ipAddress}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="font-medium">Your Location:</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm">{location || 'Detecting...'}</div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-sm">Visit Started:</span>
            </div>
            <div className="text-sm text-gray-600">
              {new Date().toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visit History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Visit History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : visitLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No visit history available
            </div>
          ) : (
            <div className="space-y-4">
              {visitLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {log.ipAddress}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {log.location}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatTimestamp(log.timestamp)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Duration:</span> {formatDuration(log.visitDuration)}
                    </div>
                    <div className="truncate">
                      <span className="font-medium">Browser:</span> {log.userAgent}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-orange-800 mb-1">Security Notice</h4>
              <p className="text-sm text-orange-700">
                Your IP address and location are recorded for security purposes and to prevent unauthorized access. 
                All visits are logged and monitored for suspicious activity.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IPTracker;