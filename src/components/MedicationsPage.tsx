import { ChevronLeft, Bell, Pill, Clock, AlertTriangle, Package, Info } from 'lucide-react';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import exampleImage from 'figma:asset/87c0bedd0b2fd346e1cb70f884e9d43734dc98ee.png';

interface MedicationsPageProps {
  navigate: (page: string, patientId?: string) => void;
  patientId: string;
  alarmCount: number;
}

export default function MedicationsPage({ navigate, patientId, alarmCount }: MedicationsPageProps) {
  // Patient data based on patientId
  const patients = [
    { id: '1', name: "Jenny Wilson", avatar: exampleImage },
    { id: '2', name: "Jacob Jones", avatar: "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=100&h=100&fit=crop" },
    { id: '3', name: "Darrell Steward", avatar: "https://images.unsplash.com/photo-1595429035839-c99c298ffdde?w=100&h=100&fit=crop" },
    { id: '4', name: "Devon Lane", avatar: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=100&h=100&fit=crop" },
    { id: '5', name: "Albert Flores", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop" },
    { id: '6', name: "Courtney Henry", avatar: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=100&h=100&fit=crop" },
    { id: '7', name: "Kristin Watson", avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=100&h=100&fit=crop" }
  ];

  const patientData = patients.find(p => p.id === patientId) || patients[0];

  const medications = [
    {
      id: 1,
      name: "Aspirin",
      dosage: "100mg",
      frequency: "Once daily",
      time: "09:00 AM",
      stockLevel: 28,
      lowStock: false,
      nextDose: "Tomorrow, 09:00 AM",
      status: "taken"
    },
    {
      id: 2,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      time: "09:00 AM",
      stockLevel: 15,
      lowStock: true,
      nextDose: "Tomorrow, 09:00 AM",
      status: "taken",
      indication: "Blood pressure"
    },
    {
      id: 3,
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      time: "09:00 AM, 06:00 PM",
      stockLevel: 42,
      lowStock: false,
      nextDose: "Today, 06:00 PM",
      status: "pending",
      indication: "Diabetes"
    },
    {
      id: 4,
      name: "Atorvastatin",
      dosage: "20mg",
      frequency: "Once daily",
      time: "08:00 PM",
      stockLevel: 30,
      lowStock: false,
      nextDose: "Today, 08:00 PM",
      status: "pending",
      indication: "Cholesterol"
    },
    {
      id: 5,
      name: "Vitamin D3",
      dosage: "1000 IU",
      frequency: "Once daily",
      time: "09:00 AM",
      stockLevel: 8,
      lowStock: true,
      nextDose: "Tomorrow, 09:00 AM",
      status: "taken"
    }
  ];

  const todaySchedule = [
    { time: "09:00 AM", medications: ["Aspirin 100mg", "Lisinopril 10mg", "Metformin 500mg", "Vitamin D3 1000 IU"], status: "taken" },
    { time: "06:00 PM", medications: ["Metformin 500mg"], status: "pending" },
    { time: "08:00 PM", medications: ["Atorvastatin 20mg"], status: "pending" }
  ];

  const adherenceRate = 95;

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-24 pt-7">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <button 
          type="button"
          onClick={() => navigate('patient', patientId)} 
          className="p-3 -ml-3 hover:bg-gray-100 rounded-full transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center cursor-pointer relative"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700 absolute inset-0 m-auto" style={{ pointerEvents: 'none' }} />
        </button>
        <h2 className="flex-1 text-center -ml-12">Medications</h2>
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

      {/* Patient Info */}
      <div className="bg-white px-6 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <ImageWithFallback src={patientData.avatar} alt={patientData.name} className="w-full h-full object-cover" />
            </Avatar>
            <div>
              <p className="text-gray-900">{patientData.name}</p>
              <p className="text-gray-500 text-xs">5 active medications</p>
            </div>
          </div>
          <Badge className="bg-green-50 text-green-700 hover:bg-green-50">
            {adherenceRate}% Adherence
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white flex items-center justify-around px-2 border-b border-gray-200">
        <button 
          className="px-3 py-3 text-gray-500 text-sm hover:text-gray-900"
          onClick={() => navigate('patient', patientId)}
        >
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
        <button className="px-3 py-3 text-gray-900 text-sm border-b-2 border-teal-700">
          Medications
        </button>
        <button className="px-3 py-3 text-gray-500 text-sm">Care Team</button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
        <div className="flex gap-2">
          <Info className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
          <p className="text-blue-900 text-xs">Example view if connected to medication system. Read-only.</p>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="px-4 pt-4">
        <h3 className="mb-3 px-1">Today's Schedule</h3>
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          {todaySchedule.map((schedule, index) => (
            <div 
              key={index} 
              className={`flex items-start gap-3 ${index !== todaySchedule.length - 1 ? 'pb-4 mb-4 border-b border-gray-100' : ''}`}
            >
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  schedule.status === 'taken' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Clock className={`w-5 h-5 ${schedule.status === 'taken' ? 'text-green-700' : 'text-gray-500'}`} />
                </div>
                {index !== todaySchedule.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-gray-900">{schedule.time}</p>
                  {schedule.status === 'taken' ? (
                    <Badge className="bg-green-50 text-green-700 hover:bg-green-50 text-xs">
                      Taken ✓
                    </Badge>
                  ) : (
                    <Badge className="bg-orange-50 text-orange-700 hover:bg-orange-50 text-xs">
                      Pending
                    </Badge>
                  )}
                </div>
                <div className="space-y-1">
                  {schedule.medications.map((med, medIndex) => (
                    <p key={medIndex} className="text-gray-600 text-sm">• {med}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Medications */}
      <div className="px-4 pb-4">
        <h3 className="mb-3 px-1">All Medications</h3>
        <div className="space-y-3">
          {medications.map((med) => (
            <div key={med.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Pill className="w-5 h-5 text-teal-700" />
                  </div>
                  <div>
                    <p className="text-gray-900">{med.name}</p>
                    <p className="text-gray-600 text-sm">{med.dosage}</p>
                    {med.indication && (
                      <p className="text-gray-500 text-xs mt-1">{med.indication}</p>
                    )}
                  </div>
                </div>
                {med.lowStock && (
                  <Badge className="bg-orange-50 text-orange-700 hover:bg-orange-50 text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Low Stock
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Frequency</p>
                  <p className="text-gray-900 text-sm">{med.frequency}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Time</p>
                  <p className="text-gray-900 text-sm">{med.time}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Next Dose</p>
                  <p className="text-gray-900 text-sm">{med.nextDose}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    Stock Level
                  </p>
                  <p className={`text-sm ${med.lowStock ? 'text-orange-700' : 'text-gray-900'}`}>
                    {med.stockLevel} pills
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
