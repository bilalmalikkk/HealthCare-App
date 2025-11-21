import { useState, useEffect } from 'react';
import { ChevronLeft, MoreVertical, Thermometer, Heart, Activity, Droplets, Wind, Weight, Bell, Loader2 } from 'lucide-react';
import { Avatar } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { fetchVitals, fetchPatientById, VitalsData, PatientData } from '../utils/api';

interface VitalsPageProps {
  navigate: (page: string, patientId?: string) => void;
  patientId: string;
  alarmCount: number;
}

// Helper function to format date
function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  } catch {
    return 'N/A';
  }
}

// Helper function to calculate age from date of birth
function calculateAge(dob: string | null | undefined): string {
  if (!dob) return 'N/A';
  try {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} Years`;
  } catch {
    return 'N/A';
  }
}

export default function VitalsPage({ navigate, patientId, alarmCount }: VitalsPageProps) {
  const [vitalsData, setVitalsData] = useState<VitalsData | null>(null);
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate avatar URL from patient name
  const getAvatarUrl = (patient: PatientData | null): string => {
    if (!patient) return '';
    const name = `${patient.firstName || ''} ${patient.lastName || ''}`.trim();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch both patient data and vitals in parallel
        // Vitals: Gets patient's sensors, then fetches latest actual reading from readings_vital table
        // Returns: { hr, rr, fft, sv, hrv, bed_status, b2b, b2b1, b2b2, sig_strength, ts } (actual values, not averages)
        const [patientData, vitals] = await Promise.all([
          fetchPatientById(patientId),
          fetchVitals(patientId)
        ]);
        
        if (patientData) {
          setPatient(patientData);
        }
        
        // Log the vitals data received from backend
        if (import.meta.env.DEV) {
          console.log('Vitals data received:', vitals);
          console.log('Patient ID:', patientId);
        }
        
        setVitalsData(vitals);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load vitals');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // Set up polling to refresh vitals every 3 seconds
    // This fetches the latest actual reading from the readings_vital table
    const interval = setInterval(() => {
      fetchVitals(patientId)
        .then((vitals) => {
          if (import.meta.env.DEV) {
            console.log('Vitals updated (latest actual reading):', vitals);
          }
          setVitalsData(vitals);
        })
        .catch((err) => {
          console.error('Failed to refresh vitals:', err);
        });
    }, 3000); // 3 seconds
    
    return () => clearInterval(interval);
  }, [patientId]);

  // Format vitals data for display
  const formatVitalValue = (value: number | null, unit: string): string => {
    if (value === null || value === undefined) return 'N/A';
    return `${value} ${unit}`;
  };

  const formatBloodPressure = (systolic: number | null, diastolic: number | null): string => {
    if (systolic === null || diastolic === null) return 'N/A';
    return `${systolic}/${diastolic} mm Hg`;
  };

  // Using exact database field names: hr, rr, fft, etc.
  // These are the actual values from the readings_vital table (not averages)
  const vitals = [
    {
      icon: <Thermometer className="w-5 h-5" />,
      label: "Temperature (fft)",
      value: formatVitalValue(vitalsData?.fft || null, '°F'),
      date: formatDate(vitalsData?.ts || null)
    },
    {
      icon: <Heart className="w-5 h-5" />,
      label: "Heart Rate (hr)",
      value: formatVitalValue(vitalsData?.hr || null, 'BPM'),
      date: formatDate(vitalsData?.ts || null)
    },
    {
      icon: <Activity className="w-5 h-5" />,
      label: "Respiratory Rate (rr)",
      value: formatVitalValue(vitalsData?.rr || null, 'BPM'),
      date: formatDate(vitalsData?.ts || null)
    },
    {
      icon: <Droplets className="w-5 h-5" />,
      label: "Stroke Volume (sv)",
      value: formatVitalValue(vitalsData?.sv || null, 'mL'),
      date: formatDate(vitalsData?.ts || null)
    },
    {
      icon: <Wind className="w-5 h-5" />,
      label: "Heart Rate Variability (hrv)",
      value: formatVitalValue(vitalsData?.hrv || null, 'ms'),
      date: formatDate(vitalsData?.ts || null)
    },
    {
      icon: <Weight className="w-5 h-5" />,
      label: "Signal Strength (sig_strength)",
      value: formatVitalValue(vitalsData?.sig_strength || null, '%'),
      date: formatDate(vitalsData?.ts || null)
    }
  ];

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-24 pt-7">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate('patient', patientId)} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
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
          <button className="p-2 -mr-2">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Patient Profile */}
      <div className="bg-white flex flex-col items-center px-6 py-6 pb-4">
        <Avatar className="w-24 h-24 mb-4">
          <ImageWithFallback 
            src={patient ? getAvatarUrl(patient) : ''} 
            alt={patient ? `${patient.firstName} ${patient.lastName}` : 'Patient'} 
            className="w-full h-full object-cover" 
          />
        </Avatar>
        <h2 className="mb-1">
          {patient ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'Unknown Patient' : 'Loading...'}
        </h2>
        <p className="text-gray-500">
          {patient ? (
            <>
              {patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : 'N/A'} · {calculateAge(patient.dob)}
            </>
          ) : (
            'Loading...'
          )}
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white flex items-center justify-around px-2 border-b border-gray-200">
        <button 
          className="px-3 py-3 text-gray-500 text-sm"
          onClick={() => navigate('patient', patientId)}
        >
          Details
        </button>
        <button className="px-3 py-3 text-gray-900 text-sm border-b-2 border-teal-700">
          Vitals
        </button>
        <button className="px-3 py-3 text-gray-500 text-sm">Care Plan</button>
        <button className="px-3 py-3 text-gray-500 text-sm">Medications</button>
        <button className="px-3 py-3 text-gray-500 text-sm">Care Team</button>
      </div>

      {/* Vitals Grid */}
      <div className="px-4 pt-4 pb-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-teal-700" />
            <span className="ml-3 text-gray-600">Loading vitals...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-red-600 mb-2 font-semibold">Error loading vitals</p>
            <p className="text-red-500 text-sm mb-3">{error}</p>
            {error.includes('Cannot connect to backend') && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3 text-left">
                <p className="text-yellow-800 text-xs font-semibold mb-1">To fix this:</p>
                <ol className="text-yellow-700 text-xs list-decimal list-inside space-y-1">
                  <li>Open a terminal and navigate to the zenzohealth folder</li>
                  <li>Run: <code className="bg-yellow-100 px-1 rounded">npm run dev</code> (not <code className="bg-yellow-100 px-1 rounded">npm start</code> - dev loads .env file)</li>
                  <li>Wait for the server to start (usually on port 8000)</li>
                  <li>Refresh this page</li>
                </ol>
              </div>
            )}
            {(error.includes('Backend server error') || error.includes('Backend error')) && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3 text-left">
                <p className="text-orange-800 text-xs font-semibold mb-2">Backend Error (500)</p>
                <p className="text-orange-700 text-xs mb-2">
                  The backend returned a 500 error. This usually means:
                </p>
                <ul className="text-orange-700 text-xs list-disc list-inside space-y-1 mb-2">
                  <li>The user with this UUID doesn't exist in the database</li>
                  <li>Database connection issue</li>
                  <li>The user exists but has no data in the <code className="bg-orange-100 px-1 rounded">stats</code> field</li>
                </ul>
                <p className="text-orange-700 text-xs mb-2">
                  <strong>Check the backend console</strong> (where you ran <code className="bg-orange-100 px-1 rounded">npm start</code>) for the exact error message.
                </p>
                <p className="text-orange-600 text-xs">
                  <strong>Quick test:</strong> Try a different UUID from your database, or verify the user exists:
                  <code className="bg-orange-100 px-1 rounded block mt-1">SELECT * FROM users WHERE id = '33cfc5cf-fcaa-406a-9acc-7553a659b2f0';</code>
                </p>
              </div>
            )}
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchVitals(patientId)
                  .then(setVitalsData)
                  .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load vitals'))
                  .finally(() => setLoading(false));
              }}
              className="mt-3 px-4 py-2 bg-teal-700 text-white text-sm rounded-lg hover:bg-teal-800 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : vitalsData === null ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-600">No vitals data available for this patient</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {vitals.map((vital, index) => (
              <Card key={index} className="border border-gray-200 shadow-none bg-white rounded-xl">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4 text-gray-700">
                    {vital.icon}
                    <span className="text-sm">{vital.label}</span>
                  </div>
                  <p className="text-gray-900 text-2xl mb-2">{vital.value}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span>{vital.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
