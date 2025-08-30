import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { admin } from '../lib/api';
import PageLayout from '../components/PageLayout';
import Spinner from '../components/Spinner';
import ParticipantRow from '../components/ParticipantRow';

export default function Admin() {
  const queryClient = useQueryClient();
  const [showConfirmation, setShowConfirmation] = useState<'start' | 'reset' | null>(null);

  const { data: statusData, isLoading } = useQuery({
    queryKey: ['admin-status'],
    queryFn: admin.getStatus,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const startMutation = useMutation({
    mutationFn: admin.startAssignment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-status'] });
      queryClient.invalidateQueries({ queryKey: ['assignedFriend'] });
      toast.success('Secret friend assignments completed!');
      setShowConfirmation(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
      setShowConfirmation(null);
    },
  });

  const resetMutation = useMutation({
    mutationFn: admin.resetSystem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-status'] });
      queryClient.invalidateQueries({ queryKey: ['assignedFriend'] });
      toast.success('System has been reset successfully');
      setShowConfirmation(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
      setShowConfirmation(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: admin.deleteParticipant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-status'] });
      toast.success('Participant deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleStart = () => setShowConfirmation('start');
  const handleReset = () => setShowConfirmation('reset');
  const handleDelete = (userId: string) => deleteMutation.mutate(userId);

  const confirmAction = () => {
    if (showConfirmation === 'start') {
      startMutation.mutate();
    } else if (showConfirmation === 'reset') {
      resetMutation.mutate();
    }
  };

  return (
    <PageLayout
      title="Admin Panel"
      subtitle="Manage participants and control the secret friend event"
      maxWidth="xl"
    >
      <div className="card space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Participants</h2>
          <div className="flex gap-3">
            {statusData?.data.isAssignmentDone ? (
              <button
                onClick={handleReset}
                className="btn-secondary"
                disabled={resetMutation.isPending}
              >
                Reset System
              </button>
            ) : (
              <button
                onClick={handleStart}
                className="btn-primary"
                disabled={
                  isLoading ||
                  startMutation.isPending ||
                  !statusData?.data.participantCount ||
                  statusData.data.participantCount < 2 ||
                  statusData.data.isAssignmentDone
                }
              >
                Start Secret Friend
              </button>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h3 className="font-medium text-gray-700">System Status</h3>
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <div className="space-y-1 text-sm">
              <p>
                Event Status:{' '}
                <span className={statusData?.data.isLocked ? 'text-yellow-600' : 'text-green-600'}>
                  {statusData?.data.isLocked ? 'Locked' : 'Open for Registration'}
                </span>
              </p>
              <p>
                Assignments:{' '}
                <span className={statusData?.data.isAssignmentDone ? 'text-green-600' : 'text-blue-600'}>
                  {statusData?.data.isAssignmentDone ? 'Completed' : 'Pending'}
                </span>
              </p>
              <p>
                Participants: <span className="font-medium">{statusData?.data.participantCount || 0}</span>
              </p>
            </div>
          )}
        </div>

        {/* Participants List */}
        {isLoading ? (
          <div className="py-12">
            <Spinner size="lg" />
          </div>
        ) : !statusData?.data.participants.length ? (
          <div className="text-center py-8 text-gray-600">
            No participants yet
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {statusData.data.participants.map((participant) => (
              <ParticipantRow
                key={participant.id}
                participant={participant}
                onDelete={handleDelete}
                isAssignmentDone={statusData.data.isAssignmentDone}
              />
            ))}
          </div>
        )}

        {statusData?.data.participantCount === 1 && (
          <div className="text-sm text-yellow-600 bg-yellow-50 p-4 rounded-lg">
            At least 2 participants are needed to start the assignment.
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4"
          >
            <h3 className="text-xl font-semibold">
              {showConfirmation === 'start' ? 'Confirm Start' : 'Confirm Reset'}
            </h3>
            <p className="text-gray-600">
              {showConfirmation === 'start' ? (
                'Are you sure you want to start the secret friend assignment? This action cannot be undone, and no more participants will be able to join.'
              ) : (
                'Are you sure you want to reset the system? This will clear all assignments and allow participants to register again.'
              )}
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmation(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={showConfirmation === 'start' ? 'btn-primary' : 'btn-secondary'}
                disabled={startMutation.isPending || resetMutation.isPending}
              >
                {startMutation.isPending || resetMutation.isPending ? (
                  <span className="flex items-center">
                    <Spinner size="sm" />
                    <span className="ml-2">Processing...</span>
                  </span>
                ) : showConfirmation === 'start' ? (
                  'Start Assignment'
                ) : (
                  'Reset System'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </PageLayout>
  );
}