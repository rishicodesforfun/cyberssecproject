"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Eye, EyeOff, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { checkPasswordStrength } from "@/lib/auth";

interface PasswordCheckerProps {
  onPasswordChange?: (password: string, strength: {
    score: number;
    strength: 'weak' | 'fair' | 'good' | 'strong';
    feedback: string[];
  }) => void;
  initialPassword?: string;
}

const PasswordChecker: React.FC<PasswordCheckerProps> = ({ 
  onPasswordChange, 
  initialPassword = '' 
}) => {
  const [password, setPassword] = useState(initialPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState<{
    score: number;
    strength: 'weak' | 'fair' | 'good' | 'strong';
    feedback: string[];
  } | null>(null);

  // Analyze password strength when password changes
  useEffect(() => {
    if (password) {
      const analysis = checkPasswordStrength(password);
      setStrength(analysis);
      onPasswordChange?.(password, analysis);
    } else {
      setStrength(null);
      onPasswordChange?.(password, null);
    }
  }, [password, onPasswordChange]);

  const getStrengthColor = (strength: 'weak' | 'fair' | 'good' | 'strong') => {
    switch (strength) {
      case 'weak': return 'text-red-600';
      case 'fair': return 'text-yellow-600';
      case 'good': return 'text-blue-600';
      case 'strong': return 'text-green-600';
    }
  };

  const getStrengthBgColor = (strength: 'weak' | 'fair' | 'good' | 'strong') => {
    switch (strength) {
      case 'weak': return 'bg-red-500';
      case 'fair': return 'bg-yellow-500';
      case 'good': return 'bg-blue-500';
      case 'strong': return 'bg-green-500';
    }
  };

  const getProgressBarColor = (strength: 'weak' | 'fair' | 'good' | 'strong') => {
    switch (strength) {
      case 'weak': return 'bg-red-500';
      case 'fair': return 'bg-yellow-500';
      case 'good': return 'bg-blue-500';
      case 'strong': return 'bg-green-500';
    }
  };

  const getProgressBarWidth = (score: number) => {
    return (score / 5) * 100;
  };

  const getPasswordRequirements = () => {
    return [
      { label: 'At least 8 characters long', met: password.length >= 8 },
      { label: 'Contains lowercase letters', met: /[a-z]/.test(password) },
      { label: 'Contains uppercase letters', met: /[A-Z]/.test(password) },
      { label: 'Contains numbers', met: /[0-9]/.test(password) },
      { label: 'Contains special characters', met: /[^A-Za-z0-9]/.test(password) }
    ];
  };

  const requirements = getPasswordRequirements();

  const generatePassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const allChars = lowercase + uppercase + numbers + special;
    let generatedPassword = '';
    
    // Ensure at least one of each character type
    generatedPassword += lowercase[Math.floor(Math.random() * lowercase.length)];
    generatedPassword += uppercase[Math.floor(Math.random() * uppercase.length)];
    generatedPassword += numbers[Math.floor(Math.random() * numbers.length)];
    generatedPassword += special[Math.floor(Math.random() * special.length)];
    
    // Fill the rest with random characters
    for (let i = 4; i < 12; i++) {
      generatedPassword += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    generatedPassword = generatedPassword.split('').sort(() => Math.random() - 0.5).join('');
    
    setPassword(generatedPassword);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Password Security Checker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Password Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Enter Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password to check its strength"
              className="pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Password Strength Display */}
        {strength && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Password Strength</span>
              <Badge 
                variant="outline"
                className={`${getStrengthColor(strength.strength)} border-current`}
              >
                {strength.strength.toUpperCase()}
              </Badge>
            </div>
            
            <Progress 
              value={getProgressBarWidth(strength.score)} 
              className="h-2"
            />
            
            <div className="text-xs text-gray-600">
              Score: {strength.score}/5
            </div>
          </div>
        )}

        {/* Requirements Checklist */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Password Requirements</label>
          <div className="space-y-1">
            {requirements.map((requirement, index) => (
              <div key={index} className="flex items-center text-xs">
                {requirement.met ? (
                  <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                ) : (
                  <XCircle className="h-3 w-3 text-red-500 mr-2 flex-shrink-0" />
                )}
                <span className={requirement.met ? 'text-green-700' : 'text-gray-600'}>
                  {requirement.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback */}
        {strength && strength.feedback.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
              <span className="text-sm font-medium text-yellow-800">Suggestions</span>
            </div>
            <ul className="text-xs text-yellow-700 space-y-1">
              {strength.feedback.map((feedback, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  {feedback}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Generate Password Button */}
        <div className="pt-2">
          <Button 
            variant="outline" 
            onClick={generatePassword}
            className="w-full"
            size="sm"
          >
            Generate Secure Password
          </Button>
        </div>

        {/* Security Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Security Tips</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Use unique passwords for each account</li>
            <li>• Change passwords regularly</li>
            <li>• Avoid using personal information</li>
            <li>• Consider using a password manager</li>
            <li>• Enable two-factor authentication when available</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordChecker;