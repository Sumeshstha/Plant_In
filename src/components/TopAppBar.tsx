import { Menu, Bell, ArrowLeft, Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface TopAppBarProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
  onMenuClick?: () => void;
}

export default function TopAppBar({ 
  title = "PlantIn", 
  showBack = false, 
  showSearch = false, 
  showNotifications = true,
  showProfile = false,
  onMenuClick
}: TopAppBarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {showBack ? (
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-surface-container rounded-full transition-colors active:scale-95"
          >
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
        ) : (
          <button 
            onClick={onMenuClick}
            className="p-2 hover:bg-surface-container rounded-full transition-colors active:scale-95"
          >
            <Menu className="w-6 h-6 text-primary" />
          </button>
        )}
        <h1 className="font-headline font-extrabold text-lg text-primary tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {showSearch && (
          <button 
            onClick={() => navigate('/search')}
            className="p-2 hover:bg-surface-container rounded-full transition-colors active:scale-95"
          >
            <Search className="w-6 h-6 text-primary" />
          </button>
        )}
        {showNotifications && (
          <button 
            onClick={() => navigate('/notifications')}
            className="p-2 hover:bg-surface-container rounded-full transition-colors active:scale-95"
          >
            <Bell className="w-6 h-6 text-primary" />
          </button>
        )}
        {showProfile && (
          <button 
            onClick={() => navigate('/profile')}
            className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary-container active:scale-95 transition-transform"
          >
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl98IU_zGD3a5Ta4hJxvwXAhMCGCeb-zC6fzK0g0akDH0NjZd263vv3aPs4uw3bnoyji1r7GU46-MfRJ2cFxnuxEunNqOGOKOVFdwgLSQjtjShapNJZYJHZN7mJgM2VZRron_pAZcIzqtBvDuJ52gqJoN3TRgCRNnL0QgbzKzzh7lqtCwVErIMDBtnUqJlnazbqNZn-8pwyn0r1UeU_3lQQrsAyue_JUo0GmQ0R1Bq8cxyTLkFL36y4rTdVao_XN3Jf4LcdNd9mKY" 
              alt="Profile" 
              className="w-full h-full object-cover" 
            />
          </button>
        )}
      </div>
    </header>
  );
}
