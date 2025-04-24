
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
      sessionStorage.setItem('userLetterDetails', JSON.stringify(userDetails));
    }
  }, [userDetails]);

  const updateUserDetail = (field: string, value: string) => {
    setUserDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return { userDetails, setUserDetails, updateUserDetail };
};
