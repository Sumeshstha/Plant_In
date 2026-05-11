import { motion } from 'motion/react';
import { Leaf } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-surface">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(70,102,73,0.1)_0%,transparent_70%)] pointer-events-none" />
      
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary-fixed text-primary shadow-lg border-2 border-background">
          <Leaf className="w-12 h-12 fill-primary/20" />
        </div>
        
        <div className="flex flex-col items-center">
          <h1 className="font-headline font-extrabold text-5xl tracking-tight text-primary">
            PlantIn
          </h1>
          <div className="mt-4 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div 
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                className="w-1.5 h-1.5 rounded-full bg-primary"
              />
            ))}
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full h-1/3 opacity-20 blur-3xl pointer-events-none">
        <div className="w-full h-full bg-gradient-to-t from-primary-container to-transparent" />
      </div>
    </main>
  );
}
