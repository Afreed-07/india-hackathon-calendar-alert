
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Mail, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { validateEmail, validateName, validateCity, validatePassword, sanitizeInput } from "@/utils/inputValidation";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    city: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error!;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error!;
    }

    if (!isLogin) {
      const nameValidation = validateName(formData.name);
      if (!nameValidation.isValid) {
        newErrors.name = nameValidation.error!;
      }

      const cityValidation = validateCity(formData.city);
      if (!cityValidation.isValid) {
        newErrors.city = cityValidation.error!;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting login with email:', formData.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizeInput(formData.email.toLowerCase()),
        password: formData.password,
      });

      console.log('Login response:', { data, error });

      if (error) {
        console.error('Login error details:', error);
        let errorMessage = error.message;
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
        }

        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      console.log('Login successful, redirecting...');
      toast({
        title: "Welcome back! 🎉",
        description: "You've successfully logged in.",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Login exception:', error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting signup with email:', formData.email);
      const redirectUrl = `${window.location.origin}/`;
      console.log('Redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email: sanitizeInput(formData.email.toLowerCase()),
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: sanitizeInput(formData.name),
          }
        }
      });

      console.log('Signup response:', { data, error });

      if (error) {
        console.error('Signup error details:', error);
        let errorMessage = error.message;
        
        if (error.message.includes('Signups not allowed for this instance')) {
          errorMessage = "Account creation is currently disabled. Please contact support or try again later.";
          console.error('SIGNUP DISABLED: Check Supabase dashboard Authentication > Settings > User Signups');
        } else if (error.message.includes('already registered')) {
          errorMessage = "This email is already registered. Please try logging in instead.";
          setIsLogin(true);
        } else if (error.message.includes('weak password')) {
          errorMessage = "Password is too weak. Please choose a stronger password.";
        }
        
        toast({
          title: "Signup Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      console.log('Signup successful, user created:', data.user?.id);

      // Update the profile with city information
      if (data.user) {
        console.log('Updating user profile with city...');
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ city: sanitizeInput(formData.city) })
          .eq('id', data.user.id);

        if (profileError) {
          console.error('Profile update error:', profileError);
        } else {
          console.log('Profile updated successfully');
        }
      }

      toast({
        title: "Account Created! 🎉",
        description: "Please check your email to verify your account.",
      });
      
      setIsLogin(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        city: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Signup exception:', error);
      toast({
        title: "Signup Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg">
              <CalendarDays className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">HackIndia</h1>
              <p className="text-sm text-gray-600">Your Gateway to Hackathons</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {isLogin ? 'Welcome Back' : 'Join HackIndia'}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Sign in to access your hackathon dashboard' 
                : 'Create your account to start discovering hackathons'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
              {!isLogin && (
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
              )}

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
                <Label htmlFor="password" className="flex items-center text-sm font-medium">
                  <Lock className="h-4 w-4 mr-2" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  required
                  className={`mt-1 ${errors.password ? 'border-red-500' : ''}`}
                  maxLength={128}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {!isLogin && (
                <div>
                  <Label htmlFor="city" className="flex items-center text-sm font-medium">
                    <CalendarDays className="h-4 w-4 mr-2" />
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
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                disabled={isLoading}
              >
                {isLoading ? (isLogin ? "Signing in..." : "Creating account...") : (isLogin ? "Sign In" : "Create Account")}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrors({});
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
