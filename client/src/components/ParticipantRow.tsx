import { useState } from 'react';
import { motion } from 'framer-motion';

interface ParticipantRowProps {
  participant: {
    id: string;
    fullName: string;
    assignedFriend: {
      id: string;
      fullName: string;
    } | null;
  };
  onDelete: (userId: string) => void;
  isAssignmentDone: boolean;
}

export default function ParticipantRow({ participant, onDelete, isAssignmentDone }: ParticipantRowProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    if (isAssignmentDone) {
      return; // Don't allow deletion after assignment
    }
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(participant.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="py-4 flex items-center justify-between group">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">{participant.fullName}</span>
          {!isAssignmentDone && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleDeleteClick}
              className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete participant"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </motion.button>
          )}
        </div>
        {participant.assignedFriend && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: isRevealed ? 1 : 0, height: isRevealed ? 'auto' : 0 }}
            className="text-sm text-gray-600 mt-1"
          >
            Secret Friend: {participant.assignedFriend.fullName}
          </motion.div>
        )}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-sm w-full"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Delete Participant
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete {participant.fullName}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
