import React, { createContext, useContext, useState, useEffect } from 'react';
import { Plant, Task, Space, Tip } from '../types';
import { PLANTS as INITIAL_PLANTS, TASKS as INITIAL_TASKS, SPACES as INITIAL_SPACES, TIPS as INITIAL_TIPS } from '../constants';

interface GardenContextType {
  plants: Plant[];
  tasks: Task[];
  spaces: Space[];
  tips: Tip[];
  addPlant: (plant: Omit<Plant, 'id'>) => void;
  updatePlant: (id: string, plant: Partial<Plant>) => void;
  deletePlant: (id: string) => void;
  completeTask: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  addSpace: (space: Omit<Space, 'id' | 'plantCount'>) => void;
  updateSpace: (id: string, space: Partial<Space>) => void;
  deleteSpace: (id: string) => void;
}

const GardenContext = createContext<GardenContextType | undefined>(undefined);

export const GardenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plants, setPlants] = useState<Plant[]>(INITIAL_PLANTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [spaces, setSpaces] = useState<Space[]>(INITIAL_SPACES);
  const [tips] = useState<Tip[]>(INITIAL_TIPS);

  // Cross-functional logic: Update space plant counts when plants change
  useEffect(() => {
    setSpaces(prevSpaces => 
      prevSpaces.map(space => ({
        ...space,
        plantCount: plants.filter(p => p.spaceId === space.id).length
      }))
    );
  }, [plants]);

  const addPlant = (plant: Omit<Plant, 'id'>) => {
    const newPlant = { ...plant, id: Date.now().toString() };
    setPlants(prev => [...prev, newPlant]);
  };

  const updatePlant = (id: string, updatedPlant: Partial<Plant>) => {
    setPlants(prev => prev.map(p => p.id === id ? { ...p, ...updatedPlant } : p));
  };

  const deletePlant = (id: string) => {
    setPlants(prev => prev.filter(p => p.id !== id));
  };

  const completeTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: true } : t));
  };

  const addTask = (task: Omit<Task, 'id' | 'completed'>) => {
    const newTask = { ...task, id: `t${Date.now()}`, completed: false };
    setTasks(prev => [newTask, ...prev]);
  };

  const addSpace = (space: Omit<Space, 'id' | 'plantCount'>) => {
    const newSpace = { ...space, id: `s${Date.now()}`, plantCount: 0, status: 'Stable' as const };
    setSpaces(prev => [...prev, newSpace]);
  };

  const updateSpace = (id: string, updatedSpace: Partial<Space>) => {
    setSpaces(prev => prev.map(s => s.id === id ? { ...s, ...updatedSpace } : s));
  };

  const deleteSpace = (id: string) => {
    setSpaces(prev => prev.filter(s => s.id !== id));
  };

  return (
    <GardenContext.Provider value={{ 
      plants, tasks, spaces, tips,
      addPlant, updatePlant, deletePlant,
      completeTask, addTask,
      addSpace, updateSpace, deleteSpace
    }}>
      {children}
    </GardenContext.Provider>
  );
};

export const useGarden = () => {
  const context = useContext(GardenContext);
  if (context === undefined) {
    throw new Error('useGarden must be used within a GardenProvider');
  }
  return context;
};
