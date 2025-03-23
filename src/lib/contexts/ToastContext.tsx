'use client';

import React, { createContext, ReactNode, useContext, useState } from 'react';
import Toast from '@/components/ui/Toast';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

let toastInstance:
  | ((message: string | string[], type?: ToastType) => void)
  | null = null; // ✅ 전역 변수 추가

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<{
    message: string | string[];
    type: ToastType;
  } | null>(null);

  const showToast = (message: string | string[], type: ToastType = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000); // 3초 후 자동 닫기
  };

  toastInstance = showToast;

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <Toast text={toast.message} type={toast.type} />}
    </ToastContext.Provider>
  );
};

export const triggerToast = (
  message: string | string[],
  type: ToastType = 'info'
) => {
  if (toastInstance) {
    toastInstance(message, type);
  }
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
