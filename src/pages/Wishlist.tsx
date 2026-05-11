import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import TopAppBar from '../components/TopAppBar';
import { PLANTS } from '../constants';
import { Camera, Plus, Search, Filter, Heart, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Wishlist() {
  const navigate = useNavigate();
  const { openSidebar } = useOutletContext<{ openSidebar: () => void }>();
  const [activeFilter, setActiveFilter] = useState<'All' | 'Indoor' | 'Rare'>('All');
  
  const wishlist = PLANTS.slice(0, 4);

  const filteredItems = wishlist.filter(plant => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Indoor') return plant.habitat === 'Indoor';
    if (activeFilter === 'Rare') return plant.tags?.includes('Rare');
    return true;
  });

  return (
    <div className="bg-background min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md px-6 h-16 flex items-center justify-between border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <button onClick={openSidebar} className="p-2 hover:bg-surface-container rounded-full transition-colors">
            <Menu className="w-6 h-6 text-primary" />
          </button>
          <h1 className="font-headline font-bold text-xl text-primary tracking-tight">Plant Wishlist</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
          <Filter className="text-secondary w-5 h-5" />
        </div>
      </header>

      <main className="pt-24 px-6 max-w-5xl mx-auto pb-32">
        <section className="mt-4 mb-10">
          <div className="relative group">
            <input 
              onFocus={() => navigate('/search')}
              className="w-full bg-surface-container-low border-none rounded-full py-5 px-14 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/50 font-medium" 
              placeholder="Find more plants to add..." 
              type="text"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/60 w-6 h-6" />
            <Camera onClick={() => navigate('/scan')} className="absolute right-5 top-1/2 -translate-y-1/2 text-primary/40 cursor-pointer w-6 h-6" />
          </div>
        </section>

        <div className="flex gap-3 mb-8 overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => setActiveFilter('All')}
            className={`${activeFilter === 'All' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'} px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors`}
          >
            All Items ({wishlist.length})
          </button>
          <button 
            onClick={() => setActiveFilter('Indoor')}
            className={`${activeFilter === 'Indoor' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'} px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors`}
          >
            Indoor
          </button>
          <button 
            onClick={() => setActiveFilter('Rare')}
            className={`${activeFilter === 'Rare' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'} px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors`}
          >
            Rare Finds
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((plant) => (
              <motion.div 
                key={plant.id} 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-surface-container-lowest rounded-lg overflow-hidden group border border-outline-variant/10 shadow-sm transition-all hover:shadow-xl"
              >
                <div 
                  className="relative aspect-[4/5] overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/plant/${plant.id}`)}
                >
                  <img src={plant.image} alt={plant.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-sm p-2 rounded-full text-primary shadow-sm hover:scale-110 transition-transform">
                    <Heart className="w-5 h-5 fill-primary" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="cursor-pointer" onClick={() => navigate(`/plant/${plant.id}`)}>
                      <h3 className="font-headline text-xl font-bold text-on-surface">{plant.name}</h3>
                      <p className="font-body text-sm text-on-surface-variant italic">{plant.scientificName}</p>
                    </div>
                    {plant.tags && plant.tags.length > 0 && (
                      <span className="bg-primary-fixed text-on-primary-fixed px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest leading-none">
                        {plant.tags[0]}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => navigate('/add-plant')}
                    className="w-full bg-primary text-on-primary rounded-full py-4 flex items-center justify-center gap-2 font-bold transition-all active:scale-95"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add to My Plants</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <section className="mt-16 mb-12">
          <h2 className="font-headline text-3xl font-bold mb-6 text-on-surface tracking-tight">Suggested for You</h2>
          <div className="bg-tertiary-fixed rounded-lg p-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 border border-outline-variant/10">
            <div className="z-10 flex-1">
              <span className="bg-secondary text-on-secondary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block tracking-tighter">Expert Choice</span>
              <h3 className="font-headline text-3xl font-extrabold text-on-surface mb-4">The Rare Alocasia Black Velvet</h3>
              <p className="text-on-surface-variant mb-6 leading-relaxed text-sm">Add this stunning dark-leaved beauty to your collection. Perfect for moody, sophisticated indoor spaces.</p>
              <button 
                onClick={() => navigate('/search?query=Alocasia%20Black%20Velvet')}
                className="bg-on-surface text-surface px-8 py-3 rounded-full font-bold transition-transform active:scale-95 text-sm"
              >
                View Details
              </button>
            </div>
            <div className="relative w-full md:w-1/3 aspect-square rounded-xl overflow-hidden shadow-2xl rotate-3">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaqquvxNTRQO4CfyZY48j3pAjaaBQXNocR1jjGFQ3reUyvfNeSPByVER0U5CYStaJfWWFj3QrDsYrMRxtcKaH5Fyz9E_F1hXg0D0MeBKzI-amkvdXhmtFhoP9JBRNqLT0wIAkN-69A-tVVCN7Xw1OmVtUfUHMka5PlYPprOGE0rMXfuc25WhmmuKf9nJofHvJ_feBBfAglX3iod2np8S726GFYmArcBRoLLyKAYM0pUEhsTl-MOS7wC1cjrk75XanPIAbd5rY1xnc" alt="Alocasia" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
