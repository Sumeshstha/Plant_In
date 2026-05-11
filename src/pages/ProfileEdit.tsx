import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Check, User, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProfileEdit() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: 'Elena Green',
    email: 'elena.grow@greenery.com',
    phone: '+1 (555) 0123 4567',
    location: 'Portland, Oregon',
    bio: 'Urban gardener and plant parent to 42 leafy friends. Obsessed with Monstera propagation and sustainable soil health.',
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBl98IU_zGD3a5Ta4hJxvwXAhMCGCeb-zC6fzK0g0akDH0NjZd263vv3aPs4uw3bnoyji1r7GU46-MfRJ2cFxnuxEunNqOGOKOVFdwgLSQjtjShapNJZYJHZN7mJgM2VZRron_pAZcIzqtBvDuJ52gqJoN3TRgCRNnL0QgbzKzzh7lqtCwVErIMDBtnUqJlnazbqNZn-8pwyn0r1UeU_3lQQrsAyue_JUo0GmQ0R1Bq8cxyTLkFL36y4rTdVao_XN3Jf4LcdNd9mKY"
  });

  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      navigate('/profile');
    }, 1500);
  };

  return (
    <div className="bg-background min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface-container rounded-full transition-colors active:scale-95">
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <h1 className="font-headline font-bold text-xl text-primary">Edit Profile</h1>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary text-on-primary px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto pb-32">
        {/* Profile Picture Upload */}
        <section className="flex flex-col items-center mb-10">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface shadow-lg">
              <img 
                src={formData.image} 
                alt="Profile" 
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
            </div>
            <label className="absolute bottom-1 right-1 bg-secondary text-on-secondary p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform active:scale-90 border-2 border-surface cursor-pointer">
              <Camera className="w-5 h-5" />
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange}
              />
            </label>
          </div>
          <p className="mt-4 text-[10px] font-bold text-primary uppercase tracking-widest">Change Photo</p>
        </section>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary opacity-50 group-focus-within:opacity-100 transition-opacity" />
              <input 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 text-on-surface font-medium transition-all"
                type="text"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary opacity-50 group-focus-within:opacity-100 transition-opacity" />
              <input 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 text-on-surface font-medium transition-all"
                type="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Phone Number</label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary opacity-50 group-focus-within:opacity-100 transition-opacity" />
              <input 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 text-on-surface font-medium transition-all"
                type="tel"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Location</label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary opacity-50 group-focus-within:opacity-100 transition-opacity" />
              <input 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 text-on-surface font-medium transition-all"
                type="text"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Bio</label>
            <textarea 
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              rows={4}
              className="w-full bg-surface-container-low border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 text-on-surface font-medium text-sm leading-relaxed transition-all resize-none"
            />
          </div>
        </div>

        <section className="mt-12 pt-8 border-t border-outline-variant/10">
          <h3 className="font-headline font-bold text-lg mb-6">Expertise & Interests</h3>
          <div className="flex flex-wrap gap-2">
            {['Tropicals', 'Succulents', 'Organic Soil', 'Indoor Lighting', 'Propagation', 'Hydroponics'].map((tag) => (
              <span key={tag} className="bg-primary/5 text-primary border border-primary/20 px-4 py-2 rounded-full text-xs font-bold hover:bg-primary hover:text-on-primary transition-colors cursor-pointer">
                {tag}
              </span>
            ))}
            <button className="flex items-center gap-1 bg-surface-container border border-dashed border-outline-variant px-4 py-2 rounded-full text-xs font-bold text-outline">
              + Add Interest
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
