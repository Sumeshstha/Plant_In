import React, { useState } from 'react';
import { 
  Search, Camera, ChevronRight, Heart, MessageSquare, Share2, 
  Sprout, MapPin, CheckCircle2, Sparkles, AlertCircle, Info, HelpCircle, 
  ArrowRight, Plus, Check, Loader2, Thermometer, Sun, Droplets, ShieldAlert 
} from 'lucide-react';
import TopAppBar from '../components/TopAppBar';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useGarden } from '../context/GardenContext';
import { Plant, Space, Task } from '../types';

export default function SearchPage() {
  const navigate = useNavigate();
  const { openSidebar } = useOutletContext<{ openSidebar: () => void }>();
  const { plants, spaces, tasks, addPlant } = useGarden();

  // Search input & results states
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [addedSuccess, setAddedSuccess] = useState<string | null>(null);

  // Filter local plants
  const filteredPlants = plants.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.tags && p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  // Filter local spaces
  const filteredSpaces = spaces.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter local tasks
  const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Static tool results matching query
  const toolResults = [
    { name: 'Watering Needs Calculator', path: '/tools/watering', keywords: ['water', 'calculator', 'hydrate', 'measure'] },
    { name: 'Interactive Care Scheduler', path: '/tools/calendar', keywords: ['calendar', 'schedule', 'agenda', 'nepalese', 'patro'] },
    { name: 'Soil & Repotting Drainage Checker', path: '/tools/repotting', keywords: ['repot', 'soil', 'drainage', 'pot', 'size'] },
    { name: 'Expert Plant Doctor & Scanner', path: '/scan', keywords: ['scan', 'diagnose', 'disease', 'bug', 'photo', 'identify'] }
  ].filter(tool => 
    searchQuery.length > 2 && 
    tool.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Trigger Gemini Scholarly Search
  const handleAiSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsAiSearching(true);
    setAiResult(null);
    setAiError(null);
    setAddedSuccess(null);

    try {
      const response = await fetch('/api/gemini/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });

      const data = await response.json();
      if (data.success && data.data) {
        setAiResult(data.data);
      } else {
        setAiError(data.error || 'Unable to identify species care profile. Please try another query!');
      }
    } catch (err) {
      console.error('Botanical scholar search error:', err);
      setAiError('Connection to botanical database lost. Please retry.');
    } finally {
      setIsAiSearching(false);
    }
  };

  // Add species to real garden
  const handleSaveToGarden = () => {
    if (!aiResult) return;
    try {
      addPlant({
        name: aiResult.name,
        scientificName: aiResult.species || aiResult.scientificName || 'Unknown Species',
        image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1000&auto=format&fit=crop',
        description: aiResult.description || 'Discovered from our global search directory.',
        vitality: 98,
        healthStatus: 'Excellent',
        light: aiResult.light || 'Bright Light',
        watering: aiResult.watering || '7 Days',
        temp: aiResult.temp || '18-27°C',
        habitat: aiResult.habitat === 'Outdoor' ? 'Outdoor' : 'Indoor'
      });
      setAddedSuccess(`${aiResult.name} has been added to My Garden! 🌱`);
      setTimeout(() => setAddedSuccess(null), 5000);
    } catch (err) {
      console.error('Save plant error:', err);
    }
  };

  const guides = [
    { 
      id: 1, 
      title: 'Best for Beginners', 
      tag: 'Newbie', 
      image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1000',
      color: 'bg-primary-fixed' 
    },
    { 
      id: 2, 
      title: 'Pet-Friendly Picks', 
      tag: 'Safety', 
      image: 'https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?q=80&w=1000',
      color: 'bg-secondary-container' 
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      <TopAppBar onMenuClick={openSidebar} />
      
      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
        {/* Search header & camera junction */}
        <section className="mb-8">
          <h1 className="font-headline font-bold text-4xl mb-6 tracking-tight text-on-surface">
            Explore the <span className="text-primary italic">Greenery</span>
          </h1>
          <div className="relative flex gap-2">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary w-5 h-5 opacity-60" />
              <input 
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  // clear AI results on empty
                  if (!e.target.value) {
                    setAiResult(null);
                    setAiError(null);
                  }
                }}
                className="w-full bg-surface-container border-none rounded-2xl py-4.5 pl-13 pr-12 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/20 transition-all font-semibold shadow-sm" 
                placeholder="Search garden plants, spaces, tasks or query AI..." 
                type="text"
              />
            </div>
            
            {/* Quick camera button linked to Scan Page (Plant.id proxy using 2b10dlhWh58SL91BTT38gUOqu) */}
            <button
              onClick={() => navigate('/scan')}
              className="p-4 bg-primary text-on-primary rounded-2xl hover:bg-primary/95 shadow-md active:scale-95 transition-all flex items-center justify-center shrink-0"
              title="Identity via camera (Plant.id & AI)"
            >
              <Camera className="w-6 h-6" />
            </button>
          </div>
        </section>

        {searchQuery ? (
          /* Live Search Results View */
          <div className="space-y-8">
            
            {/* 1. Local Plants results */}
            {filteredPlants.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant px-1 flex items-center gap-1">
                  <Sprout className="w-3.5 h-3.5 text-primary" />
                  My Garden Plants ({filteredPlants.length})
                </h3>
                <div className="space-y-2">
                  {filteredPlants.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => navigate(`/plant/${p.id}`)}
                      className="p-3 bg-surface-container-lowest border border-outline-variant/10 rounded-xl flex justify-between items-center cursor-pointer hover:bg-primary-fixed/5 active:scale-[0.99] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img src={p.image} className="w-10 h-10 rounded-full object-cover border" alt="" />
                        <div>
                          <p className="font-bold text-sm text-on-surface leading-tight">{p.name}</p>
                          <p className="text-[10px] text-on-surface-variant italic">{p.scientificName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">
                          {p.habitat}
                        </span>
                        <ChevronRight className="w-4 h-4 text-on-surface-variant" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Local Spaces results */}
            {filteredSpaces.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant px-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  My Spaces & Locations ({filteredSpaces.length})
                </h3>
                <div className="space-y-2">
                  {filteredSpaces.map(s => (
                    <div 
                      key={s.id}
                      onClick={() => navigate(`/space/${s.id}`)}
                      className="p-3 bg-surface-container-lowest border border-outline-variant/10 rounded-xl flex justify-between items-center cursor-pointer hover:bg-primary-fixed/5 active:scale-[0.99] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img src={s.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                        <div>
                          <p className="font-bold text-sm text-on-surface leading-tight">{s.name}</p>
                          <p className="text-[10px] text-on-surface-variant leading-none">{s.plantCount} plants total</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-on-surface-variant" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Local Tasks matching */}
            {filteredTasks.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant px-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  My Care Tasks & To-dos ({filteredTasks.length})
                </h3>
                <div className="space-y-2">
                  {filteredTasks.map(t => (
                    <div 
                      key={t.id}
                      onClick={() => navigate('/')}
                      className="p-3 bg-surface-container-lowest border border-outline-variant/10 rounded-xl flex justify-between items-center cursor-pointer hover:bg-primary-fixed/5 active:scale-[0.99] transition-all"
                    >
                      <div>
                        <p className="font-bold text-sm text-on-surface leading-tight">{t.title}</p>
                        <p className="text-[10px] text-on-surface-variant">{t.subtitle}</p>
                      </div>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${t.completed ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'}`}>
                        {t.completed ? 'Done' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Filtered Tool Shortcuts */}
            {toolResults.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant px-1">
                  Matched App Features & Calculators
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {toolResults.map(tool => (
                    <button
                      key={tool.name}
                      onClick={() => navigate(tool.path)}
                      className="p-3 text-left bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-xl flex justify-between items-center transition-all"
                    >
                      <span className="font-bold text-xs text-primary leading-tight">{tool.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-primary" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Botanical Scholar Search directory (Gemini AI integration!) */}
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/15 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-headline font-bold text-base text-on-surface flex items-center gap-1.5 leading-none">
                    <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                    AI Speciation Index (Gemini 3.5 Scholar)
                  </h4>
                  <p className="text-[11px] text-on-surface-variant mt-1">Generate a comprehensive care schedule blueprint for plant: <span className="font-black italic">"{searchQuery}"</span></p>
                </div>
                <button
                  type="button"
                  onClick={handleAiSearch}
                  disabled={isAiSearching}
                  className="px-4 py-2 bg-primary hover:bg-primary/95 disabled:bg-primary/50 text-white font-bold text-xs rounded-xl flex items-center gap-1 active:scale-95 transition-all shadow-sm shrink-0"
                >
                  {isAiSearching ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5" />
                      <span>Lookup AI</span>
                    </>
                  )}
                </button>
              </div>

              {/* Success Alert Banner */}
              {addedSuccess && (
                <div className="bg-green-50 dark:bg-green-950/40 p-4.5 rounded-xl border border-green-200 text-green-700 dark:text-green-300 font-bold text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{addedSuccess}</span>
                </div>
              )}

              {/* Error state */}
              {aiError && (
                <div className="p-4 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 flex gap-2.5 text-xs text-red-700 dark:text-red-300">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                  <p>{aiError}</p>
                </div>
              )}

              {/* Retreived AI Result Specimen */}
              {aiResult && (
                <div className="bg-white dark:bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 space-y-4 shadow-sm">
                  <div className="border-b border-outline-variant/10 pb-3 flex justify-between items-start">
                    <div>
                      <h5 className="font-headline font-bold text-lg text-primary leading-tight">{aiResult.name}</h5>
                      <p className="text-xs italic text-on-surface-variant font-medium">{aiResult.species}</p>
                    </div>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-black tracking-widest uppercase px-2 py-0.5 rounded-full">
                      {aiResult.habitat || 'Indoor'}
                    </span>
                  </div>

                  <p className="text-xs text-on-surface-variant/90 leading-relaxed font-body">{aiResult.description}</p>

                  {/* Care Matrix */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center gap-2 border border-outline-variant/5">
                      <Sun className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <span className="text-[9px] uppercase font-black tracking-wider text-on-surface-variant block">Lighting</span>
                        <span className="font-bold text-on-surface truncate leading-tight block">{aiResult.light}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center gap-2 border border-outline-variant/5">
                      <Droplets className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <span className="text-[9px] uppercase font-black tracking-wider text-on-surface-variant block">Watering</span>
                        <span className="font-bold text-on-surface truncate leading-tight block">{aiResult.watering}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center gap-2 border border-outline-variant/5">
                      <Thermometer className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <span className="text-[9px] uppercase font-black tracking-wider text-on-surface-variant block">Temperature</span>
                        <span className="font-bold text-on-surface truncate leading-tight block">{aiResult.temp}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center gap-2 border border-outline-variant/5">
                      <ShieldAlert className="w-4 h-4 text-on-surface-variant shrink-0" />
                      <div>
                        <span className="text-[9px] uppercase font-black tracking-wider text-on-surface-variant block">Toxicity</span>
                        <span className="font-bold text-on-surface text-[10px] truncate leading-tight block">{aiResult.toxicity || 'Non-toxic'}</span>
                      </div>
                    </div>
                  </div>

                  {aiResult.funFact && (
                    <div className="p-3.5 bg-primary/5 rounded-xl border border-primary/10 flex gap-2.5 text-xs text-on-surface-variant leading-relaxed">
                      <Info className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-primary block">Historical Fact & Trivia</span>
                        {aiResult.funFact}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleSaveToGarden}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl space-x-2 text-xs flex items-center justify-center transition-all shadow-md active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save {aiResult.name} to My Garden</span>
                  </button>
                </div>
              )}
            </div>

            {filteredPlants.length === 0 && filteredSpaces.length === 0 && filteredTasks.length === 0 && toolResults.length === 0 && !aiResult && !isAiSearching && (
              <div className="text-center py-10 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/10">
                <p className="text-xs text-on-surface-variant/60 italic p-3">No matching local plants, spaces or tasks found.</p>
                <p className="text-xs text-on-surface-variant/60">Click <span className="font-bold text-primary">"Lookup AI"</span> above to crawl scientific databases for Care Guides! ⚡</p>
              </div>
            )}
          </div>
        ) : (
          /* Idle/Empty Search View (original guides & posts) */
          <>
            <section className="mb-12">
              <div className="flex justify-between items-end mb-6">
                <h2 className="font-headline font-bold text-2xl">Explore Guides</h2>
                <button className="text-primary font-semibold text-sm hover:underline">See all</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {guides.map((guide) => (
                  <div 
                    key={guide.id} 
                    className="group cursor-pointer"
                    onClick={() => {
                      setSearchQuery(guide.title);
                    }}
                  >
                    <div className="relative h-48 rounded-lg overflow-hidden mb-3">
                      <img src={guide.image} alt={guide.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className={`inline-block ${guide.color} text-on-surface text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full mb-2`}>
                          {guide.tag}
                        </span>
                        <p className="text-white font-headline font-bold leading-tight">{guide.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 overflow-x-auto hide-scrollbar py-2 mt-4">
                {['Light', 'Succulent', 'Air Purifying', 'Herb'].map((tag) => (
                  <span 
                    key={tag} 
                    onClick={() => setSearchQuery(tag)}
                    className="whitespace-nowrap bg-surface-container-high px-5 py-2.5 rounded-full text-sm font-semibold text-on-surface-variant hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-headline font-bold text-2xl">Community Highlights</h2>
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container" />
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-surface bg-primary-fixed flex items-center justify-center text-[10px] font-bold text-on-primary-fixed">+12k</div>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-lg p-5 mb-8 transition-all hover:bg-surface-bright shadow-sm border border-outline-variant/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">EG</div>
                  <div>
                    <p className="font-bold text-sm">Elena Gardenia</p>
                    <p className="text-xs text-on-surface-variant/60">2 hours ago • <span className="text-primary font-semibold">New Leaf!</span></p>
                  </div>
                </div>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                  Look at this absolute unit of a Monstera leaf! 🌿 I’ve been using the Expert tips on drainage and it finally rewarded me. Any advice on staking?
                </p>
                <div className="rounded-lg overflow-hidden aspect-video mb-5">
                  <img 
                    src="https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1000&auto=format&fit=crop" 
                    alt="Post" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-1.5 text-on-surface-variant hover:text-secondary group transition-colors">
                      <Heart className="w-5 h-5 group-active:scale-125 transition-transform" />
                      <span className="text-xs font-bold">124</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary group transition-colors">
                      <MessageSquare className="w-5 h-5" />
                      <span className="text-xs font-bold">18</span>
                    </button>
                  </div>
                  <button className="text-on-surface-variant hover:text-primary transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
