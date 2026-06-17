import { create } from 'zustand';
import type { ApplicationItem, CorrectionNotice, ECertificate, FlowRecord } from '@/types';
import { mockCertificates } from '@/data/mockData';

interface ProgressState {
  applicationItems: ApplicationItem[];
  corrections: CorrectionNotice[];
  certificates: ECertificate[];
  setItemsAndCorrections: (items: ApplicationItem[], corrections: CorrectionNotice[]) => void;
  resolveCorrection: (id: string) => void;
  updateItemStatus: (id: string, status: ApplicationItem['status']) => void;
  addFlowRecord: (itemId: string, record: FlowRecord) => void;
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
        ? state.applicationItems.map((item) => {
            if (item.id === correction.itemId && item.status === 'rejected') {
              const now = new Date();
              const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
              const newRecord: FlowRecord = {
                id: `${item.id}-corrected-${Date.now()}`,
                type: 'corrected',
                title: '补正材料已提交，恢复办理',
                department: item.department,
                time: timeStr,
              };
              return {
                ...item,
                status: 'processing' as const,
                flowRecords: [...item.flowRecords, newRecord],
              };
            }
            return item;
          })
        : state.applicationItems;
      return { corrections: newCorrections, applicationItems: newApplicationItems };
    }),

  updateItemStatus: (id, status) =>
    set((state) => ({
      applicationItems: state.applicationItems.map((item) =>
        item.id === id ? { ...item, status } : item
      ),
    })),

  addFlowRecord: (itemId, record) =>
    set((state) => ({
      applicationItems: state.applicationItems.map((item) =>
        item.id === itemId
          ? { ...item, flowRecords: [...item.flowRecords, record] }
          : item
      ),
    })),
}));
