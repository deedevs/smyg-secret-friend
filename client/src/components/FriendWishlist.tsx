import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { wishlist } from '../lib/api';
import Spinner from './Spinner';

interface FriendWishlistProps {
  onClose: () => void;
  friendName: string;
}

export default function FriendWishlist({ onClose, friendName }: FriendWishlistProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['friend-wishlist'],
    queryFn: wishlist.getFriend,
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold">{friendName}'s Wishlist</h2>
            <p className="text-sm text-gray-600 mt-1">
              Here's what your secret friend would love to receive!
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="py-12 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : !data?.data.items.length ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-gray-600">
              {friendName} hasn't added any items to their wishlist yet.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Check back later or surprise them with something special!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.data.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h4 className="font-medium text-lg">{item.title}</h4>
                {item.description && (
                  <p className="text-gray-600 mt-1">{item.description}</p>
                )}
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 mt-2 text-sm"
                  >
                    View Item
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t flex justify-end">
          <button onClick={onClose} className="btn-primary">
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
