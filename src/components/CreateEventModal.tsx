
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar, MapPin, Users, Award, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createEvent } from "@/utils/eventApi";
import { debugAuthState } from "@/utils/authDebug";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    type: 'virtual' as 'virtual' | 'offline' | 'hybrid',
    max_participants: '',
    prize: '',
    website: '',
    organizer: '',
    registration_open: true
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  console.log('CreateEventModal - User state:', user);
  console.log('CreateEventModal - Modal isOpen:', isOpen);

  const createEventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      console.log('Event created successfully');
      queryClient.invalidateQueries({ queryKey: ['user-events'] });
      toast({
        title: "Event created successfully!",
        description: "Your hackathon event has been added to the calendar.",
      });
      onClose();
      setFormData({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        location: '',
        type: 'virtual',
        max_participants: '',
        prize: '',
        website: '',
        organizer: '',
        registration_open: true
      });
    },
    onError: (error) => {
      console.error('Event creation error:', error);
      toast({
        title: "Failed to create event",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started');
    console.log('Form data:', formData);
    console.log('User authenticated:', !!user);
    
    // Run auth debug to get detailed information
    await debugAuthState();
    
    if (!user) {
      console.error('User not authenticated');
      toast({
        title: "Authentication required",
        description: "Please log in to create events.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.name || !formData.description || !formData.start_date || !formData.end_date || !formData.location || !formData.organizer) {
      console.error('Missing required fields');
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    console.log('Validation passed, creating event...');

    createEventMutation.mutate({
      name: formData.name,
      description: formData.description,
      start_date: formData.start_date,
      end_date: formData.end_date,
      location: formData.location,
      type: formData.type,
      max_participants: formData.max_participants ? parseInt(formData.max_participants) : undefined,
      prize: formData.prize || undefined,
      website: formData.website || undefined,
      organizer: formData.organizer,
      registration_open: formData.registration_open
    });
  };

  // Don't render modal if user is not authenticated
  if (!user) {
    console.log('User not authenticated, not rendering modal');
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Create New Hackathon Event
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Event Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter event name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="organizer">Organizer *</Label>
              <Input
                id="organizer"
                value={formData.organizer}
                onChange={(e) => setFormData(prev => ({ ...prev, organizer: e.target.value }))}
                placeholder="Event organizer"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your hackathon event"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date *</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Event location"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Event Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="virtual">Virtual</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_participants">Max Participants</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="max_participants"
                  type="number"
                  value={formData.max_participants}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_participants: e.target.value }))}
                  placeholder="Optional"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prize">Prize Pool</Label>
              <div className="relative">
                <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="prize"
                  value={formData.prize}
                  onChange={(e) => setFormData(prev => ({ ...prev, prize: e.target.value }))}
                  placeholder="e.g., $10,000"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website URL</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://example.com"
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="registration_open"
              checked={formData.registration_open}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, registration_open: checked }))}
            />
            <Label htmlFor="registration_open">Registration Open</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createEventMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createEventMutation.isPending ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventModal;
