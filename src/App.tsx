/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Cpu, Zap, Activity } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Decorative Neon Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-purple/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Header / Brand */}
      <header className="absolute top-8 left-8 flex items-center gap-4 z-20">
        <div className="w-12 h-12 bg-neon-cyan/20 border border-neon-cyan rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          <Cpu className="w-6 h-6 text-neon-cyan" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tighter text-white uppercase italic">CyberShift</h1>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-lime animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Protocol Active</span>
          </div>
        </div>
      </header>

      {/* Side HUD Left */}
      <div className="hidden xl:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col gap-8 z-10 w-48">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-slate-500 font-mono text-[10px] tracking-widest uppercase">
            <span>Power Core</span>
            <span className="text-neon-cyan">Stable</span>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-neon-cyan" 
              animate={{ width: ['40%', '85%', '60%'] }} 
              transition={{ repeat: Infinity, duration: 4 }}
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-slate-500 font-mono text-[10px] tracking-widest uppercase">
            <span>Sync Rate</span>
            <span className="text-neon-purple">98.2%</span>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
               className="h-full bg-neon-purple" 
               animate={{ width: ['70%', '40%', '95%'] }} 
               transition={{ repeat: Infinity, duration: 3 }}
            />
          </div>
        </div>
        <div className="pt-8 border-t border-slate-900">
           <Activity className="w-12 h-12 text-slate-800 mb-2" />
           <p className="text-[10px] text-slate-600 font-mono leading-relaxed">
             INTEGRATED NEURAL LINK SUSTAINED. KEEP MOVING TO MAINTAIN SIGNAL INTEGRITY.
           </p>
        </div>
      </div>

      {/* Main Layout */}
      <main className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-7xl mx-auto">
        {/* Game Window - Left or Top */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2 px-2">
             <div className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_5px_#06b6d4]" />
             <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-[0.4em]">Grid_Simulation_v4.2</h2>
          </div>
          <SnakeGame />
        </section>

        {/* Console / Divider for desktop */}
        <div className="hidden lg:flex flex-col items-center gap-4 py-12">
            <div className="w-px h-24 bg-gradient-to-b from-transparent via-slate-800 to-transparent" />
            <Zap className="w-6 h-6 text-slate-800" />
            <div className="w-px h-24 bg-gradient-to-t from-transparent via-slate-800 to-transparent" />
        </div>

        {/* Music Player - Right or Bottom */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2 px-2 lg:justify-end">
             <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-[0.4em]">Audio_Matrix</h2>
             <div className="w-2 h-2 rounded-full bg-neon-purple shadow-[0_0_5px_#d946ef]" />
          </div>
          <MusicPlayer />
        </section>
      </main>

      {/* Footer Info */}
      <footer className="absolute bottom-8 left-0 right-0 flex justify-center z-20">
        <div className="glass-morphism px-6 py-2 rounded-full flex items-center gap-8 border border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Network</span>
            <span className="text-[10px] font-mono font-bold text-neon-lime uppercase tracking-widest">Encrypted</span>
          </div>
          <div className="w-px h-4 bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Region</span>
            <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest">Tokyo-Sector</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
