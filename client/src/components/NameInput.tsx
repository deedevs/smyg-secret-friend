import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NameInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidityChange: (isValid: boolean) => void;
}

export default function NameInput({ value, onChange, onValidityChange }: NameInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [validationStatus, setValidationStatus] = useState<'error' | 'warning' | 'success' | null>(null);

  useEffect(() => {
    validateName(value);
  }, [value]);

  const validateName = (name: string) => {
    // Remove extra spaces and trim
    const cleanName = name.replace(/\s+/g, ' ').trim();

    // Reset validation if empty
    if (!cleanName) {
      setValidationMessage('');
      setValidationStatus(null);
      onValidityChange(false);
      return;
    }

    // Check for minimum length
    if (cleanName.length < 4) {
      setValidationMessage('Please enter your full name');
      setValidationStatus('error');
      onValidityChange(false);
      return;
    }

    // Split into words
    const words = cleanName.split(' ');

    // Check number of words
    if (words.length < 2) {
      setValidationMessage('Please enter both your first and last name');
      setValidationStatus('error');
      onValidityChange(false);
      return;
    }

    // Check each word
    for (const word of words) {
      if (word.length < 2) {
        setValidationMessage('Each part of your name should be at least 2 characters');
        setValidationStatus('error');
        onValidityChange(false);
        return;
      }

      if (!/^[A-Za-z.-]+$/.test(word)) {
        setValidationMessage('Names can only contain letters, dots, and hyphens');
        setValidationStatus('error');
        onValidityChange(false);
        return;
      }
    }

    // Check total length
    if (cleanName.length > 50) {
      setValidationMessage('Name is too long (maximum 50 characters)');
      setValidationStatus('error');
      onValidityChange(false);
      return;
    }

    // Suggest adding initials if name is common
    if (words.length === 2 && !cleanName.includes('.')) {
      setValidationMessage('Consider adding your initials to make your name unique');
      setValidationStatus('warning');
      onValidityChange(true);
      return;
    }

    // All good
    setValidationMessage('Valid full name');
    setValidationStatus('success');
    onValidityChange(true);
  };

  return (
    <div className="space-y-1">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`input pr-10 ${
            validationStatus === 'error'
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : validationStatus === 'warning'
              ? 'border-yellow-300 focus:ring-yellow-500 focus:border-yellow-500'
              : validationStatus === 'success'
              ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
              : ''
          }`}
          placeholder="Enter your full name"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {validationStatus && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={
                validationStatus === 'error'
                  ? 'text-red-500'
                  : validationStatus === 'warning'
                  ? 'text-yellow-500'
                  : 'text-green-500'
              }
            >
              {validationStatus === 'error' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                </svg>
              ) : validationStatus === 'warning' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
              )}
            </motion.span>
          )}
        </div>
      </div>

      <AnimatePresence>
        {(validationMessage && isFocused) && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`text-sm ${
              validationStatus === 'error'
                ? 'text-red-600'
                : validationStatus === 'warning'
                ? 'text-yellow-600'
                : 'text-green-600'
            }`}
          >
            {validationMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
