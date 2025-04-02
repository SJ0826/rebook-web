import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  text: string | string[];
  type?: ToastType;
  duration?: number;
}

const Toast = ({ text, type, duration = 3000 }: ToastProps) => {
  const [visible, setVisible] = useState(true);

  const alertType = () => {
    switch (type) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-error';
      case 'warning':
        return 'alert-warning';
      case 'info':
        return 'alert-info';
      default:
        return 'alert-info';
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed top-1/2 left-1/2 z-[9999] -translate-x-1/2"
        >
          {Array.isArray(text) ? (
            text.map((text) => (
              <div key={text} className={`alert ${alertType()} z-[9999]`}>
                {text}
              </div>
            ))
          ) : (
            <div className={`alert ${alertType()} alert-soft`}>{text}</div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
