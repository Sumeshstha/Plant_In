import { motion, AnimatePresence } from 'motion/react';
import TopAppBar from '../components/TopAppBar';
import { Plus, AlertCircle, Info, Droplets, Sun, Heart, Leaf } from 'lucide-react';
import { Link, useOutletContext, useNavigate } from 'react-router-dom';
import { useGarden } from '../context/GardenContext';
import { useState } from 'react';

export default function Garden() {
  const navigate = useNavigate();
  const { openSidebar } = useOutletContext<{ openSidebar: () => void }>();
  const { plants } = useGarden();
  const [filter, setFilter] = useState<'All' | 'Indoor' | 'Outdoor' | 'Alerts'>('All');

  const filteredPlants = plants.filter(plant => {
    if (filter === 'All') return true;
    if (filter === 'Indoor') return plant.habitat === 'Indoor';
    if (filter === 'Outdoor') return plant.habitat === 'Outdoor';
    if (filter === 'Alerts') return plant.healthStatus === 'Needs Attention';
    return true;
  });

  return (
    <div className="bg-background min-h-screen">
      <TopAppBar showProfile showSearch title="My Garden" onMenuClick={openSidebar} />
      
      <main className="pt-24 px-6 max-w-5xl mx-auto pb-32">
        <section className="mb-10">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="font-label text-secondary font-semibold uppercase tracking-widest text-xs mb-2 block">Your Collection</span>
              <h2 className="font-headline text-4xl font-extrabold text-on-surface leading-tight">My Garden</h2>
            </div>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
            <button 
              onClick={() => setFilter('All')}
              className={`${filter === 'All' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'} px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap active:scale-95 transition-transform`}
            >
              All Plants
            </button>
            <button 
              onClick={() => setFilter('Indoor')}
              className={`${filter === 'Indoor' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'} px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap active:scale-95 transition-transform`}
            >
              Indoor
            </button>
            <button 
              onClick={() => setFilter('Outdoor')}
              className={`${filter === 'Outdoor' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'} px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap active:scale-95 transition-transform`}
            >
              Outdoor
            </button>
            <button 
              onClick={() => setFilter('Alerts')}
              className={`${filter === 'Alerts' ? 'bg-error text-on-error' : 'bg-error-container text-on-error-container'} px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap flex items-center gap-2 active:scale-95 shadow-sm transition-transform`}
            >
              <AlertCircle className={`w-4 h-4 ${filter === 'Alerts' ? 'fill-on-error' : 'fill-error'}`} />
              Alerts
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPlants.map((plant) => (
              <motion.div
                layout
                key={plant.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Link to={`/plant/${plant.id}`} className="block bg-surface-container-lowest rounded-lg overflow-hidden group border border-outline-variant/10 shadow-sm hover:shadow-md transition-all h-full">
                  <div className="h-48 relative overflow-hidden">
                    <img 
                      src={plant.image} 
                      alt={plant.name} 
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm">
                      <Heart className="w-5 h-5 text-on-surface" />
                    </div>
                    {plant.healthStatus === 'Healthy' && (
                      <div className="absolute bottom-4 left-4 bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                        {plant.healthStatus}
                      </div>
                    )}
                    {plant.healthStatus === 'Excellent' && (
                      <div className="absolute bottom-4 left-4 bg-primary text-on-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                        {plant.healthStatus}
                      </div>
                    )}
                    {plant.healthStatus === 'Needs Attention' && (
                      <div className="absolute bottom-4 left-4 bg-error-container text-on-error-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-error/20">
                        {plant.healthStatus}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h4 className="font-headline font-bold text-lg">{plant.name}</h4>
                    <p className="text-on-surface-variant text-sm mb-4">{plant.habitat} • {plant.light}</p>
                    <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${plant.vitality}%` }}
                        className={`h-full ${plant.vitality > 70 ? 'bg-primary' : 'bg-secondary'}`}
                      />
                    </div>
                    <p className={`text-[10px] font-bold mt-2 uppercase tracking-tighter ${plant.vitality > 70 ? 'text-primary' : 'text-secondary'}`}>
                      {plant.vitality}% Vitality
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredPlants.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto opacity-40">
                <Leaf className="w-10 h-10" />
              </div>
              <p className="text-on-surface-variant font-medium">No plants found for this filter.</p>
              <button 
                onClick={() => setFilter('All')}
                className="text-primary font-bold text-sm underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        <button 
          onClick={() => navigate('/add-plant')}
          className="fixed bottom-28 right-6 md:right-12 bg-secondary text-on-secondary w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-40 active:scale-90 transition-transform hover:scale-105"
        >
          <Plus className="w-8 h-8" />
        </button>
      </main>
    </div>
  );
}
