import { useState, useEffect } from 'react';
import { db, WorkoutEntry, User } from './db/database';
import Settings from './components/Settings';
import Login from './components/Login';

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
  const [showSettings, setShowSettings] = useState(false);
  const [history, setHistory] = useState<WorkoutEntry[]>([]);
  const [exerciseHistory, setExerciseHistory] = useState<Record<string, ExerciseHistory[]>>({});
  const [user, setUser] = useState<User | null>(null);

  // Load history on component mount
  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;
    
    const allWorkouts = await db.workouts
      .where('userId')
      .equals(user.username)
      .reverse()
      .sortBy('date');
      
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
    if (!user) return;

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
          reps: state.reps,
          userId: user.username
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

  const handleLogout = () => {
    setUser(null);
    setHistory([]);
    setExerciseHistory({});
    setWorkoutStates({});
  };

  const currentExercises = user?.sessions[currentSession - 1].exercises || [];

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="min-h-full">
        {/* Navigation */}
        <nav className="bg-white dark:bg-gray-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    FitForLife
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-700 dark:text-gray-300">
                  Welcome, {user.username}!
                </span>
                <button
                  onClick={() => {
                    setShowHistory(false);
                    setShowSettings(!showSettings);
                  }}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  {showSettings ? 'Workout' : 'Settings'}
                </button>
                {!showSettings && (
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {showHistory ? 'Current Workout' : 'History'}
                  </button>
                )}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 transition-colors"
                >
                  {darkMode ? '🌞' : '🌙'}
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {showSettings ? (
              <Settings user={user} onUserUpdate={setUser} />
            ) : !showHistory ? (
              <>
                <div className="flex gap-4 mb-8">
                  <select
                    value={currentSession}
                    onChange={(e) => setCurrentSession(Number(e.target.value))}
                    className="p-2 rounded-lg bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600"
                  >
                    {user.sessions.map((session) => (
                      <option key={session.id} value={session.id}>
                        {session.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={resetWorkouts}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Reset Inputs
                  </button>

                  <button
                    onClick={saveWorkout}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
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
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-102 transition-transform duration-200"
                      >
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            {exercise.name}
                          </h3>
                          
                          {/* Exercise History */}
                          <div className="mb-6 space-y-2">
                            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                              <span className="text-purple-700 dark:text-purple-300 font-medium">Personal Best</span>
                              <span className="text-purple-800 dark:text-purple-200 font-bold">{personalBest} kg</span>
                            </div>
                            <div className="space-y-2">
                              {exerciseHistoryData.slice(0, 3).map((entry, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400"
                                >
                                  <span>{entry.date.toLocaleDateString()}</span>
                                  <span className="font-medium">{entry.weight}kg × {entry.reps}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Weight (kg)
                                </label>
                                <input
                                  type="number"
                                  value={state.weight || ''}
                                  onChange={(e) => handleWorkoutChange(exercise.name, 'weight', Number(e.target.value))}
                                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                  min="0"
                                  step="0.5"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Reps
                                </label>
                                <input
                                  type="number"
                                  value={state.reps || ''}
                                  onChange={(e) => handleWorkoutChange(exercise.name, 'reps', Number(e.target.value))}
                                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                  min="0"
                                />
                              </div>
                            </div>
                            <div className="aspect-video rounded-lg overflow-hidden shadow-inner">
                              <iframe
                                src={exercise.video}
                                title={`${exercise.name} demo`}
                                className="w-full h-full"
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Workout History</h2>
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Session</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Exercise</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Weight</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reps</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {history.map((entry) => (
                          <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                              {new Date(entry.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                              {entry.sessionNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                              {entry.exerciseName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                              {entry.weight} kg
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                              {entry.reps}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => entry.id && deleteWorkout(entry.id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
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
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
