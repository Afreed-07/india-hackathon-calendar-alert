import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Bell, Mail, User, MapPin } from "lucide-react";
import { signupUser, SignupData } from "@/utils/apiClient";
import { validateEmail, validateName, validateCity, sanitizeInput } from "@/utils/inputValidation";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<SignupData>({
    name: '',
    email: '',
    city: '',
    notifications: {
      dailyUpdates: true,
      eventReminders: true,
      weeklyDigest: false
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error!;
    }

    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error!;
    }

    const cityValidation = validateCity(formData.city);
    if (!cityValidation.isValid) {
      newErrors.city = cityValidation.error!;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Sanitize inputs before sending
      const sanitizedData = {
        ...formData,
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email.toLowerCase()),
        city: sanitizeInput(formData.city)
      };

      await signupUser(sanitizedData);
      
      toast({
        title: "Welcome to HackIndia! 🎉",
        description: "You'll start receiving daily hackathon updates every morning at 9 AM IST.",
      });
      
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        city: '',
        notifications: {
          dailyUpdates: true,
          eventReminders: true,
          weeklyDigest: false
        }
      });
      setErrors({});
    } catch (error) {
      console.error('Signup error:', error);
      let errorMessage = "Please try again later.";
      
      if (error instanceof Error) {
        if (error.message.includes('email already registered') || error.message.includes('Email already registered')) {
          errorMessage = "This email is already registered. Please use a different email address.";
        } else if (error.message.includes('rate limit') || error.message.includes('Too many requests')) {
          errorMessage = "Too many signup attempts. Please wait a few minutes and try again.";
        } else if (error.message.includes('Invalid email')) {
          errorMessage = "Please enter a valid email address.";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNotificationChange = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: checked
      }
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Join HackIndia Free! 🚀
          </DialogTitle>
          <p className="text-gray-600 text-center">
            Get daily updates on hackathons across India
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="flex items-center text-sm font-medium">
                <User className="h-4 w-4 mr-2" />
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                required
                className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
                maxLength={100}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <Label htmlFor="email" className="flex items-center text-sm font-medium">
                <Mail className="h-4 w-4 mr-2" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
                required
                className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
                maxLength={254}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <Label htmlFor="city" className="flex items-center text-sm font-medium">
                <MapPin className="h-4 w-4 mr-2" />
                City
              </Label>
              <Input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Mumbai, Delhi, Bangalore..."
                required
                className={`mt-1 ${errors.city ? 'border-red-500' : ''}`}
                maxLength={50}
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
          </div>
          
          <div className="space-y-3">
            <Label className="flex items-center text-sm font-medium">
              <Bell className="h-4 w-4 mr-2" />
              Notification Preferences
            </Label>
            
            <div className="space-y-3 pl-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dailyUpdates"
                  checked={formData.notifications.dailyUpdates}
                  onCheckedChange={(checked) => handleNotificationChange('dailyUpdates', checked as boolean)}
                />
                <Label htmlFor="dailyUpdates" className="text-sm">
                  Daily morning updates (9 AM IST)
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="eventReminders"
                  checked={formData.notifications.eventReminders}
                  onCheckedChange={(checked) => handleNotificationChange('eventReminders', checked as boolean)}
                />
                <Label htmlFor="eventReminders" className="text-sm">
                  Event registration reminders
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="weeklyDigest"
                  checked={formData.notifications.weeklyDigest}
                  onCheckedChange={(checked) => handleNotificationChange('weeklyDigest', checked as boolean)}
                />
                <Label htmlFor="weeklyDigest" className="text-sm">
                  Weekly digest (Sundays)
                </Label>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">What you'll get:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Daily hackathon updates every morning</li>
              <li>• Priority notifications for Indian events</li>
              <li>• Registration deadline reminders</li>
              <li>• Free access to all features</li>
            </ul>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
            disabled={isLoading}
          >
            {isLoading ? "Setting up your account..." : "Start Getting Updates 🎯"}
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            By signing up, you agree to receive hackathon notifications. Unsubscribe anytime.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignupModal;
