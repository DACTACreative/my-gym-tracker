import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { db, User } from '../db/database';

interface SettingsProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

export default function Settings({ user, onUserUpdate }: SettingsProps) {
  const [selectedSession, setSelectedSession] = useState(1);

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(user.sessions[selectedSession - 1].exercises);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedSessions = [...user.sessions];
    updatedSessions[selectedSession - 1] = {
      ...updatedSessions[selectedSession - 1],
      exercises: items,
    };

    const updatedUser = { ...user, sessions: updatedSessions };
    await db.users.update(user.id!, { sessions: updatedSessions });
    onUserUpdate(updatedUser);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Session Settings</h2>
        <select
          value={selectedSession}
          onChange={(e) => setSelectedSession(Number(e.target.value))}
          className="px-4 py-2 bg-[#2A2C30] text-white rounded-xl border-2 border-[#3A3C40] focus:border-[#CCFF00] focus:outline-none"
        >
          {user.sessions.map((session) => (
            <option key={session.id} value={session.id}>
              {session.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-[#2A2C30] rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-6">Exercise Order</h3>
        <p className="text-gray-400 mb-6">
          Drag and drop exercises to reorder them in your workout session.
        </p>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="exercises">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {user.sessions[selectedSession - 1].exercises.map(
                  (exercise, index) => (
                    <Draggable
                      key={exercise.name}
                      draggableId={exercise.name}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-4 bg-[#1A1C20] rounded-xl border-2 ${
                            snapshot.isDragging
                              ? 'border-[#CCFF00]'
                              : 'border-[#3A3C40]'
                          } flex items-center justify-between group hover:border-[#CCFF00] transition-colors cursor-move`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-[#CCFF00] opacity-50 group-hover:opacity-100 transition-opacity">
                              ⋮⋮
                            </div>
                            <span className="font-medium">{exercise.name}</span>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  )
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
