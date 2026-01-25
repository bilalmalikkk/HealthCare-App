import { useState, useEffect } from 'react';
import { ChevronLeft, Bell, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Badge } from './ui/badge';

interface BackendTestPageProps {
  navigate: (page: string, patientId?: string) => void;
  alarmCount: number;
}

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  details?: string;
  data?: any;
}

export default function BackendTestPage({ navigate, alarmCount }: BackendTestPageProps) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://nordicmedtek3.vps.itpays.cloud';
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Backend Reachability', status: 'pending', message: 'Testing...' },
    { name: 'CORS Configuration', status: 'pending', message: 'Testing...' },
    { name: 'Patients API', status: 'pending', message: 'Testing...' },
    { name: 'Max Well Patient', status: 'pending', message: 'Testing...' },
    { name: 'Vitals API', status: 'pending', message: 'Testing...' }
  ]);
  
  const [isRunning, setIsRunning] = useState(false);
  const [maxWellId, setMaxWellId] = useState<string | null>(null);

  const updateTest = (index: number, updates: Partial<TestResult>) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, ...updates } : test
    ));
  };

  const runTests = async () => {
    setIsRunning(true);
    
    // Check for Mixed Content issue first
    const isMixedContent = window.location.protocol === 'https:' && API_BASE_URL.startsWith('http:');
    if (isMixedContent) {
      updateTest(0, {
        status: 'error',
        message: 'Mixed Content Error - HTTPS → HTTP blocked',
        details: `Browser blocks HTTP requests from HTTPS pages. Backend must use HTTPS.`
      });
      updateTest(1, {
        status: 'warning',
        message: 'Cannot test - Mixed Content blocking',
        details: 'CORS cannot be tested due to Mixed Content policy'
      });
      updateTest(2, { status: 'pending', message: 'Skipped (Mixed Content)' });
      updateTest(3, { status: 'pending', message: 'Skipped (Mixed Content)' });
      updateTest(4, { status: 'pending', message: 'Skipped (Mixed Content)' });
      setIsRunning(false);
      return;
    }
    
    // Test 1: Backend Reachability
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${API_BASE_URL}/api/v2/patients?type=active`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      clearTimeout(timeout);
      
      if (response.ok) {
        updateTest(0, {
          status: 'success',
          message: 'Backend is reachable',
          details: `Status: ${response.status} ${response.statusText}`
        });
        
        // Test 2: CORS
        updateTest(1, {
          status: 'success',
          message: 'CORS is properly configured',
          details: 'No CORS errors detected'
        });
        
        // Test 3: Patients API
        const patients = await response.json();
        const patientsArray = Array.isArray(patients) ? patients : (patients.result || []);
        updateTest(2, {
          status: 'success',
          message: `Found ${patientsArray.length} patients`,
          details: `API returned valid JSON data`,
          data: patientsArray
        });
        
        // Test 4: Find Max Well
        const maxWell = patientsArray.find((p: any) => 
          p.firstName?.toLowerCase() === 'max' && p.lastName?.toLowerCase() === 'well'
        );
        
        if (maxWell) {
          setMaxWellId(maxWell.id);
          updateTest(3, {
            status: 'success',
            message: 'Max Well found in backend',
            details: `ID: ${maxWell.id}`,
            data: maxWell
          });
          
          // Test 5: Vitals API
          try {
            const vitalsResponse = await fetch(
              `${API_BASE_URL}/api/v2/patients/${maxWell.id}/vital/average?unit=minutes&time=5`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                }
              }
            );
            
            if (vitalsResponse.ok) {
              const vitalsData = await vitalsResponse.json();
              updateTest(4, {
                status: 'success',
                message: 'Vitals data retrieved successfully',
                details: `HR: ${vitalsData.avg_hr?.toFixed(1)}, RR: ${vitalsData.avg_rr?.toFixed(1)}`,
                data: vitalsData
              });
            } else {
              updateTest(4, {
                status: 'error',
                message: 'Vitals API returned error',
                details: `Status: ${vitalsResponse.status} ${vitalsResponse.statusText}`
              });
            }
          } catch (vitalsError) {
            updateTest(4, {
              status: 'error',
              message: 'Failed to fetch vitals',
              details: vitalsError instanceof Error ? vitalsError.message : 'Unknown error'
            });
          }
        } else {
          updateTest(3, {
            status: 'warning',
            message: 'Max Well not found in backend',
            details: `Found patients: ${patientsArray.map((p: any) => `${p.firstName} ${p.lastName}`).join(', ')}`
          });
          updateTest(4, {
            status: 'pending',
            message: 'Skipped (Max Well not found)'
          });
        }
      } else {
        updateTest(0, {
          status: 'error',
          message: 'Backend returned error',
          details: `Status: ${response.status} ${response.statusText}`
        });
        updateTest(1, { status: 'pending', message: 'Skipped' });
        updateTest(2, { status: 'pending', message: 'Skipped' });
        updateTest(3, { status: 'pending', message: 'Skipped' });
        updateTest(4, { status: 'pending', message: 'Skipped' });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMsg.includes('aborted') || errorMsg.includes('timeout')) {
        updateTest(0, {
          status: 'error',
          message: 'Backend connection timeout',
          details: 'Server did not respond within 5 seconds'
        });
      } else if (errorMsg.includes('Failed to fetch') || errorMsg.includes('CORS')) {
        updateTest(0, {
          status: 'error',
          message: 'Cannot reach backend',
          details: 'Possible CORS issue or network problem'
        });
        updateTest(1, {
          status: 'error',
          message: 'CORS blocking requests',
          details: 'Backend must allow requests from this domain'
        });
      } else {
        updateTest(0, {
          status: 'error',
          message: 'Connection failed',
          details: errorMsg
        });
      }
      
      updateTest(2, { status: 'pending', message: 'Skipped' });
      updateTest(3, { status: 'pending', message: 'Skipped' });
      updateTest(4, { status: 'pending', message: 'Skipped' });
    }
    
    setIsRunning(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'pending':
        return <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'pending':
        return 'bg-gray-50 border-gray-200';
    }
  };

  const allPassed = tests.every(t => t.status === 'success');
  const hasErrors = tests.some(t => t.status === 'error');

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-24 pt-7">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between mb-4">
        <button onClick={() => navigate('landing')} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-teal-700">Backend Diagnostics</h1>
        <button 
          onClick={() => navigate('alarms')}
          className="relative p-2 hover:bg-teal-100 rounded-full transition-colors"
        >
          <Bell className="w-5 h-5 text-teal-700" />
          {alarmCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 hover:bg-red-500 text-white text-xs border-2 border-white rounded-full">
              {alarmCount}
            </Badge>
          )}
        </button>
      </div>

      <div className="px-4 space-y-4">
        {/* Summary */}
        <div className={`p-4 rounded-lg border-2 ${allPassed ? 'bg-green-50 border-green-200' : hasErrors ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
          <h2 className={`mb-2 ${allPassed ? 'text-green-900' : hasErrors ? 'text-red-900' : 'text-blue-900'}`}>
            {allPassed ? '✅ All tests passed!' : hasErrors ? '❌ Connection issues detected' : '⏳ Running tests...'}
          </h2>
          <p className={`text-sm ${allPassed ? 'text-green-700' : hasErrors ? 'text-red-700' : 'text-blue-700'}`}>
            {allPassed ? 'Backend is working correctly' : hasErrors ? 'See details below for backend team' : 'Please wait...'}
          </p>
        </div>

        {/* Backend Info */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-gray-900 mb-2">Backend Configuration</h3>
          <div className="space-y-1 text-sm">
            <p className="text-gray-600">
              <span className="font-medium">URL:</span> {API_BASE_URL}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Client Domain:</span> {window.location.origin}
            </p>
            {maxWellId && (
              <p className="text-gray-600">
                <span className="font-medium">Max Well ID:</span> {maxWellId}
              </p>
            )}
          </div>
        </div>

        {/* Test Results */}
        <div className="space-y-3">
          {tests.map((test, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getStatusColor(test.status)}`}>
              <div className="flex items-start gap-3">
                {getStatusIcon(test.status)}
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 mb-1">{test.name}</h3>
                  <p className="text-sm text-gray-700">{test.message}</p>
                  {test.details && (
                    <p className="text-xs text-gray-600 mt-1 font-mono">{test.details}</p>
                  )}
                  {test.data && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-900">
                        Show raw data
                      </summary>
                      <pre className="text-xs bg-gray-900 text-green-400 p-2 rounded mt-1 overflow-x-auto">
                        {JSON.stringify(test.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={runTests}
            disabled={isRunning}
            className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isRunning ? 'Running Tests...' : 'Run Tests Again'}
          </button>
          {maxWellId && (
            <button
              onClick={() => navigate('vitals', maxWellId)}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Max Well Vitals
            </button>
          )}
        </div>

        {/* Backend Team Instructions */}
        {hasErrors && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-blue-900 mb-2">📋 Solutions for Backend Team</h3>
            <div className="text-sm text-blue-800 space-y-3">
              
              {/* Mixed Content Error */}
              {tests[0]?.message.includes('Mixed Content') && (
                <div className="bg-orange-100 border border-orange-300 rounded p-3">
                  <p className="font-medium text-orange-900 mb-2">🔒 Mixed Content Error (HTTPS → HTTP)</p>
                  <p className="mb-2">The app runs on HTTPS but backend is HTTP. Browser blocks this for security.</p>
                  <p className="font-medium mb-1">Solutions:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li><strong>Add SSL/TLS to backend</strong> (Recommended)
                      <ul className="list-disc list-inside ml-4 mt-1 text-xs">
                        <li>Use Let's Encrypt for free SSL certificates</li>
                        <li>Change backend URL to: <code className="bg-orange-50 px-1 rounded">https://nordicmedtek3.vps.itpays.cloud:5001</code></li>
                      </ul>
                    </li>
                    <li><strong>Use nginx as reverse proxy</strong> with SSL
                      <ul className="list-disc list-inside ml-4 mt-1 text-xs">
                        <li>nginx handles HTTPS, forwards to HTTP backend</li>
                      </ul>
                    </li>
                    <li><strong>Deploy frontend to same HTTP domain</strong> (Not recommended for production)</li>
                  </ol>
                  <p className="mt-2 font-medium">Quick nginx + Let's Encrypt setup:</p>
                  <pre className="bg-gray-900 text-green-400 p-2 rounded text-xs overflow-x-auto mt-1">
{`# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d nordicmedtek3.vps.itpays.cloud

# nginx will auto-configure HTTPS`}
                  </pre>
                </div>
              )}
              
              {/* CORS Error */}
              {!tests[0]?.message.includes('Mixed Content') && (
                <>
                  <p className="font-medium">If you see CORS errors above:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Add CORS headers to allow: <code className="bg-blue-100 px-1 rounded">{window.location.origin}</code></li>
                    <li>Or allow all origins with: <code className="bg-blue-100 px-1 rounded">Access-Control-Allow-Origin: *</code></li>
                    <li>Include headers: <code className="bg-blue-100 px-1 rounded">Content-Type, Accept</code></li>
                  </ol>
                  <p className="mt-3 font-medium">Example for Flask/Python:</p>
                  <pre className="bg-blue-900 text-green-400 p-2 rounded text-xs overflow-x-auto">
{`from flask_cors import CORS
CORS(app, origins=["*"])`}
                  </pre>
                  <p className="mt-3 font-medium">Example for Express/Node.js:</p>
                  <pre className="bg-blue-900 text-green-400 p-2 rounded text-xs overflow-x-auto">
{`const cors = require('cors');
app.use(cors());`}
                  </pre>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
