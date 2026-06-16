import { ArrowLeft, Check, Camera, Leaf, Sun, Droplets, Thermometer, Globe, Menu } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import React, { useState } from 'react';
import { useGarden } from '../context/GardenContext';
import { motion } from 'motion/react';

export default function AddPlant() {
  const navigate = useNavigate();
  const { openSidebar } = useOutletContext<{ openSidebar: () => void }>();
  const { addPlant, spaces } = useGarden();
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1000&auto=format&fit=crop',
    description: '',
    vitality: 100,
    healthStatus: 'Healthy' as const,
    light: 'Bright Light',
    watering: '7 Days',
    temp: '18-27°C',
    habitat: 'Indoor' as const,
    spaceId: '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const galleryImages = [
    'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1000',
    'https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?q=80&w=1000',
    'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?q=80&w=1000',
    'https://images.unsplash.com/photo-1520412099561-638192179b1b?q=80&w=1000'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPlant(formData);
    navigate('/garden');
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
          <h1 className="font-headline font-bold text-xl text-primary">Add New Plant</h1>
        </div>
        <button 
          onClick={handleSubmit}
          className="bg-primary text-on-primary px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-95 transition-all"
        >
          <Check className="w-4 h-4" />
          Add
        </button>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto pb-32">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Picker */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-48 h-48 rounded-3xl overflow-hidden shadow-2xl group border-4 border-white">
              <img src={formData.image} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="text-white w-10 h-10" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
            
            <div className="w-full">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3 px-1 text-center">Or pick from library</p>
              <div className="flex justify-center gap-3 overflow-x-auto py-2">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData({...formData, image: img})}
                    className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${formData.image === img ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Plant Name</label>
              <input 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Fiddle Leaf Fig"
                className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary text-on-surface font-medium transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Assign to Space</label>
              <select 
                value={formData.spaceId}
                onChange={e => setFormData({...formData, spaceId: e.target.value})}
                className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary text-on-surface font-medium transition-all appearance-none"
              >
                <option value="">No Space assigned</option>
                {spaces.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Light Needs</label>
                <div className="relative">
                  <Sun className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <input 
                    value={formData.light}
                    onChange={e => setFormData({...formData, light: e.target.value})}
                    className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary text-on-surface font-medium text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Watering</label>
                <div className="relative">
                  <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <input 
                    value={formData.watering}
                    onChange={e => setFormData({...formData, watering: e.target.value})}
                    className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary text-on-surface font-medium text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Habitat</label>
              <div className="flex gap-4">
                {['Indoor', 'Outdoor'].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setFormData({...formData, habitat: h as 'Indoor' | 'Outdoor'})}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border ${
                      formData.habitat === h 
                      ? 'bg-primary text-on-primary border-primary shadow-md' 
                      : 'bg-surface-container border-outline-variant/10 text-on-surface-variant'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Description</label>
              <textarea 
                rows={3}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Share some notes about this plant..."
                className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary text-on-surface font-medium transition-all resize-none text-sm"
              />
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
