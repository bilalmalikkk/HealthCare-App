import { useState } from 'react';
import { Heart, Activity, Droplets, AlertTriangle } from 'lucide-react';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import ClientsPage from './components/ClientsPage';
import PatientDetailsPage from './components/PatientDetailsPage';
import VitalsPage from './components/VitalsPage';
import DigitalCarePage from './components/DigitalCarePage';
import AlarmHandlingPage from './components/AlarmHandlingPage';
import JournalPage, { JournalEntry } from './components/JournalPage';
import PhoneFrame from './components/PhoneFrame';

interface Alarm {
  id: number;
  patientId: string;
  patientName: string;
  patientAvatar: string;
  type: string;
  typeIcon: React.ReactNode;
  value: string;
  time: string;
  handledBy: string | null;
  handledAt: string | null;
  resolvedAt: string | null;
  status: 'active' | 'in-progress' | 'resolved';
  notes?: string;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  
  // Journal entries state
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  
  // Shared alarm state
  const [alarms, setAlarms] = useState<Alarm[]>([
    {
      id: 1,
      patientId: '33cfc5cf-fcaa-406a-9acc-7553a659b2f0',
      patientName: "Jenny Wilson",
      patientAvatar: "https://images.unsplash.com/photo-1594751543129-6701ad444259?w=100&h=100&fit=crop",
      type: "HR",
      typeIcon: <Heart className="w-4 h-4" />,
      value: "89 BPM",
      time: "Nov 7, 08:24 PM",
      handledBy: null,
      handledAt: null,
      resolvedAt: null,
      status: 'active',
      notes: "This person often call for pain in a fot, but it is not real, He just want someone to visit"
    },
    {
      id: 2,
      patientId: '496d1ca1-dbe7-425d-9b73-0e230f8f37b5',
      patientName: "Jacob Jones",
      patientAvatar: "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=100&h=100&fit=crop",
      type: "Fall",
      typeIcon: <AlertTriangle className="w-4 h-4" />,
      value: "Fall Detected",
      time: "Nov 7, 07:45 PM",
      handledBy: null,
      handledAt: null,
      resolvedAt: null,
      status: 'active',
      notes: "Fall detection sensor triggered. Check camera immediately and verify patient status."
    },
    {
      id: 3,
      patientId: '4dd1ccdf-adff-4e67-9862-6110b4737d74',
      patientName: "Darrell Steward",
      patientAvatar: "https://images.unsplash.com/photo-1595429035839-c99c298ffdde?w=100&h=100&fit=crop",
      type: "O2",
      typeIcon: <Droplets className="w-4 h-4" />,
      value: "88%",
      time: "Nov 7, 07:12 PM",
      handledBy: null,
      handledAt: null,
      resolvedAt: null,
      status: 'active',
      notes: "Check oxygen concentrator settings. Patient may need supplemental oxygen adjustment."
    }
  ]);

  const handleLogin = (username: string) => {
    setIsLoggedIn(true);
    setCurrentUser(username);
  };

  const navigate = (page: string, patientId?: string) => {
    setCurrentPage(page);
    if (patientId) {
      setSelectedPatientId(patientId);
    }
  };

  // Alarm handlers
  const handleMarkInProgress = (alarmId: number) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    const formattedTime = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
    
    setAlarms(alarms.map(alarm => 
      alarm.id === alarmId 
        ? { 
            ...alarm, 
            handledBy: currentUser, 
            handledAt: `${formattedDate}, ${formattedTime}`,
            status: 'in-progress' 
          }
        : alarm
    ));
  };

  const handleReset = (alarmId: number, selectedOptions: string[], freeText: string) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    const formattedTime = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
    
    // Find the alarm being resolved
    const alarm = alarms.find(a => a.id === alarmId);
    
    if (alarm) {
      // Create a journal entry
      const journalEntry: JournalEntry = {
        id: Date.now(), // Use timestamp as unique ID
        alarmId: alarm.id,
        patientId: alarm.patientId,
        patientName: alarm.patientName,
        patientAvatar: alarm.patientAvatar,
        alarmType: alarm.type,
        alarmValue: alarm.value,
        detectedTime: alarm.time,
        handledBy: alarm.handledBy || currentUser,
        handledAt: alarm.handledAt || `${formattedDate}, ${formattedTime}`,
        resolvedAt: `${formattedDate}, ${formattedTime}`,
        selectedOptions: selectedOptions,
        freeTextNotes: freeText,
        alarmNotes: alarm.notes
      };
      
      // Add to journal entries
      setJournalEntries([journalEntry, ...journalEntries]);
      
      console.log('Alarm resolved and saved to journal:', journalEntry);
    }
    
    // Mark alarm as resolved
    setAlarms(alarms.map(alarm => 
      alarm.id === alarmId 
        ? { 
            ...alarm, 
            resolvedAt: `${formattedDate}, ${formattedTime}`,
            status: 'resolved' 
          }
        : alarm
    ));
  };

  const handleRelease = (alarmId: number) => {
    setAlarms(alarms.map(alarm => 
      alarm.id === alarmId 
        ? { 
            ...alarm, 
            handledBy: null,
            handledAt: null,
            status: 'active' 
          }
        : alarm
    ));
  };

  // Calculate active alarm count
  const activeAlarmCount = alarms.filter(a => a.status === 'active' || a.status === 'in-progress').length;

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return (
      <PhoneFrame>
        <LoginPage onLogin={handleLogin} />
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <div className="min-h-screen bg-gray-50">
        {currentPage === 'landing' && (
          <LandingPage 
            navigate={navigate} 
            currentUser={currentUser} 
            alarmCount={activeAlarmCount}
          />
        )}
        {currentPage === 'clients' && (
          <ClientsPage 
            navigate={navigate} 
            alarmCount={activeAlarmCount}
          />
        )}
        {currentPage === 'patient' && selectedPatientId && (
          <PatientDetailsPage 
            navigate={navigate} 
            patientId={selectedPatientId} 
            alarmCount={activeAlarmCount}
          />
        )}
        {currentPage === 'vitals' && selectedPatientId && (
          <VitalsPage 
            navigate={navigate} 
            patientId={selectedPatientId} 
            alarmCount={activeAlarmCount}
          />
        )}
        {currentPage === 'digitalcare' && selectedPatientId && (
          <DigitalCarePage 
            navigate={navigate} 
            patientId={selectedPatientId} 
            alarmCount={activeAlarmCount}
          />
        )}
        {currentPage === 'alarms' && (
          <AlarmHandlingPage 
            navigate={navigate} 
            currentUser={currentUser} 
            alarms={alarms}
            onMarkInProgress={handleMarkInProgress}
            onReset={handleReset}
            onRelease={handleRelease}
          />
        )}
        {currentPage === 'journal' && (
          <JournalPage 
            navigate={navigate}
            alarmCount={activeAlarmCount}
            journalEntries={journalEntries}
          />
        )}
      </div>
    </PhoneFrame>
  );
}
