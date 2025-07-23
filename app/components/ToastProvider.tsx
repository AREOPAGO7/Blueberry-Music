"use client";

import { Toast } from 'primereact/toast';
import { useRef, createContext, useContext } from 'react';

type ToastContextType = {
  showToast: (options: { severity: string; summary: string; detail: string; life?: number }) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const toastRef = useRef<Toast>(null);

  const showToast = (options: { severity: string; summary: string; detail: string; life?: number }) => {
    toastRef.current?.show(options);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast ref={toastRef} />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context.showToast;
};
