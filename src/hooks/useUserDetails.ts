
import { useState, useEffect } from 'react';

interface UserDetails {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export const useUserDetails = () => {
  const [userDetails, setUserDetails] = useState<UserDetails>(() => {
    const saved = sessionStorage.getItem('userLetterDetails');
    return saved ? JSON.parse(saved) : {
      firstName: '',
      lastName: '',
      phone: '',
      email: ''
    };
  });

  useEffect(() => {
    sessionStorage.setItem('userLetterDetails', JSON.stringify(userDetails));
  }, [userDetails]);

  return { userDetails, setUserDetails };
};
