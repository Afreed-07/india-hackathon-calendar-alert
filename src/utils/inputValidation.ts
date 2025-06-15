
// Input validation utilities for frontend
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  if (email.length > 254) {
    return { isValid: false, error: 'Email address is too long' };
  }
  
  return { isValid: true };
};

export const validateName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'Name is required' };
  }
  
  const trimmedName = name.trim();
  
  if (trimmedName.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }
  
  if (trimmedName.length > 100) {
    return { isValid: false, error: 'Name must be less than 100 characters' };
  }
  
  // Check for potentially harmful characters
  if (/<[^>]*>/.test(trimmedName)) {
    return { isValid: false, error: 'Name contains invalid characters' };
  }
  
  return { isValid: true };
};

export const validateCity = (city: string): { isValid: boolean; error?: string } => {
  if (!city || !city.trim()) {
    return { isValid: false, error: 'City is required' };
  }
  
  const trimmedCity = city.trim();
  
  if (trimmedCity.length < 2) {
    return { isValid: false, error: 'City name must be at least 2 characters long' };
  }
  
  if (trimmedCity.length > 50) {
    return { isValid: false, error: 'City name must be less than 50 characters' };
  }
  
  // Check for potentially harmful characters
  if (/<[^>]*>/.test(trimmedCity)) {
    return { isValid: false, error: 'City name contains invalid characters' };
  }
  
  return { isValid: true };
};

export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  
  if (password.length > 128) {
    return { isValid: false, error: 'Password must be less than 128 characters' };
  }
  
  // Check for at least one uppercase, one lowercase, and one number
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return { 
      isValid: false, 
      error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
    };
  }
  
  return { isValid: true };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateEventName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'Event name is required' };
  }
  
  const trimmedName = name.trim();
  
  if (trimmedName.length < 3) {
    return { isValid: false, error: 'Event name must be at least 3 characters long' };
  }
  
  if (trimmedName.length > 200) {
    return { isValid: false, error: 'Event name must be less than 200 characters' };
  }
  
  return { isValid: true };
};

export const validateEventDescription = (description: string): { isValid: boolean; error?: string } => {
  if (!description || !description.trim()) {
    return { isValid: false, error: 'Event description is required' };
  }
  
  const trimmedDescription = description.trim();
  
  if (trimmedDescription.length < 10) {
    return { isValid: false, error: 'Event description must be at least 10 characters long' };
  }
  
  if (trimmedDescription.length > 5000) {
    return { isValid: false, error: 'Event description must be less than 5000 characters' };
  }
  
  return { isValid: true };
};
