import { create } from 'zustand';
import createPDPStore from '@/zustand/slices/pdp';

export const useBoundStore = create(() => ({
  ...createPDPStore(),
}));
