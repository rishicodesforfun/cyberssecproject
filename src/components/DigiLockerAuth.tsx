"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Smartphone, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { authService } from "@/services/authService";

interface DigiLockerAuthProps {
  onAuthSuccess: (user: any) => void;
  onAuthError: (error: string) => void;
}

const DigiLockerAuth: React.FC<DigiLockerAuthProps> = ({ onAuthSuccess, onAuthError }) => {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'aadhaar' | 'otp' | 'loading'>('aadhaar');
  const [error, setError] = useState('');
  const [digiLockerData, setDigiLockerData] = useState<any>(null);

  const handleSendOTP = async () => {
    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      setError('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    setError('');
    setStep('otp');

    // Mock OTP sending (in real implementation, this would call DigiLocker API)
    console.log(`OTP sent to Aadhaar: ${aadhaarNumber}`);
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setError('');
    setStep('loading');

    try {
      const result = await authService.digiLockerAuth(aadhaarNumber, otp);

      setDigiLockerData(result.digiLockerData);
      onAuthSuccess(result.user);

    } catch (error: any) {
      setError(error.message || 'DigiLocker authentication failed');
      onAuthError(error.message || 'DigiLocker authentication failed');
      setStep('otp');
    }
  };

  const formatAadhaar = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Limit to 12 digits
    const limited = digits.slice(0, 12);
    // Add spaces every 4 digits
    return limited.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadhaar(e.target.value);
    setAadhaarNumber(formatted.replace(/\s/g, ''));
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-2">
          <Shield className="h-8 w-8 text-blue-600 mr-2" />
          <CardTitle className="text-xl">DigiLocker Authentication</CardTitle>
        </div>
        <p className="text-gray-600 text-sm">Secure login using your Aadhaar number</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 'aadhaar' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Aadhaar Number</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  value={formatAadhaar(aadhaarNumber)}
                  onChange={handleAadhaarChange}
                  placeholder="XXXX XXXX XXXX"
                  className="pl-10 text-center text-lg tracking-wider"
                  maxLength={14} // 12 digits + 2 spaces
                />
              </div>
              <p className="text-xs text-gray-500 text-center">
                Enter your 12-digit Aadhaar number
              </p>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center flex items-center justify-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
              </div>
            )}

            <Button onClick={handleSendOTP} className="w-full">
              Send OTP
            </Button>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-4">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                OTP sent to your registered mobile number
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Enter 6-digit OTP</label>
              <Input
                type="text"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 6) {
                    setOtp(value);
                  }
                }}
                placeholder="000000"
                className="text-center text-lg tracking-wider"
                maxLength={6}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center flex items-center justify-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setStep('aadhaar')}
                className="flex-1"
              >
                Back
              </Button>
              <Button onClick={handleVerifyOTP} className="flex-1">
                Verify OTP
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Didn't receive OTP? <button className="text-blue-600 hover:underline">Resend</button>
              </p>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Verifying with DigiLocker...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
          </div>
        )}

        {digiLockerData && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="font-medium text-green-800">Authentication Successful</span>
            </div>
            <div className="text-sm text-green-700 space-y-1">
              <p><strong>Name:</strong> {digiLockerData.name}</p>
              <p><strong>Aadhaar:</strong> {digiLockerData.aadhaarNumber}</p>
              <p><strong>Email:</strong> {digiLockerData.email}</p>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 text-center space-y-1 bg-gray-50 p-3 rounded-lg">
          <p className="font-medium">Mock DigiLocker</p>
          <p>Test OTPs: 123456, 654321, 111111</p>
          <p>This is a demonstration of DigiLocker integration</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DigiLockerAuth;