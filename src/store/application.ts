import { create } from 'zustand';
import type { BabyInfo, UserInfo, DivergenceResult, PageStep, MaterialItem } from '@/types';
import { mockBabyInfo, mockFatherInfo, mockMotherInfo, generateMaterials, generateApplicationItems, generateCorrections } from '@/data/mockData';
import { useProgressStore } from '@/store/progress';

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

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  currentStep: 'home',
  babyInfo: mockBabyInfo,
  fatherInfo: mockFatherInfo,
  motherInfo: mockMotherInfo,
  divergenceResult: null,
  materials: [],
  applicationSubmitted: false,

  setCurrentStep: (step) => set({ currentStep: step }),
  setBabyInfo: (info) => set((state) => ({ babyInfo: { ...state.babyInfo, ...info } })),
  setFatherInfo: (info) => set((state) => ({ fatherInfo: { ...state.fatherInfo, ...info } })),
  setMotherInfo: (info) => set((state) => ({ motherInfo: { ...state.motherInfo, ...info } })),

  setDivergenceResult: (result) => {
    const materials = generateMaterials(result.maritalStatus, result.settlementType);
    const applicationItems = generateApplicationItems(result.applicableItems);
    const corrections = generateCorrections(applicationItems);

    const progressStore = useProgressStore.getState();
    progressStore.setItemsAndCorrections(applicationItems, corrections);

    set({ divergenceResult: result, materials });
  },

  setMaterialUploaded: (id, uploaded) =>
    set((state) => ({
      materials: state.materials.map((m) => (m.id === id ? { ...m, uploaded } : m)),
    })),

  setApplicationSubmitted: (submitted) => set({ applicationSubmitted: submitted }),

  resetApplication: () =>
    set({
      currentStep: 'home',
      divergenceResult: null,
      materials: [],
      applicationSubmitted: false,
    }),
}));
