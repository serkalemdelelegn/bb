// components/ToastProvider.tsx
'use client'; // This directive is crucial!

import { ToastContainer } from 'react-toastify'; // Or 'sonner', or your chosen library
import 'react-toastify/dist/ReactToastify.css'; // Don't forget the CSS for react-toastify

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <ToastContainer
        position="top-center" // Customize position
        autoClose={3000} // Customize duration
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // Customize theme
        // Add other props as needed by your toast library
      />
    </>
  );
}