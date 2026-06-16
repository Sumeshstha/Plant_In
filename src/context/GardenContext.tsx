import React, { createContext, useContext, useState, useEffect } from 'react';
import { Plant, Task, Space, Tip, JournalEntry } from '../types';
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
  // Dynamic care tracking actions
  addJournalEntry: (plantId: string, entry: Omit<JournalEntry, 'id'>) => void;
  updateJournalEntry: (plantId: string, entryId: string, entry: Partial<JournalEntry>) => void;
  deleteJournalEntry: (plantId: string, entryId: string) => void;
  recordWatering: (plantId: string, dateString?: string) => void;
  recordFertilization: (plantId: string, dateString?: string) => void;
  recordRepotting: (plantId: string, dateString?: string) => void;
}

const GardenContext = createContext<GardenContextType | undefined>(undefined);

// Helper to initialize care features with today's simulation date "2026-06-15"
const initializePlantsWithCare = (initial: Plant[]): Plant[] => {
  return initial.map(p => {
    const daysMatch = p.watering.match(/(\d+)/);
    const wateringIntervalDays = daysMatch ? parseInt(daysMatch[1], 10) : 7;
    
    // Setup realistic last care dates relative to "2026-06-15"
    let lastWateredDate = "2026-06-10";
    if (p.id === '1') lastWateredDate = "2026-06-08"; // due 15th (today!)
    if (p.id === '2') lastWateredDate = "2026-06-11"; // due 18th
    if (p.id === '3') lastWateredDate = "2026-06-10"; // due 15th (today!)
    if (p.id === '4') lastWateredDate = "2026-06-14"; // due 16th
    if (p.id === '5') lastWateredDate = "2026-06-01"; // due 15th (today!)

    const fertilizerIntervalDays = p.id === '1' || p.id === '3' || p.id === '4' ? 14 : 30;
    let lastFertilizedDate = "2026-05-25";
    if (p.id === '4') lastFertilizedDate = "2026-06-01"; // due 15th (today!)

    const lastRepottedDate = "2025-06-15";
    const repotIntervalMonths = 12;

    const initialJournals: JournalEntry[] = [
      {
        id: 'j-1',
        date: '2026-05-15',
        category: 'general',
        title: 'Adopted into Oasis!',
        notes: `Welcome home! Placed in a beautiful spot with ${p.light} and adjusted the temperature target to ${p.temp}.`,
        plantHeight: p.id === '1' ? 85 : p.id === '4' ? 45 : p.id === '5' ? 30 : 25
      }
    ];

    if (p.id === '1') {
      initialJournals.push({
        id: 'j-2',
        date: '2026-06-02',
        category: 'new-growth',
        title: 'Brand New Glossy Leaf!',
        notes: 'A perfect delicate new leaflet unfolded at the apex. Staged feeding and misting are paying off.',
        plantHeight: 89
      });
    } else if (p.id === '2') {
      initialJournals.push({
        id: 'j-2',
        date: '2026-06-10',
        category: 'pest-treatment',
        title: 'Dust Cleaning & Neem Wipe',
        notes: 'Wiped the gorgeous pin-striped leaves using a light organic mixture of organic soap and neem oil. Restored original vibrant sheen!',
        plantHeight: 28
      });
    } else if (p.id === '4') {
      initialJournals.push({
        id: 'j-2',
        date: '2026-05-30',
        category: 'repotting',
        title: 'Repotting into Breathable Pot',
        notes: 'Roots showed minor crowding. Moved up into structured 10" terracotta using loose, fertile potting soil.',
        plantHeight: 52
      });
    }

    return {
      ...p,
      wateringIntervalDays,
      lastWateredDate,
      fertilizerIntervalDays,
      lastFertilizedDate,
      lastRepottedDate,
      repotIntervalMonths,
      spaceId: p.spaceId || (p.id === '1' || p.id === '2' ? 's1' : p.id === '3' || p.id === '4' ? 's3' : 's1'),
      journals: initialJournals
    };
  });
};

export const GardenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plants, setPlants] = useState<Plant[]>(() => initializePlantsWithCare(INITIAL_PLANTS));
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [spaces, setSpaces] = useState<Space[]>(INITIAL_SPACES);
  const [tips] = useState<Tip[]>(INITIAL_TIPS);

  // Sync dynamic plant water/fertilizer needs to custom generated today's task structure!
  useEffect(() => {
    // Generate tasks automatically based on plants that have watering or fertilizing needs today!
    // Today is "2026-06-15"
    const todayStr = "2026-06-15";
    const todayTime = new Date(todayStr).getTime();

    const careTasks: Task[] = [];
    plants.forEach(p => {
      // Watering check
      if (p.lastWateredDate && p.wateringIntervalDays) {
        const lastWaterDate = new Date(p.lastWateredDate);
        const nextWaterDate = new Date(lastWaterDate.getTime() + p.wateringIntervalDays * 24 * 60 * 60 * 1000);
        
        // If due today or in the past
        if (nextWaterDate.getTime() <= todayTime) {
          const overdueDays = Math.max(0, Math.round((todayTime - nextWaterDate.getTime()) / (24 * 60 * 60 * 1000)));
          careTasks.push({
            id: `auto-water-${p.id}`,
            type: 'water',
            title: `Water ${p.name}`,
            subtitle: overdueDays > 0 ? `Overdue by ${overdueDays}d • ${p.habitat}` : `Scheduled today • ${p.habitat}`,
            completed: false
          });
        }
      }

      // Fertilizer check
      if (p.lastFertilizedDate && p.fertilizerIntervalDays) {
        const lastFeedDate = new Date(p.lastFertilizedDate);
        const nextFeedDate = new Date(lastFeedDate.getTime() + p.fertilizerIntervalDays * 24 * 60 * 60 * 1000);

        if (nextFeedDate.getTime() <= todayTime) {
          careTasks.push({
            id: `auto-feed-${p.id}`,
            type: 'feed',
            title: `Feed/Fertilize ${p.name}`,
            subtitle: `Monthly boost due • Nourishment required`,
            completed: false
          });
        }
      }
    });

    // Merge custom tasks and auto-generated care tasks. Maintain user task completions.
    setTasks(prevTasks => {
      // Keep static custom tasks (like t1, t2 etc.) and custom users tasks, but wipe stale auto-generated tasks
      const nonAutoTasks = prevTasks.filter(t => !t.id.startsWith('auto-'));
      
      // Merge: if auto task was marked active, keep it or append it
      const merged = [...nonAutoTasks];
      careTasks.forEach(ct => {
        const existingCompleted = prevTasks.find(t => t.id === ct.id && t.completed);
        if (existingCompleted) {
          merged.push({ ...ct, completed: true });
        } else {
          merged.push(ct);
        }
      });

      return merged;
    });
  }, [plants]);

  // Cross-functional logic: Update space plant counts & status alerts when plants change
  useEffect(() => {
    setSpaces(prevSpaces => 
      prevSpaces.map(space => {
        const spacePlants = plants.filter(p => p.spaceId === space.id);
        const hasWarning = spacePlants.some(p => p.healthStatus === 'Needs Attention');
        
        let status = space.status;
        let alert = space.alert;

        if (spacePlants.length > 0) {
          if (hasWarning) {
            status = 'Dry Soil';
            alert = 'Plants need care soon';
          } else {
            status = 'Lush';
            alert = undefined;
          }
        }

        return {
          ...space,
          plantCount: spacePlants.length,
          status,
          alert
        };
      })
    );
  }, [plants]);

  const addPlant = (plant: Omit<Plant, 'id'>) => {
    const todayStr = "2026-06-15";
    const daysMatch = plant.watering?.match(/(\d+)/);
    const wateringIntervalDays = daysMatch ? parseInt(daysMatch[1], 10) : 7;

    const newPlant: Plant = { 
      ...plant, 
      id: Date.now().toString(),
      wateringIntervalDays,
      lastWateredDate: todayStr,
      lastFertilizedDate: todayStr,
      fertilizerIntervalDays: 14,
      lastRepottedDate: todayStr,
      repotIntervalMonths: 12,
      journals: [
        {
          id: `j-${Date.now()}`,
          date: todayStr,
          category: 'general',
          title: 'Registered in My Garden',
          notes: `Added ${plant.name} to my garden collection. Light: ${plant.light}, Habitat: ${plant.habitat}.`
        }
      ]
    };
    setPlants(prev => [newPlant, ...prev]);
  };

  const updatePlant = (id: string, updatedPlant: Partial<Plant>) => {
    setPlants(prev => prev.map(p => p.id === id ? { ...p, ...updatedPlant } : p));
  };

  const deletePlant = (id: string) => {
    setPlants(prev => prev.filter(p => p.id !== id));
  };

  const completeTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: true } : t));

    // Side effect: If completing an auto watering/feeding task, trigger care logs automatically!
    if (id.startsWith('auto-water-')) {
      const plantId = id.replace('auto-water-', '');
      recordWatering(plantId);
    } else if (id.startsWith('auto-feed-')) {
      const plantId = id.replace('auto-feed-', '');
      recordFertilization(plantId);
    }
  };

  const addTask = (task: Omit<Task, 'id' | 'completed'>) => {
    const newTask = { ...task, id: `t${Date.now()}`, completed: false };
    setTasks(prev => [newTask, ...prev]);
  };

  const addSpace = (space: Omit<Space, 'id' | 'plantCount'>) => {
    const newSpace: Space = { ...space, id: `s${Date.now()}`, plantCount: 0, status: 'Stable' };
    setSpaces(prev => [...prev, newSpace]);
  };

  const updateSpace = (id: string, updatedSpace: Partial<Space>) => {
    setSpaces(prev => prev.map(s => s.id === id ? { ...s, ...updatedSpace } : s));
  };

  const deleteSpace = (id: string) => {
    setSpaces(prev => prev.filter(s => s.id !== id));
  };

  // Add Journal Entry
  const addJournalEntry = (plantId: string, entry: Omit<JournalEntry, 'id'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: `j-${Date.now()}`
    };

    setPlants(prev => prev.map(p => {
      if (p.id === plantId) {
        const list = p.journals ? [newEntry, ...p.journals] : [newEntry];
        // If height is recorded in journal, we can update some dynamic status too if necessary
        return {
          ...p,
          journals: list
        };
      }
      return p;
    }));
  };

  // Update Journal Entry
  const updateJournalEntry = (plantId: string, entryId: string, entry: Partial<JournalEntry>) => {
    setPlants(prev => prev.map(p => {
      if (p.id === plantId && p.journals) {
        return {
          ...p,
          journals: p.journals.map(j => j.id === entryId ? { ...j, ...entry } : j)
        };
      }
      return p;
    }));
  };

  // Delete Journal Entry
  const deleteJournalEntry = (plantId: string, entryId: string) => {
    setPlants(prev => prev.map(p => {
      if (p.id === plantId && p.journals) {
        return {
          ...p,
          journals: p.journals.filter(j => j.id !== entryId)
        };
      }
      return p;
    }));
  };

  // Record Watering Now
  const recordWatering = (plantId: string, dateString?: string) => {
    const todayStr = dateString || "2026-06-15";
    setPlants(prev => prev.map(p => {
      if (p.id === plantId) {
        // Prevent duplicate journal entry on the same date for watering
        const alreadyRecorded = p.journals?.some(j => j.date === todayStr && j.category === 'watering');
        if (alreadyRecorded) return p;

        const newJournal: JournalEntry = {
          id: `j-${Date.now()}`,
          date: todayStr,
          category: 'watering',
          title: 'Watered Plant',
          notes: 'Soaked soil thoroughly until it drained. Restored hydration level!'
        };
        const currentJournals = p.journals ? [newJournal, ...p.journals] : [newJournal];
        
        return {
          ...p,
          vitality: Math.min(100, Math.max(90, p.vitality + 15)), // Boost vitality to 90-100
          healthStatus: 'Excellent' as const,
          lastWateredDate: todayStr,
          journals: currentJournals
        };
      }
      return p;
    }));

    // Synergic Sync with Task/To-Do list
    setTasks(prevTasks => prevTasks.map(t => 
      t.id === `auto-water-${plantId}` ? { ...t, completed: true } : t
    ));
  };

  // Record Fertilization Now
  const recordFertilization = (plantId: string, dateString?: string) => {
    const todayStr = dateString || "2026-06-15";
    setPlants(prev => prev.map(p => {
      if (p.id === plantId) {
        // Prevent duplicate journal entry on same date for fertilizing
        const alreadyRecorded = p.journals?.some(j => j.date === todayStr && j.category === 'fertilizing');
        if (alreadyRecorded) return p;

        const newJournal: JournalEntry = {
          id: `j-${Date.now()}`,
          date: todayStr,
          category: 'fertilizing',
          title: 'Fed with Liquid Fertilizer',
          notes: 'Supplied organic NPK fertilizer diluted in water. Leaf growth nutrient boost.'
        };
        const currentJournals = p.journals ? [newJournal, ...p.journals] : [newJournal];
        
        return {
          ...p,
          vitality: Math.min(100, p.vitality + 10),
          lastFertilizedDate: todayStr,
          journals: currentJournals
        };
      }
      return p;
    }));

    // Synergic Sync with Task/To-Do list
    setTasks(prevTasks => prevTasks.map(t => 
      t.id === `auto-feed-${plantId}` ? { ...t, completed: true } : t
    ));
  };

  // Record Repotting Now
  const recordRepotting = (plantId: string, dateString?: string) => {
    const todayStr = dateString || "2026-06-15";
    setPlants(prev => prev.map(p => {
      if (p.id === plantId) {
        const newJournal: JournalEntry = {
          id: `j-${Date.now()}`,
          date: todayStr,
          category: 'repotting',
          title: 'Repotted with Premium Soil',
          notes: 'Moved into fresh fertile soil. Root zone aerated and upgraded.'
        };
        const currentJournals = p.journals ? [newJournal, ...p.journals] : [newJournal];
        
        return {
          ...p,
          vitality: Math.min(100, p.vitality + 5),
          lastRepottedDate: todayStr,
          journals: currentJournals
        };
      }
      return p;
    }));
  };

  return (
    <div id="garden-provider-root">
      <GardenContext.Provider value={{ 
        plants, tasks, spaces, tips,
        addPlant, updatePlant, deletePlant,
        completeTask, addTask,
        addSpace, updateSpace, deleteSpace,
        addJournalEntry, updateJournalEntry, deleteJournalEntry,
        recordWatering, recordFertilization, recordRepotting
      }}>
        {children}
      </GardenContext.Provider>
    </div>
  );
};

export const useGarden = () => {
  const context = useContext(GardenContext);
  if (context === undefined) {
    throw new Error('useGarden must be used within a GardenProvider');
  }
  return context;
};
