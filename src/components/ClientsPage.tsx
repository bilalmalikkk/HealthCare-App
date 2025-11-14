import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Bell } from 'lucide-react';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { HomeIcon, ScheduleIcon, ClientsIcon, TasksIcon, JournalIcon } from './BottomNavIcons';
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

export default function ClientsPage({ navigate, alarmCount }: ClientsPageProps) {
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
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between">
        <Avatar className="w-10 h-10">
          <AvatarImage src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h2>Clients</h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('alarms')}
            className="relative p-2 hover:bg-teal-100 rounded-full transition-colors -mr-2"
          >
            <Bell className="w-5 h-5 text-teal-700" />
            {alarmCount > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 hover:bg-red-500 text-white text-xs border-2 border-white rounded-full">
                {alarmCount}
              </Badge>
            )}
          </button>
          <Search className="w-5 h-5" />
          <SlidersHorizontal className="w-5 h-5" />
        </div>
      </div>

      {/* Clients List */}
      <div className="px-6 py-4 space-y-3">
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
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
            >
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
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-6 py-3 pb-16">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('landing')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-700"
          >
            <HomeIcon className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <div className="flex flex-col items-center gap-1 text-gray-500">
            <ScheduleIcon className="w-6 h-6" />
            <span className="text-xs">Schedule</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-gray-700">
            <ClientsIcon className="w-6 h-6" />
            <span className="text-xs">Clients</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-gray-500">
            <TasksIcon className="w-6 h-6" />
            <span className="text-xs">Tasks</span>
          </div>
          <button 
            onClick={() => navigate('journal')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-700"
          >
            <JournalIcon className="w-6 h-6" />
            <span className="text-xs">Journal</span>
          </button>
        </div>
      </div>
    </div>
  );
}
