import { ReactNode } from 'react';
import { Wifi, Signal, Battery } from 'lucide-react';

interface PhoneFrameProps {
  children: ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      {/* Phone Frame */}
      <div className="relative bg-gray-200 rounded-[3rem] p-3 shadow-xl" style={{ width: '400px', height: '820px' }}>
        {/* Phone Border */}
        <div className="absolute inset-0 rounded-[3rem] border-4 border-gray-300"></div>
        
        {/* Top Speaker/Camera Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-200 rounded-b-3xl z-50 flex items-center justify-center gap-3">
          <div className="w-12 h-1.5 bg-gray-400 rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
        </div>

        {/* Screen Container */}
        <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
          {/* Android Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-7 bg-white z-40 px-6 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <span className="text-black">{currentTime}</span>
            </div>
            <div className="flex items-center gap-1.5 text-black">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* App Content */}
          <div className="w-full h-full overflow-auto phone-content-area">
            {children}
          </div>

          {/* Android Navigation Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-white border-t border-gray-100 z-40 flex items-center justify-center">
            <div className="flex items-center justify-center gap-16">
              {/* Back Button */}
              <button className="w-6 h-6 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </button>
              
              {/* Home Button */}
              <button className="w-6 h-6 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </button>
              
              {/* Recent Apps Button */}
              <button className="w-6 h-6 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Side Buttons */}
        <div className="absolute -right-1 top-32 w-1 h-16 bg-gray-400 rounded-r"></div>
        <div className="absolute -right-1 top-52 w-1 h-12 bg-gray-400 rounded-r"></div>
        <div className="absolute -left-1 top-40 w-1 h-16 bg-gray-400 rounded-l"></div>
      </div>
    </div>
  );
}
