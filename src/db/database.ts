import Dexie, { Table } from 'dexie';

export interface WorkoutEntry {
  id?: number;
  date: Date;
  sessionNumber: number;
  exerciseName: string;
  weight: number;
  reps: number;
  userId: string;
}

export interface User {
  id?: number;
  username: string;
  sessions: {
    id: number;
    name: string;
    exercises: Array<{
      name: string;
      video: string;
      weight: number;
    }>;
  }[];
  createdAt: Date;
}

export class MyGymTrackerDB extends Dexie {
  workouts!: Table<WorkoutEntry>;
  users!: Table<User>;

  constructor() {
    super('MyGymTrackerDB');
    this.version(2).stores({
      workouts: '++id, date, sessionNumber, exerciseName, userId',
      users: '++id, username'
    });
  }
}

export const db = new MyGymTrackerDB();
