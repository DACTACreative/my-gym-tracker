import { useState } from 'react';
import { db, User } from '../db/database';
import { exerciseData } from '../data/exercises';

const ALLOWED_USERS = ['CELIA', 'EUNICE'];

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formattedUsername = username.trim().toUpperCase();

    if (!ALLOWED_USERS.includes(formattedUsername)) {
      setError('You are not invited to this app yet.');
      setIsLoading(false);
      return;
    }

    try {
      // Delete all users first
      await db.users.clear();

      // Check if user exists
      let user = await db.users.where('username').equals(formattedUsername).first();

      // If user doesn't exist, create new user
      if (!user) {
        const newUser: User = {
          username: formattedUsername,
          sessions: exerciseData.map((session, index) => ({
            id: index + 1,
            name: `Session ${index + 1}`,
            exercises: session.exercises
          })),
          createdAt: new Date()
        };
        const id = await db.users.add(newUser);
        user = { ...newUser, id };
      }

      onLogin(user);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1C20]">
      <div className="w-full max-w-md px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            VOLUME UP YOUR BODY GOALS
          </h1>
          <p className="text-gray-400">
            Track your progress. Achieve your goals.
          </p>
        </div>

        <div className="bg-[#2A2C30] rounded-3xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 bg-[#1A1C20] text-white rounded-xl border-2 border-[#3A3C40] focus:border-[#CCFF00] focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl text-black font-semibold text-lg transition-all duration-200 ${
                isLoading
                  ? 'bg-[#CCFF00]/50'
                  : 'bg-[#CCFF00] hover:bg-[#CCFF00]/90'
              }`}
            >
              {isLoading ? 'Loading...' : 'START BUILDING YOUR BODY'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Only invited users can access this app
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
