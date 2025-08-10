import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  onAuthStateChangedListener,
  listenToStudents,
  listenToQueue,
  addToQueue as addToQueueFirebase,
  completePickup as completePickupFirebase,
  getStudentsByCarNumber,
} from '../services/firebase';
import { Student, QueueEntry } from '../types';

export const useAppState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Students listener
  useEffect(() => {
    if (!user) return;

    const unsubscribe = listenToStudents((studentsData) => {
      setStudents(studentsData);
    });

    return unsubscribe;
  }, [user]);

  // Queue listener
  useEffect(() => {
    if (!user) return;

    const unsubscribe = listenToQueue((queueData) => {
      setQueue(queueData);
    });

    return unsubscribe;
  }, [user]);

  const addToQueue = async (carNumber: number): Promise<boolean> => {
    try {
      const studentsInCar = await getStudentsByCarNumber(carNumber);

      if (studentsInCar.length === 0) {
        return false;
      }

      await addToQueueFirebase({
        carNumber,
        studentIds: studentsInCar.map((s) => s.id),
        studentNames: studentsInCar.map((s) => `${s.firstName} ${s.lastName}`),
      });

      return true;
    } catch (error) {
      console.error('Error adding to queue:', error);
      return false;
    }
  };

  const completePickup = async (queueId: string): Promise<boolean> => {
    try {
      await completePickupFirebase(queueId);
      return true;
    } catch (error) {
      console.error('Error completing pickup:', error);
      return false;
    }
  };

  const getStudentsForCar = async (carNumber: number): Promise<Student[]> => {
    try {
      return await getStudentsByCarNumber(carNumber);
    } catch (error) {
      console.error('Error getting students for car:', error);
      return [];
    }
  };

  return {
    user,
    students,
    queue,
    loading,
    addToQueue,
    completePickup,
    getStudentsForCar,
  };
};

