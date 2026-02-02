import { useState } from 'react';
import { ChevronLeft, AlertTriangle, CheckCircle2, RotateCcw, Camera, Loader2 } from 'lucide-react';
import { getAlarmTypeLabel, getAlarmTypeShortLabel, shouldShowCameraForType } from '../utils/alarmTypes';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import ResetAlarmDialog from './ResetAlarmDialog';

interface Alarm {
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

interface AlarmHandlingPageProps {
  navigate: (page: string, patientId?: string) => void;
  currentUser: string;
  alarms: Alarm[];
  isLoading?: boolean;
  error?: string | null;
  onMarkInProgress: (alarmId: string) => void;
  onReset: (alarmId: string, selectedOptions: string[], freeText: string) => void;
  onRelease: (alarmId: string) => void;
}

export default function AlarmHandlingPage({
  navigate,
  currentUser,
  alarms,
  isLoading = false,
  error = null,
  onMarkInProgress,
  onReset,
  onRelease,
}: AlarmHandlingPageProps) {

  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [selectedAlarmForReset, setSelectedAlarmForReset] = useState<Alarm | null>(null);

  const handleResetClick = (alarm: Alarm) => {
    setSelectedAlarmForReset(alarm);
    setResetDialogOpen(true);
  };

  const handleResetConfirm = (selectedOptions: string[], freeText: string) => {
    if (selectedAlarmForReset) {
      onReset(selectedAlarmForReset.id, selectedOptions, freeText);
      setResetDialogOpen(false);
      setSelectedAlarmForReset(null);
    }
  };

  const activeAlarms = alarms.filter(a => a.status === 'active');
  const inProgressAlarms = alarms.filter(a => a.status === 'in-progress');
  const resolvedAlarms = alarms.filter(a => a.status === 'resolved');

  // If reset dialog is open, show it instead of the alarm list
  if (resetDialogOpen && selectedAlarmForReset) {
    return (
      <ResetAlarmDialog
        onClose={() => {
          setResetDialogOpen(false);
          setSelectedAlarmForReset(null);
        }}
        onConfirm={handleResetConfirm}
        patientName={selectedAlarmForReset.patientName}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-8 pt-7">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between mb-4">
        <button onClick={() => navigate('landing')} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Emergency Alarms
        </h2>
        <div className="w-10"></div>
      </div>

      {/* Active Alarms Count */}
      <div className="px-6 mb-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-red-900">Active Alarms</p>
            <p className="text-red-600 text-sm">Requires immediate attention</p>
          </div>
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">{activeAlarms.length + inProgressAlarms.length}</span>
          </div>
        </div>
      </div>

      {/* Alarms List */}
      <div className="px-6 space-y-3">
        {/* Loading state */}
        {isLoading && alarms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-teal-700" />
            <p className="text-gray-600 text-sm">Loading alarms...</p>
          </div>
        )}

        {/* Error state */}
        {error && alarms.length === 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-800 font-medium mb-2">Failed to load alarms</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Active Alarms */}
        {!isLoading && activeAlarms.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-gray-700 text-sm px-2">Active Alerts</h3>
            {activeAlarms.map((alarm) => (
              <div key={alarm.id} className="bg-white border-2 border-red-200 rounded-2xl p-4 shadow-sm">
                {/* Patient Info */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <Avatar className="w-12 h-12">
                    <ImageWithFallback src={alarm.patientAvatar} alt={alarm.patientName} className="w-full h-full object-cover" />
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-gray-900">{alarm.patientName}</p>
                    <p className="text-gray-500 text-sm">{alarm.time}</p>
                  </div>
                  <Badge className="bg-red-500 hover:bg-red-500 text-white flex items-center gap-1">
                    {alarm.typeIcon}
                    {getAlarmTypeShortLabel(alarm.type)}
                  </Badge>
                </div>

                {/* Alarm Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Alarm Type</p>
                    <p className="text-gray-900">{getAlarmTypeLabel(alarm.type)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Value</p>
                    <p className="text-red-600">{alarm.value}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {shouldShowCameraForType(alarm.type) && (
                    <Button 
                      onClick={() => navigate('digitalcare', alarm.patientId)}
                      variant="outline"
                      className="w-full border-teal-700 text-teal-700 hover:bg-teal-50 hover:text-teal-800 h-10"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      View Camera
                    </Button>
                  )}
                  <Button 
                    onClick={() => onMarkInProgress(alarm.id)}
                    className="w-full bg-teal-700 hover:bg-teal-800 h-10"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark as In Progress
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* In Progress Alarms */}
        {!isLoading && inProgressAlarms.length > 0 && (
          <div className="space-y-3 mt-6">
            <h3 className="text-gray-700 text-sm px-2">In Progress</h3>
            {inProgressAlarms.map((alarm) => (
              <div key={alarm.id} className="bg-white border-2 border-amber-200 rounded-2xl p-4 shadow-sm">
                {/* Patient Info */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <Avatar className="w-12 h-12">
                    <ImageWithFallback src={alarm.patientAvatar} alt={alarm.patientName} className="w-full h-full object-cover" />
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-gray-900">{alarm.patientName}</p>
                    <p className="text-gray-500 text-sm">{alarm.time}</p>
                  </div>
                  <Badge className="bg-amber-500 hover:bg-amber-500 text-white flex items-center gap-1">
                    {alarm.typeIcon}
                    {getAlarmTypeShortLabel(alarm.type)}
                  </Badge>
                </div>

                {/* Alarm Details */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Alarm Type</p>
                    <p className="text-gray-900">{getAlarmTypeLabel(alarm.type)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Value</p>
                    <p className="text-amber-600">{alarm.value}</p>
                  </div>
                </div>

                {/* Responsible Person */}
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-3">
                  <div className="space-y-1">
                    <p className="text-teal-700 text-sm">
                      <span className="text-gray-600">Handled by:</span> <span className="font-medium">{alarm.handledBy}</span>
                    </p>
                    {alarm.handledAt && (
                      <p className="text-gray-600 text-xs">
                        Started: {alarm.handledAt}
                      </p>
                    )}
                  </div>
                </div>

                {/* Patient Notes */}
                {alarm.notes && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                    <p className="text-blue-900 text-xs mb-1">Cloud Notes:</p>
                    <p className="text-blue-800 text-sm">{alarm.notes}</p>
                  </div>
                )}

                {/* Camera Button for Fall / Fire / Out of Bed Alarms */}
                {shouldShowCameraForType(alarm.type) && (
                  <Button 
                    onClick={() => navigate('digitalcare', alarm.patientId)}
                    variant="outline"
                    className="w-full border-teal-700 text-teal-700 hover:bg-teal-50 hover:text-teal-800 h-10 mb-3"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    View Camera Feed
                  </Button>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    onClick={() => onRelease(alarm.id)}
                    variant="outline"
                    className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 h-10"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Release
                  </Button>
                  <Button 
                    onClick={() => handleResetClick(alarm)}
                    className="flex-1 bg-green-600 hover:bg-green-700 h-10"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resolved Alarms */}
        {!isLoading && resolvedAlarms.length > 0 && (
          <div className="space-y-3 mt-6">
            <h3 className="text-gray-700 text-sm px-2">Resolved Alerts</h3>
            {resolvedAlarms.map((alarm) => (
              <div key={alarm.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm opacity-75">
                {/* Patient Info */}
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
                  <Avatar className="w-12 h-12">
                    <ImageWithFallback src={alarm.patientAvatar} alt={alarm.patientName} className="w-full h-full object-cover" />
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-gray-900">{alarm.patientName}</p>
                    <p className="text-gray-500 text-sm">{alarm.time}</p>
                  </div>
                  <Badge className="bg-green-50 text-green-700 hover:bg-green-50 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Resolved
                  </Badge>
                </div>

                {/* Alarm Details */}
                <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Type</p>
                    <p className="text-gray-700">{getAlarmTypeLabel(alarm.type)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Value</p>
                    <p className="text-gray-700">{alarm.value}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Handled by</p>
                    <p className="text-teal-700">{alarm.handledBy}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="space-y-2">
                    {alarm.handledAt && (
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600">Started:</span>
                        <span className="text-gray-800">{alarm.handledAt}</span>
                      </div>
                    )}
                    {alarm.resolvedAt && (
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600">Resolved:</span>
                        <span className="text-green-700 font-medium">{alarm.resolvedAt}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* All Clear - had resolved, no active */}
        {!isLoading &&
          activeAlarms.length === 0 &&
          inProgressAlarms.length === 0 &&
          resolvedAlarms.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center mt-8">
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-green-900 mb-2">All Clear!</h3>
              <p className="text-green-700 text-sm">All emergency alarms have been handled</p>
            </div>
          )}

        {/* No alarms at all */}
        {!isLoading &&
          !error &&
          alarms.length === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center mt-8">
              <CheckCircle2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-gray-700 mb-2">No Alarms</h3>
              <p className="text-gray-500 text-sm">There are no active alarms at the moment</p>
            </div>
          )}
      </div>
    </div>
  );
}
