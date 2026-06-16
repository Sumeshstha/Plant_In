import { motion, AnimatePresence } from 'motion/react';
import TopAppBar from '../components/TopAppBar';
import { CheckCircle2, AlertCircle, Droplets, Wind, ChevronRight, Sun, Leaf, Check, Plus, X, Calendar, Sparkles, MapPin } from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';
import { useGarden } from '../context/GardenContext';
import React, { useState, useEffect } from 'react';

export default function Home() {
  const { openSidebar } = useOutletContext<{ openSidebar: () => void }>();
  const { tasks, spaces, tips, completeTask, addTask, plants } = useGarden();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [layoutDensity, setLayoutDensity] = useState(() => localStorage.getItem('pref-density') || 'compact');

  useEffect(() => {
    const handleStorage = () => {
      setLayoutDensity(localStorage.getItem('pref-density') || 'compact');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);
  
  const pendingTasks = tasks.filter(t => !t.completed);

  const findRoomForTask = (task: typeof tasks[0]) => {
    let plantId = '';
    if (task.id.startsWith('auto-water-')) {
      plantId = task.id.replace('auto-water-', '');
    } else if (task.id.startsWith('auto-feed-')) {
      plantId = task.id.replace('auto-feed-', '');
    } else {
      const titleLower = task.title.toLowerCase();
      const matchingPlant = plants.find(p => titleLower.includes(p.name.toLowerCase()));
      if (matchingPlant) {
        plantId = matchingPlant.id;
      }
    }

    if (plantId) {
      const plant = plants.find(p => p.id === plantId);
      if (plant && plant.spaceId) {
        const space = spaces.find(s => s.id === plant.spaceId);
        return space ? space.name : null;
      }
    }
    return null;
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    addTask({
      title: newTaskTitle,
      subtitle: 'New custom task',
      type: 'water',
    });
    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  return (
    <div className="bg-background min-h-screen">
      <TopAppBar showProfile showSearch title="PlantIn" onMenuClick={openSidebar} />
      
      <main className={layoutDensity === 'compact' ? "pt-16 px-4 space-y-6 pb-24 md:px-6 md:space-y-10" : "pt-20 px-6 space-y-10 pb-32"}>
        <AnimatePresence>
          {isAddingTask && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white w-full max-w-sm rounded-3xl p-8 space-y-6 shadow-2xl"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-headline font-bold text-xl">New Task</h3>
                  <button onClick={() => setIsAddingTask(false)} className="p-2 hover:bg-surface-container rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleAddTask} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Task Title</label>
                    <input 
                      autoFocus
                      value={newTaskTitle}
                      onChange={e => setNewTaskTitle(e.target.value)}
                      placeholder="e.g. Fertilize Monstera"
                      className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary text-on-surface"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Create Task
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Welcome */}
        <section className={layoutDensity === 'compact' ? "mb-1" : ""}>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`font-headline font-bold text-on-surface tracking-tight ${layoutDensity === 'compact' ? 'text-3xl mb-1' : 'text-4xl mb-2'}`}
          >
            Hello, Elena!
          </motion.h1>
          <p className={`font-body text-on-surface-variant ${layoutDensity === 'compact' ? 'text-sm' : 'text-lg'}`}>Your green oasis is thriving today.</p>
        </section>

        {/* Today's Tasks Summary */}
        <section>
          <div className={`bg-surface-container-low rounded-2xl relative overflow-hidden group transition-all duration-300 ${layoutDensity === 'compact' ? 'p-4 md:p-8' : 'p-8'}`}>
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary-fixed opacity-20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className={`flex items-center justify-between ${layoutDensity === 'compact' ? 'mb-4' : 'mb-6'}`}>
                <h2 className={`font-headline font-bold flex items-center gap-2 ${layoutDensity === 'compact' ? 'text-lg' : 'text-xl'}`}>
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Today’s Tasks
                </h2>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsAddingTask(true)}
                    className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary-fixed px-3 py-1 rounded-full">
                    {pendingTasks.length} Pending
                  </span>
                </div>
              </div>
              {/* Grouped Tasks Section */}
              <div className={layoutDensity === 'compact' ? "space-y-4" : "space-y-8"}>
                {/* 1. Watering Routine Group */}
                {pendingTasks.filter(t => t.type === 'water').length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-headline font-bold text-xs text-blue-500 dark:text-blue-400 capitalize tracking-widest flex items-center gap-1.5 px-1">
                      <Droplets className="w-4 h-4 text-blue-500 shrink-0" />
                      <span>Watering Routine</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <AnimatePresence mode="popLayout">
                        {pendingTasks.filter(t => t.type === 'water').map((task) => {
                          const roomName = findRoomForTask(task);
                          return (
                            <motion.div 
                              key={task.id} 
                              layout
                              exit={{ opacity: 0, x: -20 }}
                              className={`bg-surface-container-lowest rounded-xl flex items-center justify-between border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow group/task ${layoutDensity === 'compact' ? 'p-3' : 'p-5'}`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`rounded-full flex items-center justify-center bg-blue-50 dark:bg-blue-950/40 text-blue-500 border border-blue-100 dark:border-blue-900/10 shrink-0 ${layoutDensity === 'compact' ? 'w-10 h-10' : 'w-12 h-12'}`}>
                                  <Droplets className={layoutDensity === 'compact' ? 'w-5 h-5' : 'w-6 h-6'} />
                                </div>
                                <div className="min-w-0">
                                  <p className={`font-headline font-semibold text-on-surface truncate ${layoutDensity === 'compact' ? 'text-sm' : 'text-base'}`}>{task.title}</p>
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 text-on-surface-variant text-[11px] mt-0.5">
                                    <span className="font-body font-medium">{task.subtitle}</span>
                                    {roomName && (
                                      <span className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 bg-blue-500/5 dark:bg-blue-400/5 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider shrink-0 w-max">
                                        <MapPin className="w-2.5 h-2.5 text-blue-400" />
                                        <span>{roomName}</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <button 
                                onClick={() => completeTask(task.id)}
                                className={`rounded-full border-2 border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all active:scale-95 group-hover/task:border-primary shrink-0 ${layoutDensity === 'compact' ? 'w-8 h-8' : 'w-10 h-10'}`}
                              >
                                <Check className={layoutDensity === 'compact' ? 'w-4 h-4' : 'w-5 h-5'} />
                              </button>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* 2. Nourishment & Fertilizers Group */}
                {pendingTasks.filter(t => t.type === 'feed').length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-headline font-bold text-xs text-amber-500 dark:text-amber-400 capitalize tracking-widest flex items-center gap-1.5 px-1">
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Fertilizers & Nourishment</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <AnimatePresence mode="popLayout">
                        {pendingTasks.filter(t => t.type === 'feed').map((task) => {
                          const roomName = findRoomForTask(task);
                          return (
                            <motion.div 
                              key={task.id} 
                              layout
                              exit={{ opacity: 0, x: -20 }}
                              className={`bg-surface-container-lowest rounded-xl flex items-center justify-between border-l-4 border-amber-500 shadow-sm hover:shadow-md transition-shadow group/task ${layoutDensity === 'compact' ? 'p-3' : 'p-5'}`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`rounded-full flex items-center justify-center bg-amber-50 dark:bg-amber-950/40 text-amber-500 border border-amber-100 dark:border-amber-900/10 shrink-0 ${layoutDensity === 'compact' ? 'w-10 h-10' : 'w-12 h-12'}`}>
                                  <Sparkles className={layoutDensity === 'compact' ? 'w-5 h-5' : 'w-6 h-6'} />
                                </div>
                                <div className="min-w-0">
                                  <p className={`font-headline font-semibold text-on-surface truncate ${layoutDensity === 'compact' ? 'text-sm' : 'text-base'}`}>{task.title}</p>
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 text-on-surface-variant text-[11px] mt-0.5">
                                    <span className="font-body font-medium">{task.subtitle}</span>
                                    {roomName && (
                                      <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 bg-amber-500/5 dark:bg-amber-400/5 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider shrink-0 w-max">
                                        <MapPin className="w-2.5 h-2.5 text-amber-400" />
                                        <span>{roomName}</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <button 
                                onClick={() => completeTask(task.id)}
                                className={`rounded-full border-2 border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all active:scale-95 group-hover/task:border-primary shrink-0 ${layoutDensity === 'compact' ? 'w-8 h-8' : 'w-10 h-10'}`}
                              >
                                <Check className={layoutDensity === 'compact' ? 'w-4 h-4' : 'w-5 h-5'} />
                              </button>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* 3. Other Maintenance Chores */}
                {pendingTasks.filter(t => t.type !== 'water' && t.type !== 'feed').length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-headline font-bold text-xs text-emerald-500 dark:text-emerald-400 capitalize tracking-widest flex items-center gap-1.5 px-1">
                      <Wind className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Other Maintenance Chores</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <AnimatePresence mode="popLayout">
                        {pendingTasks.filter(t => t.type !== 'water' && t.type !== 'feed').map((task) => {
                          const roomName = findRoomForTask(task);
                          return (
                            <motion.div 
                              key={task.id} 
                              layout
                              exit={{ opacity: 0, x: -20 }}
                              className={`bg-surface-container-lowest rounded-xl flex items-center justify-between border-l-4 border-emerald-500 shadow-sm hover:shadow-md transition-shadow group/task ${layoutDensity === 'compact' ? 'p-3' : 'p-5'}`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`rounded-full flex items-center justify-center bg-primary-fixed text-primary shrink-0 ${layoutDensity === 'compact' ? 'w-10 h-10' : 'w-12 h-12'}`}>
                                  <Wind className={layoutDensity === 'compact' ? 'w-5 h-5' : 'w-6 h-6'} />
                                </div>
                                <div className="min-w-0">
                                  <p className={`font-headline font-semibold text-on-surface truncate ${layoutDensity === 'compact' ? 'text-sm' : 'text-base'}`}>{task.title}</p>
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 text-on-surface-variant text-[11px] mt-0.5">
                                    <span className="font-body font-medium">{task.subtitle}</span>
                                    {roomName && (
                                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 dark:bg-emerald-400/5 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider shrink-0 w-max">
                                        <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                                        <span>{roomName}</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <button 
                                onClick={() => completeTask(task.id)}
                                className={`rounded-full border-2 border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all active:scale-95 group-hover/task:border-primary shrink-0 ${layoutDensity === 'compact' ? 'w-8 h-8' : 'w-10 h-10'}`}
                              >
                                <Check className={layoutDensity === 'compact' ? 'w-4 h-4' : 'w-5 h-5'} />
                              </button>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {pendingTasks.length === 0 && (
                  <div className="text-center py-10 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/20">
                    <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3 opacity-60 animate-bounce" />
                    <p className="font-headline font-bold text-on-surface">All tasks completed! Coffee time? ☕</p>
                    <p className="text-xs text-on-surface-variant mt-1">Your plants are fully nurtured, satisfied, and happy!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Smart Tools Section */}
        <section>
          <div className={`flex items-center justify-between ${layoutDensity === 'compact' ? 'mb-4' : 'mb-8'}`}>
            <h2 className={`font-headline font-bold ${layoutDensity === 'compact' ? 'text-lg' : 'text-xl'}`}>Smart Tools</h2>
            <Link to="/tools" className="text-primary font-bold text-xs uppercase tracking-wider hover:opacity-70 transition-opacity">View All</Link>
          </div>
          <div className={`grid grid-cols-3 ${layoutDensity === 'compact' ? 'gap-3' : 'gap-4'}`}>
            <Link to="/tools/watering" className={`bg-surface-container-low rounded-2xl flex flex-col items-center transition-all hover:bg-surface-container active:scale-95 text-center ${layoutDensity === 'compact' ? 'p-3 gap-1.5' : 'p-5 gap-3'}`}>
              <div className={`bg-blue-100 text-blue-600 rounded-full flex items-center justify-center ${layoutDensity === 'compact' ? 'w-10 h-10' : 'w-12 h-12'}`}>
                <Droplets className={layoutDensity === 'compact' ? 'w-5 h-5' : 'w-6 h-6'} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Watering</span>
            </Link>
            <Link to="/tools/calendar" className={`bg-surface-container-low rounded-2xl flex flex-col items-center transition-all hover:bg-surface-container active:scale-95 text-center ${layoutDensity === 'compact' ? 'p-3 gap-1.5' : 'p-5 gap-3'}`}>
              <div className={`bg-primary/10 text-primary rounded-full flex items-center justify-center ${layoutDensity === 'compact' ? 'w-10 h-10' : 'w-12 h-12'}`}>
                <Calendar className={layoutDensity === 'compact' ? 'w-5 h-5' : 'w-6 h-6'} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Calendar</span>
            </Link>
            <Link to="/tools/repotting" className={`bg-surface-container-low rounded-2xl flex flex-col items-center transition-all hover:bg-surface-container active:scale-95 text-center ${layoutDensity === 'compact' ? 'p-3 gap-1.5' : 'p-5 gap-3'}`}>
              <div className={`bg-tertiary/10 text-tertiary rounded-full flex items-center justify-center ${layoutDensity === 'compact' ? 'w-10 h-10' : 'w-12 h-12'}`}>
                <Leaf className={layoutDensity === 'compact' ? 'w-5 h-5' : 'w-6 h-6'} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Repot</span>
            </Link>
          </div>
        </section>

        {/* My Spaces Grid */}
        <section>
          <div className={`flex items-center justify-between ${layoutDensity === 'compact' ? 'mb-4' : 'mb-8'}`}>
            <h2 className={`font-headline font-bold ${layoutDensity === 'compact' ? 'text-lg' : 'text-xl'}`}>My Spaces</h2>
            <Link to="/room-planner" className="text-primary font-bold text-xs uppercase tracking-wider hover:opacity-70 transition-opacity">Edit Spaces</Link>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${layoutDensity === 'compact' ? 'gap-4 font-sans' : 'gap-8 font-sans'}`}>
            {spaces.map((space) => (
              <Link key={space.id} to={`/space/${space.id}`} className="group cursor-pointer">
                <div className={`relative rounded-2xl overflow-hidden transition-all duration-500 shadow-sm hover:shadow-xl ${layoutDensity === 'compact' ? 'h-44 md:h-52 mb-2' : 'h-72 mb-4'}`}>
                  <img src={space.image} alt={space.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                    <div>
                      <h3 className={`text-white font-headline font-bold ${layoutDensity === 'compact' ? 'text-lg' : 'text-xl'}`}>{space.name}</h3>
                      <p className="text-white/80 font-body text-xs">{space.plantCount} Plants total</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
                      <span className="text-white text-[10px] font-bold">{space.status}</span>
                    </div>
                  </div>
                </div>
                {(space as any).alert && (
                  <div className="px-1 flex items-center gap-1.5 text-error text-xs font-bold animate-pulse">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {(space as any).alert}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Tips Carousel */}
        <section className={layoutDensity === 'compact' ? "pb-20" : "pb-32"}>
          <h2 className={`font-headline font-bold mb-4 ${layoutDensity === 'compact' ? 'text-lg' : 'text-xl'}`}>Expert Tips for Today</h2>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-2 px-2">
            {tips.map((tip) => (
              <div key={tip.id} className={`flex-shrink-0 ${tip.color} rounded-2xl relative overflow-hidden transition-all ${layoutDensity === 'compact' ? 'w-72 p-4' : 'w-80 p-6'}`}>
                <div className="absolute -bottom-4 -right-4 opacity-10">
                  {tip.icon === 'Sun' ? <Sun className="w-20 h-20" /> : <Leaf className="w-20 h-20" />}
                </div>
                <h4 className="font-headline font-bold text-on-surface text-base mb-1.5">{tip.title}</h4>
                <p className="font-body text-xs text-on-surface-variant font-medium leading-relaxed">{tip.content}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
