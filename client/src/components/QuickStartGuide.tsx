import { motion } from 'framer-motion';

export default function QuickStartGuide() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg max-w-md mx-auto mt-8"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Quick Start Guide 🚀
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
            1
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Register/Login</h3>
            <p className="text-sm text-gray-600">
              Use your full name (first + last name). Add initials if needed to make it unique.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
            2
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Join Event</h3>
            <p className="text-sm text-gray-600">
              Click "Register as SMYG Secret Friend" on your dashboard to participate.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
            3
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Create Wishlist</h3>
            <p className="text-sm text-gray-600">
              Add items you'd like to receive to help your secret friend.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
            4
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Wait for Assignment</h3>
            <p className="text-sm text-gray-600">
              Once admin starts the event, you'll see who you're gifting to!
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-500 border-t pt-4">
        <strong>Remember:</strong> Keep your assigned friend secret and check their wishlist regularly for updates! 🤫
      </div>
    </motion.div>
  );
}
