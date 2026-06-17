import { create } from 'zustand';
import type { ApplicationItem, CorrectionNotice, ECertificate } from '@/types';
import { mockApplicationItems, mockCorrections, mockCertificates } from '@/data/mockData';

interface ProgressState {
  applicationItems: ApplicationItem[];
  corrections: CorrectionNotice[];
  certificates: ECertificate[];
  resolveCorrection: (id: string) => void;
  updateItemStatus: (id: string, status: ApplicationItem['status']) => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  applicationItems: mockApplicationItems,
  corrections: mockCorrections,
  certificates: mockCertificates,

  resolveCorrection: (id) =>
    set((state) => ({
      corrections: state.corrections.map((c) =>
        c.id === id ? { ...c, resolved: true } : c
      ),
    })),

  updateItemStatus: (id, status) =>
    set((state) => ({
      applicationItems: state.applicationItems.map((item) =>
        item.id === id ? { ...item, status } : item
      ),
    })),
}));
