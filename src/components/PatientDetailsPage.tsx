import { useState, useEffect } from 'react';
import { ChevronLeft, MoreVertical, Calendar, Languages, MapPin, Phone, AlertCircle, MessageSquare, ChevronRight, Bell, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { fetchPatientById, PatientData } from '../utils/api';

interface PatientDetailsPageProps {
  navigate: (page: string, patientId?: string) => void;
  patientId: string;
  alarmCount: number;
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

// Helper function to format date
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    const daySuffix = day === 1 || day === 21 || day === 31 ? 'st' : 
                     day === 2 || day === 22 ? 'nd' : 
                     day === 3 || day === 23 ? 'rd' : 'th';
    return `${day}${daySuffix} ${month}, ${year}`;
  } catch {
    return 'N/A';
  }
}

// Helper function to format address
function formatAddress(patient: PatientData): string {
  const parts: string[] = [];
  if (patient.block) parts.push(patient.block);
  if (patient.street) parts.push(patient.street);
  if (patient.landmark) parts.push(patient.landmark);
  if (patient.city) parts.push(patient.city);
  if (patient.state) parts.push(patient.state);
  if (patient.zip) parts.push(patient.zip);
  if (patient.countryCode) parts.push(patient.countryCode);
  
  return parts.length > 0 ? parts.join(', ') : 'Address not available';
}

export default function PatientDetailsPage({ navigate, patientId, alarmCount }: PatientDetailsPageProps) {
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPatient = async () => {
      setLoading(true);
      setError(null);
      try {
        const patientData = await fetchPatientById(patientId);
        if (patientData) {
          setPatient(patientData);
        } else {
          setError('Patient not found');
        }
      } catch (err) {
        console.error('Failed to load patient:', err);
        setError(err instanceof Error ? err.message : 'Failed to load patient');
      } finally {
        setLoading(false);
      }
    };

    loadPatient();
  }, [patientId]);

  // Generate avatar URL from patient name
  const getAvatarUrl = (patient: PatientData | null): string => {
    if (!patient) return '';
    const name = `${patient.firstName || ''} ${patient.lastName || ''}`.trim();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-24 pt-7 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-700 mx-auto mb-4" />
          <p className="text-gray-600">Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-24 pt-7">
        <div className="bg-white px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('clients')} className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="px-6 py-8 text-center">
          <p className="text-red-600 mb-4">{error || 'Patient not found'}</p>
          <Button onClick={() => navigate('clients')} variant="outline">
            Back to Clients
          </Button>
        </div>
      </div>
    );
  }

  const patientName = `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'Unknown Patient';
  const gender = patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : 'N/A';
  const age = calculateAge(patient.dob);
  const birthDate = formatDate(patient.dob);
  const address = formatAddress(patient);
  const phone = patient.phone || 'N/A';
  const avatarUrl = getAvatarUrl(patient);

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-24 pt-7">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate('clients')} className="p-2 -ml-2">
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
          <ImageWithFallback src={avatarUrl} alt={patientName} className="w-full h-full object-cover" />
        </Avatar>
        <h2 className="mb-1">{patientName}</h2>
        <p className="text-gray-500">
          {gender} · {age}
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white flex items-center justify-around px-2 border-b border-gray-200">
        <button className="px-3 py-3 text-gray-900 text-sm border-b-2 border-teal-700">
          Details
        </button>
        <button 
          className="px-3 py-3 text-gray-500 text-sm hover:text-gray-900"
          onClick={() => navigate('vitals', patientId)}
        >
          Vitals
        </button>
        <button 
          className="px-3 py-3 text-gray-500 text-sm hover:text-gray-900"
          onClick={() => navigate('digitalcare', patientId)}
        >
          Digital Care
        </button>
        <button className="px-3 py-3 text-gray-500 text-sm">Medications</button>
        <button className="px-3 py-3 text-gray-500 text-sm">Care Team</button>
      </div>

      {/* Details Content */}
      <div className="px-4 pt-4 pb-4">
        {/* Notes/Description */}
        {(patient.notes || patient.description) && (
          <div className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
            <p className="text-gray-600 text-sm mb-2">Notes</p>
            <p className="text-gray-900 text-sm">{patient.notes || patient.description || 'No notes available'}</p>
          </div>
        )}

        {/* Other Details */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          {/* Birth Date */}
          <div className="flex items-center gap-3 py-4 border-b border-gray-100">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="text-gray-900">{birthDate}</span>
          </div>

          {/* Email */}
          {patient.email && (
            <div className="flex items-center gap-3 py-4 border-b border-gray-100">
              <Languages className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">{patient.email}</span>
            </div>
          )}

          {/* Address */}
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div className="flex items-center gap-3 flex-1">
              <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0" />
              <span className="text-gray-900">{address}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 ml-2" />
          </div>

          {/* Phone */}
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">{phone}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          {/* Emergency Contacts */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Emergency Contacts</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 h-12 border-gray-300">
            <Phone className="w-5 h-5 mr-2" />
            Call
          </Button>
          <Button className="flex-1 h-12 bg-teal-700 hover:bg-teal-800">
            <MessageSquare className="w-5 h-5 mr-2" />
            Chat
          </Button>
        </div>
        <div className="w-32 h-1 bg-black rounded-full mx-auto mt-3"></div>
      </div>
    </div>
  );
}
