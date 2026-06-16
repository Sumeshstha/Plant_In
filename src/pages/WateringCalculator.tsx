import { ArrowLeft, Droplets, Info, Calculator, Sun, Thermometer, Container, Menu, Sparkles } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGarden } from '../context/GardenContext';

export default function WateringCalculator() {
  const navigate = useNavigate();
  const { openSidebar } = useOutletContext<{ openSidebar: () => void }>();
  const { plants, updatePlant } = useGarden();

  const [plantType, setPlantType] = useState('succulent');
  const [potSize, setPotSize] = useState('medium');
  const [lightLevel, setLightLevel] = useState('bright');
  const [temperature, setTemperature] = useState('22');
  
  const [result, setResult] = useState<{ volume: string; frequency: string } | null>(null);
  const [freqDays, setFreqDays] = useState<number>(7);
  const [selectedPlantId, setSelectedPlantId] = useState('');
  const [justApplied, setJustApplied] = useState(false);

  const calculate = () => {
    let baseFreq = 7;
    let baseVol = 250;

    if (plantType === 'tropical') {
      baseFreq = 3;
      baseVol = 500;
    } else if (plantType === 'cactus') {
      baseFreq = 14;
      baseVol = 150;
    }

    if (potSize === 'large') baseVol *= 2.5;
    if (potSize === 'small') baseVol *= 0.5;

    if (lightLevel === 'direct') baseFreq -= 1;
    if (lightLevel === 'low') baseFreq += 4;

    const temp = parseInt(temperature, 10);
    if (temp > 28) baseFreq -= 1;
    if (temp < 15) baseFreq += 3;

    const finalFreq = Math.max(1, baseFreq);

    setResult({
      frequency: `Every ${finalFreq} days`,
      volume: `${Math.round(baseVol)}ml`
    });
    setFreqDays(finalFreq);
    setJustApplied(false);
  };

  return (
    <div className="bg-background min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md px-6 h-16 flex items-center gap-2 border-b border-outline-variant/10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface-container rounded-full transition-colors active:scale-95">
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>
        <button onClick={openSidebar} className="p-2 hover:bg-surface-container rounded-full transition-colors active:scale-95">
          <Menu className="w-6 h-6 text-primary" />
        </button>
        <h1 className="font-headline font-bold text-xl text-primary">Watering Calculator</h1>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto pb-32 space-y-8">
        <div className="bg-primary/10 p-6 rounded-3xl flex items-start gap-4">
          <div className="bg-primary p-3 rounded-2xl text-on-primary">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-headline font-bold text-lg text-primary">Smart Estimation</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Answer a few questions about your plant's environment to get the perfect watering schedule.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <section className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Plant Type</label>
            <div className="grid grid-cols-3 gap-3">
              {['succulent', 'tropical', 'cactus'].map((type) => (
                <button
                  key={type}
                  onClick={() => setPlantType(type)}
                  className={`py-4 rounded-2xl font-bold text-xs capitalize transition-all border ${
                    plantType === type 
                    ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20' 
                    : 'bg-surface-container-low border-outline-variant/10 text-on-surface-variant'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Pot Size</label>
            <div className="grid grid-cols-3 gap-3">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  onClick={() => setPotSize(size)}
                  className={`py-4 rounded-2xl font-bold text-xs capitalize transition-all border ${
                    potSize === size 
                    ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20' 
                    : 'bg-surface-container-low border-outline-variant/10 text-on-surface-variant'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Current Temperature ({temperature}°C)</label>
            <input 
              type="range" 
              min="5" 
              max="40" 
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </section>

          <button 
            onClick={calculate}
            className="w-full py-5 bg-primary text-on-primary rounded-3xl font-headline font-bold text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Droplets className="w-6 h-6" />
            Calculate Needs
          </button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface-container-highest p-8 rounded-3xl border border-primary/20 shadow-xl space-y-6"
            >
              <h3 className="text-center font-headline font-bold text-xl text-primary">Recommended Schedule</h3>
              <div className="grid grid-cols-2 gap-6 text-center">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <Sun className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant">Frequency</p>
                  <p className="font-headline font-bold text-lg">{result.frequency}</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <Droplets className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant">Water Volume</p>
                  <p className="font-headline font-bold text-lg">{result.volume}</p>
                </div>
              </div>

              {/* Apply directly to any plant in collection */}
              <div className="pt-6 border-t border-outline-variant/10 space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block text-center">
                  Apply This Schedule to an Existing Plant
                </label>
                <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                  <select
                    value={selectedPlantId}
                    onChange={e => {
                      setSelectedPlantId(e.target.value);
                      setJustApplied(false);
                    }}
                    className="flex-1 bg-surface-container-low border-none rounded-2xl py-3 px-4 text-xs font-body focus:ring-2 focus:ring-primary text-on-surface"
                  >
                    <option value="">-- Choose Plant --</option>
                    {plants.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.scientificName})</option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      if (!selectedPlantId) return;
                      const originalPlant = plants.find(p => p.id === selectedPlantId);
                      if (originalPlant) {
                        updatePlant(selectedPlantId, {
                          watering: `${freqDays} Days`,
                          wateringIntervalDays: freqDays
                        });
                        setJustApplied(true);
                      }
                    }}
                    disabled={!selectedPlantId}
                    className="py-3 px-6 bg-primary text-on-primary font-bold text-xs rounded-2xl active:scale-95 transition-all disabled:opacity-50 shrink-0"
                  >
                    Apply Schedule
                  </button>
                </div>
                {justApplied && (
                  <p className="text-center font-bold text-green-600 text-[11px] animate-pulse">
                    ✓ Schedule successfully matched! Cycles updated for selected plant.
                  </p>
                )}
              </div>

              <p className="text-[10px] text-center text-on-surface-variant font-medium uppercase tracking-widest">
                * Based on average room conditions
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
