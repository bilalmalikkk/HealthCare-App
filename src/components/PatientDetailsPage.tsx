import { ChevronLeft, MoreVertical, Calendar, Languages, MapPin, Phone, AlertCircle, MessageSquare, ChevronRight, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import exampleImage from 'figma:asset/87c0bedd0b2fd346e1cb70f884e9d43734dc98ee.png';

interface PatientDetailsPageProps {
  navigate: (page: string, patientId?: number) => void;
  patientId: number;
  alarmCount: number;
}

export default function PatientDetailsPage({ navigate, patientId, alarmCount }: PatientDetailsPageProps) {
  const patientData = {
    name: "Jenny Wilson",
    gender: "Female",
    age: "78 Years",
    avatar: exampleImage,
    nextVisit: {
      date: "Wednesday, 14th Aug 2024",
      time: "09:30 AM - 7:30 PM"
    },
    birthDate: "16th Aug, 1981",
    languages: "English, Spanish",
    address: "3891 Ranchview Dr. Richardson, California",
    phone: "+1 123 456 7890"
  };

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
          <ImageWithFallback src={patientData.avatar} alt={patientData.name} className="w-full h-full object-cover" />
        </Avatar>
        <h2 className="mb-1">{patientData.name}</h2>
        <p className="text-gray-500">
          {patientData.gender} · {patientData.age}
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
        {/* Next Visit */}
        <div className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
          <p className="text-gray-600 text-sm mb-3">Next Visit Scheduled On</p>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <p className="text-gray-900">{patientData.nextVisit.date}</p>
              <p className="text-gray-500 text-sm">{patientData.nextVisit.time}</p>
            </div>
          </div>
        </div>

        {/* Other Details */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          {/* Birth Date */}
          <div className="flex items-center gap-3 py-4 border-b border-gray-100">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="text-gray-900">{patientData.birthDate}</span>
          </div>

          {/* Languages */}
          <div className="flex items-center gap-3 py-4 border-b border-gray-100">
            <Languages className="w-5 h-5 text-gray-600" />
            <span className="text-gray-900">{patientData.languages}</span>
          </div>

          {/* Address */}
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div className="flex items-center gap-3 flex-1">
              <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0" />
              <span className="text-gray-900">{patientData.address}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 ml-2" />
          </div>

          {/* Phone */}
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">{patientData.phone}</span>
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
