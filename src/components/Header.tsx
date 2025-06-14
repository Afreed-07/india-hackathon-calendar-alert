
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Bell, CalendarDays, User } from "lucide-react";
import SignupModal from "./SignupModal";

const Header = () => {
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg">
              <CalendarDays className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">HackIndia</h1>
              <p className="text-xs text-gray-600">Your Gateway to Hackathons</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button 
              onClick={() => setIsSignupOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
            >
              <User className="h-4 w-4 mr-2" />
              Sign Up Free
            </Button>
          </div>
        </div>
      </div>
      
      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    </header>
  );
};

export default Header;
