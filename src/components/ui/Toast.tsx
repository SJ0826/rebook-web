import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  text: string | string[];
  type?: ToastType;
  duration?: number;
}

const toastStyleMap: Record<ToastType, string> = {
  success: 'bg-green-100 text-green-800 border-green-300',
  error: 'bg-red-100 text-red-800 border-red-300',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  info: 'bg-blue-100 text-blue-800 border-blue-300',
};

const Toast = ({ text, type = 'success', duration = 3000 }: ToastProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const toastClass = `w-full max-w-sm border-l-4 rounded-md px-4 py-3 shadow-md ${toastStyleMap[type]}`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed top-1/6 left-1/2 z-[9999] -translate-x-1/2"
        >
          {Array.isArray(text) ? (
            text.map((text) => (
              <div key={text} className={` ${toastClass} z-[9999]`}>
                {text}
              </div>
            ))
          ) : (
            <div className={` ${toastClass} alert-soft`}>{text}</div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
