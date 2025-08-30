import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { wishlist, WishlistItem } from '../lib/api';
import Spinner from './Spinner';

interface WishlistModalProps {
  onClose: () => void;
}

export default function WishlistModal({ onClose }: WishlistModalProps) {
  const queryClient = useQueryClient();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [newItem, setNewItem] = useState({ title: '', description: '', link: '' });

  // Fetch existing wishlist
  const { data, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlist.getMine,
  });

  // Update items state when data is loaded
  useEffect(() => {
    if (data?.data?.items) {
      setItems(data.data.items);
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: wishlist.updateMine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Wishlist updated successfully!');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update wishlist');
    },
  });

  const handleAddItem = () => {
    if (!newItem.title.trim()) return;
    setItems(prevItems => [...prevItems, newItem]);
    setNewItem({ title: '', description: '', link: '' });
  };

  const handleRemoveItem = (index: number) => {
    setItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    console.log('Saving items:', items); // Debug log
    updateMutation.mutate(items);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">My Wishlist</h2>
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
        ) : (
          <div className="space-y-6">
            {/* Add new item form */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-medium">Add New Item</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Item name"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="input"
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="input"
                />
                <input
                  type="url"
                  placeholder="Link (optional)"
                  value={newItem.link}
                  onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
                  className="input"
                />
                <button
                  onClick={handleAddItem}
                  disabled={!newItem.title.trim()}
                  className="btn-primary w-full"
                >
                  Add Item
                </button>
              </div>
            </div>

            {/* Items list */}
            <div className="space-y-4">
              <h3 className="font-medium">My Items ({items.length})</h3>
              {items.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No items in your wishlist yet</p>
              ) : (
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="bg-white border rounded-lg p-4">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{item.title}</h4>
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      {item.description && (
                        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                      )}
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 text-sm mt-1 inline-block"
                        >
                          View Link
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <button onClick={onClose} className="btn">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="btn-primary"
              >
                {updateMutation.isPending ? (
                  <span className="flex items-center">
                    <Spinner size="sm" />
                    <span className="ml-2">Saving...</span>
                  </span>
                ) : (
                  'Save Wishlist'
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}