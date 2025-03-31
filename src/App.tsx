import { useState, useEffect } from 'react';
import { exerciseData } from './data/exercises';

type Exercise = {
  name: string;
  image: string;
  video: string;
  weight: number;
};

type Session = {
  id: number;
  exercises: Exercise[];
};

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentSession, setCurrentSession] = useState(1);
  const [weights, setWeights] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('gymWeights');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('gymWeights', JSON.stringify(weights));
  }, [weights]);

  const handleWeightChange = (exerciseName: string, weight: number) => {
    setWeights(prev => ({
      ...prev,
      [exerciseName]: weight
    }));
  };

  const resetWeights = () => {
    if (confirm('Are you sure you want to reset all weights?')) {
      setWeights({});
    }
  };

  const currentExercises = exerciseData[currentSession - 1].exercises;

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            My Gym Tracker
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
          >
            {darkMode ? '🌞' : '🌙'}
          </button>
        </header>

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
            onClick={resetWeights}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Reset Weights
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentExercises.map((exercise) => (
            <div
              key={exercise.name}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <img
                src={exercise.image}
                alt={exercise.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 dark:text-white">
                  {exercise.name}
                </h3>
                <div className="mb-4">
                  <input
                    type="number"
                    value={weights[exercise.name] || ''}
                    onChange={(e) => handleWeightChange(exercise.name, Number(e.target.value))}
                    placeholder="Weight (kg)"
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  />
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
          ))}
        </div>
      </div>
    </div>
  );
}
