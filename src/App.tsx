import { useState, useEffect } from 'react';
import { getAlarmTypeIcon } from './utils/alarmTypes';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import ClientsPage from './components/ClientsPage';
import PatientDetailsPage from './components/PatientDetailsPage';
import VitalsPage from './components/VitalsPage';
import DigitalCarePage from './components/DigitalCarePage';
import MedicationsPage from './components/MedicationsPage';
import BackendTestPage from './components/BackendTestPage';
import AlarmHandlingPage from './components/AlarmHandlingPage';
import JournalPage, { JournalEntry } from './components/JournalPage';
import PhoneFrame from './components/PhoneFrame';
import { isAuthenticated, getStoredUser, clearAuthTokens } from './utils/api';

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

  // Check for existing authentication on mount
  useEffect(() => {
    if (isAuthenticated()) {
      const storedUser = getStoredUser();
      if (storedUser) {
        setIsLoggedIn(true);
        setCurrentUser(storedUser.name || storedUser.email || 'User');
      }
    }
  }, []);
  
  // Journal entries state
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    // Dummy healthcare journal entries
    {
      id: 101,
      alarmId: 201,
      patientId: '33cfc5cf-fcaa-406a-9acc-7553a659b2f0',
      patientName: "Jenny Wilson",
      patientAvatar: "https://images.unsplash.com/photo-1594751543129-6701ad444259?w=100&h=100&fit=crop",
      alarmType: "Heart Rate",
      alarmValue: "112 BPM - High Heart Rate",
      detectedTime: "Nov 19, 2024 at 2:45 PM",
      handledBy: "Ingrid Hansen",
      handledAt: "Nov 19, 2024 at 2:47 PM",
      resolvedAt: "Nov 19, 2024 at 3:15 PM",
      selectedOptions: ["Contacted patient", "Vital signs checked", "Medication reviewed"],
      freeTextNotes: "Patient was experiencing anxiety after watching the news. Breathing exercises performed. Heart rate normalized after 15 minutes.",
      alarmNotes: "Patient has history of anxiety-related tachycardia"
    },
    {
      id: 102,
      alarmId: 202,
      patientId: '4dd1ccdf-adff-4e67-9862-6110b4737d74',
      patientName: "Robert Fox",
      patientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      alarmType: "Oxygen",
      alarmValue: "88% - Low Oxygen Saturation",
      detectedTime: "Nov 19, 2024 at 10:20 AM",
      handledBy: "Lars Olsen",
      handledAt: "Nov 19, 2024 at 10:22 AM",
      resolvedAt: "Nov 19, 2024 at 10:45 AM",
      selectedOptions: ["Contacted patient", "Emergency protocol initiated", "Oxygen therapy adjusted"],
      freeTextNotes: "Patient's nasal cannula had become dislodged during sleep. Repositioned oxygen equipment. O2 levels returned to 95% within 10 minutes. Patient feeling well.",
      alarmNotes: "COPD patient - monitor oxygen levels closely"
    },
    {
      id: 103,
      alarmId: 203,
      patientId: '496d1ca1-dbe7-425d-9b73-0e230f8f37b5',
      patientName: "Max Well",
      patientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      alarmType: "Fall",
      alarmValue: "Fall detected in bathroom",
      detectedTime: "Nov 18, 2024 at 11:35 PM",
      handledBy: "Kari Andersen",
      handledAt: "Nov 18, 2024 at 11:37 PM",
      resolvedAt: "Nov 18, 2024 at 11:58 PM",
      selectedOptions: ["Contacted patient", "Family contacted", "Physical assessment completed"],
      freeTextNotes: "Patient slipped on wet floor. No injuries sustained. Vital signs stable. Advised to use bathroom mat. Family notified.",
      alarmNotes: "Patient uses walker - fall risk present"
    },
    {
      id: 104,
      alarmId: 204,
      patientId: '496d1ca1-dbe7-425d-9b73-0e230f8f37b5',
      patientName: "Jacob Jones",
      patientAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      alarmType: "Blood Pressure",
      alarmValue: "165/98 mmHg - High Blood Pressure",
      detectedTime: "Nov 18, 2024 at 6:10 AM",
      handledBy: "Solveig Berg",
      handledAt: "Nov 18, 2024 at 6:12 AM",
      resolvedAt: "Nov 18, 2024 at 7:30 AM",
      selectedOptions: ["Contacted patient", "Medication administered", "Vital signs monitored"],
      freeTextNotes: "Patient forgot to take morning BP medication. Medication taken under supervision. BP rechecked after 1 hour: 138/82 mmHg - within acceptable range.",
      alarmNotes: "Patient has hypertension - daily medication required"
    },
    {
      id: 105,
      alarmId: 205,
      patientId: '33cfc5cf-fcaa-406a-9acc-7553a659b2f0',
      patientName: "Jenny Wilson",
      patientAvatar: "https://images.unsplash.com/photo-1594751543129-6701ad444259?w=100&h=100&fit=crop",
      alarmType: "Heart Rate",
      alarmValue: "45 BPM - Low Heart Rate",
      detectedTime: "Nov 17, 2024 at 4:20 AM",
      handledBy: "Erik Johansen",
      handledAt: "Nov 17, 2024 at 4:22 AM",
      resolvedAt: "Nov 17, 2024 at 4:35 AM",
      selectedOptions: ["Contacted patient", "Vital signs checked"],
      freeTextNotes: "Patient was in deep sleep. Vital signs otherwise normal. Heart rate increased to 58 BPM upon waking. Patient reports feeling well rested.",
      alarmNotes: "Patient is on beta blockers - may lower heart rate during rest"
    },
    {
      id: 106,
      alarmId: 206,
      patientId: '496d1ca1-dbe7-425d-9b73-0e230f8f37b5',
      patientName: "Max Well",
      patientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      alarmType: "Heart Rate",
      alarmValue: "102 BPM - Elevated Heart Rate",
      detectedTime: "Nov 16, 2024 at 3:15 PM",
      handledBy: "Magnus Nilsen",
      handledAt: "Nov 16, 2024 at 3:17 PM",
      resolvedAt: "Nov 16, 2024 at 3:45 PM",
      selectedOptions: ["Contacted patient", "Vital signs checked"],
      freeTextNotes: "Patient was doing light exercises (walking stairs). Heart rate normalized after rest period. Advised to moderate exercise intensity.",
      alarmNotes: "Patient cleared for light exercise by physician"
    },
    {
      id: 107,
      alarmId: 207,
      patientId: '33cfc5cf-fcaa-406a-9acc-7553a659b2f0',
      patientName: "Emma Johnson",
      patientAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      alarmType: "Oxygen",
      alarmValue: "91% - Borderline Low Oxygen",
      detectedTime: "Nov 15, 2024 at 9:45 PM",
      handledBy: "Ingrid Hansen",
      handledAt: "Nov 15, 2024 at 9:47 PM",
      resolvedAt: "Nov 15, 2024 at 10:10 PM",
      selectedOptions: ["Contacted patient", "Vital signs monitored"],
      freeTextNotes: "Patient reported feeling tired. Encouraged deep breathing exercises. O2 levels improved to 94% after breathing exercises. Patient advised to rest.",
    }
  ]);
  
  // Shared alarm state
  const [alarms, setAlarms] = useState<Alarm[]>([
    {
      id: 1,
      patientId: '33cfc5cf-fcaa-406a-9acc-7553a659b2f0',
      patientName: "Jenny Wilson",
      patientAvatar: "https://images.unsplash.com/photo-1594751543129-6701ad444259?w=100&h=100&fit=crop",
      type: "HR",
      typeIcon: getAlarmTypeIcon("HR"),
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
      typeIcon: getAlarmTypeIcon("Fall"),
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
      typeIcon: getAlarmTypeIcon("O2"),
      value: "88%",
      time: "Nov 7, 07:12 PM",
      handledBy: null,
      handledAt: null,
      resolvedAt: null,
      status: 'active',
      notes: "Check oxygen concentrator settings. Patient may need supplemental oxygen adjustment."
    },
    {
      id: 4,
      patientId: '496d1ca1-dbe7-425d-9b73-0e230f8f37b5',
      patientName: "Max Well",
      patientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      type: "FallOutOfBed",
      typeIcon: getAlarmTypeIcon("FallOutOfBed"),
      value: "Out of bed detected",
      time: "Nov 7, 06:30 PM",
      handledBy: null,
      handledAt: null,
      resolvedAt: null,
      status: 'active',
      notes: "Patient left bed without assistance. Check camera to verify safety."
    },
    {
      id: 5,
      patientId: '33cfc5cf-fcaa-406a-9acc-7553a659b2f0',
      patientName: "Jenny Wilson",
      patientAvatar: "https://images.unsplash.com/photo-1594751543129-6701ad444259?w=100&h=100&fit=crop",
      type: "Fire",
      typeIcon: getAlarmTypeIcon("Fire"),
      value: "Smoke detected in room",
      time: "Nov 7, 06:15 PM",
      handledBy: null,
      handledAt: null,
      resolvedAt: null,
      status: 'active',
      notes: "Fire alarm triggered. Evacuate and verify via camera."
    },
    {
      id: 6,
      patientId: '4dd1ccdf-adff-4e67-9862-6110b4737d74',
      patientName: "Robert Fox",
      patientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      type: "RR",
      typeIcon: getAlarmTypeIcon("RR"),
      value: "28 /min",
      time: "Nov 7, 06:00 PM",
      handledBy: null,
      handledAt: null,
      resolvedAt: null,
      status: 'active',
      notes: "Elevated respiratory rate. Monitor patient for signs of distress."
    }
  ]);

  const handleLogin = (username: string, userData?: any) => {
    setIsLoggedIn(true);
    setCurrentUser(username);
    // Store user data if provided
    if (userData) {
      localStorage.setItem('eldercare_user', JSON.stringify(userData));
    }
  };

  const handleLogout = () => {
    clearAuthTokens();
    setIsLoggedIn(false);
    setCurrentUser('');
    setCurrentPage('landing');
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
        {currentPage === 'medications' && selectedPatientId && (
          <MedicationsPage 
            navigate={navigate} 
            patientId={selectedPatientId} 
            alarmCount={activeAlarmCount}
          />
        )}
        {currentPage === 'backend-test' && (
          <BackendTestPage 
            navigate={navigate}
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
