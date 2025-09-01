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
import { CalendarIcon, Search, Upload, LogOut, User, Phone, Globe, MessageSquare, Database, Eye, EyeOff, Camera } from "lucide-react";

// Import new components
import FaceAuth from './components/FaceAuth';
import SignUp from './components/SignUp';
import IPTracker from './components/IPTracker';
import CameraTest from './components/CameraTest';
import SimpleCameraFeed from './components/SimpleCameraFeed';

// Mock API functions
const mockAPI = {
  login: async (username: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (username === 'admin' && password === 'password') {
      return { username, role: 'analyst' };
    }
    throw new Error('Invalid credentials');
  },

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
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d: any) => Math.sqrt(d.weight) * 2);

    const node = g.append("g")
      .selectAll("circle")
      .data(data.nodes)
      .enter().append("circle")
      .attr("r", (d: any) => Math.sqrt(d.calls) * 2 + 5)
      .attr("fill", (d: any) => d.type === 'phone' ? '#3b82f6' : '#10b981')
      .attr("stroke", "#fff")
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
      .style("fill", "#333")
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
      <div className="border rounded-lg p-4 bg-white">
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
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
        
        {sortedData.map((record, index) => (
          <div key={record.id} className="relative flex items-start space-x-4 pb-6">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center z-10">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            
            <div className="flex-1 bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium">{record.aParty} → {record.bParty}</div>
                <Badge variant={record.communicationType === 'VOICE' ? 'default' : record.communicationType === 'SMS' ? 'secondary' : 'outline'}>
                  {record.communicationType}
                </Badge>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {new Date(record.timestamp).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
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
  const [showFaceAuth, setShowFaceAuth] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await mockAPI.login(username, password);
      onLogin(user);
    } catch (err) {
      setError('Invalid username or password');
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">IPDR Analysis System</CardTitle>
          <p className="text-gray-600">Secure Login</p>
        </CardHeader>
        <CardContent>
          {!showFaceAuth ? (
            <div className="space-y-4">
              <Tabs defaultValue="credentials" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="credentials">Credentials</TabsTrigger>
                  <TabsTrigger value="face">Face Auth</TabsTrigger>
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
                      <div className="text-red-600 text-sm text-center">{error}</div>
                    )}
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Logging in...' : 'Login'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="face" className="space-y-4">
                  <FaceAuth onAuthSuccess={handleFaceAuthSuccess} onAuthError={handleFaceAuthError} />
                </TabsContent>
              </Tabs>

              <div className="text-center">
                <Button 
                  variant="link" 
                  onClick={() => setShowFaceAuth(!showFaceAuth)}
                  className="text-sm"
                >
                  {showFaceAuth ? 'Use credentials instead' : 'Try face authentication'}
                </Button>
              </div>
            </div>
          ) : (
            <FaceAuth onAuthSuccess={handleFaceAuthSuccess} onAuthError={handleFaceAuthError} />
          )}
        </CardContent>
      </Card>
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
  }, []);

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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">IPDR Analysis System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{user.username}</span>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
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
                  <div className="text-sm text-gray-500">
                    {filteredData.length} records found
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
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

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleSignUp = (userData: any) => {
    setUser(userData);
  };

  const handleSwitchToLogin = () => {
    setShowSignUp(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <div className="min-h-screen">
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
                <div className="fixed bottom-4 right-4">
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
    </QueryClientProvider>
  );
};

export default App;