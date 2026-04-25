import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Music, Volume2, ListMusic } from 'lucide-react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Odyssey',
    artist: 'CyberSynth AI',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop',
    duration: 185,
    genre: 'Synthwave'
  },
  {
    id: '2',
    title: 'Digital Drift',
    artist: 'Silicon Soul',
    cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&h=400&fit=crop',
    duration: 212,
    genre: 'Electronic'
  },
  {
    id: '3',
    title: 'Midnight Protocol',
    artist: 'Neural Network',
    cover: 'https://images.unsplash.com/photo-1557683311-eac922347aa1?w=400&h=400&fit=crop',
    duration: 158,
    genre: 'Techno'
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            handleNext();
            return 0;
          }
          return p + (100 / currentTrack.duration);
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  const handleNext = () => {
    setCurrentTrackIndex(prev => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handlePrevious = () => {
    setCurrentTrackIndex(prev => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-sm glass-morphism rounded-[2.5rem] p-6 flex flex-col gap-6 neon-border-cyan relative overflow-hidden group">
      {/* Visualizer Background */}
      <div className="absolute inset-0 flex items-end justify-center gap-1 opacity-20 pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-2 bg-neon-cyan rounded-t-full"
            animate={{
              height: isPlaying ? [10, Math.random() * 80 + 20, 10] : 10,
            }}
            transition={{
              duration: 0.5 + Math.random(),
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="bg-slate-800/50 p-2 rounded-xl text-slate-400">
            <ListMusic className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono font-bold tracking-[0.3em] uppercase text-slate-500">System Audio</span>
          <div className="bg-slate-800/50 p-2 rounded-xl text-slate-400">
            <Volume2 className="w-5 h-5" />
          </div>
        </div>

        <div className="relative aspect-square rounded-3xl overflow-hidden mb-6 group/cover shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentTrack.id}
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.1, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotate: 2 }}
              transition={{ duration: 0.6, ease: "circOut" }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          
          {isPlaying && (
             <div className="absolute bottom-4 left-4 flex gap-1 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-lime animate-pulse" />
                <span className="text-[10px] text-neon-lime uppercase font-bold tracking-tighter">Live Stream</span>
             </div>
          )}
        </div>

        <div className="mb-8">
          <motion.h3 
            key={currentTrack.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl font-bold text-white mb-1 tracking-tight"
          >
            {currentTrack.title}
          </motion.h3>
          <motion.p 
             key={currentTrack.artist}
             initial={{ y: 10, opacity: 0 }}
             animate={{ y: 0, opacity: 0.6 }}
             className="text-slate-400 font-medium"
          >
            {currentTrack.artist}
          </motion.p>
        </div>

        <div className="space-y-2 mb-8">
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple shadow-[0_0_10px_rgba(6,182,212,0.5)]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
            <span>{formatTime((progress / 100) * currentTrack.duration)}</span>
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8">
          <button 
            onClick={handlePrevious}
            className="text-slate-500 hover:text-neon-cyan transition-colors"
          >
            <SkipBack className="w-8 h-8 fill-current" />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-950 hover:scale-110 active:scale-95 transition-all shadow-xl shadow-white/10"
          >
            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>

          <button 
             onClick={handleNext}
             className="text-slate-500 hover:text-neon-cyan transition-colors"
          >
            <SkipForward className="w-8 h-8 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
}
