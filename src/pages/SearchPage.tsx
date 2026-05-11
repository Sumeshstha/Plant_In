import { Search, Camera, ChevronRight, Heart, MessageSquare, Share2 } from 'lucide-react';
import TopAppBar from '../components/TopAppBar';
import { motion } from 'motion/react';
import { useNavigate, useOutletContext } from 'react-router-dom';

export default function SearchPage() {
  const navigate = useNavigate();
  const { openSidebar } = useOutletContext<{ openSidebar: () => void }>();
  const guides = [
    { 
      id: 1, 
      title: 'Best for Beginners', 
      tag: 'Newbie', 
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQw-lH5puYpHs6pWJ5TNUbERsQ56iAQmfXuENrustdZhl0NjrGLKGL5UB8mgCeNRJ77GsIpy7t_vKTMM7oRipf7DU_Cmvt6TKozNuydOPprp47IZmoc4M7yBDnhy8taI9vOBwz29MboT7P6QVrE1tfqhhg4VRmi5hoOfhJYIXJsxzSF4TvfWeRXrHwltnw5dg6IvczHaAOfX8vgQGSEwhYZIAGSDyU-keYvOAUb7Xv9tNeU4PhBXJq3VvfTERxeccJkMKq7x_SeYo',
      color: 'bg-primary-fixed' 
    },
    { 
      id: 2, 
      title: 'Pet-Friendly Picks', 
      tag: 'Safety', 
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBy1U4WcLGA1AGyj27NLiX1ELnm8IUPgCFo4_a_u9IMl9plFIgLCn0gZWqgtXmkn3WbtiBHyuRsScZtii1-PGwrt0qfYFzmvxqSHWFA03i_qi9Nx1ISVWJVw4ZB3fEVPyQsgfRedNuXFD2O3hoAs-lr2IXcPkcWgV7xO213Adeqnc8n7wLL9z_MRnbX6GQG_nBHznQMvEl9qHY-lZEWSjlAzTDuwmP_7oBni4xVTOYc5UrTU6uFBOeVfpX8UOlV8qo531FBCggl0tU',
      color: 'bg-secondary-container' 
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      <TopAppBar onMenuClick={openSidebar} />
      
      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
        <section className="mb-10">
          <h1 className="font-headline font-bold text-4xl mb-6 tracking-tight text-on-surface">
            Explore the <span className="text-primary italic">Greenery</span>
          </h1>
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary w-6 h-6 opacity-60" />
            <input 
              className="w-full bg-surface-container border-none rounded-full py-5 pl-14 pr-6 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/20 transition-all font-medium text-lg shadow-sm" 
              placeholder="Search 24,000+ species" 
              type="text"
            />
          </div>
        </section>

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
                onClick={() => navigate(`/search?query=${encodeURIComponent(guide.title)}`)}
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
            {['Low Light', 'Succulents', 'Air Purifying', 'Kitchen Herbs'].map((tag) => (
              <span 
                key={tag} 
                onClick={() => navigate(`/search?query=${encodeURIComponent(tag)}`)}
                className="whitespace-nowrap bg-surface-container-high px-5 py-2.5 rounded-full text-sm font-semibold text-on-surface-variant hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-headline font-bold text-2xl">Community</h2>
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container" />
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-surface bg-primary-fixed flex items-center justify-center text-[10px] font-bold text-on-primary-fixed">+12k</div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-lg p-5 mb-8 transition-all hover:bg-surface-bright shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-surface-container" />
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
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuADBixviZa5ZF3YxvW67WvseHIifW8ICL-rwgYl7eIFh2HwWnZC6DxPSt_jxJrz0F-7aWM0xR0MOczyXHTX-gVQmYmQflGM40GAaRp-7i-BwjFHUoMOW6F2P_RwZ4zRPwrSVPCRHkKbXE0k9ixgtyu6eAhECGHPaEY_KfhbwS9PU7u_XvfMAswS9M6hfIcpAJomqTaZk0cE1R_ps9ZpZicBUxjCqUO5IwjuYIAyN6Bo_VvWaVbMTG1WcDsmUE6ceZkR4hRbvBaYvK4" 
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
      </main>
    </div>
  );
}
