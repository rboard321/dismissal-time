export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  carNumber: number;
  createdAt?: any; // Firestore Timestamp
}

export interface QueueEntry {
  id: string;
  carNumber: number;
  studentIds: string[];
  studentNames: string[];
  createdAt: any; // Firestore Timestamp
  status: 'waiting' | 'completed';
  completedAt?: any; // Firestore Timestamp
}

export interface Teacher {
  id?: string;
  name: string;
  isLoggedIn: boolean;
}

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

export type TabParamList = {
  Students: undefined;
  CheckIn: undefined;
  Queue: undefined;
};
