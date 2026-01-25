import { ChevronLeft, Phone, ChevronRight } from 'lucide-react';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface StaffListViewProps {
  onBack: () => void;
}

// On-duty staff data
const onDutyStaff = [
  {
    name: "Ingrid Hansen",
    title: "Nurse",
    phone: "+47 912 34 567",
    avatar: "https://ui-avatars.com/api/?name=Ingrid+Hansen&background=0D9488&color=fff"
  },
  {
    name: "Lars Olsen",
    title: "Care Worker",
    phone: "+47 923 45 678",
    avatar: "https://ui-avatars.com/api/?name=Lars+Olsen&background=14B8A6&color=fff"
  },
  {
    name: "Kari Andersen",
    title: "Nurse",
    phone: "+47 934 56 789",
    avatar: "https://ui-avatars.com/api/?name=Kari+Andersen&background=0D9488&color=fff"
  },
  {
    name: "Erik Johansen",
    title: "Care Worker",
    phone: "+47 945 67 890",
    avatar: "https://ui-avatars.com/api/?name=Erik+Johansen&background=14B8A6&color=fff"
  },
  {
    name: "Solveig Berg",
    title: "Nurse",
    phone: "+47 956 78 901",
    avatar: "https://ui-avatars.com/api/?name=Solveig+Berg&background=0D9488&color=fff"
  },
  {
    name: "Magnus Nilsen",
    title: "Care Worker",
    phone: "+47 967 89 012",
    avatar: "https://ui-avatars.com/api/?name=Magnus+Nilsen&background=14B8A6&color=fff"
  }
];

export default function StaffListView({ onBack }: StaffListViewProps) {
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pt-7">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="flex items-center gap-2 text-teal-900">
          <Phone className="w-5 h-5 text-teal-700" />
          On-Duty Staff
        </h2>
        <div className="w-10"></div>
      </div>
      
      {/* Staff List */}
      <div className="px-6 py-4 space-y-3">
        {onDutyStaff.map((staff, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl border border-gray-200 p-4 hover:border-teal-200 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
              <Avatar className="w-12 h-12">
                <ImageWithFallback src={staff.avatar} alt={staff.name} className="w-full h-full object-cover" />
              </Avatar>
              <div className="flex-1">
                <p className="text-gray-900">{staff.name}</p>
                <Badge 
                  variant="outline" 
                  className={`mt-1 ${staff.title === "Nurse" ? "bg-teal-50 text-teal-700 border-teal-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}
                >
                  {staff.title}
                </Badge>
              </div>
            </div>
            
            {/* Phone Number */}
            <a 
              href={`tel:${staff.phone}`}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-teal-50 transition-colors group"
            >
              <Phone className="w-5 h-5 text-gray-500 group-hover:text-teal-700" />
              <span className="text-gray-900 group-hover:text-teal-900">{staff.phone}</span>
              <ChevronRight className="w-5 h-5 text-gray-400 ml-auto group-hover:text-teal-600" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
