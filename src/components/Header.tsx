
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Bell, CalendarDays, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import SignupModal from "./SignupModal";

const Header = () => {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You've been logged out of your account.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign out failed",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

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
            
            {user && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 hidden sm:block">
                  Welcome, {user.email?.split('@')[0]}
                </span>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            )}
            
            <Button 
              onClick={() => setIsSignupOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
            >
              <User className="h-4 w-4 mr-2" />
              Subscribe
            </Button>
          </div>
        </div>
      </div>
      
      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    </header>
  );
};

export default Header;
