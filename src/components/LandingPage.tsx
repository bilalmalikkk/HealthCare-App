import { Heart, Activity, Users, Shield, ChevronRight, Bell, Monitor, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface LandingPageProps {
  navigate: (page: string) => void;
  currentUser?: string;
  alarmCount: number;
}

export default function LandingPage({ navigate, currentUser, alarmCount }: LandingPageProps) {
  const features = [
    {
      icon: alarmCount > 0 ? (
        <div className="relative">
          <Bell className="w-8 h-8" />
          <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 bg-red-500 hover:bg-red-500 text-white text-xs rounded-full">
            {alarmCount}
          </Badge>
        </div>
      ) : (
        <Bell className="w-8 h-8" />
      ),
      title: "Emergency Response",
      description: "Instant emergency contact and alert system",
      clickable: true,
      page: 'alarms'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Digital Care",
      description: "Remote monitoring and vital signs tracking.",
      clickable: true,
      page: 'clients'
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Care Journal",
      description: "View complete history of all resolved alarms",
      clickable: true,
      page: 'journal'
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Medical Support",
      description: "Professional healthcare support at your fingertips",
      clickable: false
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Care Team Connection",
      description: "Stay connected with your dedicated care team",
      clickable: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Header with User Info and Notification Bell */}
      <div className="max-w-md mx-auto px-6 pt-10 pb-4">
        <div className="flex items-center justify-between">
          {/* User Welcome */}
          {currentUser && (
            <div>
              <p className="text-gray-500 text-sm">Welcome back,</p>
              <p className="text-teal-800">{currentUser}</p>
            </div>
          )}
          {!currentUser && <div></div>}
          
          {/* Notification Bell */}
          <button 
            onClick={() => navigate('alarms')}
            className="relative p-2 hover:bg-teal-100 rounded-full transition-colors"
          >
            <Bell className="w-6 h-6 text-teal-700" />
            {alarmCount > 0 && (
              <Badge className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center p-0 bg-red-500 hover:bg-red-500 text-white border-2 border-white rounded-full">
                {alarmCount}
              </Badge>
            )}
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-md mx-auto px-6 pt-4 pb-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-700 rounded-3xl mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="mb-4">ElderCare Home</h1>
          <p className="text-gray-600 text-lg">
            Premium medical care and monitoring for your loved ones at home
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-4 mb-12">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`border-none shadow-sm hover:shadow-md transition-shadow ${feature.clickable ? 'cursor-pointer' : ''}`}
              onClick={feature.clickable ? () => navigate(feature.page!) : undefined}
            >
              <CardContent className="flex items-start gap-4 p-6">
                <div className="text-teal-700 flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="mb-1">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full h-14 border-teal-700 text-teal-700 hover:bg-teal-50"
          >
            Learn More
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            Trusted by thousands of families worldwide
          </p>
        </div>
      </div>
    </div>
  );
}
