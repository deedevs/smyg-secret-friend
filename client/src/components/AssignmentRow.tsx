import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AssignmentRowProps {
  participant: {
    id: string;
    fullName: string;
    assignedFriend: {
      id: string;
      fullName: string;
    } | null;
  };
}

export default function AssignmentRow({ participant }: AssignmentRowProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="py-4 flex items-center justify-between">
      <div className="flex-1">
        <span className="text-lg">{participant.fullName}</span>
        <AnimatePresence>
          {isRevealed && participant.assignedFriend && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-gray-600 mt-1"
            >
              Secret Friend: {participant.assignedFriend.fullName}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {participant.assignedFriend && (
        <button
          onClick={() => setIsRevealed(!isRevealed)}
          className="ml-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
          title={isRevealed ? 'Hide assignment' : 'Show assignment'}
        >
          {isRevealed ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
