
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, ExternalLink } from "lucide-react";

interface Event {
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  type: 'virtual' | 'offline' | 'hybrid';
  registrationOpen: boolean;
  maxParticipants?: number;
  prize?: string;
  description: string;
  website?: string;
  organizer: string;
}

interface EventCardProps {
  event: Event;
  compact?: boolean;
  active?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, compact = false, active = false }) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'virtual': return 'bg-blue-100 text-blue-800';
      case 'offline': return 'bg-green-100 text-green-800';
      case 'hybrid': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (compact) {
    return (
      <Card className={`hover:shadow-md transition-shadow ${active ? 'border-green-300 bg-green-50' : ''}`}>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-sm text-gray-900 leading-tight">{event.name}</h3>
              {active && <Badge className="bg-green-500 text-white text-xs">Live</Badge>}
            </div>
            
            <div className="flex items-center text-xs text-gray-600">
              <Clock className="h-3 w-3 mr-1" />
              {formatDate(event.startDate)}
            </div>
            
            <div className="flex items-center text-xs text-gray-600">
              <MapPin className="h-3 w-3 mr-1" />
              {event.location}
            </div>
            
            <div className="flex items-center justify-between">
              <Badge className={`text-xs ${getTypeColor(event.type)}`}>
                {event.type}
              </Badge>
              {event.registrationOpen && (
                <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                  Open
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{event.name}</h3>
              <p className="text-gray-600 text-sm mt-1">by {event.organizer}</p>
            </div>
            <Badge className={getTypeColor(event.type)}>
              {event.type}
            </Badge>
          </div>
          
          <p className="text-gray-700">{event.description}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              {formatDate(event.startDate)} - {formatDate(event.endDate)}
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              {event.location}
            </div>
            {event.maxParticipants && (
              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                Max {event.maxParticipants} participants
              </div>
            )}
            {event.prize && (
              <div className="flex items-center text-green-600 font-semibold">
                🏆 {event.prize}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-4">
            <div className="flex space-x-2">
              {event.registrationOpen ? (
                <Badge className="bg-green-100 text-green-800">Registration Open</Badge>
              ) : (
                <Badge variant="secondary">Registration Closed</Badge>
              )}
            </div>
            
            {event.website && (
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <ExternalLink className="h-4 w-4 mr-2" />
                Register
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
