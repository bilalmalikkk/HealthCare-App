import { useState, useEffect } from 'react';
import { ChevronLeft, Search, Filter, Bell, Phone, ChevronRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { fetchAllPatients, PatientData } from '../utils/api';

interface ClientsPageProps {
  navigate: (page: string, patientId?: string) => void;
  alarmCount: number;
}

interface Client {
  id: string;
  name: string;
  type: string;
  status: string;
  avatar: string;
}

// On-duty staff data
const onDutyStaff = [
  {
    name: "Ingrid Hansen",
    title: "Nurse",
    phone: "+47 912 34 567",
    avatar: "https://ui-avatars.com/api/?name=Ingrid+Hansen&background=0D9488&color=fff"
  },
  {
    name: "Lars Olsen",
    title: "Care Worker",
    phone: "+47 923 45 678",
    avatar: "https://ui-avatars.com/api/?name=Lars+Olsen&background=14B8A6&color=fff"
  },
  {
    name: "Kari Andersen",
    title: "Nurse",
    phone: "+47 934 56 789",
    avatar: "https://ui-avatars.com/api/?name=Kari+Andersen&background=0D9488&color=fff"
  },
  {
    name: "Erik Johansen",
    title: "Care Worker",
    phone: "+47 945 67 890",
    avatar: "https://ui-avatars.com/api/?name=Erik+Johansen&background=14B8A6&color=fff"
  },
  {
    name: "Solveig Berg",
    title: "Nurse",
    phone: "+47 956 78 901",
    avatar: "https://ui-avatars.com/api/?name=Solveig+Berg&background=0D9488&color=fff"
  },
  {
    name: "Magnus Nilsen",
    title: "Care Worker",
    phone: "+47 967 89 012",
    avatar: "https://ui-avatars.com/api/?name=Magnus+Nilsen&background=14B8A6&color=fff"
  }
];

export default function ClientsPage({ navigate, alarmCount }: ClientsPageProps) {
  const [showStaffDialog, setShowStaffDialog] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClients = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all patients from the backend
        const patients = await fetchAllPatients();
        
        if (patients.length === 0) {
          setError('No patients found. Please ensure the backend /api/v2/patients endpoint is available.');
          setClients([]);
          return;
        }
        
        const loadedClients: Client[] = patients.map((patient: PatientData) => ({
          id: patient.id,
          name: `${patient.firstName || ''} ${patient.lastName || ''}`.trim(),
          type: "Personal Care",
          status: patient.active !== false ? "Active" : "Inactive",
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent((patient.firstName || '') + ' ' + (patient.lastName || ''))}&background=random`
        }));
        
        setClients(loadedClients);
      } catch (error) {
        console.error('Failed to load patients:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load patients';
        setError(`Cannot load patients: ${errorMessage}. Please ensure the backend /api/v2/patients endpoint is available.`);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pt-7">
      {/* Show Staff List View OR Normal Clients Page */}
      {showStaffDialog ? (
        /* Staff List View */
        <div className="bg-white min-h-screen">
          {/* Header */}
          <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
            <button 
              onClick={() => setShowStaffDialog(false)}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="flex items-center gap-2 text-teal-900">
              <Phone className="w-5 h-5 text-teal-700" />
              On-Duty Staff
            </h2>
            <div className="w-10"></div>
          </div>
          
          {/* Staff List */}
          <div className="px-6 py-4 space-y-3">
            {onDutyStaff.map((staff, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl border border-gray-200 p-4 hover:border-teal-200 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
                  <Avatar className="w-12 h-12">
                    <ImageWithFallback src={staff.avatar} alt={staff.name} className="w-full h-full object-cover" />
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-gray-900">{staff.name}</p>
                    <Badge 
                      variant="outline" 
                      className={`mt-1 ${staff.title === "Nurse" ? "bg-teal-50 text-teal-700 border-teal-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}
                    >
                      {staff.title}
                    </Badge>
                  </div>
                </div>
                
                {/* Phone Number */}
                <a 
                  href={`tel:${staff.phone}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-teal-50 transition-colors group"
                >
                  <Phone className="w-5 h-5 text-gray-500 group-hover:text-teal-700" />
                  <span className="text-gray-900 group-hover:text-teal-900">{staff.phone}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 ml-auto group-hover:text-teal-600" />
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Normal Clients Page */
        <>
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between">
        <button 
          type="button"
          onClick={() => navigate('landing')} 
          className="p-3 -ml-3 hover:bg-gray-100 rounded-full transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center cursor-pointer relative"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700 absolute inset-0 m-auto" style={{ pointerEvents: 'none' }} />
        </button>
        <h2 className="flex-1 text-center -ml-12">Clients</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowStaffDialog(true)}
            className="p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors"
            title="Call On-Duty Staff"
          >
            <Phone className="w-5 h-5" />
          </button>
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
          <Search className="w-5 h-5" />
          <Filter className="w-5 h-5" />
        </div>
      </div>

      {/* Clients List */}
      <div className="px-6 py-4 space-y-3 pb-6">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading patients...</div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-red-600 mb-2 font-semibold">Error loading patients</p>
            <p className="text-red-500 text-sm">{error}</p>
            <p className="text-red-500 text-xs mt-2">
              The backend endpoint <code className="bg-red-100 px-1 rounded">/api/v2/patients</code> is not available.
              Please ensure your backend has this endpoint registered.
            </p>
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No patients found</div>
        ) : (
          clients.map((client) => (
            <div
              key={client.id}
              onClick={() => navigate('patient', client.id)}
              className="p-4 bg-white border border-gray-200 rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
            >
              {/* Top Row: Avatar, Name, Status */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <ImageWithFallback src={client.avatar} alt={client.name} className="w-full h-full object-cover" />
                    <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-gray-900">{client.name}</p>
                    <p className="text-gray-500 text-sm">{client.type}</p>
                  </div>
                </div>
                <Badge 
                  variant={client.status === "New" ? "default" : "secondary"}
                  className={client.status === "Active" ? "bg-green-50 text-green-700 hover:bg-green-50" : "bg-blue-50 text-blue-700 hover:bg-blue-50"}
                >
                  {client.status}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
        </>
      )}
    </div>
  );
}
