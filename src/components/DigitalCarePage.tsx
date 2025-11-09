import { ChevronLeft, Bell, Camera, Moon, Maximize2, Download, Video, Eye, EyeOff, Wifi, WifiOff, Play, Square } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import exampleImage from 'figma:asset/87c0bedd0b2fd346e1cb70f884e9d43734dc98ee.png';
import irCameraImage from 'figma:asset/2e26288dd1d5130f2fcf37a88e7c9630fb970e5a.png';
import { useState, useEffect } from 'react';

interface DigitalCarePageProps {
  navigate: (page: string, patientId?: number) => void;
  patientId: number;
  alarmCount: number;
}

export default function DigitalCarePage({ navigate, patientId, alarmCount }: DigitalCarePageProps) {
  const [selectedCamera, setSelectedCamera] = useState(0);
  const [nightVision, setNightVision] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  // Timer effect for 20-second camera activation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, remainingTime]);

  const handleStart = () => {
    setIsActive(true);
    setRemainingTime(20);
  };

  const handleStop = () => {
    setIsActive(false);
    setRemainingTime(0);
  };

  // Patient data based on patientId
  const patients = [
    { id: 1, name: "Jenny Wilson", avatar: "https://images.unsplash.com/photo-1594751543129-6701ad444259?w=100&h=100&fit=crop" },
    { id: 2, name: "Jacob Jones", avatar: "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=100&h=100&fit=crop" },
    { id: 3, name: "Darrell Steward", avatar: "https://images.unsplash.com/photo-1595429035839-c99c298ffdde?w=100&h=100&fit=crop" },
    { id: 4, name: "Devon Lane", avatar: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=100&h=100&fit=crop" },
    { id: 5, name: "Albert Flores", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop" },
    { id: 6, name: "Courtney Henry", avatar: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=100&h=100&fit=crop" },
    { id: 7, name: "Kristin Watson", avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=100&h=100&fit=crop" }
  ];

  const patientData = patients.find(p => p.id === patientId) || patients[0];

  const cameras = [
    {
      id: 0,
      name: "Bedroom",
      location: "Main bedroom",
      imageUrl: "https://images.unsplash.com/photo-1722607760671-0b3555fe53eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwYmVkcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc2MjY3ODAwNnww&ixlib=rb-4.1.0&q=80&w=1080",
      lastActivity: "2 min ago",
      isIR: false
    },
    {
      id: 1,
      name: "Living Room",
      location: "Common area",
      imageUrl: "https://images.unsplash.com/photo-1724582586529-62622e50c0b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZpbmclMjByb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYyNjcxODg1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      lastActivity: "5 min ago",
      isIR: false
    },
    {
      id: 2,
      name: "Bathroom",
      location: "Privacy area",
      imageUrl: irCameraImage,
      lastActivity: "15 min ago",
      isIR: true
    }
  ];

  const currentCamera = cameras[selectedCamera];

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-24 pt-7">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <button 
          type="button"
          onClick={() => {
            console.log('Back button clicked, navigating to patient:', patientId);
            navigate('patient', patientId);
          }} 
          className="p-3 -ml-3 hover:bg-gray-100 rounded-full transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h2 className="flex-1 text-center -ml-12">Digital Care</h2>
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
              <p className="text-gray-500 text-xs">Privacy-protected monitoring</p>
            </div>
          </div>
          {isActive && (
            <Badge className="bg-green-50 text-green-700 hover:bg-green-50">
              Active: {remainingTime}s
            </Badge>
          )}
        </div>
      </div>

      {/* Main Camera View */}
      <div className="px-4 pt-4">
        <div className="relative bg-black rounded-2xl overflow-hidden shadow-lg">
          {/* Camera Feed */}
          <div className="relative aspect-[4/3]">
            {!isActive ? (
              <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center">
                <Camera className="w-12 h-12 text-gray-500 mb-2" />
                <p className="text-gray-400 text-sm">Camera Inactive</p>
                <p className="text-gray-500 text-xs mt-1">Press Start to activate (20s)</p>
              </div>
            ) : privacyMode ? (
              <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center">
                <EyeOff className="w-12 h-12 text-gray-500 mb-2" />
                <p className="text-gray-400 text-sm">Privacy Mode Active</p>
              </div>
            ) : (
              <ImageWithFallback 
                src={currentCamera.imageUrl} 
                alt={currentCamera.name}
                className={`w-full h-full ${currentCamera.isIR ? 'object-contain bg-black' : 'object-cover'} ${
                  !currentCamera.isIR && nightVision ? 'grayscale contrast-125' : ''
                }`}
              />
            )}
            
            {/* Camera Overlay Info */}
            {isActive && !privacyMode && (
              <>
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <Badge className="bg-black/60 text-white hover:bg-black/60 backdrop-blur-sm border-none">
                    <Camera className="w-3 h-3 mr-1" />
                    {currentCamera.name}
                  </Badge>
                  {selectedCamera === 2 && (
                    <Badge className="bg-orange-900/80 text-white hover:bg-orange-900/80 backdrop-blur-sm border-none">
                      IR Sensor
                    </Badge>
                  )}
                  {nightVision && selectedCamera !== 2 && (
                    <Badge className="bg-purple-900/80 text-white hover:bg-purple-900/80 backdrop-blur-sm border-none">
                      <Moon className="w-3 h-3 mr-1" />
                      Night Vision
                    </Badge>
                  )}
                </div>

                <div className="absolute top-3 right-3">
                  <Badge className="bg-red-600/90 text-white hover:bg-red-600/90 backdrop-blur-sm border-none">
                    {remainingTime}s
                  </Badge>
                </div>

                <div className="absolute bottom-3 left-3">
                  <p className="text-white text-xs bg-black/60 backdrop-blur-sm px-2 py-1 rounded">
                    Last activity: {currentCamera.lastActivity}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Camera Controls */}
          <div className="bg-gray-900/95 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {!isActive ? (
                <Button 
                  size="sm" 
                  className="h-8 bg-green-600 hover:bg-green-700 text-white px-4"
                  onClick={handleStart}
                >
                  <Play className="w-4 h-4 mr-1" />
                  Start
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  className="h-8 bg-red-600 hover:bg-red-700 text-white px-4"
                  onClick={handleStop}
                >
                  <Square className="w-4 h-4 mr-1" />
                  Stop
                </Button>
              )}
              <Button 
                size="sm" 
                variant={privacyMode ? "secondary" : "ghost"}
                className={`h-8 ${privacyMode ? 'bg-teal-700 hover:bg-teal-800 text-white' : 'text-white hover:bg-white/10'}`}
                onClick={() => setPrivacyMode(!privacyMode)}
                disabled={!isActive}
              >
                {privacyMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button 
                size="sm" 
                variant={nightVision ? "secondary" : "ghost"}
                className={`h-8 ${nightVision ? 'bg-purple-700 hover:bg-purple-800 text-white' : 'text-white hover:bg-white/10'}`}
                onClick={() => setNightVision(!nightVision)}
                disabled={!isActive}
              >
                <Moon className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="h-8 text-white hover:bg-white/10" disabled={!isActive}>
                <Download className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 text-white hover:bg-white/10" disabled={!isActive}>
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Camera Selector */}
        <div className="mt-4 mb-4">
          <h3 className="mb-3 px-1">Available Cameras</h3>
          <div className="grid grid-cols-3 gap-3">
            {cameras.map((camera) => (
              <button
                key={camera.id}
                onClick={() => setSelectedCamera(camera.id)}
                className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                  selectedCamera === camera.id 
                    ? 'border-teal-700 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="aspect-[4/3] bg-gray-100">
                  <ImageWithFallback 
                    src={camera.imageUrl} 
                    alt={camera.name}
                    className={`w-full h-full ${camera.isIR ? 'object-contain bg-black' : 'object-cover'}`}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-1 left-1 right-1">
                  <p className="text-white text-xs truncate">{camera.name}</p>
                </div>
                {selectedCamera === camera.id && (
                  <div className="absolute top-1 right-1">
                    <div className="w-2 h-2 bg-teal-500 rounded-full border border-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
