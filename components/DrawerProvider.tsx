import React, { useState, createContext, useContext } from 'react';

interface DrawerContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextType | null>(null);

/**
 * DrawerProvider - Provides global drawer state management
 * This allows any component to control the drawer (open/close) without needing
 * direct access to the drawer state.
 */
export default function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const value: DrawerContextType = {
    open,
    setOpen,
    openDrawer,
    closeDrawer,
  };

  return (
    <DrawerContext.Provider value={value}>
      {children}
    </DrawerContext.Provider>
  );
}

/**
 * Hook to access drawer control functions
 * @throws Error if used outside of DrawerProvider
 */
export function useDrawer() {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
}
