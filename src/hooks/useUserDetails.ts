
import { useState, useEffect } from 'react';

interface UserDetails {
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

  return { userDetails, setUserDetails };
};
