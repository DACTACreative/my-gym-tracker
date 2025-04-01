import { useState, useEffect } from 'react';
import { db } from '../db/database';

interface MacroEntry {
  id?: number;
  userId: string;
  date: Date;
  name: string;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface Props {
  userId: string;
}

export default function Macro({ userId }: Props) {
  const [entries, setEntries] = useState<MacroEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [newEntry, setNewEntry] = useState<MacroEntry>({
    date: new Date(),
    name: '',
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    userId: userId
  });

  // Daily goals
  const goals = {
    protein: 150,
    carbs: 200,
    fat: 55,
    fiber: 30
  };

  useEffect(() => {
    loadTodayEntries();
  }, [userId]);

  const loadTodayEntries = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const entries = await db.macros
      .where('userId')
      .equals(userId)
      .filter(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime();
      })
      .toArray();
    
    setEntries(entries);
  };

  const handleInputChange = (field: keyof MacroEntry, value: string | number) => {
    setNewEntry(prev => ({
      ...prev,
      [field]: field === 'name' ? value : Number(value)
    }));
  };

  const addEntry = async () => {
    if (!newEntry.name) return;

    await db.macros.add(newEntry);
    await loadTodayEntries();
    
    setNewEntry({
      date: new Date(),
      name: '',
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      userId: userId
    });
    setShowManualEntry(false);
  };

  const getTotalMacros = () => {
    return entries.reduce((totals, entry) => ({
      protein: totals.protein + entry.protein,
      carbs: totals.carbs + entry.carbs,
      fat: totals.fat + entry.fat,
      fiber: totals.fiber + entry.fiber
    }), {
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    });
  };

  const totals = getTotalMacros();

  return (
    <div className="space-y-6">
      {/* Daily Summary Card */}
      <div className="bg-[#2A2C30] rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Today's Macros</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-[#1A1C20] rounded-xl">
            <div className="text-sm text-gray-400">Protein</div>
            <div className="text-2xl font-bold text-[#CCFF00]">{totals.protein}g</div>
            <div className="text-xs text-gray-500">Goal: {goals.protein}g</div>
          </div>
          <div className="p-4 bg-[#1A1C20] rounded-xl">
            <div className="text-sm text-gray-400">Carbs</div>
            <div className="text-2xl font-bold text-[#CCFF00]">{totals.carbs}g</div>
            <div className="text-xs text-gray-500">Goal: {goals.carbs}g</div>
          </div>
          <div className="p-4 bg-[#1A1C20] rounded-xl">
            <div className="text-sm text-gray-400">Fat</div>
            <div className="text-2xl font-bold text-[#CCFF00]">{totals.fat}g</div>
            <div className="text-xs text-gray-500">Goal: {goals.fat}g</div>
          </div>
          <div className="p-4 bg-[#1A1C20] rounded-xl">
            <div className="text-sm text-gray-400">Fiber</div>
            <div className="text-2xl font-bold text-[#CCFF00]">{totals.fiber}g</div>
            <div className="text-xs text-gray-500">Goal: {goals.fiber}g</div>
          </div>
        </div>
      </div>

      {/* Quick Add Card */}
      <div className="bg-[#2A2C30] rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Quick Add</h2>
        <div className="flex gap-4">
          <button 
            className="flex-1 p-4 bg-[#1A1C20] rounded-xl flex items-center justify-center gap-2 hover:bg-[#CCFF00] hover:text-black transition-colors"
            onClick={() => alert('Barcode scanning coming soon!')}
          >
            <span>📸</span>
            Scan Barcode
          </button>
          <button 
            className="flex-1 p-4 bg-[#1A1C20] rounded-xl flex items-center justify-center gap-2 hover:bg-[#CCFF00] hover:text-black transition-colors"
            onClick={() => setShowManualEntry(true)}
          >
            <span>📝</span>
            Manual Entry
          </button>
        </div>
      </div>

      {/* Manual Entry Form */}
      {showManualEntry && (
        <div className="bg-[#2A2C30] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Add Food</h2>
            <button 
              onClick={() => setShowManualEntry(false)}
              className="text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Food Name
              </label>
              <input
                type="text"
                value={newEntry.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1C20] rounded-xl border-2 border-[#3A3C40] focus:border-[#CCFF00] focus:outline-none"
                placeholder="Enter food name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Protein (g)
                </label>
                <input
                  type="number"
                  value={newEntry.protein || ''}
                  onChange={(e) => handleInputChange('protein', e.target.value)}
                  className="w-full px-3 py-2 bg-[#1A1C20] rounded-xl border-2 border-[#3A3C40] focus:border-[#CCFF00] focus:outline-none"
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Carbs (g)
                </label>
                <input
                  type="number"
                  value={newEntry.carbs || ''}
                  onChange={(e) => handleInputChange('carbs', e.target.value)}
                  className="w-full px-3 py-2 bg-[#1A1C20] rounded-xl border-2 border-[#3A3C40] focus:border-[#CCFF00] focus:outline-none"
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Fat (g)
                </label>
                <input
                  type="number"
                  value={newEntry.fat || ''}
                  onChange={(e) => handleInputChange('fat', e.target.value)}
                  className="w-full px-3 py-2 bg-[#1A1C20] rounded-xl border-2 border-[#3A3C40] focus:border-[#CCFF00] focus:outline-none"
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Fiber (g)
                </label>
                <input
                  type="number"
                  value={newEntry.fiber || ''}
                  onChange={(e) => handleInputChange('fiber', e.target.value)}
                  className="w-full px-3 py-2 bg-[#1A1C20] rounded-xl border-2 border-[#3A3C40] focus:border-[#CCFF00] focus:outline-none"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
            <button
              onClick={addEntry}
              className="w-full px-6 py-2 bg-[#CCFF00] text-black font-semibold rounded-xl hover:bg-[#CCFF00]/90 transition-colors"
            >
              Add Food
            </button>
          </div>
        </div>
      )}

      {/* Today's Entries */}
      {entries.length > 0 && (
        <div className="bg-[#2A2C30] rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Today's Foods</h2>
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <div 
                key={index}
                className="p-4 bg-[#1A1C20] rounded-xl flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{entry.name}</div>
                  <div className="text-sm text-gray-400">
                    {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[#CCFF00]">{entry.protein}g P</div>
                  <div className="text-xs text-gray-400">
                    {entry.carbs}g C | {entry.fat}g F | {entry.fiber}g Fiber
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Food Search Card */}
      <div className="bg-[#2A2C30] rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Search Foods</h2>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Australian foods..."
            className="w-full px-4 py-3 bg-[#1A1C20] rounded-xl border-2 border-[#3A3C40] focus:border-[#CCFF00] focus:outline-none pl-10"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
            🔍
          </span>
        </div>
        <div className="mt-2 text-sm text-gray-400">
          Australian food database coming soon!
        </div>
      </div>
    </div>
  );
}
