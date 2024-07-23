'use client';
import { type StoreApi, useStore } from 'zustand';
import { useContext, createContext, type ReactNode, useRef } from 'react';
import createPDPStore, { type PDPState } from '@/zustand/slices/pdp';
// NOTE:
//************************************************************************************/
// We ensure that this component is re-render-safe by checking
// the value of the reference, so that the store is only created once.
// This component will only be rendered once per request on the server,
// but might be re-rendered multiple times on the client
// if there are stateful client components located above this component in the tree,
// or if this component also contains other mutable state that causes a re-render.
//************************************************************************************/

const PDPStoreContext = createContext<StoreApi<PDPState> | null>(null);
PDPStoreContext.displayName = 'PDPStoreContext';

export interface PageDesignerStoreProviderProps {
  children: ReactNode;
}

export const PDPStoreProvider: React.FC<PageDesignerStoreProviderProps> = ({
  children,
}) => {
  const storeRef = useRef<StoreApi<PDPState>>();
  if (!storeRef.current) {
    storeRef.current = createPDPStore();
  }

  return (
    <PDPStoreContext.Provider value={storeRef.current}>
      {children}
    </PDPStoreContext.Provider>
  );
};

export const usePDPStore = <T,>(selector: (store: PDPState) => T): T => {
  const pdpContext = useContext(PDPStoreContext);
  if (!pdpContext) {
    throw new Error(`usePDPStore must be used within PDPStoreProvider`);
  }

  return useStore(pdpContext, selector);
};
