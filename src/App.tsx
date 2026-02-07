import { useState, useEffect, useCallback } from 'react';
import { getAlarmTypeIcon } from './utils/alarmTypes';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import ClientsPage from './components/ClientsPage';
import PatientDetailsPage from './components/PatientDetailsPage';
import VitalsPage from './components/VitalsPage';
import DigitalCarePage from './components/DigitalCarePage';
import MedicationsPage from './components/MedicationsPage';
import AlarmHandlingPage from './components/AlarmHandlingPage';
import JournalPage, { JournalEntry } from './components/JournalPage';
import PhoneFrame from './components/PhoneFrame';
import {
  isAuthenticated,
  getStoredUser,
  clearAuthTokens,
  fetchAlertEvents,
  markAlertInProgress,
  releaseAlertEvent,
  resolveAlertEvent,
  type PatientAlertEvent,
} from './utils/api';

export interface Alarm {
  id: string;
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

function formatTriggeredAt(triggeredAt: string): string {
  if (!triggeredAt) return 'N/A';
  try {
    const d = new Date(triggeredAt);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return 'N/A';
  }
}

function eventToAlarm(e: PatientAlertEvent): Alarm {
  const valueStr =
    e.value !== null && e.value !== undefined ? String(e.value) : 'N/A';
  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    (e.patientName || 'U').split(/\s+/).map((n) => n[0]).join('')
  )}&background=0d9488&color=fff`;
  const isHandling = Boolean(e.isHandling);
  // Only show "Handled by" / "Started" when DB says is_handling is true
  const handledBy = isHandling ? (e.handlingByName ?? null) : null;
  const handledAt = isHandling && e.handlingAt ? formatTriggeredAt(e.handlingAt) : null;
  const status: Alarm['status'] = e.isResolved ? 'resolved' : isHandling ? 'in-progress' : 'active';
  const resolvedAt = e.resolvedAt ? formatTriggeredAt(e.resolvedAt) : null;
  return {
    id: e.id,
    patientId: e.patientId,
    patientName: e.patientName || 'Unknown',
    patientAvatar: avatar,
    type: e.type || 'Unknown',
    typeIcon: getAlarmTypeIcon(e.type),
    value: valueStr,
    time: formatTriggeredAt(e.triggeredAt || ''),
    handledBy,
    handledAt,
    resolvedAt,
    status,
  };
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

  // Alarm state: API-backed unresolved + local in-progress overlay + resolved this session
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [inProgressMap, setInProgressMap] = useState<
    Map<string, { handledBy: string; handledAt: string }>
  >(new Map());
  const [resolvedAlarms, setResolvedAlarms] = useState<Alarm[]>([]);
  const [alarmsLoading, setAlarmsLoading] = useState(false);
  const [alarmsError, setAlarmsError] = useState<string | null>(null);
  const [markingInProgressId, setMarkingInProgressId] = useState<string | null>(null);
  const [markedInProgressIds, setMarkedInProgressIds] = useState<Set<string>>(new Set());
  /** IDs released by current user – show as active so someone else can handle */
  const [releasedIds, setReleasedIds] = useState<Set<string>>(new Set());
  const [markAlarmError, setMarkAlarmError] = useState<string | null>(null);
  const [markAlarmWarning, setMarkAlarmWarning] = useState<string | null>(null);

  const loadAlarms = useCallback(async (silent = false) => {
    if (!isAuthenticated()) return;
    if (!silent) {
      setAlarmsLoading(true);
      setAlarmsError(null);
    }
    try {
      const events = await fetchAlertEvents('unresolved', 1000);
      const newAlarms = events.map((e) => eventToAlarm(e));
      setAlarms(newAlarms);
      // When backend says an alarm is not being handled (unhandled in DB), clear local state so UI shows active again
      const idsActiveFromBackend = new Set(
        newAlarms.filter((a) => a.status === 'active').map((a) => a.id)
      );
      if (idsActiveFromBackend.size > 0) {
        setMarkedInProgressIds((prev) => {
          const next = new Set(prev);
          idsActiveFromBackend.forEach((id) => next.delete(id));
          return next;
        });
        setInProgressMap((prev) => {
          const next = new Map(prev);
          idsActiveFromBackend.forEach((id) => next.delete(id));
          return next;
        });
        setReleasedIds((prev) => {
          const next = new Set(prev);
          idsActiveFromBackend.forEach((id) => next.delete(id));
          return next;
        });
      }
    } catch (e) {
      setAlarmsError(e instanceof Error ? e.message : 'Failed to load alarms');
      setAlarms([]);
    } finally {
      if (!silent) setAlarmsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    loadAlarms(false);
    const t = setInterval(() => loadAlarms(true), 15000);
    return () => clearInterval(t);
  }, [isLoggedIn, loadAlarms]);

  useEffect(() => {
    if (currentPage !== 'alarms') {
      setMarkAlarmError(null);
      setMarkAlarmWarning(null);
      setMarkedInProgressIds(new Set());
      setReleasedIds(new Set());
    }
  }, [currentPage]);

  useEffect(() => {
    if (!markAlarmWarning) return;
    const t = setTimeout(() => setMarkAlarmWarning(null), 6000);
    return () => clearTimeout(t);
  }, [markAlarmWarning]);

  const displayAlarms: Alarm[] = alarms.map((a) => {
    // Released: show as active so someone else can take it
    if (releasedIds.has(a.id))
      return { ...a, status: 'active' as const, handledBy: null, handledAt: null };
    // Marked in progress (by us or from API): show in-progress with Release/Reset
    if (markedInProgressIds.has(a.id))
      return {
        ...a,
        status: 'in-progress' as const,
        handledBy: a.handledBy || currentUser,
        handledAt: a.handledAt ?? null,
      };
    const prog = inProgressMap.get(a.id);
    if (prog)
      return {
        ...a,
        status: 'in-progress' as const,
        handledBy: prog.handledBy,
        handledAt: prog.handledAt,
      };
    return a;
  });

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

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleMarkInProgress = async (alarmId: string) => {
    if (!alarmId?.trim()) {
      setMarkAlarmError('Invalid alarm. Please try again.');
      return;
    }
    if (markingInProgressId) return;
    setMarkAlarmError(null);
    setMarkingInProgressId(alarmId);

    const handlingByName = currentUser || 'User';
    const handlingByInitials = getInitials(handlingByName);
    const storedUser = getStoredUser();
    const handlingBy = storedUser?.id ?? storedUser?.email ?? undefined;

    try {
      await markAlertInProgress(alarmId, {
        handling_by: handlingBy,
        handling_by_name: handlingByName,
        handling_by_initials: handlingByInitials,
      });
      setMarkAlarmWarning(null);
      setMarkedInProgressIds((s) => new Set(s).add(alarmId));
      await loadAlarms(true);
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      const message = err instanceof Error ? err.message : 'Failed to mark in progress';
      if (status === 404) {
        setMarkAlarmWarning(
          'Not saved to database: server does not have the handle endpoint yet. Alarm is marked in progress on this device only. Deploy the backend with PUT /api/v2/patients/alert-events/:id/handle to save to DB.'
        );
        setMarkedInProgressIds((s) => new Set(s).add(alarmId));
        console.warn('Handle endpoint not implemented (404); alarm marked in progress locally.');
        return;
      }
      if (status === 401) {
        setMarkAlarmError('Please log in again.');
      } else {
        setMarkAlarmError(message);
      }
      console.error('Failed to mark alarm in progress:', err);
    } finally {
      setMarkingInProgressId(null);
    }
  };

  const handleRelease = async (alarmId: string) => {
    try {
      await releaseAlertEvent(alarmId);
      setMarkAlarmError(null);
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      if (status === 404) {
        setMarkAlarmWarning('Release not saved to database: server may not have PUT .../alert-events/:id/unhandle endpoint yet.');
      } else {
        setMarkAlarmError(err instanceof Error ? err.message : 'Failed to release alarm.');
        return;
      }
    }
    setInProgressMap((m) => {
      const next = new Map(m);
      next.delete(alarmId);
      return next;
    });
    setMarkedInProgressIds((s) => {
      const next = new Set(s);
      next.delete(alarmId);
      return next;
    });
    setReleasedIds((s) => new Set(s).add(alarmId));
    await loadAlarms(true);
  };

  const handleReset = async (
    alarmId: string,
    selectedOptions: string[],
    freeText: string
  ) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const resolvedAt = `${formattedDate}, ${formattedTime}`;
    const a = displayAlarms.find((x) => x.id === alarmId);
    if (!a) return;
    setMarkAlarmError(null);
    try {
      // Resolve in the cloud (same backend) so alarm is removed from active list everywhere
      await resolveAlertEvent(alarmId);
    } catch (e) {
      console.error('Failed to resolve alarm:', e);
      setMarkAlarmError(e instanceof Error ? e.message : 'Failed to resolve alarm. Please try again.');
      return;
    }
    const journalEntry: JournalEntry = {
      id: Date.now(),
      alarmId,
      patientId: a.patientId,
      patientName: a.patientName,
      patientAvatar: a.patientAvatar,
      alarmType: a.type,
      alarmValue: a.value,
      detectedTime: a.time,
      handledBy: a.handledBy || currentUser,
      handledAt: a.handledAt || resolvedAt,
      resolvedAt,
      selectedOptions,
      freeTextNotes: freeText,
      alarmNotes: a.notes,
    };
    setJournalEntries((prev) => [journalEntry, ...prev]);
    setResolvedAlarms((prev) => {
      if (prev.some((r) => r.id === alarmId)) return prev;
      return [
        {
          ...a,
          status: 'resolved',
          resolvedAt,
          handledBy: a.handledBy || currentUser,
          handledAt: a.handledAt || resolvedAt,
        } as Alarm,
        ...prev,
      ];
    });
    setInProgressMap((m) => {
      const next = new Map(m);
      next.delete(alarmId);
      return next;
    });
    setMarkedInProgressIds((s) => {
      const next = new Set(s);
      next.delete(alarmId);
      return next;
    });
    setReleasedIds((s) => {
      const next = new Set(s);
      next.delete(alarmId);
      return next;
    });
    loadAlarms(true);
  };

  // Avoid duplicates: only show resolved from local list; active/in-progress from displayAlarms (API)
  const allAlarmsForPage: Alarm[] = [
    ...displayAlarms.filter((a) => a.status !== 'resolved'),
    ...resolvedAlarms,
  ];
  const activeAlarmCount = displayAlarms.filter(
    (a) => a.status === 'active' || a.status === 'in-progress'
  ).length;

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
        {currentPage === 'alarms' && (
          <AlarmHandlingPage
            navigate={navigate}
            currentUser={currentUser}
            alarms={allAlarmsForPage}
            isLoading={alarmsLoading}
            error={alarmsError}
            markingInProgressId={markingInProgressId}
            markedInProgressIds={markedInProgressIds}
            markAlarmError={markAlarmError}
            markAlarmWarning={markAlarmWarning}
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
