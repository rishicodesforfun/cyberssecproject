"use client";

import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Search, Upload, LogOut, User, Phone, Globe, MessageSquare, Database, Eye, EyeOff, Camera, Shield, Clock } from "lucide-react";

// Import new components
import FaceAuth from './components/FaceAuth';
import SignUp from './components/SignUp';
import DigiLockerAuth from './components/DigiLockerAuth';
import Marquee from './components/Marquee';
import { ThemeProvider } from './components/ThemeProvider';
import ThemeToggle from './components/ThemeToggle';
import IPTracker from './components/IPTracker';
import CameraTest from './components/CameraTest';
import SimpleCameraFeed from './components/SimpleCameraFeed';

// Import auth service
import { authService } from './services/authService';

// Mock API functions
const mockAPI = {
  uploadFile: async (file: File) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      status: 'processing',
      uploadTime: new Date().toISOString(),
      records: Math.floor(Math.random() * 1000) + 100
    };
  },

  processFile: async (fileId: string) => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    return {
      id: fileId,
      status: 'completed',
      processedRecords: Math.floor(Math.random() * 1000) + 100,
      analysisComplete: true
    };
  },

  getIPDRData: async (filters?: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const sampleData = [];
    const aParties = ['555-1234', '555-5678', '555-9012', '555-3456', '555-7890'];
    const bParties = ['555-9876', '555-4321', '555-6543', '555-2109', '555-8765'];
    const publicIPs = ['192.168.1.1', '10.0.0.1', '172.16.0.1', '203.0.113.1', '198.51.100.1'];
    const commTypes = ['VOICE', 'SMS', 'DATA'];
    
    for (let i = 0; i < 50; i++) {
      const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      sampleData.push({
        id: `record-${i + 1}`,
        timestamp: timestamp.toISOString(),
        aParty: aParties[Math.floor(Math.random() * aParties.length)],
        bParty: bParties[Math.floor(Math.random() * bParties.length)],
        publicIP: publicIPs[Math.floor(Math.random() * publicIPs.length)],
        communicationType: commTypes[Math.floor(Math.random() * commTypes.length)],
        duration: Math.floor(Math.random() * 300),
        bytes: Math.floor(Math.random() * 1000000)
      });
    }
    
    return sampleData;
  }
};

// Sample data for visualization
const sampleNetworkData = {
  nodes: [
    { id: '555-1234', label: '555-1234', type: 'phone', calls: 15 },
    { id: '555-5678', label: '555-5678', type: 'phone', calls: 8 },
    { id: '555-9012', label: '555-9012', type: 'phone', calls: 12 },
    { id: '192.168.1.1', label: '192.168.1.1', type: 'ip', calls: 20 },
    { id: '10.0.0.1', label: '10.0.0.1', type: 'ip', calls: 5 },
    { id: '555-9876', label: '555-9876', type: 'phone', calls: 3 },
    { id: '555-4321', label: '555-4321', type: 'phone', calls: 7 },
    { id: '172.16.0.1', label: '172.16.0.1', type: 'ip', calls: 11 }
  ],
  links: [
    { source: '555-1234', target: '192.168.1.1', type: 'VOICE', weight: 5 },
    { source: '555-1234', target: '555-5678', type: 'SMS', weight: 3 },
    { source: '555-5678', target: '10.0.0.1', type: 'DATA', weight: 2 },
    { source: '555-9012', target: '192.168.1.1', type: 'VOICE', weight: 4 },
    { source: '555-9012', target: '555-9876', type: 'SMS', weight: 1 },
    { source: '192.168.1.1', target: '172.16.0.1', type: 'DATA', weight: 6 },
    { source: '10.0.0.1', target: '555-4321', type: 'VOICE', weight: 3 },
    { source: '555-4321', target: '172.16.0.1', type: 'SMS', weight: 2 }
  ]
};

// D3.js Network Graph Component
const NetworkGraph: React.FC<{ data: any }> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [d3Loaded, setD3Loaded] = useState(false);

  useEffect(() => {
    const loadD3 = async () => {
      try {
        const d3Module = await import('d3');
        const d3 = d3Module.default || d3Module;
        
        if (svgRef.current && data) {
          renderGraph(d3);
        }
        setD3Loaded(true);
      } catch (error) {
        console.error('Error loading D3.js:', error);
      }
    };

    if (data && !d3Loaded) {
      loadD3();
    }
  }, [data, d3Loaded]);

  const renderGraph = (d3: any) => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 400;
    const margin = 40;

    const g = svg.append("g");

    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(80))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(25));

    const link = g.append("g")
      .selectAll("line")
      .data(data.links)
      .enter().append("line")
      .attr("stroke", "hsl(var(--muted-foreground))")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d: any) => Math.sqrt(d.weight) * 2);

    const node = g.append("g")
      .selectAll("circle")
      .data(data.nodes)
      .enter().append("circle")
      .attr("r", (d: any) => Math.sqrt(d.calls) * 2 + 5)
      .attr("fill", (d: any) => d.type === 'phone' ? 'hsl(var(--primary))' : 'hsl(var(--secondary))')
      .attr("stroke", "hsl(var(--border))")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        setSelectedNode(d);
      })
      .call(d3.drag()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    const label = g.append("g")
      .selectAll("text")
      .data(data.nodes)
      .enter().append("text")
      .text((d: any) => d.label)
      .attr("font-size", "12px")
      .attr("dx", 15)
      .attr("dy", 4)
      .style("fill", "hsl(var(--foreground))")
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);

      label
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });

    return () => {
      simulation.stop();
    };
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 bg-card">
        {!d3Loaded ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading visualization...</p>
            </div>
          </div>
        ) : (
          <svg
            ref={svgRef}
            width="800"
            height="400"
            className="w-full h-auto border rounded"
          />
        )}
      </div>
      {selectedNode && (
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Selected Node Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">ID:</span> {selectedNode.id}
            </div>
            <div>
              <span className="font-medium">Type:</span> {selectedNode.type}
            </div>
            <div>
              <span className="font-medium">Calls:</span> {selectedNode.calls}
            </div>
            <div>
              <span className="font-medium">Label:</span> {selectedNode.label}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

// Timeline Component
const TimelineView: React.FC<{ data: any[] }> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
        
        {sortedData.map((record, index) => (
          <div key={record.id} className="relative flex items-start space-x-4 pb-6">
            <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center z-10">
              <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
            </div>
            
            <div className="flex-1 bg-card p-4 rounded-lg shadow-sm border border-border">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium">{record.aParty} → {record.bParty}</div>
                <Badge variant={record.communicationType === 'VOICE' ? 'default' : record.communicationType === 'SMS' ? 'secondary' : 'outline'}>
                  {record.communicationType}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground mb-2">
                {new Date(record.timestamp).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                IP: {record.publicIP} | Duration: {record.duration}s | Bytes: {record.bytes.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Login Component
const Login: React.FC<{ onLogin: (user: any) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authMethod, setAuthMethod] = useState<'credentials' | 'face' | 'digilocker'>('credentials');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.login(username, password);
      onLogin(result.user);
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const handleFaceAuthSuccess = () => {
    // Simulate successful face authentication
    const user = { username: 'face_user', role: 'analyst' };
    onLogin(user);
  };

  const handleFaceAuthError = (error: string) => {
    setError(`Face authentication failed: ${error}`);
  };

  const handleDigiLockerSuccess = (user: any) => {
    onLogin(user);
  };

  const handleDigiLockerError = (error: string) => {
    setError(`DigiLocker authentication failed: ${error}`);
  };

  const marqueeMessages = [
    "Automate complex data analysis. Identify and map communication between individuals with ease.",
    "Detect fraudulent activity like SIM box fraud and phishing with AetherTrace's intelligent algorithms.",
    "Maximum security guaranteed. We use a Zero Trust model with encrypted data at every stage."
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Marquee at the top */}
      <Marquee messages={marqueeMessages} speed={30} />

      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">IPDR Analysis System</CardTitle>
            <p className="text-muted-foreground">Secure Login</p>
          </CardHeader>
          <CardContent>
          <Tabs value={authMethod} onValueChange={(value) => setAuthMethod(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="credentials">Credentials</TabsTrigger>
              <TabsTrigger value="face">Face Auth</TabsTrigger>
              <TabsTrigger value="digilocker">DigiLocker</TabsTrigger>
            </TabsList>

            <TabsContent value="credentials" className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                </div>
                {error && (
                  <div className="text-destructive text-sm text-center">{error}</div>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="face" className="space-y-4">
              <FaceAuth onAuthSuccess={handleFaceAuthSuccess} onAuthError={handleFaceAuthError} />
            </TabsContent>

            <TabsContent value="digilocker" className="space-y-4">
              <DigiLockerAuth onAuthSuccess={handleDigiLockerSuccess} onAuthError={handleDigiLockerError} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard: React.FC<{ user: any; onLogout: () => void }> = ({ user, onLogout }) => {
  const [ipdrData, setIPDRData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [commType, setCommType] = useState('');
  const [numberFilter, setNumberFilter] = useState('');
  const [activeTab, setActiveTab] = useState('graph');
  const [userIP, setUserIP] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [loginLogs, setLoginLogs] = useState<any[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [tokenExpiry, setTokenExpiry] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get user IP and location
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        setUserIP(ipData.ip);

        const locationResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
        const locationData = await locationResponse.json();

        if (locationData.city && locationData.country_name) {
          setUserLocation(`${locationData.city}, ${locationData.country_name}`);
        }
      } catch (error) {
        console.error('Error getting user info:', error);
      }
    };

    getUserInfo();
    loadData();
    loadLoginLogs();
  }, []);

  const loadLoginLogs = async () => {
    try {
      const logs = await authService.getLoginLogs();
      setLoginLogs(logs);
    } catch (error) {
      console.error('Error loading login logs:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setDeleteLoading(true);
    try {
      await authService.deleteAccount();
      onLogout();
    } catch (error: any) {
      console.error('Delete account error:', error);
      alert('Failed to delete account: ' + error.message);
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  // Check token expiry and setup refresh
  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const expiryTime = decoded.exp * 1000; // Convert to milliseconds
        setTokenExpiry(new Date(expiryTime));
        
        // Auto-refresh token 5 minutes before expiry
        const timeUntilExpiry = expiryTime - Date.now();
        const refreshThreshold = 5 * 60 * 1000;
        
        if (timeUntilExpiry <= refreshThreshold && timeUntilExpiry > 0) {
          console.log('Token expiring soon, refreshing...');
          refreshToken();
        }
      } catch (error) {
        console.error('Error checking token expiry:', error);
      }
    };

    const refreshToken = async () => {
      setIsRefreshing(true);
      try {
        await authService.refreshToken();
        checkTokenExpiry(); // Update expiry time after refresh
      } catch (error) {
        console.error('Failed to refresh token:', error);
        // If refresh fails, logout user
        onLogout();
      } finally {
        setIsRefreshing(false);
      }
    };

    // Check token expiry every minute
    const interval = setInterval(checkTokenExpiry, 60 * 1000);
    
    // Initial check
    checkTokenExpiry();
    
    return () => clearInterval(interval);
  }, [onLogout]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await mockAPI.getIPDRData();
      setIPDRData(data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setSelectedFile(file);
    setLoading(true);
    
    try {
      const uploadResult = await mockAPI.uploadFile(file);
      setUploadedFiles(prev => [uploadResult, ...prev]);
      
      setTimeout(async () => {
        const processResult = await mockAPI.processFile(uploadResult.id);
        setUploadedFiles(prev => prev.map(f => f.id === uploadResult.id ? { ...f, ...processResult } : f));
        await loadData();
      }, 2000);
      
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = ipdrData.filter(record => {
    const matchesSearch = searchTerm === '' || 
      record.aParty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.bParty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.publicIP.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCommType = commType === '' || record.communicationType === commType;
    
    const matchesNumber = numberFilter === '' || 
      record.aParty.includes(numberFilter) || 
      record.bParty.includes(numberFilter);
    
    const matchesDate = !dateRange.start || !dateRange.end ||
      new Date(record.timestamp) >= dateRange.start &&
      new Date(record.timestamp) <= dateRange.end;
    
    return matchesSearch && matchesCommType && matchesNumber && matchesDate;
  });

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-foreground">IPDR Analysis System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{user.username}</span>
              </div>
              
              {/* Token Status */}
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {tokenExpiry && (
                  <span>
                    {tokenExpiry > new Date() ? 'Valid' : 'Expired'}
                  </span>
                )}
              </div>

              {/* Refresh Status */}
              {isRefreshing && (
                <div className="flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 dark:border-blue-400"></div>
                  <span>Refreshing...</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('logs')}
                  className="text-xs"
                >
                  View Logs
                </Button>
                {!showDeleteConfirm ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-xs"
                  >
                    Delete Account
                  </Button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-red-600">Confirm delete?</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteAccount}
                      disabled={deleteLoading}
                      className="text-xs"
                    >
                      {deleteLoading ? 'Deleting...' : 'Yes'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="text-xs"
                    >
                      No
                    </Button>
                  </div>
                )}
                <ThemeToggle />
                <Button variant="outline" size="sm" onClick={onLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - IP Tracker */}
          <div className="lg:col-span-1">
            <IPTracker ipAddress={userIP} location={userLocation} />
          </div>

          {/* Middle Panel - File Upload and Filters */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  File Upload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                      <div className="text-sm text-gray-600">
                        <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                      </div>
                      <div className="text-xs text-gray-500">
                        CSV, TXT files (max 10MB)
                      </div>
                    </div>
                  </label>
                </div>
                
                {selectedFile && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium">{selectedFile.name}</div>
                    <div className="text-xs text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {uploadedFiles.length === 0 ? (
                    <div className="text-sm text-gray-500">No files uploaded yet</div>
                  ) : (
                    uploadedFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{file.name}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(file.uploadTime).toLocaleDateString()}
                          </div>
                        </div>
                        <Badge 
                          variant={file.status === 'completed' ? 'default' : file.status === 'processing' ? 'secondary' : 'destructive'}
                          className="ml-2"
                        >
                          {file.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Search & Filter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <Input
                    placeholder="Search by number, IP..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <div className="flex space-x-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="flex-1">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {dateRange.start ? format(dateRange.start, "PPP") : "Start"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateRange.start}
                          onSelect={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="flex-1">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {dateRange.end ? format(dateRange.end, "PPP") : "End"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateRange.end}
                          onSelect={(date) => setDateRange(prev => ({ ...prev, end: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Communication Type</label>
                  <Select value={commType} onValueChange={setCommType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="VOICE">Voice</SelectItem>
                      <SelectItem value="SMS">SMS</SelectItem>
                      <SelectItem value="DATA">Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Number Filter</label>
                  <Input
                    placeholder="Filter by number..."
                    value={numberFilter}
                    onChange={(e) => setNumberFilter(e.target.value)}
                  />
                </div>

                <Button onClick={loadData} className="w-full" disabled={loading}>
                  {loading ? 'Loading...' : 'Apply Filters'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Main Visualization */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Data Analysis</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {filteredData.length} records found
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="graph" className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Network
                    </TabsTrigger>
                    <TabsTrigger value="table" className="flex items-center">
                      <Database className="h-4 w-4 mr-2" />
                      Table
                    </TabsTrigger>
                    <TabsTrigger value="timeline" className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Timeline
                    </TabsTrigger>
                    <TabsTrigger value="camera" className="flex items-center">
                      <Camera className="h-4 w-4 mr-2" />
                      Camera Test
                    </TabsTrigger>
                    <TabsTrigger value="logs" className="flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Login Logs
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="graph" className="mt-6">
                    <NetworkGraph data={sampleNetworkData} />
                  </TabsContent>

                  <TabsContent value="table" className="mt-6">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>A-Party</TableHead>
                            <TableHead>B-Party</TableHead>
                            <TableHead>Public IP</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Duration</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredData.map((record) => (
                            <TableRow key={record.id}>
                              <TableCell>
                                {new Date(record.timestamp).toLocaleString()}
                              </TableCell>
                              <TableCell className="font-medium">{record.aParty}</TableCell>
                              <TableCell>{record.bParty}</TableCell>
                              <TableCell>{record.publicIP}</TableCell>
                              <TableCell>
                                <Badge variant={record.communicationType === 'VOICE' ? 'default' : 'secondary'}>
                                  {record.communicationType}
                                </Badge>
                              </TableCell>
                              <TableCell>{record.duration}s</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="timeline" className="mt-6">
                    <TimelineView data={filteredData} />
                  </TabsContent>

                  <TabsContent value="camera" className="mt-6">
                    <SimpleCameraFeed />
                  </TabsContent>

                  <TabsContent value="logs" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Shield className="h-5 w-5 mr-2" />
                          Login Activity Logs
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          All authentication attempts and account activities
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {loginLogs.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No login logs available</p>
                          </div>
                          ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                              {loginLogs.map((log, index) => (
                                <div
                                  key={log.id || index}
                                  className={`p-4 rounded-lg border ${
                                    log.success
                                      ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                                      : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
                                  }`}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-2">
                                        <Badge
                                          variant={log.success ? 'default' : 'destructive'}
                                          className="text-xs"
                                        >
                                          {log.action?.toUpperCase() || 'LOGIN'}
                                        </Badge>
                                        <span className="text-sm font-medium">
                                          {log.success ? 'Success' : 'Failed'}
                                        </span>
                                      </div>

                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <span className="font-medium">User:</span>{' '}
                                          {log.userId === 'unknown' ? 'Unknown' : log.userId}
                                        </div>
                                        <div>
                                          <span className="font-medium">Time:</span>{' '}
                                          {new Date(log.timestamp).toLocaleString()}
                                        </div>
                                        <div>
                                          <span className="font-medium">IP:</span>{' '}
                                          {log.ipAddress || 'Unknown'}
                                        </div>
                                        <div>
                                          <span className="font-medium">Location:</span>{' '}
                                          {log.location || 'Unknown'}
                                        </div>
                                      </div>

                                      {log.reason && (
                                        <div className="mt-2 text-sm text-destructive">
                                          <span className="font-medium">Reason:</span> {log.reason}
                                        </div>
                                      )}

                                      {log.details && (
                                        <div className="mt-2 text-sm text-muted-foreground">
                                          <span className="font-medium">Details:</span> {log.details}
                                        </div>
                                      )}

                                      {log.failedAttempts && (
                                        <div className="mt-2 text-sm text-orange-600 dark:text-orange-400">
                                          <span className="font-medium">Failed Attempts:</span> {log.failedAttempts}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [user, setUser] = useState<any>(null);
  const [queryClient] = useState(() => new QueryClient());
  const [showSignUp, setShowSignUp] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid tokens
        await authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  const handleSignUp = (userData: any) => {
    setUser(userData);
  };

  const handleSwitchToLogin = () => {
    setShowSignUp(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="aether-trace-theme">
        <TooltipProvider>
          <Router>
            <div className="min-h-screen bg-background text-foreground">
              {!user ? (
                <div>
                  {showSignUp ? (
                    <SignUp
                      onSignUp={handleSignUp}
                      onLogin={handleLogin}
                      onSwitchToLogin={handleSwitchToLogin}
                    />
                  ) : (
                    <Login onLogin={handleLogin} />
                  )}
                  <div className="fixed bottom-4 right-4 flex gap-2">
                    <Button
                      onClick={() => setShowSignUp(!showSignUp)}
                      variant="outline"
                      size="sm"
                    >
                      {showSignUp ? 'Back to Login' : 'Create Account'}
                    </Button>
                  </div>
                </div>
              ) : (
                <Dashboard user={user} onLogout={handleLogout} />
              )}
            </div>
          </Router>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;