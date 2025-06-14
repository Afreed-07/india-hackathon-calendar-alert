
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings, Bell, Mail, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getUserPreferences, updateUserPreferences } from "@/utils/eventApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const UserPreferences: React.FC = () => {
  const [preferences, setPreferences] = useState({
    dark_mode: false,
    email_notifications: true,
    event_reminders: true
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: userPreferences, isLoading } = useQuery({
    queryKey: ['user-preferences'],
    queryFn: getUserPreferences,
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: updateUserPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
      toast({
        title: "Preferences updated",
        description: "Your preferences have been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update preferences",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (userPreferences) {
      setPreferences({
        dark_mode: userPreferences.dark_mode,
        email_notifications: userPreferences.email_notifications,
        event_reminders: userPreferences.event_reminders
      });
    }
  }, [userPreferences]);

  const handlePreferenceChange = (key: keyof typeof preferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const savePreferences = () => {
    updatePreferencesMutation.mutate(preferences);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          User Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Moon className="h-5 w-5 text-gray-600" />
              <div>
                <Label htmlFor="dark_mode" className="text-sm font-medium">
                  Dark Mode
                </Label>
                <p className="text-xs text-gray-500">
                  Enable dark theme for the interface
                </p>
              </div>
            </div>
            <Switch
              id="dark_mode"
              checked={preferences.dark_mode}
              onCheckedChange={(checked) => handlePreferenceChange('dark_mode', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-600" />
              <div>
                <Label htmlFor="email_notifications" className="text-sm font-medium">
                  Email Notifications
                </Label>
                <p className="text-xs text-gray-500">
                  Receive email updates about hackathons
                </p>
              </div>
            </div>
            <Switch
              id="email_notifications"
              checked={preferences.email_notifications}
              onCheckedChange={(checked) => handlePreferenceChange('email_notifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-gray-600" />
              <div>
                <Label htmlFor="event_reminders" className="text-sm font-medium">
                  Event Reminders
                </Label>
                <p className="text-xs text-gray-500">
                  Get reminders before hackathon events start
                </p>
              </div>
            </div>
            <Switch
              id="event_reminders"
              checked={preferences.event_reminders}
              onCheckedChange={(checked) => handlePreferenceChange('event_reminders', checked)}
            />
          </div>
        </div>

        <Button 
          onClick={savePreferences}
          disabled={updatePreferencesMutation.isPending}
          className="w-full"
        >
          {updatePreferencesMutation.isPending ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserPreferences;
