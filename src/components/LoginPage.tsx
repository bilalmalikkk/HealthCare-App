import { Fingerprint, Heart, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useState } from 'react';
import { login } from '../utils/api';

interface LoginPageProps {
  onLogin: (username: string, userData?: any) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    
    try {
      await login({ email, password });
      // Get user data from token or use email as username
      const userData = { email, name: email.split('@')[0] };
      onLogin(userData.name || email, userData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFingerprintLogin = () => {
    // For now, fingerprint login uses a default demo account
    // In production, this would use biometric authentication
    setError('Fingerprint authentication not yet implemented');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex flex-col">
      {/* Logo Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-12">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-teal-700 rounded-3xl mb-8 shadow-lg">
          <Heart className="w-12 h-12 text-white" />
        </div>
        <h1 className="mb-2">ElderCare Home</h1>
        <p className="text-gray-600 text-center mb-12">
          Sign in to access your care dashboard
        </p>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-5">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 border-gray-300 focus:border-teal-700 focus:ring-teal-700"
              required
              disabled={isLoading}
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-gray-300 focus:border-teal-700 focus:ring-teal-700 pr-12"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button type="button" className="text-sm text-teal-700 hover:text-teal-800">
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <Button 
            type="submit"
            className="w-full bg-teal-700 hover:bg-teal-800 h-12"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Divider */}
        <div className="w-full max-w-sm flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Fingerprint Authentication */}
        <button
          onClick={handleFingerprintLogin}
          className="group flex flex-col items-center gap-3 p-6 hover:bg-teal-50 rounded-2xl transition-colors"
        >
          <div className="w-16 h-16 bg-white border-2 border-teal-700 rounded-full flex items-center justify-center group-hover:bg-teal-700 transition-colors shadow-md">
            <Fingerprint className="w-8 h-8 text-teal-700 group-hover:text-white transition-colors" />
          </div>
          <span className="text-sm text-gray-700 group-hover:text-teal-700">
            Sign in with Fingerprint
          </span>
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 text-center">
        <p className="text-gray-500 text-sm">
          Secure access to ElderCare Home
        </p>
        <p className="text-gray-400 text-xs mt-2">
          © 2024 ElderCare Home. All rights reserved.
        </p>
      </div>
    </div>
  );
}
