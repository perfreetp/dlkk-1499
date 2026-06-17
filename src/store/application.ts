import { create } from 'zustand';
import type { BabyInfo, UserInfo, DivergenceResult, PageStep, MaterialItem } from '@/types';
import { mockBabyInfo, mockFatherInfo, mockMotherInfo, mockDivergenceResult, mockMaterials } from '@/data/mockData';

interface ApplicationState {
  currentStep: PageStep;
  babyInfo: BabyInfo;
  fatherInfo: UserInfo;
  motherInfo: UserInfo;
  divergenceResult: DivergenceResult | null;
  materials: MaterialItem[];
  applicationSubmitted: boolean;
  setCurrentStep: (step: PageStep) => void;
  setBabyInfo: (info: Partial<BabyInfo>) => void;
  setFatherInfo: (info: Partial<UserInfo>) => void;
  setMotherInfo: (info: Partial<UserInfo>) => void;
  setDivergenceResult: (result: DivergenceResult) => void;
  setMaterialUploaded: (id: string, uploaded: boolean) => void;
  setApplicationSubmitted: (submitted: boolean) => void;
  resetApplication: () => void;
}

export const useApplicationStore = create<ApplicationState>((set) => ({
  currentStep: 'home',
  babyInfo: mockBabyInfo,
  fatherInfo: mockFatherInfo,
  motherInfo: mockMotherInfo,
  divergenceResult: mockDivergenceResult,
  materials: mockMaterials,
  applicationSubmitted: false,

  setCurrentStep: (step) => set({ currentStep: step }),
  setBabyInfo: (info) => set((state) => ({ babyInfo: { ...state.babyInfo, ...info } })),
  setFatherInfo: (info) => set((state) => ({ fatherInfo: { ...state.fatherInfo, ...info } })),
  setMotherInfo: (info) => set((state) => ({ motherInfo: { ...state.motherInfo, ...info } })),
  setDivergenceResult: (result) => set({ divergenceResult: result }),
  setMaterialUploaded: (id, uploaded) =>
    set((state) => ({
      materials: state.materials.map((m) => (m.id === id ? { ...m, uploaded } : m)),
    })),
  setApplicationSubmitted: (submitted) => set({ applicationSubmitted: submitted }),
  resetApplication: () =>
    set({
      currentStep: 'home',
      applicationSubmitted: false,
    }),
}));
