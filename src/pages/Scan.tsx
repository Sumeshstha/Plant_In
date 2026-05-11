import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, Lightbulb, Zap, ZapOff, Minimize2, Scan as ScanIcon, Biohazard, Timer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Scan() {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState('Plant ID');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [flashOn, setFlashOn] = useState(false);

  const modes = [
    { id: 'Plant ID', icon: ScanIcon },
    { id: 'Disease', icon: Biohazard },
    { id: 'Mushroom', icon: Timer },
    { id: 'Light', icon: Lightbulb }
  ];

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        name: 'Monstera Deliciosa',
        species: 'Araceae',
        confidence: 98,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoF2Bk7FvZdu06aWQzCiMkvsx2Ig3xInNxWFRyV1GWsaCna6um1PoTgQZDg2gmCCPtFQ6-ilVyiYJAnsqTeGHpSrSo4fH4LGEJxV3on68lhLPntALKgTwfnqyAkF0pZSR3zIK6h2P1YxIod8qlz5XkBD-pLAas4yxsSqOv4HOJDwrwuEklr89OYVEdXWhsrkABpHopLt8MgL2HH2FZLox8JbTlfQy2y4b6fWWtW7eWTYd5AGZaktJfGKqoTx9bn8qiUvGhizy6oSU'
      });
    }, 2000);
  };

  return (
    <div className="bg-on-surface h-screen flex flex-col overflow-hidden relative">
      {/* Live Camera Feed Backdrop (Static Image for Demo) */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoF2Bk7FvZdu06aWQzCiMkvsx2Ig3xInNxWFRyV1GWsaCna6um1PoTgQZDg2gmCCPtFQ6-ilVyiYJAnsqTeGHpSrSo4fH4LGEJxV3on68lhLPntALKgTwfnqyAkF0pZSR3zIK6h2P1YxIod8qlz5XkBD-pLAas4yxsSqOv4HOJDwrwuEklr89OYVEdXWhsrkABpHopLt8MgL2HH2FZLox8JbTlfQy2y4b6fWWtW7eWTYd5AGZaktJfGKqoTx9bn8qiUvGhizy6oSU" 
          alt="Camera view" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <header className="relative z-10 pt-12 px-6 flex justify-between items-center">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex bg-black/20 backdrop-blur-md p-1 rounded-full border border-white/10">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-xs font-bold uppercase tracking-tight
                ${activeMode === mode.id ? 'bg-primary text-on-primary' : 'text-white/60 hover:text-white'}
              `}
            >
              <mode.icon className="w-4 h-4" />
              <span className={activeMode === mode.id ? 'inline' : 'hidden md:inline'}>{mode.id}</span>
            </button>
          ))}
        </div>

        <div className="w-10" /> {/* Spacer */}
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <AnimatePresence>
          {isScanning && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                top: ['20%', '80%', '20%']
              }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-0 h-1 bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)] z-50 pointer-events-none"
              style={{ top: '50%' }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          )}

          {scanResult && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute bottom-24 inset-x-6 z-50 bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                  <img src={scanResult.image} alt={scanResult.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline font-bold text-xl text-primary">{scanResult.name}</h3>
                    <span className="text-[10px] font-bold text-success uppercase tracking-widest">{scanResult.confidence}% confidence</span>
                  </div>
                  <p className="font-body text-sm text-on-surface-variant">{scanResult.species}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => navigate('/add-plant')}
                  className="py-4 bg-primary text-on-primary rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                  Add to Garden
                </button>
                <button 
                  onClick={() => setScanResult(null)}
                  className="py-4 bg-surface-container text-on-surface rounded-2xl font-bold text-sm active:scale-95 transition-all"
                >
                  Scan Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AR Reticle */}
        <div className={`relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center transition-all duration-700 ${isScanning ? 'scale-110 opacity-100' : 'opacity-60'}`}>
          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary-fixed rounded-tl-3xl transition-all" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-primary-fixed rounded-tr-3xl transition-all" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-primary-fixed rounded-bl-3xl transition-all" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-primary-fixed rounded-br-3xl transition-all" />
          
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-primary-fixed rounded-full shadow-[0_0_12px_rgba(200,236,200,1)]" 
          />
        </div>

        {!isScanning && !scanResult && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 mx-6 flex items-center gap-3 bg-secondary-container/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-secondary/20 max-w-sm"
          >
            <div className="w-10 h-10 bg-on-secondary-container/20 rounded-full flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5 text-on-secondary-container" />
            </div>
            <div>
              <p className="font-headline font-bold text-sm text-on-secondary-container">Snap Tip</p>
              <p className="font-body text-xs text-on-secondary-container/80 leading-snug">Ensure the leaf is in focus for accurate diagnosis.</p>
            </div>
          </motion.div>
        )}
      </main>

      <footer className="relative z-10 pb-12 px-10 flex items-center justify-between max-w-lg mx-auto w-full">
        <div className="relative group">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/30 shadow-lg">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4hMSnjzTe1mQHcv82R1zK5y_GYPy2qNQZntZOH2tOO6VffQGN8lOzgolZV22E8hhGFrFavhpZit0BtA8rLOmqCDiVsNS66PCvSeux9Ubqj3fn8MBj63iu60XXBwG_8lRcNEozCFnSuPOA5zr7UoL_2rN8HeR6LNVl5HWmcWF8W86v6EN0O6ggYWWpR-NEzL7QjqAUA8im15GB-4jLdTRBJxEkUYbT2vhRTPhYj6kVGxKhnLPaAPvmwoFZFyiJv6b39S4QMtR04PA" alt="Recent" className="w-full h-full object-cover" />
          </div>
          <span className="absolute -top-2 -right-2 bg-primary w-5 h-5 rounded-full text-[10px] text-on-primary flex items-center justify-center font-bold">12</span>
        </div>

        <button 
          onClick={startScan}
          disabled={isScanning || !!scanResult}
          className="w-20 h-20 bg-white rounded-full p-1 shadow-2xl active:scale-90 transition-all disabled:opacity-50"
        >
          <div className="w-full h-full rounded-full border-[3px] border-primary-container flex items-center justify-center">
            <div className={`w-14 h-14 bg-primary rounded-full transition-transform ${isScanning ? 'scale-75 cursor-wait' : ''}`} />
          </div>
        </button>

        <button 
          onClick={() => setFlashOn(!flashOn)}
          className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors
            ${flashOn ? 'bg-primary text-white' : 'bg-black/20 text-white'}
          `}
        >
          {flashOn ? <Zap className="w-6 h-6" /> : <ZapOff className="w-6 h-6" />}
        </button>
      </footer>
    </div>
  );
}
