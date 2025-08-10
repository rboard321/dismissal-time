import { useEffect, useState } from 'react';
import { onAuthStateChangedListener } from '../services/firebase';
import { Teacher } from '../types';

const useAppState = () => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) {
        setTeacher({ id: user.uid, name: user.displayName || '', isLoggedIn: true });
      } else {
        setTeacher(null);
      }
    });
    return unsubscribe;
  }, []);

  return { teacher };
};

export default useAppState;
