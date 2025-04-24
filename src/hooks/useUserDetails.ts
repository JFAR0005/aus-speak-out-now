
import { useState, useEffect } from 'react';

export interface UserDetails {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export const useUserDetails = () => {
  const [userDetails, setUserDetails] = useState<UserDetails>(() => {
    if (typeof window === 'undefined') {
      return {
        firstName: '',
        lastName: '',
        phone: '',
        email: ''
      };
    }
    
    const saved = sessionStorage.getItem('userLetterDetails');
    return saved ? JSON.parse(saved) : {
      firstName: '',
      lastName: '',
      phone: '',
      email: ''
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Only save if there's at least one non-empty field
        if (Object.values(userDetails).some(val => val && val.trim() !== '')) {
          sessionStorage.setItem('userLetterDetails', JSON.stringify(userDetails));
        }
      } catch (error) {
        console.error('Failed to save user details to session storage:', error);
      }
    }
  }, [userDetails]);

  const updateUserDetail = (field: string, value: string) => {
    // No validation - just update the value
    setUserDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return { userDetails, updateUserDetail };
};
