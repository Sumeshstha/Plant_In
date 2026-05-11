import { motion, AnimatePresence } from 'motion/react';
import TopAppBar from '../components/TopAppBar';
import { CheckCircle2, AlertCircle, Droplets, Wind, ChevronRight, Sun, Leaf, Check, Plus, X, Calendar } from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';
import { useGarden } from '../context/GardenContext';
import React, { useState } from 'react';

export default function Home() {
  const { openSidebar } = useOutletContext<{ openSidebar: () => void }>();
  const { tasks, spaces, tips, completeTask, addTask } = useGarden();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  const pendingTasks = tasks.filter(t => !t.completed);

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
      
      <main className="pt-20 px-6 space-y-10 pb-32">
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
        <section>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-headline font-bold text-4xl text-on-surface tracking-tight mb-2"
          >
            Hello, Elena!
          </motion.h1>
          <p className="font-body text-on-surface-variant text-lg">Your green oasis is thriving today.</p>
        </section>

        {/* Today's Tasks Summary */}
        <section>
          <div className="bg-surface-container-low p-8 rounded-lg relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary-fixed opacity-20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline font-bold text-xl flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {pendingTasks.map((task) => (
                    <motion.div 
                      key={task.id} 
                      layout
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-surface-container-lowest p-5 rounded-lg flex items-center justify-between border-l-4 border-primary shadow-sm hover:shadow-md transition-shadow group/task"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                          {task.type === 'water' ? <Droplets className="w-6 h-6" /> : <Wind className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="font-headline font-bold text-on-surface">{task.title}</p>
                          <p className="font-body text-sm text-on-surface-variant">{task.subtitle}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => completeTask(task.id)}
                        className="w-10 h-10 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all active:scale-95 group-hover/task:border-primary"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {pendingTasks.length === 0 && (
                  <p className="text-center py-6 text-on-surface-variant italic w-full">All tasks completed! Coffee time? ☕</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Smart Tools Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-headline font-bold text-2xl">Smart Tools</h2>
            <Link to="/tools" className="text-primary font-bold text-sm uppercase tracking-wider hover:opacity-70 transition-opacity">View All</Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Link to="/tools/watering" className="bg-surface-container-low p-5 rounded-2xl flex flex-col items-center gap-3 transition-all hover:bg-surface-container active:scale-95 text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <Droplets className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Watering</span>
            </Link>
            <Link to="/tools/calendar" className="bg-surface-container-low p-5 rounded-2xl flex flex-col items-center gap-3 transition-all hover:bg-surface-container active:scale-95 text-center">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Calendar</span>
            </Link>
            <Link to="/tools/repotting" className="bg-surface-container-low p-5 rounded-2xl flex flex-col items-center gap-3 transition-all hover:bg-surface-container active:scale-95 text-center">
              <div className="w-12 h-12 bg-tertiary/10 text-tertiary rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Repot</span>
            </Link>
          </div>
        </section>

        {/* My Spaces Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-headline font-bold text-2xl">My Spaces</h2>
            <Link to="/room-planner" className="text-primary font-bold text-sm uppercase tracking-wider hover:opacity-70 transition-opacity">Edit Spaces</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {spaces.map((space) => (
              <Link key={space.id} to={`/space/${space.id}`} className="group cursor-pointer">
                <div className="relative h-72 rounded-lg overflow-hidden mb-4 shadow-sm hover:shadow-xl transition-all duration-500">
                  <img src={space.image} alt={space.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                    <div>
                      <h3 className="text-white font-headline font-bold text-xl">{space.name}</h3>
                      <p className="text-white/80 font-body text-sm">{space.plantCount} Plants total</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      <span className="text-white text-xs font-bold">{space.status}</span>
                    </div>
                  </div>
                </div>
                {(space as any).alert && (
                  <div className="px-1 flex items-center gap-2 text-error text-sm font-bold animate-pulse">
                    <AlertCircle className="w-4 h-4" />
                    {(space as any).alert}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Tips Carousel */}
        <section className="pb-32">
          <h2 className="font-headline font-bold text-2xl mb-6">Expert Tips for Today</h2>
          <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-4 -mx-2 px-2">
            {tips.map((tip) => (
              <div key={tip.id} className={`flex-shrink-0 w-80 ${tip.color} p-6 rounded-lg relative overflow-hidden`}>
                <div className="absolute -bottom-4 -right-4 opacity-10">
                  {tip.icon === 'Sun' ? <Sun className="w-24 h-24" /> : <Leaf className="w-24 h-24" />}
                </div>
                <h4 className="font-headline font-bold text-on-surface text-lg mb-2">{tip.title}</h4>
                <p className="font-body text-sm text-on-surface-variant font-medium">{tip.content}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
