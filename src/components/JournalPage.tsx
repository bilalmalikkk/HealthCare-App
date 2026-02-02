import { ChevronLeft, Bell, Calendar, User, Clock, FileText, AlertCircle, Download, Filter, Heart, Droplets, Activity, AlertTriangle, Bed, Flame, Wind } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Avatar } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { HomeIcon, ScheduleIcon, ClientsIcon, TasksIcon, JournalIcon } from './BottomNavIcons';

export interface JournalEntry {
  id: number;
  alarmId: string | number;
  patientId: string;
  patientName: string;
  patientAvatar: string;
  alarmType: string;
  alarmValue: string;
  detectedTime: string;
  handledBy: string;
  handledAt: string;
  resolvedAt: string;
  selectedOptions: string[];
  freeTextNotes: string;
  alarmNotes?: string;
}

interface JournalPageProps {
  navigate: (page: string) => void;
  alarmCount: number;
  journalEntries: JournalEntry[];
}

export default function JournalPage({ navigate, alarmCount, journalEntries }: JournalPageProps) {
  const [filterType, setFilterType] = useState<'all' | 'today' | 'week'>('all');

  // Filter entries based on selected time range
  const getFilteredEntries = () => {
    if (filterType === 'all') return journalEntries;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return journalEntries.filter(entry => {
      const resolvedDate = new Date(entry.resolvedAt);
      if (filterType === 'today') {
        return resolvedDate >= today;
      } else {
        return resolvedDate >= weekAgo;
      }
    });
  };

  const filteredEntries = getFilteredEntries();

  // Group entries by date
  const groupedEntries = filteredEntries.reduce((groups, entry) => {
    const date = new Date(entry.resolvedAt).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {} as Record<string, JournalEntry[]>);

  const getAlarmTypeColor = (type: string) => {
    const t = type.toLowerCase();
    if (t === 'hr' || t === 'heart rate') return 'bg-red-50 text-red-700 border-red-200';
    if (t === 'o2' || t === 'oxygen') return 'bg-blue-50 text-blue-700 border-blue-200';
    if (t === 'rr' || t === 'respiration rate' || t === 'respiratory rate') return 'bg-cyan-50 text-cyan-700 border-cyan-200';
    if (t === 'bp' || t === 'blood pressure') return 'bg-purple-50 text-purple-700 border-purple-200';
    if (t === 'fall' || t === 'fall detection') return 'bg-orange-50 text-orange-700 border-orange-200';
    if (t === 'falloutofbed' || t === 'fall out of bed' || t === 'outofbed') return 'bg-amber-50 text-amber-700 border-amber-200';
    if (t === 'fire') return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getAlarmTypeIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t === 'hr' || t === 'heart rate') return <Heart className="w-3 h-3" />;
    if (t === 'o2' || t === 'oxygen') return <Droplets className="w-3 h-3" />;
    if (t === 'rr' || t === 'respiration rate' || t === 'respiratory rate') return <Wind className="w-3 h-3" />;
    if (t === 'bp' || t === 'blood pressure') return <Activity className="w-3 h-3" />;
    if (t === 'fall' || t === 'fall detection') return <AlertTriangle className="w-3 h-3" />;
    if (t === 'falloutofbed' || t === 'fall out of bed' || t === 'outofbed') return <Bed className="w-3 h-3" />;
    if (t === 'fire') return <Flame className="w-3 h-3" />;
    return <AlertCircle className="w-3 h-3" />;
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-24 pt-7">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => navigate('landing')} 
            className="p-3 -ml-3 hover:bg-gray-100 rounded-full transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h2>Care Journal</h2>
            <p className="text-gray-500 text-xs">{filteredEntries.length} entries</p>
          </div>
        </div>
        <button 
          type="button"
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

      {/* Filter Tabs */}
      <div className="bg-white px-6 py-3 border-b border-gray-100">
        <Tabs value={filterType} onValueChange={(v) => setFilterType(v as 'all' | 'today' | 'week')}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Export Button */}
      <div className="px-6 py-3 bg-white border-b border-gray-100">
        <Button variant="outline" className="w-full" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export Journal (PDF)
        </Button>
      </div>

      {/* Journal Entries */}
      <div className="px-4 py-4 space-y-6">
        {Object.keys(groupedEntries).length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No journal entries found</p>
            <p className="text-gray-400 text-sm mt-1">Resolved alarms will appear here</p>
          </div>
        ) : (
          Object.entries(groupedEntries).map(([date, entries]) => (
            <div key={date}>
              {/* Date Header */}
              <div className="flex items-center gap-2 mb-3 px-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <p className="text-gray-700">{date}</p>
              </div>

              {/* Entries for this date */}
              <div className="space-y-3">
                {entries.map((entry) => (
                  <Card key={entry.id} className="border-l-4 border-l-teal-700 shadow-sm">
                    <CardContent className="p-4">
                      {/* Header: Patient & Alarm Type */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <ImageWithFallback 
                              src={entry.patientAvatar} 
                              alt={entry.patientName} 
                              className="w-full h-full object-cover" 
                            />
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{entry.patientName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={`${getAlarmTypeColor(entry.alarmType)} border text-xs px-2 py-0.5`}>
                                <span className="mr-1">{getAlarmTypeIcon(entry.alarmType)}</span>
                                {entry.alarmType}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Alarm Details */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-2">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500">Detected</p>
                            <p className="text-sm text-gray-900">{entry.alarmValue}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{entry.detectedTime}</p>
                          </div>
                        </div>
                      </div>

                      {/* Handler Info */}
                      <div className="flex items-center gap-4 mb-3 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          <span>{entry.handledBy}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Resolved: {new Date(entry.resolvedAt).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true 
                          })}</span>
                        </div>
                      </div>

                      {/* Resolution Details */}
                      {entry.selectedOptions.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs text-gray-500 mb-1">Actions Taken:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {entry.selectedOptions.map((option, idx) => (
                              <Badge 
                                key={idx} 
                                variant="secondary" 
                                className="bg-green-50 text-green-700 hover:bg-green-50 text-xs"
                              >
                                {option}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Free Text Notes */}
                      {entry.freeTextNotes && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 mt-2">
                          <p className="text-xs text-amber-900">
                            <span className="font-medium">Note: </span>
                            {entry.freeTextNotes}
                          </p>
                        </div>
                      )}

                      {/* Original Alarm Notes */}
                      {entry.alarmNotes && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">Context: </span>
                            {entry.alarmNotes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
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
          <button 
            onClick={() => navigate('clients')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-700"
          >
            <ClientsIcon className="w-6 h-6" />
            <span className="text-xs">Clients</span>
          </button>
          <div className="flex flex-col items-center gap-1 text-gray-500">
            <TasksIcon className="w-6 h-6" />
            <span className="text-xs">Tasks</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-gray-700">
            <JournalIcon className="w-6 h-6" />
            <span className="text-xs">Journal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
