import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  color: string;
}

const colors = [
  'bg-primary-500',
  'bg-secondary-500',
  'bg-yellow-500',
  'bg-green-500',
  'bg-pink-500',
];

export default function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const newPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setPieces(newPieces);

    const timer = setTimeout(() => {
      setPieces([]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      <AnimatePresence>
        {pieces.map((piece) => (
          <motion.div
            key={piece.id}
            className={`absolute w-2 h-2 rounded-full ${piece.color}`}
            initial={{
              top: '-10%',
              left: `${piece.x}%`,
              scale: 1,
              opacity: 1,
            }}
            animate={{
              top: '110%',
              left: [
                `${piece.x}%`,
                `${piece.x + (Math.random() * 20 - 10)}%`,
                `${piece.x + (Math.random() * 20 - 10)}%`,
              ],
              scale: 0,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2,
              delay: piece.delay,
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
