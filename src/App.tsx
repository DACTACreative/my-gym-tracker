import { useState, useEffect } from 'react';
import { db, WorkoutEntry, User } from './db/database';
import Settings from './components/Settings';
import Login from './components/Login';

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
    <div className="min-h-screen bg-[#1A1C20] text-white">
      {/* Navigation */}
      <nav className="bg-[#2A2C30] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold text-[#CCFF00]">
                  FitTracker
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#CCFF00] flex items-center justify-center">
                  <span className="text-black font-bold">
                    {user.username[0]}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {user.username}
                </span>
              </div>
              <button
                onClick={() => {
                  setShowHistory(false);
                  setShowSettings(!showSettings);
                }}
                className="px-4 py-2 bg-[#3A3C40] text-white rounded-xl hover:bg-[#4A4C50] transition-colors"
              >
                {showSettings ? 'Workout' : 'Settings'}
              </button>
              {!showSettings && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="px-4 py-2 bg-[#3A3C40] text-white rounded-xl hover:bg-[#4A4C50] transition-colors"
                >
                  {showHistory ? 'Current' : 'History'}
                </button>
              )}
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {showSettings ? (
          <Settings user={user} onUserUpdate={setUser} />
        ) : !showHistory ? (
          <>
            <div className="flex gap-4 mb-8">
              <select
                value={currentSession}
                onChange={(e) => setCurrentSession(Number(e.target.value))}
                className="px-4 py-2 bg-[#2A2C30] text-white rounded-xl border-2 border-[#3A3C40] focus:border-[#CCFF00] focus:outline-none"
              >
                {user.sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.name}
                  </option>
                ))}
              </select>

              <button
                onClick={resetWorkouts}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
              >
                Reset
              </button>

              <button
                onClick={saveWorkout}
                className="px-6 py-2 bg-[#CCFF00] text-black font-semibold rounded-xl hover:bg-[#CCFF00]/90 transition-colors"
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
                    className="bg-[#2A2C30] rounded-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-200"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-4">
                        {exercise.name}
                      </h3>
                      
                      {/* Exercise History */}
                      <div className="mb-6 space-y-3">
                        <div className="flex items-center justify-between p-3 bg-[#CCFF00]/10 rounded-xl">
                          <span className="text-[#CCFF00] font-medium">Personal Best</span>
                          <span className="text-white font-bold">{personalBest} kg</span>
                        </div>
                        <div className="space-y-2">
                          {exerciseHistoryData.slice(0, 3).map((entry, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center text-sm text-gray-400"
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
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                              Weight (kg)
                            </label>
                            <input
                              type="number"
                              value={state.weight || ''}
                              onChange={(e) => handleWorkoutChange(exercise.name, 'weight', Number(e.target.value))}
                              className="w-full px-3 py-2 bg-[#1A1C20] rounded-xl border-2 border-[#3A3C40] focus:border-[#CCFF00] focus:outline-none"
                              min="0"
                              step="0.5"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                              Reps
                            </label>
                            <input
                              type="number"
                              value={state.reps || ''}
                              onChange={(e) => handleWorkoutChange(exercise.name, 'reps', Number(e.target.value))}
                              className="w-full px-3 py-2 bg-[#1A1C20] rounded-xl border-2 border-[#3A3C40] focus:border-[#CCFF00] focus:outline-none"
                              min="0"
                            />
                          </div>
                        </div>
                        <div className="aspect-video rounded-xl overflow-hidden bg-black/50">
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
            <h2 className="text-2xl font-bold">Workout History</h2>
            <div className="bg-[#2A2C30] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#3A3C40]">
                  <thead className="bg-[#1A1C20]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Session</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Exercise</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Weight</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Reps</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3A3C40]">
                    {history.map((entry) => (
                      <tr key={entry.id} className="hover:bg-[#3A3C40] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(entry.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {entry.sessionNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {entry.exerciseName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {entry.weight} kg
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {entry.reps}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => entry.id && deleteWorkout(entry.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
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
      </main>
    </div>
  );
}
