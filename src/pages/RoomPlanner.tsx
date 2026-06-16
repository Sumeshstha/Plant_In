import { ArrowLeft, Plus, Move, LayoutGrid, Trash2, Save, MoreHorizontal, X, Camera, Check } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGarden } from '../context/GardenContext';

export default function RoomPlanner() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { spaces, addSpace, deleteSpace, plants } = useGarden();
  
  const spaceIdFromQuery = searchParams.get('spaceId');
  const [activeRoomId, setActiveRoomId] = useState(spaceIdFromQuery || spaces[0]?.id || '');
  const [isAddingSpace, setIsAddingSpace] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [layoutDensity, setLayoutDensity] = useState(() => localStorage.getItem('pref-density') || 'compact');

  useEffect(() => {
    if (spaceIdFromQuery) {
      setActiveRoomId(spaceIdFromQuery);
    }
  }, [spaceIdFromQuery]);

  useEffect(() => {
    const handleStorage = () => {
      setLayoutDensity(localStorage.getItem('pref-density') || 'compact');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleRoomChange = (id: string) => {
    setActiveRoomId(id);
    setSearchParams({ spaceId: id });
  };

  const activeSpace = spaces.find(s => s.id === activeRoomId);
  const plantsInRoom = plants.filter(p => p.spaceId === activeRoomId);

  const handleAddSpace = () => {
    if (!newSpaceName) return;
    addSpace({
      name: newSpaceName,
      status: 'Stable',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop',
    });
    setNewSpaceName('');
    setIsAddingSpace(false);
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface-container rounded-full transition-colors active:scale-95">
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <h1 className="font-headline font-bold text-xl text-primary">Room Planner</h1>
        </div>
        <button className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
          <Save className="w-4 h-4" />
          Save Layout
        </button>
      </header>

      <main className={layoutDensity === 'compact' ? "pt-16 flex-1 flex flex-col p-4 pb-24" : "pt-20 flex-1 flex flex-col p-6 pb-32"}>
        <div className={`flex overflow-x-auto hide-scrollbar ${layoutDensity === 'compact' ? 'gap-2 pb-3' : 'gap-3 pb-4'}`}>
          {spaces.map(room => (
            <button
              key={room.id}
              onClick={() => handleRoomChange(room.id)}
              className={`rounded-full whitespace-nowrap transition-all font-semibold
                ${activeRoomId === room.id ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}
                ${layoutDensity === 'compact' ? 'px-4 py-2 text-xs' : 'px-6 py-2.5 text-sm'}
              `}
            >
              {room.name}
            </button>
          ))}
          <button 
            onClick={() => setIsAddingSpace(true)}
            className={`${layoutDensity === 'compact' ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-surface-container border-2 border-dashed border-outline-variant flex items-center justify-center shrink-0 hover:bg-surface-container-high transition-colors`}
          >
            <Plus className="w-5 h-5 text-outline" />
          </button>
        </div>

        {/* Add Space Overlay */}
        <AnimatePresence>
          {isAddingSpace && (
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
                  <h3 className="font-headline font-bold text-xl">New Space</h3>
                  <button onClick={() => setIsAddingSpace(false)} className="p-2 hover:bg-surface-container rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Space Name</label>
                    <input 
                      autoFocus
                      value={newSpaceName}
                      onChange={e => setNewSpaceName(e.target.value)}
                      placeholder="e.g. Suntrap Balcony"
                      className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary text-on-surface"
                    />
                  </div>
                </div>
                <button 
                  onClick={handleAddSpace}
                  disabled={!newSpaceName}
                  className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Check className="w-5 h-5" />
                  Create Space
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Canvas Area */}
        <div className={`flex-1 bg-surface-container-low rounded-3xl relative overflow-hidden border-4 border-surface shadow-inner group ${layoutDensity === 'compact' ? 'mt-2' : 'mt-4'}`}>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          
          <AnimatePresence>
            {plantsInRoom.length > 0 ? (
              plantsInRoom.map((plant, idx) => (
                <motion.div
                  key={plant.id}
                  drag
                  dragMomentum={false}
                  initial={{ left: `${(idx * 20) + 10}%`, top: `${(idx * 15) + 15}%` }}
                  className={`absolute cursor-grab active:cursor-grabbing group/plant ${layoutDensity === 'compact' ? 'w-20 h-20' : 'w-24 h-24'}`}
                >
                  <div className="relative w-full h-full">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] font-bold px-3 py-1 rounded-full opacity-0 group-hover/plant:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-20">
                      {plant.name}
                    </div>
                    <div className="w-full h-full rounded-full border-4 border-white shadow-lg overflow-hidden bg-primary/10">
                      <img src={plant.image} alt={plant.name} className="w-full h-full object-cover" />
                    </div>
                    <div className={`absolute -bottom-1.5 -right-1.5 bg-white rounded-full shadow-md ${layoutDensity === 'compact' ? 'p-1' : 'p-1.5'}`}>
                      <Move className={`text-primary ${layoutDensity === 'compact' ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 opacity-40">
                <LayoutGrid className="w-12 h-12 mb-3" />
                <p className="font-bold text-sm">No plants in this space yet.</p>
                <p className="text-xs mt-1">Go to your garden to assign plants here.</p>
              </div>
            )}
          </AnimatePresence>

          <div className={`absolute flex items-center justify-between ${layoutDensity === 'compact' ? 'bottom-4 left-4 right-4' : 'bottom-6 left-6 right-6'}`}>
            <div className="bg-white/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/40 flex items-center gap-2">
              <LayoutGrid className="w-3.5 h-3.5 text-primary" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface">Grid: 24px</span>
            </div>
            {activeSpace && (
              <button 
                onClick={() => {
                  if (window.confirm('Delete this space?')) {
                    deleteSpace(activeSpace.id);
                    setActiveRoomId(spaces[0]?.id || '');
                  }
                }}
                className={`bg-error-container/80 backdrop-blur-md text-on-error-container rounded-full shadow-xl hover:bg-error transition-colors ${layoutDensity === 'compact' ? 'p-2.5' : 'p-3'}`}
              >
                <Trash2 className={layoutDensity === 'compact' ? 'w-5 h-5' : 'w-6 h-6'} />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
