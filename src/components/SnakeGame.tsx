import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play } from 'lucide-react';
import { Direction, Point } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 120;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    generateFood(INITIAL_SNAKE);
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Wall collision
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'w'].includes(e.key) && direction !== 'DOWN') setDirection('UP');
      if (['ArrowDown', 's'].includes(e.key) && direction !== 'UP') setDirection('DOWN');
      if (['ArrowLeft', 'a'].includes(e.key) && direction !== 'RIGHT') setDirection('LEFT');
      if (['ArrowRight', 'd'].includes(e.key) && direction !== 'LEFT') setDirection('RIGHT');
      if (e.key === ' ' && !isGameOver) setIsPaused(p => !p);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, isGameOver, moveSnake]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center gap-6 glass-morphism p-8 rounded-3xl neon-border-cyan">
      <div className="flex justify-between w-full items-center mb-2">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-slate-400 font-medium">Session Score</span>
          <span className="text-4xl font-bold font-mono text-neon-cyan neon-glow-cyan">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 text-slate-400">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-xs uppercase tracking-widest font-medium">Best Record</span>
          </div>
          <span className="text-2xl font-bold font-mono text-slate-300">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div 
        className="relative bg-slate-950/80 rounded-xl overflow-hidden border border-slate-800 shadow-2xl"
        style={{ width: 400, height: 400 }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-10">
          {Array.from({ length: 400 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-slate-700" />
          ))}
        </div>

        {/* Snake segments */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${segment.x}-${segment.y}-${i}`}
            className={`absolute rounded-sm ${i === 0 ? 'bg-neon-cyan shadow-[0_0_10px_#06b6d4]' : 'bg-neon-cyan/60'}`}
            initial={false}
            animate={{
              left: `${segment.x * 5}%`,
              top: `${segment.y * 5}%`,
            }}
            transition={{ duration: 0.1, ease: "linear" }}
            style={{ width: '5%', height: '5%' }}
          />
        ))}

        {/* Food */}
        <motion.div
          className="absolute bg-neon-purple rounded-full shadow-[0_0_15px_#d946ef]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ repeat: Infinity, duration: 1 }}
          style={{
            left: `${food.x * 5}%`,
            top: `${food.y * 5}%`,
            width: '5%',
            height: '5%',
          }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center z-10"
            >
              <h2 className="text-5xl font-bold text-red-500 mb-2 uppercase tracking-tighter italic">Vaporized</h2>
              <p className="text-slate-400 mb-8 font-mono">System Failure at {score} points</p>
              <button 
                onClick={resetGame}
                className="flex items-center gap-3 bg-neon-cyan text-slate-950 px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              >
                <RefreshCw className="w-5 h-5" /> RESTART CORE
              </button>
            </motion.div>
          )}

          {isPaused && !isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md flex flex-col items-center justify-center z-10"
            >
              <button 
                onClick={() => setIsPaused(false)}
                className="w-20 h-20 bg-neon-cyan/20 border-2 border-neon-cyan text-neon-cyan rounded-full flex items-center justify-center hover:bg-neon-cyan hover:text-slate-950 transition-all group shadow-[0_0_30px_rgba(6,182,212,0.2)]"
              >
                <Play className="w-10 h-10 fill-current group-hover:scale-110 transition-transform" />
              </button>
              <p className="mt-4 text-neon-cyan font-mono tracking-widest animate-pulse font-bold">READY TO SHIFT?</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 text-slate-500 font-mono text-xs uppercase tracking-widest mt-2">
        <div className="flex items-center gap-1.5"><span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-slate-300">WASD</span> Movement</div>
        <div className="flex items-center gap-1.5"><span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-slate-300">SPACE</span> Pause</div>
      </div>
    </div>
  );
}
