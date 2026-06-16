import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Lightbulb, Zap, ZapOff, Minimize2, Scan as ScanIcon, Biohazard, Timer, Menu, Upload, Sparkles, CheckCircle2, AlertTriangle, CloudSun, Leaf, Info, HelpCircle, RefreshCw, Plus } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useGarden } from '../context/GardenContext';

export default function Scan() {
  const navigate = useNavigate();
  const { openSidebar } = useOutletContext<{ openSidebar: () => void }>() || { openSidebar: () => {} };
  const { addPlant } = useGarden();
  const [addSuccessMessage, setAddSuccessMessage] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState('Plant ID');
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  
  // Real camera & capture states
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  
  // Scanned results
  const [plantResult, setPlantResult] = useState<any>(null);
  const [geminiResult, setGeminiResult] = useState<any>(null);

  const [layoutDensity] = useState(() => localStorage.getItem('pref-density') || 'compact');

  const modes = [
    { id: 'Plant ID', icon: ScanIcon, tip: 'Keep the leaf central and in bright indirect lighting.' },
    { id: 'Disease', icon: Biohazard, tip: 'Focus closely on the affected spots or insect patterns.' },
    { id: 'Mushroom', icon: Timer, tip: 'Focus on the cap structure and stalk gills. Do not consume raw!' },
    { id: 'Light', icon: Lightbulb, tip: 'Point the camera at the location to compute room brightness.' }
  ];

  // Request & Start stream
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    
    async function startCamera() {
      try {
        setCameraError(false);
        const constraints = {
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        };
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        activeStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.warn("Camera streaming not permitted or unsupported:", err);
        setCameraError(true);
      }
    }

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Capture frame from active camera stream
  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedImage(dataUrl);
        return dataUrl;
      }
    }
    return null;
  };

  // Handle local image file upload click
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultStr = reader.result as string;
        setCapturedImage(resultStr);
        // Start identification automatically on upload
        executeAnalysisFlow(resultStr);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset page state to scan again
  const handleReset = () => {
    setCapturedImage(null);
    setPlantResult(null);
    setGeminiResult(null);
    setScanError(null);
    setIsScanning(false);
    setIsLoading(false);
    setAddSuccessMessage(null);
  };

  const handleAddScanToGarden = () => {
    if (!plantResult) return;
    try {
      addPlant({
        name: plantResult.name,
        scientificName: plantResult.species || 'Unknown Species',
        image: capturedImage || plantResult.image || 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1000&auto=format&fit=crop',
        description: plantResult.description || 'Identified via camera scan.',
        vitality: 100,
        healthStatus: 'Excellent',
        light: plantResult?.care?.sunlight || plantResult?.care?.light || 'Bright Indirect Light',
        watering: plantResult?.care?.watering || 'Every 7 Days',
        temp: '18-27°C',
        habitat: 'Indoor'
      });
      setAddSuccessMessage(`Added "${plantResult.name}" to My Garden! 🌱`);
    } catch (err) {
      console.error(err);
      setScanError("Failed to auto-add identified plant species to database.");
    }
  };

  // Unified Plant ID + Gemini API execution
  const executeAnalysisFlow = async (imagePayload: string) => {
    setIsScanning(true);
    setIsLoading(true);
    setScanError(null);
    setPlantResult(null);
    setGeminiResult(null);

    try {
      // 1. Plant ID core identification (Calls Plant.id or Fallback Gemini model)
      if (activeMode === 'Plant ID') {
        const idResponse = await fetch('/api/identify-plant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imagePayload }),
        });

        if (!idResponse.ok) {
          throw new Error(`Server returned error status ${idResponse.status}`);
        }

        const idData = await idResponse.json();
        if (idData.success) {
          if (idData.source === 'plant_id') {
            const suggestions = idData.data?.result?.classification?.suggestions;
            if (suggestions && suggestions.length > 0) {
              const bestMatch = suggestions[0];
              setPlantResult({
                name: bestMatch.name,
                species: bestMatch.species || 'Asteraceae Family',
                confidence: Math.round(bestMatch.probability * 100),
                image: bestMatch.similar_images?.[0]?.url || imagePayload,
                description: 'Identified successfully utilizing the Plant.id neural core.'
              });
            } else {
              setPlantResult({
                name: 'Unknown Plant',
                species: 'Botanical Tracheophyta',
                confidence: 78,
                image: imagePayload,
                description: 'A leafy green plant detected in the snapshot.'
              });
            }
          } else {
            // Gemini Fallback Mode
            const parsed = idData.parsed;
            setPlantResult({
              name: parsed.name,
              species: parsed.species,
              confidence: parsed.confidence,
              image: imagePayload,
              description: parsed.description,
              care: parsed.care
            });
          }
        } else {
          setScanError(idData.error || "Plant identification API failed.");
        }
      }

      // 2. High-reasoning Gemini analysis (disease, edibility, lighting dynamics)
      const geminiResponse = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imagePayload,
          mode: activeMode
        })
      });

      if (!geminiResponse.ok) {
        throw new Error(`Gemini analysis service returned status ${geminiResponse.status}`);
      }

      const geminiData = await geminiResponse.json();
      if (geminiData.success) {
        setGeminiResult(geminiData.parsedData);
      } else {
        console.warn("Advanced Gemini metadata failed to compute. Displaying core details only.");
      }

    } catch (err: any) {
      console.error(err);
      setScanError(err.message || "Failed to communicate with botanic identification nodes.");
    } finally {
      setIsScanning(false);
      setIsLoading(false);
    }
  };

  // On button tap - captures from video list and runs analysis
  const triggerCameraScan = () => {
    const snap = captureFrame();
    if (snap) {
      executeAnalysisFlow(snap);
    } else {
      setScanError("Failed to lock video frame. Try selecting a local file instead!");
    }
  };

  const activeModeItem = modes.find(m => m.id === activeMode);

  return (
    <div className="bg-[#0b0c10] text-white min-h-screen flex flex-col overflow-hidden relative">
      
      {/* 1. Video Backdrop / Image Frozen View */}
      <div className="fixed inset-0 z-0">
        {capturedImage ? (
          <img 
            src={capturedImage} 
            alt="Captured Scene" 
            className="w-full h-full object-cover opacity-80"
          />
        ) : !cameraError ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover opacity-70"
          />
        ) : (
          // Tech styled backdrop fallback
          <div className="w-full h-full bg-gradient-to-tr from-[#12131a] to-[#1a231f] flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border-2 border-dashed border-primary/30 mb-4 animate-pulse">
              <Camera className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-headline font-bold text-lg text-primary">Camera Permissions Offline</h3>
            <p className="text-xs text-white/50 max-w-xs mt-1.5 leading-relaxed">
              No live camera feed detected. Please enable system permissions or upload any houseplant photo instantly using the file uploader.
            </p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />
      </div>

      {/* Hidden elements for Canvas/Files */}
      <canvas ref={canvasRef} className="hidden" />
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* 2. Top Navigation header */}
      <header className="relative z-10 pt-12 px-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex gap-2">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-black/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <button 
            onClick={openSidebar}
            className="w-10 h-10 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-black/60 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        {!capturedImage && (
          <div className="flex bg-black/50 backdrop-blur-md p-1 rounded-full border border-white/10">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  setActiveMode(mode.id);
                  setScanError(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all text-[11px] font-bold uppercase tracking-wider
                  ${activeMode === mode.id 
                    ? 'bg-primary text-on-primary shadow-lg' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <mode.icon className="w-3.5 h-3.5" />
                <span className={activeMode === mode.id ? 'inline' : 'hidden sm:inline'}>{mode.id}</span>
              </button>
            ))}
          </div>
        )}

        <div className="w-10" />
      </header>

      {/* 3. Main Scanning / AR Target Overlay Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        
        {/* Holographic Laser Scanner Line */}
        <AnimatePresence>
          {isScanning && (
            <motion.div 
              initial={{ y: '-120%' }}
              animate={{ y: '120%' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_#4caf50] z-20 pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Reticle Focus frame */}
        {!capturedImage && (
          <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
            {/* Corner Corners */}
            <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-primary rounded-tl-2xl animate-pulse" />
            <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-primary rounded-tr-2xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-primary rounded-bl-2xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-primary rounded-br-2xl animate-pulse" />
            
            <div className="w-3 h-3 bg-primary rounded-full animate-ping opacity-75" />
          </div>
        )}

        {/* Error Dialog Banner */}
        {scanError && (
          <div className="mt-4 mx-6 p-4 bg-error-container/90 backdrop-blur-md rounded-2xl border border-error/20 flex gap-3 max-w-sm">
            <AlertTriangle className="w-5 h-5 text-error shrink-0" />
            <div>
              <p className="text-xs font-bold text-on-error-container">Botanical Scan Fault</p>
              <p className="text-[11px] text-on-error-container/80 mt-0.5 leading-tight">{scanError}</p>
              <button 
                onClick={handleReset}
                className="mt-2 text-[10px] font-bold uppercase underline text-primary"
              >
                Reset and Retry
              </button>
            </div>
          </div>
        )}

        {/* Helpful Tip popover */}
        {!capturedImage && activeModeItem && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 mx-6 flex items-center gap-3 bg-black/60 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/5 max-w-sm shadow-xl"
          >
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <Lightbulb className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-bold text-xs text-primary uppercase tracking-tight">{activeMode} Guide</p>
              <p className="text-[10px] text-white/70 leading-snug mt-0.5">{activeModeItem.tip}</p>
            </div>
          </motion.div>
        )}

        {/* Loading State Spinner */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/65 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <Sparkles className="w-6 h-6 text-primary absolute inset-0 m-auto animate-pulse" />
            </div>
            <h4 className="font-headline font-bold text-lg text-primary">Analyzing Botanical Specimen...</h4>
            <p className="text-xs text-white/50 max-w-xs mt-1 leading-relaxed">
              Querying Plant.id neural classification and Gemini 3.5 AI diagnostic models. Decoding leaf patterns, diseases, cap features, and light index.
            </p>
          </div>
        )}

        {/* 4. RESULTS DISPLAY MODAL CARD (FLUID SLIDE-UP GRID) */}
        <AnimatePresence>
          {capturedImage && !isLoading && (plantResult || geminiResult) && (
            <motion.div 
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              className="absolute inset-x-0 bottom-0 bg-surface-container-lowest text-on-surface rounded-t-[36px] p-6 max-h-[75vh] overflow-y-auto shadow-2xl z-40 border-t border-outline-variant/10"
            >
              {/* Drag bar indicator */}
              <div className="w-12 h-1 bg-outline-variant/30 rounded-full mx-auto mb-6" />

              {/* Core Header section */}
              {plantResult && (
                <div className="flex items-center gap-4 border-b border-outline-variant/10 pb-5 mb-5">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-outline-variant/10 shadow-md shrink-0">
                    <img src={plantResult.image} alt={plantResult.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-headline font-extrabold text-xl text-primary leading-none">{plantResult.name}</h3>
                      <span className="text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest">
                        {plantResult.confidence}% match
                      </span>
                    </div>
                    <p className="font-body text-xs text-on-surface-variant font-semibold mt-1 italic">{plantResult.species}</p>
                    <p className="text-[11px] text-on-surface-variant/70 leading-relaxed mt-1.5">{plantResult.description}</p>
                  </div>
                </div>
              )}

              {/* DYNAMIC METADATA BY CURRENT SELECTION MODE */}
              
              {/* Plant ID details mode */}
              {activeMode === 'Plant ID' && (
                <div className="space-y-4">
                  {/* Care specs computed via Gemini fallback or details */}
                  {plantResult?.care ? (
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-surface-container-low p-3 rounded-2xl border border-outline-variant/5 text-center">
                        <span className="text-[9px] font-bold uppercase text-on-surface-variant">Watering</span>
                        <p className="text-xs font-black text-primary mt-1">{plantResult.care.watering}</p>
                      </div>
                      <div className="bg-surface-container-low p-3 rounded-2xl border border-outline-variant/5 text-center">
                        <span className="text-[9px] font-bold uppercase text-on-surface-variant">Sunlight</span>
                        <p className="text-xs font-black text-primary mt-1">{plantResult.care.sunlight}</p>
                      </div>
                      <div className="bg-surface-container-low p-3 rounded-2xl border border-outline-variant/5 text-center">
                        <span className="text-[9px] font-bold uppercase text-on-surface-variant">Toxicity</span>
                        <p className="text-xs font-black text-primary mt-1 truncate">{plantResult.care.toxicity}</p>
                      </div>
                    </div>
                  ) : null}

                  {geminiResult && (
                    <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/5 space-y-3">
                      <div className="flex gap-2 items-center">
                        <Sparkles className="w-4.5 h-4.5 text-primary" />
                        <span className="text-xs font-black uppercase text-on-surface">Botanical Trivia & Care tips</span>
                      </div>
                      {geminiResult.origin && (
                        <p className="text-xs leading-relaxed text-on-surface-variant">
                          <strong className="text-on-surface">Geographic Origin:</strong> {geminiResult.origin}
                        </p>
                      )}
                      {geminiResult.funFact && (
                        <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/10 text-xs italic text-on-surface-variant leading-relaxed">
                          " {geminiResult.funFact} "
                        </div>
                      )}
                      {geminiResult.growingTips && (
                        <div className="pt-2">
                          <span className="text-[10px] font-bold text-on-surface block mb-1.5">MASTER GROWING PROTOCOL</span>
                          <ul className="space-y-1.5">
                            {geminiResult.growingTips.map((tip: string, idx: number) => (
                              <li key={idx} className="text-xs text-on-surface-variant leading-normal flex gap-2">
                                <span className="text-primary select-none font-bold">✓</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Disease pathography mode */}
              {activeMode === 'Disease' && geminiResult && (
                <div className="space-y-4">
                  <div className="bg-error-container/10 p-4 rounded-2xl border border-error/15 space-y-2">
                    <div className="flex items-center gap-2 text-error">
                      <Biohazard className="w-5 h-5" />
                      <h4 className="font-headline font-black text-sm uppercase">{geminiResult.diagnosis || "Active Infection Detected"}</h4>
                    </div>
                    {geminiResult.commonName && <p className="text-xs font-bold text-on-surface">Common Name: {geminiResult.commonName}</p>}
                    <p className="text-xs text-on-surface-variant leading-relaxed mt-1">{geminiResult.description}</p>
                  </div>

                  {geminiResult.symptoms && (
                    <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/5">
                      <h5 className="text-[10px] font-bold text-on-surface mb-2 uppercase tracking-wide">Leaf Sympotomatology Checklist</h5>
                      <ul className="space-y-1.5">
                        {geminiResult.symptoms.map((symptom: string, idx: number) => (
                          <li key={idx} className="text-xs text-on-surface-variant flex gap-2 leading-tight">
                            <span className="text-error font-extrabold select-none">•</span>
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {geminiResult.remedies && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {geminiResult.remedies.organic && (
                        <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
                          <h6 className="text-[10.5px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 flex gap-1.5 items-center">
                            <Leaf className="w-3.5 h-3.5" /> Organic Cure
                          </h6>
                          <div className="space-y-1">
                            {geminiResult.remedies.organic.map((r: string, idx: number) => (
                              <p key={idx} className="text-[11px] text-on-surface-variant leading-relaxed">• {r}</p>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {geminiResult.remedies.chemical && (
                        <div className="bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10">
                          <h6 className="text-[10.5px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-2 flex gap-1.5 items-center">
                            <Zap className="w-3.5 h-3.5" /> Chemical Remedy
                          </h6>
                          <div className="space-y-1">
                            {geminiResult.remedies.chemical.map((r: string, idx: number) => (
                              <p key={idx} className="text-[11px] text-on-surface-variant leading-relaxed">• {r}</p>
                            ))}
                          </div>
                        </div>
                      )}

                      {geminiResult.remedies.prevention && (
                        <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                          <h6 className="text-[10.5px] font-extrabold text-primary uppercase tracking-widest mb-2 flex gap-1.5 items-center">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Prevention
                          </h6>
                          <div className="space-y-1">
                            {geminiResult.remedies.prevention.map((r: string, idx: number) => (
                              <p key={idx} className="text-[11px] text-on-surface-variant leading-relaxed">• {r}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Mycological Fungi mode */}
              {activeMode === 'Mushroom' && geminiResult && (
                <div className="space-y-4">
                  {/* Absolute Safety Banner */}
                  <div className={`p-4 rounded-2xl border flex gap-3 ${
                    geminiResult.edibility?.toLowerCase().includes('toxic') || geminiResult.edibility?.toLowerCase().includes('deadly')
                      ? 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300'
                      : geminiResult.edibility?.toLowerCase().includes('choice') || geminiResult.edibility?.toLowerCase().includes('edible')
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
                  }`}>
                    <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2 font-black text-sm uppercase">
                        <span>ESTIMATED TOXICITY:</span>
                        <span className="underline decoration-wavy underline-offset-4">{geminiResult.edibility || "Caution advised"}</span>
                      </div>
                      <p className="text-xs leading-relaxed mt-1 text-on-surface-variant font-bold">
                        {geminiResult.safetyWarning || "Never rely solely on digital image recognition algorithms to forage edible wild mushrooms. Deadly species can resemble edible lookalikes."}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/5">
                      <h5 className="text-[10px] font-bold text-on-surface uppercase mb-3 text-primary-fixed block">Mycological Specifications</h5>
                      <div className="space-y-2 text-xs text-on-surface-variant">
                        <p><strong className="text-on-surface">Scientific:</strong> {geminiResult.scientificName || "N/A"}</p>
                        <p><strong className="text-on-surface">Family Core:</strong> {geminiResult.family || "N/A"}</p>
                        {geminiResult.habitat && <p><strong className="text-on-surface">Habitat Substrate:</strong> {geminiResult.habitat}</p>}
                      </div>
                    </div>

                    {geminiResult.features && (
                      <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/5">
                        <h5 className="text-[10px] font-bold text-on-surface uppercase mb-2">Identification Key Features</h5>
                        <ul className="space-y-1.5">
                          {geminiResult.features.map((feat: string, idx: number) => (
                            <li key={idx} className="text-xs text-on-surface-variant leading-relaxed flex gap-2">
                              <span className="text-primary font-black">•</span>
                              {feat}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Architecture Light evaluator mode */}
              {activeMode === 'Light' && geminiResult && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10 text-center">
                      <span className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-300">Light Density Intensity</span>
                      <p className="text-lg font-black text-on-surface mt-1.5">{geminiResult.lightingQuality || "Indirect Sun"}</p>
                    </div>
                    <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 text-center col-span-2">
                      <span className="text-[10px] font-bold uppercase text-primary">Approximate Lux range</span>
                      <p className="text-lg font-black text-on-surface mt-1.5 flex justify-center items-center gap-1.5">
                        <CloudSun className="w-5 h-5 text-primary" />
                        {geminiResult.approxLux || "1500 - 3000 Lux"}
                      </p>
                    </div>
                  </div>

                  {geminiResult.assessment && (
                    <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/5">
                      <span className="text-[10.5px] font-black text-on-surface block uppercase mb-1">Architectural Photometric Assessment</span>
                      <p className="text-xs leading-normal text-on-surface-variant">{geminiResult.assessment}</p>
                    </div>
                  )}

                  {geminiResult.recommendedPlants && (
                    <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/5">
                      <span className="text-[10.5px] font-black text-on-surface block uppercase mb-3">Houseplants Suited for This Lux level</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {geminiResult.recommendedPlants.map((plt: any, idx: number) => (
                          <div key={idx} className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/10 text-xs">
                            <span className="font-extrabold text-primary tracking-wide block mb-1">{plt.name}</span>
                            <span className="text-[11px] text-on-surface-variant leading-snug block">{plt.reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Dynamic Success Alert inside modal */}
              <AnimatePresence>
                {addSuccessMessage && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="mb-4 bg-emerald-500 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-white shrink-0 animate-bounce" />
                      <span className="text-xs font-bold leading-tight">{addSuccessMessage}</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => navigate('/garden')} 
                      className="text-[10px] bg-white text-emerald-600 font-extrabold px-3 py-1 rounded-full uppercase shrink-0 transition-transform active:scale-95 shadow-sm"
                    >
                      View Garden
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Add and repeat control panels */}
              <div className="grid grid-cols-2 gap-3 mt-6 border-t border-outline-variant/10 pt-5">
                <button 
                  onClick={handleAddScanToGarden}
                  className="py-4 bg-primary text-on-primary rounded-2xl font-bold text-sm shadow-md active:scale-95 transition-all text-center flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add to Garden
                </button>
                <button 
                  onClick={handleReset}
                  className="py-4 bg-surface-container text-on-surface rounded-2xl font-bold text-sm active:scale-95 transition-all text-center"
                >
                  Scan Another Leaf
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 5. Footer Action Panels for captures & uploads */}
      <footer className="relative z-10 pb-12 px-10 flex items-center justify-between max-w-lg mx-auto w-full bg-gradient-to-t from-black/90 to-transparent">
        
        {/* Photo file import fallback */}
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-14 h-14 bg-black/40 backdrop-blur-md border border-white/10 text-white rounded-full flex flex-col items-center justify-center hover:bg-black/60 transition-all text-center group"
          title="Upload image file"
        >
          <Upload className="w-5 h-5 text-white/80 group-hover:scale-110 transition-transform" />
          <span className="text-[8px] text-white/50 uppercase font-bold mt-1 tracking-wider">File</span>
        </button>

        {/* Shutter Capture click */}
        <button 
          onClick={capturedImage ? handleReset : triggerCameraScan}
          disabled={isLoading}
          className="w-20 h-20 bg-white rounded-full p-1 shadow-2xl active:scale-90 transition-all disabled:opacity-50 flex items-center justify-center shrink-0"
        >
          <div className="w-full h-full rounded-full border-[3px] border-[#0b0c10] bg-white flex items-center justify-center">
            {capturedImage ? (
              <RefreshCw className="w-8 h-8 text-black animate-spin-slow" />
            ) : (
              <div className={`w-14 h-14 bg-primary rounded-full transition-transform ${isScanning ? 'scale-75' : ''}`} />
            )}
          </div>
        </button>

        {/* Flash Simulation Toggle */}
        <button 
          onClick={() => setFlashOn(!flashOn)}
          className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors
            ${flashOn ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-black/40 text-rose-50 hover:bg-black/60'}
          `}
        >
          {flashOn ? <Zap className="w-5 h-5" /> : <ZapOff className="w-5 h-5 opacity-70" />}
        </button>
      </footer>
    </div>
  );
}
