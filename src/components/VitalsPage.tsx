import { ChevronLeft, MoreVertical, Thermometer, Heart, Activity, Droplets, Wind, Weight, Bell } from 'lucide-react';
import { Avatar } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import exampleImage from 'figma:asset/87c0bedd0b2fd346e1cb70f884e9d43734dc98ee.png';

interface VitalsPageProps {
  navigate: (page: string, patientId?: number) => void;
  patientId: number;
  alarmCount: number;
}

export default function VitalsPage({ navigate, patientId, alarmCount }: VitalsPageProps) {
  const patientData = {
    name: "Jenny Wilson",
    gender: "Female",
    age: "78 Years",
    avatar: exampleImage
  };

  const vitals = [
    {
      icon: <Thermometer className="w-5 h-5" />,
      label: "Temperature",
      value: "98 °F",
      date: "Aug 16, 2024"
    },
    {
      icon: <Heart className="w-5 h-5" />,
      label: "Heart Rate",
      value: "62 BPM",
      date: "Aug 16, 2024"
    },
    {
      icon: <Activity className="w-5 h-5" />,
      label: "Respiratory Rate",
      value: "14 BPM",
      date: "Aug 16, 2024"
    },
    {
      icon: <Droplets className="w-5 h-5" />,
      label: "Blood Pressure",
      value: "120 mm Hg",
      date: "Aug 16, 2024"
    },
    {
      icon: <Wind className="w-5 h-5" />,
      label: "Blood Oxygen",
      value: "98 %",
      date: "Aug 16, 2024"
    },
    {
      icon: <Weight className="w-5 h-5" />,
      label: "Weight",
      value: "65 Kg",
      date: "Aug 16, 2024"
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
          <ImageWithFallback src={patientData.avatar} alt={patientData.name} className="w-full h-full object-cover" />
        </Avatar>
        <h2 className="mb-1">{patientData.name}</h2>
        <p className="text-gray-500">
          {patientData.gender} · {patientData.age}
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
      </div>
    </div>
  );
}
