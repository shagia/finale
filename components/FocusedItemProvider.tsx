import React, { useState, useCallback } from 'react';
import { JellyfinItem } from '@/scripts/services/jellyfin-api';

interface FocusedItemContextType {
  focusedItem: JellyfinItem | null;
  setFocusedItem: (item: JellyfinItem | null) => void;
}

const FocusedItemContext = React.createContext<FocusedItemContextType | null>(null);

/**
 * FocusedItemProvider - Provides global focused item state management
 * This allows any component to track and update the currently focused item
 * across multiple ItemList instances.
 */
export default function FocusedItemProvider({ children }: { children: React.ReactNode }) {
  const [focusedItem, setFocusedItem] = useState<JellyfinItem | null>(null);

  const value: FocusedItemContextType = {
    focusedItem,
    setFocusedItem,
  };

  return (
    <FocusedItemContext.Provider value={value}>
      {children}
    </FocusedItemContext.Provider>
  );
}

/**
 * Hook to access focused item state
 * @throws Error if used outside of FocusedItemProvider
 */
export function useFocusedItem() {
  const context = React.useContext(FocusedItemContext);
  if (!context) {
    throw new Error('useFocusedItem must be used within a FocusedItemProvider');
  }
  return context;
}
