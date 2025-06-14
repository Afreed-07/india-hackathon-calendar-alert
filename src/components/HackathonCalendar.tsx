
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Clock, Users, ChevronLeft, ChevronRight } from "lucide-react";
import EventCard from "./EventCard";
import { hackathonEvents } from "@/data/hackathonData";

const HackathonCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filteredEvents, setFilteredEvents] = useState(hackathonEvents);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredEvents(hackathonEvents);
    } else {
      setFilteredEvents(hackathonEvents.filter(event => event.type === selectedFilter));
    }
  }, [selectedFilter]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredEvents.filter(event => 
      event.startDate <= dateStr && event.endDate >= dateStr
    );
  };

  const upcomingEvents = filteredEvents
    .filter(event => new Date(event.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 6);

  const activeEvents = filteredEvents
    .filter(event => {
      const today = new Date().toISOString().split('T')[0];
      return event.startDate <= today && event.endDate >= today;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Active Hackathons</p>
                <p className="text-3xl font-bold">{activeEvents.length}</p>
              </div>
              <CalendarDays className="h-10 w-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Upcoming Events</p>
                <p className="text-3xl font-bold">{upcomingEvents.length}</p>
              </div>
              <Clock className="h-10 w-10 text-orange-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Total Events</p>
                <p className="text-3xl font-bold">{filteredEvents.length}</p>
              </div>
              <Users className="h-10 w-10 text-green-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Section */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'virtual', 'offline', 'hybrid'].map(filter => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter)}
              className={selectedFilter === filter ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                  <div key={`empty-${index}`} className="p-2 h-20"></div>
                ))}
                
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const events = getEventsForDate(day);
                  const isToday = new Date().getDate() === day && 
                                 new Date().getMonth() === currentDate.getMonth() && 
                                 new Date().getFullYear() === currentDate.getFullYear();
                  
                  return (
                    <div 
                      key={day} 
                      className={`p-2 h-20 border border-gray-200 hover:bg-gray-50 transition-colors ${
                        isToday ? 'bg-blue-50 border-blue-300' : ''
                      }`}
                    >
                      <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                        {day}
                      </div>
                      <div className="mt-1 space-y-1">
                        {events.slice(0, 2).map((event, eventIndex) => (
                          <div 
                            key={eventIndex}
                            className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate"
                          >
                            {event.name}
                          </div>
                        ))}
                        {events.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{events.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-orange-500" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <EventCard key={index} event={event} compact />
              ))}
            </CardContent>
          </Card>

          {activeEvents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="h-5 w-5 mr-2 text-green-500" />
                  Active Now
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeEvents.map((event, index) => (
                  <EventCard key={index} event={event} compact active />
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default HackathonCalendar;
