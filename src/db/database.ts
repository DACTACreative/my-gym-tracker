import Dexie, { Table } from 'dexie';

export interface WorkoutEntry {
  id?: number;
  date: Date;
  sessionNumber: number;
  exerciseName: string;
  weight: number;
  reps: number;
}

export class GymDatabase extends Dexie {
  workouts!: Table<WorkoutEntry>;

  constructor() {
    super('GymDatabase');
    this.version(1).stores({
      workouts: '++id, date, sessionNumber, exerciseName'
    });
  }
}

export const db = new GymDatabase();
