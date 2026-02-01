import { Heart, Activity, Droplets, AlertTriangle, Flame, Bed, Wind } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface AlarmTypeConfig {
  label: string;
  shortLabel: string; // for badge, e.g. "HR", "Fall"
  icon: LucideIcon;
  showCamera: boolean;
}

export const ALARM_TYPE_CONFIG: Record<string, AlarmTypeConfig> = {
  HR: {
    label: 'Heart Rate',
    shortLabel: 'HR',
    icon: Heart,
    showCamera: false,
  },
  O2: {
    label: 'Blood Oxygen',
    shortLabel: 'O2',
    icon: Droplets,
    showCamera: false,
  },
  RR: {
    label: 'Respiration Rate',
    shortLabel: 'RR',
    icon: Wind,
    showCamera: false,
  },
  BP: {
    label: 'Blood Pressure',
    shortLabel: 'BP',
    icon: Activity,
    showCamera: false,
  },
  Fall: {
    label: 'Fall Detection',
    shortLabel: 'Fall',
    icon: AlertTriangle,
    showCamera: true,
  },
  FallOutOfBed: {
    label: 'Out of bed',
    shortLabel: 'Out of Bed',
    icon: Bed,
    showCamera: true,
  },
  Fire: {
    label: 'Fire',
    shortLabel: 'Fire',
    icon: Flame,
    showCamera: true,
  },
};

const TYPE_ALIASES: Record<string, string> = {
  hr: 'HR',
  heartrate: 'HR',
  'heart rate': 'HR',
  o2: 'O2',
  oxygen: 'O2',
  rr: 'RR',
  respirationrate: 'RR',
  'respiration rate': 'RR',
  respiratoryrate: 'RR',
  'respiratory rate': 'RR',
  bp: 'BP',
  'blood pressure': 'BP',
  fall: 'Fall',
  falldetection: 'Fall',
  'fall detection': 'Fall',
  falloutofbed: 'FallOutOfBed',
  'fall out of bed': 'FallOutOfBed',
  outofbed: 'FallOutOfBed',
  fire: 'Fire',
};

function normalizeType(type: string): string {
  const t = (type || '').trim();
  const lower = t.toLowerCase();
  return TYPE_ALIASES[lower] ?? t;
}

export function getAlarmTypeLabel(type: string): string {
  const key = normalizeType(type);
  return ALARM_TYPE_CONFIG[key]?.label ?? type;
}

export function getAlarmTypeShortLabel(type: string): string {
  const key = normalizeType(type);
  return ALARM_TYPE_CONFIG[key]?.shortLabel ?? type;
}

export function shouldShowCameraForType(type: string): boolean {
  const key = normalizeType(type);
  return ALARM_TYPE_CONFIG[key]?.showCamera ?? false;
}

export function getAlarmTypeIcon(type: string, className = 'w-4 h-4'): React.ReactNode {
  const key = normalizeType(type);
  const config = ALARM_TYPE_CONFIG[key];
  if (!config) {
    const Icon = AlertTriangle;
    return <Icon className={className} />;
  }
  const Icon = config.icon;
  return <Icon className={className} />;
}
