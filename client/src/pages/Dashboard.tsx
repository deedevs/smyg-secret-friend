import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../lib/auth';
import { secret } from '../lib/api';
import PageLayout from '../components/PageLayout';
import Confetti from '../components/Confetti';
import WishlistModal from '../components/WishlistModal';
import FriendWishlist from '../components/FriendWishlist';

export default function Dashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMyWishlist, setShowMyWishlist] = useState(false);
  const [showFriendWishlist, setShowFriendWishlist] = useState(false);

  const { data: friendData } = useQuery({
    queryKey: ['assignedFriend'],
    queryFn: secret.getAssignedFriend,
  });

  const registerMutation = useMutation({
    mutationFn: secret.register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      setShowConfetti(true);
      toast.success("You're in! 🎉");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleRegister = () => {
    registerMutation.mutate();
  };

  return (
    <PageLayout
      title="Welcome to SMYG Digital Secret Friend"
      subtitle="Join the fun! Click the button below to enter this year's SMYG Digital Secret Friend. Once you join, you can't unjoin."
    >
      {showConfetti && <Confetti />}

      <div className="card space-y-8">
        {!user?.participating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6"
          >
            <p className="text-lg">Ready to discover who you'll be gifting to?</p>
            <button
              onClick={handleRegister}
              className="btn-primary text-lg px-8 py-3"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending
                ? 'Registering...'
                : 'Register as SMYG Secret Friend'}
            </button>
          </motion.div>
        )}

        {user?.participating && !friendData?.friend && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4"
          >
            <div className="text-2xl font-semibold text-primary-600">
              You're in! 🎉
            </div>
            <p className="text-lg text-gray-600">
              Waiting for the Admin to start the secret friend assignment.
            </p>
            <div className="pt-4">
              <button
                onClick={() => setShowMyWishlist(true)}
                className="btn-secondary"
              >
                Create My Wishlist
              </button>
            </div>
          </motion.div>
        )}

        {user?.participating && friendData?.friend && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6"
          >
            <div className="text-2xl font-semibold gradient-text">
              Your Secret Friend Is...
            </div>
            <div className="p-6 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-xl">
              <p className="text-3xl font-bold text-gray-800">
                {friendData.friend.fullName}
              </p>
            </div>
            <p className="text-gray-600">
              Remember to keep it a secret and make it special! 🤫
            </p>
            
            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => setShowMyWishlist(true)}
                className="btn-secondary"
              >
                Manage My Wishlist
              </button>
              <button
                onClick={() => setShowFriendWishlist(true)}
                className="btn-primary"
              >
                View {friendData.friend.fullName}'s Wishlist
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      {showMyWishlist && (
        <WishlistModal onClose={() => setShowMyWishlist(false)} />
      )}
      
      {showFriendWishlist && friendData?.friend && (
        <FriendWishlist
          onClose={() => setShowFriendWishlist(false)}
          friendName={friendData.friend.fullName}
        />
      )}
    </PageLayout>
  );
}