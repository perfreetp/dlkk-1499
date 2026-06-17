import { create } from 'zustand';
import type { ApplicationItem, CorrectionNotice, ECertificate } from '@/types';
import { mockCertificates } from '@/data/mockData';

interface ProgressState {
  applicationItems: ApplicationItem[];
  corrections: CorrectionNotice[];
  certificates: ECertificate[];
  setItemsAndCorrections: (items: ApplicationItem[], corrections: CorrectionNotice[]) => void;
  resolveCorrection: (id: string) => void;
  updateItemStatus: (id: string, status: ApplicationItem['status']) => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  applicationItems: [],
  corrections: [],
  certificates: mockCertificates,

  setItemsAndCorrections: (items, corrections) =>
    set({ applicationItems: items, corrections }),

  resolveCorrection: (id) =>
    set((state) => {
      const correction = state.corrections.find((c) => c.id === id);
      const newCorrections = state.corrections.map((c) =>
        c.id === id ? { ...c, resolved: true } : c
      );
      const newApplicationItems = correction
        ? state.applicationItems.map((item) =>
            item.id === correction.itemId && item.status === 'rejected'
              ? { ...item, status: 'processing' as const }
              : item
          )
        : state.applicationItems;
      return { corrections: newCorrections, applicationItems: newApplicationItems };
    }),

  updateItemStatus: (id, status) =>
    set((state) => ({
      applicationItems: state.applicationItems.map((item) =>
        item.id === id ? { ...item, status } : item
      ),
    })),
}));
