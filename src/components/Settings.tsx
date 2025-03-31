import { useState } from 'react';
import { exerciseLibrary, ExerciseInfo } from '../data/exerciseLibrary';
import { exerciseData } from '../data/exercises';

export default function Settings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('All');
  const [selectedSession, setSelectedSession] = useState(1);
  const [sessionExercises, setSessionExercises] = useState(exerciseData);

  // Filter exercises based on search term and muscle group
  const filteredExercises = exerciseLibrary
    .filter(group => selectedMuscleGroup === 'All' || group.name === selectedMuscleGroup)
    .flatMap(group => group.exercises)
    .filter(exercise => 
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.focus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Add exercise to session
  const addExerciseToSession = (exercise: ExerciseInfo) => {
    setSessionExercises(prev => {
      const newSessions = [...prev];
      const sessionIndex = selectedSession - 1;
      
      // Check if exercise already exists in session
      const exerciseExists = newSessions[sessionIndex].exercises.some(
        e => e.name === exercise.name
      );

      if (!exerciseExists) {
        newSessions[sessionIndex] = {
          ...newSessions[sessionIndex],
          exercises: [
            ...newSessions[sessionIndex].exercises,
            {
              name: exercise.name,
              video: exercise.video,
              weight: 0
            }
          ]
        };
      }

      return newSessions;
    });
  };

  // Remove exercise from session
  const removeExerciseFromSession = (exerciseName: string) => {
    setSessionExercises(prev => {
      const newSessions = [...prev];
      const sessionIndex = selectedSession - 1;

      newSessions[sessionIndex] = {
        ...newSessions[sessionIndex],
        exercises: newSessions[sessionIndex].exercises.filter(
          e => e.name !== exerciseName
        )
      };

      return newSessions;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Settings</h1>

      {/* Session Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Edit Session</h2>
        <select
          value={selectedSession}
          onChange={(e) => setSelectedSession(Number(e.target.value))}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600"
        >
          <option value={1}>Session 1</option>
          <option value={2}>Session 2</option>
          <option value={3}>Session 3</option>
        </select>
      </div>

      {/* Current Session Exercises */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">
          Current Exercises in Session {selectedSession}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessionExercises[selectedSession - 1].exercises.map((exercise) => (
            <div
              key={exercise.name}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center"
            >
              <span className="dark:text-white">{exercise.name}</span>
              <button
                onClick={() => removeExerciseFromSession(exercise.name)}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Exercise Library */}
      <div>
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Exercise Library</h2>
        
        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 rounded-lg border dark:bg-gray-800 dark:text-white"
          />
          <select
            value={selectedMuscleGroup}
            onChange={(e) => setSelectedMuscleGroup(e.target.value)}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 dark:text-white border"
          >
            <option value="All">All Muscle Groups</option>
            {exerciseLibrary.map(group => (
              <option key={group.name} value={group.name}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        {/* Exercise List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
            >
              <h3 className="text-lg font-semibold mb-2 dark:text-white">
                {exercise.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span className="font-medium">Focus:</span> {exercise.focus}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {exercise.description}
              </p>
              <button
                onClick={() => addExerciseToSession(exercise)}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add to Session {selectedSession}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
