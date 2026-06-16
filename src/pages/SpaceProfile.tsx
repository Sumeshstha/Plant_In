import React, { useState } from 'react';
import { useParams, useNavigate, Link, useOutletContext } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Check, X, Thermometer, Droplets, LayoutGrid, ChevronRight, Camera, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGarden } from '../context/GardenContext';

export default function SpaceProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { spaces, plants, updateSpace, deleteSpace } = useGarden();
  const { openSidebar } = useOutletContext<{ openSidebar: () => void }>();
  
  const space = spaces.find(s => s.id === id);
  const spacePlants = plants.filter(p => p.spaceId === id);

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(space?.name || '');
  const [editedStatus, setEditedStatus] = useState(space?.status || 'Stable');
  const [editedFeatures, setEditedFeatures] = useState<string[]>(space?.featuresImages || []);

  const openEditModal = () => {
    setEditedName(space?.name || '');
    setEditedStatus(space?.status || 'Stable');
    setEditedFeatures(space?.featuresImages || []);
    setIsEditing(true);
  };

  const handlePhotoUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && space) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSpace(space.id, { image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!space) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-on-surface-variant">Space not found.</p>
        <button onClick={() => navigate('/')} className="ml-4 text-primary font-bold underline">Go Home</button>
      </div>
    );
  }

  const handleSave = () => {
    updateSpace(space.id, {
      name: editedName,
      status: editedStatus as any,
      featuresImages: editedFeatures
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this space? This will not delete the plants, but they will be unassigned.')) {
      deleteSpace(space.id);
      navigate('/');
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header Image Area */}
      <div className="h-80 relative overflow-hidden">
        <img 
          src={space.image} 
          alt={space.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center bg-transparent">
          <div className="flex gap-2">
            <button 
              onClick={() => navigate(-1)} 
              className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all shadow-lg"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={openSidebar} 
              className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all shadow-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={openEditModal}
              className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all shadow-lg"
            >
              <Edit2 className="w-6 h-6" />
            </button>
            <button 
              onClick={handleDelete}
              className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-error transition-all shadow-lg"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          </div>
        </header>

        <div className="absolute bottom-8 left-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1"
          >
            <div className="flex items-center gap-2">
              <h1 className="text-4xl font-headline font-black text-white">{space.name}</h1>
              {space.status !== 'Stable' && (
                <span className="bg-error text-on-error text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                  {space.status}
                </span>
              )}
            </div>
            <p className="text-white/80 font-bold uppercase tracking-widest text-[10px]">
              {space.plantCount} Plants Registered
            </p>
          </motion.div>
        </div>
      </div>

      <main className="px-6 -mt-6 relative z-10 space-y-8 pb-32">
        {/* Space Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link 
            to={`/room-planner?spaceId=${space.id}`}
            className="bg-primary p-6 rounded-3xl text-on-primary flex flex-col justify-between h-32 shadow-xl shadow-primary/20"
          >
            <LayoutGrid className="w-8 h-8" />
            <span className="font-bold">Edit Layout</span>
          </Link>
          <label className="bg-white p-6 rounded-3xl flex flex-col justify-between h-32 shadow-sm border border-outline-variant/10 cursor-pointer">
            <div className="flex justify-between items-start">
              <Camera className="w-8 h-8 text-on-surface-variant" />
              <ChevronRight className="w-4 h-4 text-outline" />
            </div>
            <span className="font-bold text-on-surface">Update Photo</span>
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpdate} />
          </label>
        </div>

        {/* Plants in this space */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-headline font-bold text-2xl">Assigned Plants</h2>
            <Link to="/add-plant" className="text-primary font-bold text-sm">Add New</Link>
          </div>

          <div className="space-y-3">
            {spacePlants.length > 0 ? (
              spacePlants.map(plant => (
                <Link 
                  key={plant.id} 
                  to={`/plant/${plant.id}`}
                  className="bg-white p-4 rounded-3xl border border-outline-variant/10 flex items-center gap-4 hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-primary/5">
                    <img src={plant.image} alt={plant.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-on-surface">{plant.name}</h4>
                    <p className="text-xs text-on-surface-variant">{plant.species}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-outline" />
                </Link>
              ))
            ) : (
              <div className="py-12 bg-surface-container-low rounded-3xl text-center flex flex-col items-center gap-4 border-2 border-dashed border-outline-variant/30">
                <LayoutGrid className="w-12 h-12 text-outline opacity-30" />
                <p className="text-on-surface-variant text-sm font-medium">No plants in this space yet.</p>
                <Link to="/garden" className="bg-primary text-on-primary px-6 py-2 rounded-full text-xs font-bold">Assign from Garden</Link>
              </div>
            )}
          </div>
        </section>

        {/* Space Features & Captures Section */}
        {space.featuresImages && space.featuresImages.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-headline font-bold text-2xl">⚡ Space Features & Captures</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {space.featuresImages.map((imgUrl, fIdx) => (
                <div key={fIdx} className="aspect-square rounded-3xl overflow-hidden border border-outline-variant/10 shadow-sm relative group bg-surface-container-low">
                  <img src={imgUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={`Feature ${fIdx + 1}`} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Environmental Indicators (Mocked) */}
        <section className="bg-surface-container-lowest p-8 rounded-[40px] border border-outline-variant/10 space-y-6">
          <h3 className="font-headline font-bold text-xl">Room Conditions</h3>
          <div className="grid grid-cols-2 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                <Thermometer className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Temp</p>
                <p className="font-headline font-black text-lg">24°C</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Humidity</p>
                <p className="font-headline font-black text-lg">62%</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Edit Overlay */}
      <AnimatePresence>
        {isEditing && (
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
                <h3 className="font-headline font-bold text-xl">Edit Space</h3>
                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-surface-container rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Space Name</label>
                  <input 
                    value={editedName}
                    onChange={e => setEditedName(e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary text-on-surface"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Condition</label>
                  <select 
                    value={editedStatus}
                    onChange={e => setEditedStatus(e.target.value as any)}
                    className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary text-on-surface appearance-none"
                  >
                    <option value="Stable">Stable</option>
                    <option value="Critical">Critical</option>
                    <option value="Need Water">Need Water</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                      Space Features & Captures
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-surface-container-low rounded-2xl min-h-[50px] items-center border border-dashed border-outline-variant/30">
                    {editedFeatures.map((featImg, idx) => (
                      <div key={idx} className="relative w-12 h-12 rounded-xl overflow-hidden group border border-outline-variant/20">
                        <img src={featImg} className="w-full h-full object-cover" alt="" />
                        <button
                          type="button"
                          onClick={() => setEditedFeatures(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <label className="w-12 h-12 rounded-xl border border-dashed border-primary/40 hover:bg-primary/5 flex flex-col items-center justify-center cursor-pointer text-primary transition-all">
                      <span className="text-xl font-bold leading-none">+</span>
                      <span className="text-[9px] font-black uppercase tracking-tight">Add</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setEditedFeatures(prev => [...prev, reader.result as string]);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleSave}
                className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Save Changes
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
