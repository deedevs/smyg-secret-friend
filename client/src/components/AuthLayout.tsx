import { motion } from 'framer-motion';
import Logo from './Logo';
import AnimatedBackground from './AnimatedBackground';

export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

export default function AuthLayout({
  children,
  title,
  description,
  maxWidth = '2xl',
}: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      <AnimatedBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full ${maxWidthClasses[maxWidth]} space-y-8 relative z-10`}
      >
        {/* Logo and Title */}
        <div className="text-center">
          <Logo size="lg" className="justify-center mb-6" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
              {title}
            </h1>
            {description && (
              <p className="text-lg text-gray-600">
                {description}
              </p>
            )}
          </motion.div>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 relative"
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}