import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Sun, Droplets, Thermometer, Info, ChevronRight, Menu, Trash2, Edit2, Check, X, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import TopAppBar from '../components/TopAppBar';
import { useGarden } from '../context/GardenContext';
import { useState } from 'react';

export default function PlantProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { plants, updatePlant, deletePlant, spaces } = useGarden();
  const [isEditing, setIsEditing] = useState(false);
  
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

  return (
    <div className="bg-background min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md px-6 h-16 flex items-center justify-between border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface-container rounded-full transition-colors active:scale-95">
            <ArrowLeft className="w-6 h-6 text-primary" />
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
          <img src={plant.image} alt={plant.name} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
          {isEditing && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <button className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full text-white font-bold text-sm border border-white/20">
                <Camera className="w-5 h-5" />
                Change Photo
              </button>
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
                <span className="text-primary">{plant.healthStatus}</span>
              </div>
              <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden flex">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${plant.vitality}%` }}
                  className="h-full bg-primary" 
                />
              </div>
            </div>
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

        {/* Care Reminders */}
        {!isEditing && (
          <section className="px-6 mt-12">
            <h3 className="font-headline text-xl font-bold text-on-surface mb-6 px-1">Care Reminders</h3>
            <div className="space-y-4">
              {[
                { label: 'Watering', sub: `Due in ${plant.watering}`, icon: Droplets, color: 'bg-primary-fixed' },
                { label: 'Misting', sub: 'Daily at 8:00 AM', icon: Sun, color: 'bg-tertiary-fixed' }
              ].map((reminder) => (
                <div key={reminder.label} className="flex items-center justify-between bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/10 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${reminder.color} flex items-center justify-center text-primary`}>
                      <reminder.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-headline font-bold text-on-surface">{reminder.label}</p>
                      <p className="font-body text-xs text-on-surface-variant font-medium">{reminder.sub}</p>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative flex items-center">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Details Tabs */}
        <section className="mt-12">
          <div className="flex border-b border-surface-container overflow-x-auto hide-scrollbar px-6 gap-8">
            <button className="pb-4 border-b-2 border-primary font-headline font-bold text-on-surface whitespace-nowrap">About & Care Guides</button>
            <button className="pb-4 border-b-2 border-transparent font-headline font-bold text-on-surface-variant opacity-60 whitespace-nowrap">Journal & Growth</button>
          </div>
          <div className="p-8">
            <div className="bg-surface-container-low rounded-lg p-6 mb-8">
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
                  <p className="text-[10px] font-bold text-primary uppercase mb-1">Humidity</p>
                  <p className="text-sm font-semibold">High (60%+)</p>
                </div>
                <div className="bg-surface-container-lowest p-4 rounded-lg">
                  <p className="text-[10px] font-bold text-primary uppercase mb-1">Difficulty</p>
                  <p className="text-sm font-semibold">Beginner Friendly</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
