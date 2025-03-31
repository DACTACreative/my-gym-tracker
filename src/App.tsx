import { useState, useEffect } from 'react';
import { exerciseData } from './data/exercises';
import { db, WorkoutEntry } from './db/database';

type Exercise = {
  name: string;
  video: string;
  weight: number;
  reps: number;
};

type WorkoutState = {
  weight: number;
  reps: number;
};

type ExerciseHistory = {
  date: Date;
  weight: number;
  reps: number;
};

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentSession, setCurrentSession] = useState(1);
  const [workoutStates, setWorkoutStates] = useState<Record<string, WorkoutState>>({});
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<WorkoutEntry[]>([]);
  const [exerciseHistory, setExerciseHistory] = useState<Record<string, ExerciseHistory[]>>({});

  // Load history on component mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const allWorkouts = await db.workouts.orderBy('date').reverse().toArray();
    setHistory(allWorkouts);

    // Group history by exercise
    const historyByExercise: Record<string, ExerciseHistory[]> = {};
    allWorkouts.forEach(workout => {
      if (!historyByExercise[workout.exerciseName]) {
        historyByExercise[workout.exerciseName] = [];
      }
      historyByExercise[workout.exerciseName].push({
        date: new Date(workout.date),
        weight: workout.weight,
        reps: workout.reps
      });
    });
    setExerciseHistory(historyByExercise);
  };

  const handleWorkoutChange = async (exerciseName: string, field: 'weight' | 'reps', value: number) => {
    setWorkoutStates(prev => ({
      ...prev,
      [exerciseName]: {
        ...prev[exerciseName],
        [field]: value
      }
    }));
  };

  const saveWorkout = async () => {
    const currentDate = new Date();
    const entries: WorkoutEntry[] = [];

    currentExercises.forEach(exercise => {
      const state = workoutStates[exercise.name] || { weight: 0, reps: 0 };
      if (state.weight > 0 || state.reps > 0) {
        entries.push({
          date: currentDate,
          sessionNumber: currentSession,
          exerciseName: exercise.name,
          weight: state.weight,
          reps: state.reps
        });
      }
    });

    if (entries.length > 0) {
      await db.workouts.bulkAdd(entries);
      await loadHistory();
      setWorkoutStates({});
    }
  };

  const deleteWorkout = async (id: number) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      await db.workouts.delete(id);
      await loadHistory();
    }
  };

  const resetWorkouts = () => {
    if (confirm('Are you sure you want to reset all current inputs?')) {
      setWorkoutStates({});
    }
  };

  const currentExercises = exerciseData[currentSession - 1].exercises as Exercise[];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            My Gym Tracker
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {showHistory ? 'Current Workout' : 'History'}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
            >
              {darkMode ? '🌞' : '🌙'}
            </button>
          </div>
        </header>

        {!showHistory ? (
          <>
            <div className="flex gap-4 mb-8">
              <select
                value={currentSession}
                onChange={(e) => setCurrentSession(Number(e.target.value))}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600"
              >
                <option value={1}>Session 1</option>
                <option value={2}>Session 2</option>
                <option value={3}>Session 3</option>
              </select>

              <button
                onClick={resetWorkouts}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Reset Inputs
              </button>

              <button
                onClick={saveWorkout}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Save Workout
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentExercises.map((exercise) => {
                const state = workoutStates[exercise.name] || { weight: 0, reps: 0 };
                const exerciseHistoryData = exerciseHistory[exercise.name] || [];
                const personalBest = exerciseHistoryData.reduce((max, entry) => 
                  entry.weight > max ? entry.weight : max, 0);

                return (
                  <div
                    key={exercise.name}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2 dark:text-white">
                        {exercise.name}
                      </h3>
                      
                      {/* Exercise History */}
                      <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                        <p className="font-semibold">Personal Best: {personalBest} kg</p>
                        <div className="mt-2 space-y-1">
                          {exerciseHistoryData.slice(0, 3).map((entry, idx) => (
                            <p key={idx}>
                              {entry.date.toLocaleDateString()}: {entry.weight}kg × {entry.reps} reps
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Weight (kg)
                            </label>
                            <input
                              type="number"
                              value={state.weight || ''}
                              onChange={(e) => handleWorkoutChange(exercise.name, 'weight', Number(e.target.value))}
                              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white mt-1"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Reps
                            </label>
                            <input
                              type="number"
                              value={state.reps || ''}
                              onChange={(e) => handleWorkoutChange(exercise.name, 'reps', Number(e.target.value))}
                              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white mt-1"
                            />
                          </div>
                        </div>
                        <div className="aspect-video">
                          <iframe
                            src={exercise.video}
                            title={`${exercise.name} demo`}
                            className="w-full h-full rounded-lg"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold dark:text-white">Workout History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Session</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Exercise</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Weight</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reps</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {history.map((entry) => (
                    <tr key={entry.id} className="text-gray-700 dark:text-gray-300">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {entry.sessionNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {entry.exerciseName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {entry.weight} kg
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {entry.reps}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => entry.id && deleteWorkout(entry.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
