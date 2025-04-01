import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { User } from '../db/database';

interface SettingsProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

export default function Settings({ user, onUserUpdate }: SettingsProps) {
  const [selectedSession, setSelectedSession] = useState(1);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    const updatedUser = { ...user };
    const exercises = [...updatedUser.sessions[selectedSession - 1].exercises];
    const [removed] = exercises.splice(sourceIndex, 1);
    exercises.splice(destinationIndex, 0, removed);
    updatedUser.sessions[selectedSession - 1].exercises = exercises;

    onUserUpdate(updatedUser);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Workout Settings
        </h2>
        <select
          value={selectedSession}
          onChange={(e) => setSelectedSession(Number(e.target.value))}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600"
        >
          {user.sessions.map((session) => (
            <option key={session.id} value={session.id}>
              {session.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Reorder Exercises
        </h3>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="exercises">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {user.sessions[selectedSession - 1].exercises.map((exercise, index) => (
                  <Draggable
                    key={exercise.name}
                    draggableId={exercise.name}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${
                          snapshot.isDragging ? 'shadow-lg' : ''
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            {...provided.dragHandleProps}
                            className="text-gray-400 dark:text-gray-500 cursor-grab"
                          >
                            ☰
                          </div>
                          <span className="text-gray-900 dark:text-white">
                            {exercise.name}
                          </span>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
