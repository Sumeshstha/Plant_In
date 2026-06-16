import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { 
  ArrowLeft, Bell, Sun, Droplets, Thermometer, Info, ChevronRight, Menu, 
  Trash2, Edit2, Check, X, Camera, Leaf, Sprout, Heart, Plus, Sparkles, Calendar, ClipboardList 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGarden } from '../context/GardenContext';
import React, { useState } from 'react';
import { JournalEntry } from '../types';

export default function PlantProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openSidebar } = useOutletContext<{ openSidebar: () => void }>();
  const { 
    plants, updatePlant, deletePlant, 
    addJournalEntry, deleteJournalEntry, 
    recordWatering, recordFertilization, recordRepotting 
  } = useGarden();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  
  // Journal Modal State
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [entryForm, setEntryForm] = useState({
    title: '',
    category: 'general' as JournalEntry['category'],
    notes: '',
    plantHeight: ''
  });

  const plant = plants.find(p => p.id === id);

  if (!plant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-4">
        <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center text-outline">
          <Info className="w-10 h-10" />
        </div>
        <h2 className="font-headline font-bold text-2xl">Plant not found</h2>
        <button onClick={() => navigate('/garden')} className="text-primary font-bold">Back to Garden</button>
      </div>
    );
  }

  const [editForm, setEditForm] = useState({ ...plant });

  const [reminderState, setReminderState] = useState({
    watering: true,
    misting: true
  });

  const handleSave = () => {
    updatePlant(plant.id, editForm);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this plant?')) {
      deletePlant(plant.id);
      navigate('/garden');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddJournalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryForm.title) return;
    
    addJournalEntry(plant.id, {
      date: '2026-06-15', // Simulation today's date
      category: entryForm.category,
      title: entryForm.title,
      notes: entryForm.notes,
      plantHeight: entryForm.plantHeight ? parseFloat(entryForm.plantHeight) : undefined
    });

    setEntryForm({
      title: '',
      category: 'general',
      notes: '',
      plantHeight: ''
    });
    setShowAddEntry(false);
  };

  // Helper date metrics
  const nextWaterDateStr = (() => {
    if (plant.lastWateredDate && plant.wateringIntervalDays) {
      const waterDate = new Date(plant.lastWateredDate);
      const nextDate = new Date(waterDate.getTime() + plant.wateringIntervalDays * 24 * 60 * 60 * 1000);
      const today = new Date("2026-06-15");
      const diffTime = nextDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Due Today";
      if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
      return `Due in ${diffDays} days (${nextDate.toISOString().split('T')[0]})`;
    }
    return `Due in ${plant.watering}`;
  })();

  const nextFertilizeDateStr = (() => {
    if (plant.lastFertilizedDate && plant.fertilizerIntervalDays) {
      const feedDate = new Date(plant.lastFertilizedDate);
      const nextDate = new Date(feedDate.getTime() + plant.fertilizerIntervalDays * 24 * 60 * 60 * 1000);
      const today = new Date("2026-06-15");
      const diffTime = nextDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Due Today";
      if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
      return `Due in ${diffDays} days (${nextDate.toISOString().split('T')[0]})`;
    }
    return 'Due in 14 days';
  })();

  const getCategoryIcon = (category: JournalEntry['category']) => {
    switch(category) {
      case 'watering': return Droplets;
      case 'fertilizing': return Sparkles;
      case 'repotting': return Sprout;
      case 'new-growth': return Leaf;
      case 'pest-treatment': return Bell;
      default: return Heart;
    }
  };

  const getCategoryColor = (category: JournalEntry['category']) => {
    switch(category) {
      case 'watering': return 'text-blue-500 bg-blue-50 border-blue-100 dark:bg-blue-950/25';
      case 'fertilizing': return 'text-amber-500 bg-amber-50 border-amber-100 dark:bg-amber-950/25';
      case 'repotting': return 'text-emerald-500 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/25';
      case 'new-growth': return 'text-green-500 bg-green-50 border-green-100 dark:bg-green-950/25';
      case 'pest-treatment': return 'text-rose-500 bg-rose-50 border-rose-100 dark:bg-rose-950/25';
      default: return 'text-pink-500 bg-pink-50 border-pink-100 dark:bg-pink-950/25';
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md px-6 h-16 flex items-center justify-between border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface-container rounded-full transition-colors active:scale-95">
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <button onClick={openSidebar} className="p-2 hover:bg-surface-container rounded-full transition-colors active:scale-95">
            <Menu className="w-6 h-6 text-primary" />
          </button>
          <h1 className="font-headline font-bold text-xl text-primary">
            {isEditing ? 'Editing Plant' : 'Plant Profile'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                className="p-2 hover:bg-error/10 text-error rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <button 
                onClick={handleSave}
                className="p-2 hover:bg-primary/10 text-primary rounded-full transition-colors"
              >
                <Check className="w-6 h-6" />
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleDelete}
                className="p-2 hover:bg-error/10 text-error rounded-full transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-primary/10 text-primary rounded-full transition-colors"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </header>
      
      <main className="pt-16 pb-32">
        {/* Hero Section */}
        <section className="relative w-full h-[397px] overflow-hidden">
          <img src={isEditing ? editForm.image : plant.image} alt={plant.name} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
          {isEditing && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <label className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full text-white font-bold text-sm border border-white/20 cursor-pointer hover:bg-white/30 transition-colors">
                <Camera className="w-5 h-5" />
                <span>Change Photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          )}
        </section>

        {/* Plant Identity & Health */}
        <section className="px-6 -mt-12 relative z-10">
          <div className="bg-surface-container-lowest rounded-lg p-8 shadow-sm border border-outline-variant/10">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Plant Name</label>
                  <input 
                    value={editForm.name}
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary text-on-surface font-bold text-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Scientific Name</label>
                  <input 
                    value={editForm.scientificName}
                    onChange={e => setEditForm({...editForm, scientificName: e.target.value})}
                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary text-on-surface italic text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Watering Interval (Days)</label>
                    <input 
                      type="number"
                      value={editForm.wateringIntervalDays || ''}
                      onChange={e => setEditForm({...editForm, wateringIntervalDays: parseInt(e.target.value, 10) || 7})}
                      className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary text-on-surface text-sm font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Fertilizer Interval (Days)</label>
                    <input 
                      type="number"
                      value={editForm.fertilizerIntervalDays || ''}
                      onChange={e => setEditForm({...editForm, fertilizerIntervalDays: parseInt(e.target.value, 10) || 14})}
                      className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary text-on-surface text-sm font-semibold"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight mb-1">{plant.name}</h2>
                  <p className="font-body text-primary italic font-medium opacity-80">{plant.scientificName}</p>
                </div>
                <div className="bg-primary-fixed text-on-primary-fixed px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                  {plant.habitat}
                </div>
              </div>
            )}

            {/* Health Status Bar */}
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center px-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                <span>Health Status</span>
                <span className="text-primary font-bold">{plant.healthStatus}</span>
              </div>
              <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden flex">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${plant.vitality}%` }}
                  className="h-full bg-primary" 
                />
              </div>
            </div>

            {/* Care Quick Actions Bar */}
            {!isEditing && (
              <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-outline-variant/10">
                <button 
                  onClick={() => recordWatering(plant.id)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50/70 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold text-xs gap-1.5 transition-all active:scale-95"
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                    <Droplets className="w-5 h-5 text-blue-500" />
                  </div>
                  <span>Water Now</span>
                </button>
                <button 
                  onClick={() => recordFertilization(plant.id)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-50/70 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-semibold text-xs gap-1.5 transition-all active:scale-95"
                >
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-full">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </div>
                  <span>Fertilize</span>
                </button>
                <button 
                  onClick={() => recordRepotting(plant.id)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-50/70 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold text-xs gap-1.5 transition-all active:scale-95"
                >
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-full">
                    <Sprout className="w-5 h-5 text-emerald-500" />
                  </div>
                  <span>Repot</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Metric Tiles */}
        <section className="px-6 mt-10">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Light', value: isEditing ? editForm.light : plant.light, icon: Sun, key: 'light' },
              { label: 'Watering', value: isEditing ? editForm.watering : plant.watering, icon: Droplets, key: 'watering' },
              { label: 'Temp', value: isEditing ? editForm.temp : plant.temp, icon: Thermometer, key: 'temp' }
            ].map((metric) => (
              <div key={metric.label} className="bg-surface-container-low p-5 rounded-lg flex flex-col items-center text-center gap-3">
                <metric.icon className="w-6 h-6 text-primary" />
                <div className="w-full">
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-tighter">{metric.label}</p>
                  {isEditing ? (
                    <input 
                      value={editForm[metric.key as keyof typeof editForm] as string}
                      onChange={e => setEditForm({...editForm, [metric.key]: e.target.value})}
                      className="w-full bg-transparent border-none text-center p-0 focus:ring-0 font-headline font-bold text-xs text-on-surface"
                    />
                  ) : (
                    <p className="font-headline font-bold text-xs text-on-surface">{metric.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Live Care Schedulers */}
        {!isEditing && (
          <section className="px-6 mt-12 space-y-4">
            <h3 className="font-headline text-xl font-bold text-on-surface px-1 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              Dynamic Care Schedules
            </h3>
            <div className="space-y-4">
              {/* Watering schedule card */}
              <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/10 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-500">
                    <Droplets className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-on-surface text-sm">Watering Routine</h4>
                    <p className="font-body text-xs text-on-surface-variant">
                      Last Watered: <span className="font-semibold text-primary">{plant.lastWateredDate || 'N/A'}</span> • Frequency: {plant.wateringIntervalDays || 7} days
                    </p>
                    <p className="text-[10px] font-bold text-blue-500 uppercase mt-1 tracking-wider">{nextWaterDateStr}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setReminderState(prev => ({ ...prev, watering: !prev.watering }))}
                  className={`w-12 h-6 rounded-full relative flex items-center transition-colors ${reminderState.watering ? 'bg-primary' : 'bg-surface-container-highest'}`}
                >
                  <motion.div 
                    animate={{ x: reminderState.watering ? 24 : 4 }}
                    className="w-4 h-4 bg-white rounded-full absolute shadow-sm" 
                  />
                </button>
              </div>

              {/* Fertilization Schedule */}
              <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/10 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-500">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-on-surface text-sm">Fertilizer Timing</h4>
                    <p className="font-body text-xs text-on-surface-variant">
                      Last Fed: <span className="font-semibold text-primary">{plant.lastFertilizedDate || 'N/A'}</span> • Cycle: {plant.fertilizerIntervalDays || 14} days
                    </p>
                    <p className="text-[10px] font-bold text-amber-600 uppercase mt-1 tracking-wider">{nextFertilizeDateStr}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setReminderState(prev => ({ ...prev, misting: !prev.misting }))}
                  className={`w-12 h-6 rounded-full relative flex items-center transition-colors ${reminderState.misting ? 'bg-primary' : 'bg-surface-container-highest'}`}
                >
                  <motion.div 
                    animate={{ x: reminderState.misting ? 24 : 4 }}
                    className="w-4 h-4 bg-white rounded-full absolute shadow-sm" 
                  />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Details Tabs & Interactive Journal Creator */}
        <section className="mt-12">
          <div className="flex border-b border-surface-container overflow-x-auto hide-scrollbar px-6 gap-8">
            <button 
              onClick={() => setActiveTab('about')}
              className={`pb-4 border-b-2 font-headline font-bold whitespace-nowrap transition-all ${activeTab === 'about' ? 'border-primary text-on-surface' : 'border-transparent text-on-surface-variant opacity-60'}`}
            >
              About & Care Guides
            </button>
            <button 
              onClick={() => setActiveTab('journal')}
              className={`pb-4 border-b-2 font-headline font-bold whitespace-nowrap transition-all ${activeTab === 'journal' ? 'border-primary text-on-surface' : 'border-transparent text-on-surface-variant opacity-60'}`}
            >
              Journal & Growth ({plant.journals?.length || 0})
            </button>
          </div>
          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'about' ? (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-surface-container-low rounded-lg p-6 mb-8"
                >
                  <h4 className="font-headline font-bold text-lg mb-4">Plant Overview</h4>
                  {isEditing ? (
                    <textarea 
                      value={editForm.description}
                      onChange={e => setEditForm({...editForm, description: e.target.value})}
                      rows={4}
                      className="w-full bg-surface-container-lowest border-none rounded-xl p-4 focus:ring-2 focus:ring-primary text-sm font-body text-on-surface-variant resize-none"
                    />
                  ) : (
                    <p className="font-body text-on-surface-variant leading-relaxed text-sm mb-6">
                      {plant.description}
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-surface-container-lowest p-4 rounded-lg">
                      <p className="text-[10px] font-bold text-primary uppercase mb-1">Humidity Target</p>
                      <p className="text-sm font-semibold">High (60%+)</p>
                    </div>
                    <div className="bg-surface-container-lowest p-4 rounded-lg">
                      <p className="text-[10px] font-bold text-primary uppercase mb-1">Difficulty Level</p>
                      <p className="text-sm font-semibold">Beginner Friendly</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="journal"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-headline font-bold text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Growth Journey Logs
                    </h4>
                    <button 
                      onClick={() => setShowAddEntry(true)}
                      className="text-primary text-xs font-bold px-4 py-2 bg-primary/10 rounded-full hover:bg-primary/20 transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      Add Log
                    </button>
                  </div>

                  {/* Add Journal Entry inline Form popup */}
                  <AnimatePresence>
                    {showAddEntry && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 overflow-hidden space-y-4"
                      >
                        <h5 className="font-headline font-bold text-primary text-sm">New Growth Log</h5>
                        <form onSubmit={handleAddJournalSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase text-on-surface-variant">Log Title</label>
                              <input 
                                required
                                value={entryForm.title}
                                onChange={e => setEntryForm({...entryForm, title: e.target.value})}
                                placeholder="e.g. New leaf sprouted or Repotted"
                                className="w-full bg-surface-container-lowest border-none rounded-xl py-3 px-4 text-xs font-body focus:ring-2 focus:ring-primary"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase text-on-surface-variant">Category</label>
                              <select 
                                value={entryForm.category}
                                onChange={e => setEntryForm({...entryForm, category: e.target.value as JournalEntry['category']})}
                                className="w-full bg-surface-container-lowest border-none rounded-xl py-3 px-4 text-xs font-body focus:ring-2 focus:ring-primary"
                              >
                                <option value="general">General Update</option>
                                <option value="new-growth">New Leaf / Growth</option>
                                <option value="watering">Watering</option>
                                <option value="fertilizing">Fertilizing</option>
                                <option value="repotting">Repotting</option>
                                <option value="pest-treatment">Pest Control</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase text-on-surface-variant">Current Height (cm, optional)</label>
                              <input 
                                type="number"
                                step="any"
                                value={entryForm.plantHeight}
                                onChange={e => setEntryForm({...entryForm, plantHeight: e.target.value})}
                                placeholder="e.g. 52.4"
                                className="w-full bg-surface-container-lowest border-none rounded-xl py-3 px-4 text-xs font-body focus:ring-2 focus:ring-primary"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase text-on-surface-variant">Log Date</label>
                              <input 
                                type="text"
                                readOnly
                                value="2026-06-15"
                                className="w-full bg-surface-container-lowest/50 border-none rounded-xl py-3 px-4 text-xs font-body focus:ring-0 text-on-surface/40 cursor-not-allowed"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-on-surface-variant">Growth & Care Notes</label>
                            <textarea 
                              required
                              value={entryForm.notes}
                              onChange={e => setEntryForm({...entryForm, notes: e.target.value})}
                              placeholder="Describe leaf health, soil dryness, growth rate, or care actions taken."
                              rows={3}
                              className="w-full bg-surface-container-lowest border-none rounded-xl p-4 text-xs font-body focus:ring-2 focus:ring-primary resize-none"
                            />
                          </div>

                          <div className="flex gap-2 justify-end pt-2">
                            <button 
                              type="button" 
                              onClick={() => setShowAddEntry(false)}
                              className="px-4 py-2 text-xs font-bold text-on-surface bg-surface-container-highest rounded-full active:scale-95 transition-all"
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit" 
                              className="px-4 py-2 text-xs font-bold text-on-primary bg-primary rounded-full active:scale-95 transition-all"
                            >
                              Save Entry
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Timeline with list entries */}
                  <div className="border-l-2 border-primary/20 ml-4 pl-6 space-y-8 relative pt-4">
                    {plant.journals && plant.journals.length > 0 ? (
                      plant.journals.map((entry) => {
                        const IconComponent = getCategoryIcon(entry.category);
                        const colors = getCategoryColor(entry.category);
                        return (
                          <div key={entry.id} className="relative group/timeline">
                            {/* Dot / Icon container */}
                            <div className={`absolute -left-[45px] top-0 w-10 h-10 rounded-full border-2 border-background flex items-center justify-center shadow-sm ${colors}`}>
                              <IconComponent className="w-4 h-4" />
                            </div>

                            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-all">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{entry.date}</p>
                                    <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest bg-surface-container text-on-surface-variant">
                                      {entry.category}
                                    </span>
                                  </div>
                                  <h5 className="font-headline font-extrabold text-on-surface text-base">{entry.title}</h5>
                                </div>
                                <button 
                                  onClick={() => deleteJournalEntry(plant.id, entry.id)}
                                  className="p-1.5 text-on-surface-variant opacity-0 group-hover/timeline:opacity-100 hover:text-error hover:bg-error/10 rounded-full transition-all"
                                  title="Delete entry"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              <p className="font-body text-xs text-on-surface-variant leading-relaxed mt-3">{entry.notes}</p>
                              
                              {entry.plantHeight && (
                                <div className="mt-3 inline-flex items-center gap-1.5 bg-primary/5 text-primary px-3 py-1 rounded-full text-[10px] font-bold">
                                  <Leaf className="w-3.5 h-3.5" />
                                  <span>Recorded Height: <strong className="font-bold text-primary">{entry.plantHeight} cm</strong></span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <ClipboardList className="w-10 h-10 text-outline mx-auto mb-3 opacity-40" />
                        <p className="text-sm font-semibold text-on-surface-variant/70">No growth journals logged yet.</p>
                        <p className="text-xs text-on-surface-variant/50 mt-1">Record care tasks or click "Add Log" to document milestones!</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
}
