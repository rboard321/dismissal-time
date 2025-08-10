import { initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  signInAnonymously as firebaseSignInAnonymously,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  updateDoc,
  doc,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration - replace with your config
const firebaseConfig = {
  apiKey: 'your-api-key',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

// Auth functions
export const signInAnonymously = () => firebaseSignInAnonymously(auth);
export const onAuthStateChangedListener = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback);

// Firestore functions
export const addStudent = async (studentData: {
  firstName: string;
  lastName: string;
  carNumber: number;
}) => {
  try {
    const docRef = await addDoc(collection(db, 'students'), {
      ...studentData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding student:', error);
    throw error;
  }
};

export const addToQueue = async (queueData: {
  carNumber: number;
  studentIds: string[];
  studentNames: string[];
}) => {
  try {
    const docRef = await addDoc(collection(db, 'dismissalQueue'), {
      ...queueData,
      createdAt: Timestamp.now(),
      status: 'waiting',
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding to queue:', error);
    throw error;
  }
};

export const completePickup = async (queueId: string) => {
  try {
    await updateDoc(doc(db, 'dismissalQueue', queueId), {
      status: 'completed',
      completedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error completing pickup:', error);
    throw error;
  }
};

export const getStudentsByCarNumber = async (carNumber: number) => {
  try {
    const q = query(collection(db, 'students'), where('carNumber', '==', carNumber));
    const querySnapshot = await getDocs(q);
    const students: any[] = [];
    querySnapshot.forEach((doc) => {
      students.push({ id: doc.id, ...doc.data() });
    });
    return students;
  } catch (error) {
    console.error('Error getting students:', error);
    throw error;
  }
};

// Real-time listeners
export const listenToStudents = (callback: (students: any[]) => void) => {
  const q = query(collection(db, 'students'), orderBy('lastName'));
  return onSnapshot(q, (querySnapshot) => {
    const students: any[] = [];
    querySnapshot.forEach((doc) => {
      students.push({ id: doc.id, ...doc.data() });
    });
    callback(students);
  });
};

export const listenToQueue = (callback: (queue: any[]) => void) => {
  const q = query(
    collection(db, 'dismissalQueue'),
    where('status', '==', 'waiting'),
    orderBy('createdAt')
  );
  return onSnapshot(q, (querySnapshot) => {
    const queue: any[] = [];
    querySnapshot.forEach((doc) => {
      queue.push({ id: doc.id, ...doc.data() });
    });
    callback(queue);
  });
};

export { auth, db };
