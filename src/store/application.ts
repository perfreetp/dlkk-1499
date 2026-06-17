import { create } from 'zustand';
import type { BabyInfo, UserInfo, DivergenceResult, PageStep, MaterialItem, DraftData } from '@/types';
import { mockBabyInfo, mockFatherInfo, mockMotherInfo, generateMaterials, generateApplicationItems, generateCorrections } from '@/data/mockData';
import { useProgressStore } from '@/store/progress';

const DRAFT_STORAGE_KEY = 'birth-one-thing-draft';

interface ApplicationState {
  currentStep: PageStep;
  babyInfo: BabyInfo;
  fatherInfo: UserInfo;
  motherInfo: UserInfo;
  divergenceResult: DivergenceResult | null;
  materials: MaterialItem[];
  materialsStep: number;
  applyStep: number;
  verifiedFather: boolean;
  verifiedMother: boolean;
  applicationSubmitted: boolean;
  lastPage: PageStep;

  setCurrentStep: (step: PageStep) => void;
  setBabyInfo: (info: Partial<BabyInfo>) => void;
  setFatherInfo: (info: Partial<UserInfo>) => void;
  setMotherInfo: (info: Partial<UserInfo>) => void;
  setDivergenceResult: (result: DivergenceResult) => void;
  setMaterialUploaded: (id: string, uploaded: boolean) => void;
  setMaterialsStep: (step: number) => void;
  setApplyStep: (step: number) => void;
  setVerifiedFather: (v: boolean) => void;
  setVerifiedMother: (v: boolean) => void;
  setApplicationSubmitted: (submitted: boolean) => void;
  resetApplication: () => void;

  saveDraft: () => void;
  loadDraft: () => DraftData | null;
  clearDraft: () => void;
  hasDraft: () => boolean;
}

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  currentStep: 'home',
  babyInfo: mockBabyInfo,
  fatherInfo: mockFatherInfo,
  motherInfo: mockMotherInfo,
  divergenceResult: null,
  materials: [],
  materialsStep: 0,
  applyStep: 0,
  verifiedFather: false,
  verifiedMother: false,
  applicationSubmitted: false,
  lastPage: 'home',

  setCurrentStep: (step) => set({ currentStep: step, lastPage: step }),
  setBabyInfo: (info) => set((state) => ({ babyInfo: { ...state.babyInfo, ...info } })),
  setFatherInfo: (info) => set((state) => ({ fatherInfo: { ...state.fatherInfo, ...info } })),
  setMotherInfo: (info) => set((state) => ({ motherInfo: { ...state.motherInfo, ...info } })),

  setDivergenceResult: (result) => {
    const materials = generateMaterials(result.maritalStatus, result.settlementType);
    const applicationItems = generateApplicationItems(result.applicableItems);
    const corrections = generateCorrections(applicationItems);

    const progressStore = useProgressStore.getState();
    progressStore.setItemsAndCorrections(applicationItems, corrections);

    const isSingle = result.maritalStatus === 'single';

    set({
      divergenceResult: result,
      materials,
      verifiedFather: isSingle ? true : get().verifiedFather,
    });
  },

  setMaterialUploaded: (id, uploaded) =>
    set((state) => ({
      materials: state.materials.map((m) => (m.id === id ? { ...m, uploaded } : m)),
    })),

  setMaterialsStep: (step) => set({ materialsStep: step }),
  setApplyStep: (step) => set({ applyStep: step }),
  setVerifiedFather: (v) => set({ verifiedFather: v }),
  setVerifiedMother: (v) => set({ verifiedMother: v }),

  setApplicationSubmitted: (submitted) => {
    set({ applicationSubmitted: submitted });
    if (submitted) {
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        /* ignore */
      }
    }
  },

  resetApplication: () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    set({
      currentStep: 'home',
      divergenceResult: null,
      materials: [],
      materialsStep: 0,
      applyStep: 0,
      verifiedFather: false,
      verifiedMother: false,
      applicationSubmitted: false,
      lastPage: 'home',
    });
  },

  saveDraft: () => {
    try {
      const state = get();
      if (!state.divergenceResult) return;
      const draft: DraftData = {
        divergenceResult: state.divergenceResult,
        materials: state.materials,
        materialsStep: state.materialsStep,
        applyStep: state.applyStep,
        verifiedFather: state.verifiedFather,
        verifiedMother: state.verifiedMother,
        babyInfo: state.babyInfo,
        fatherInfo: state.fatherInfo,
        motherInfo: state.motherInfo,
        lastPage: state.lastPage,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* ignore */
    }
  },

  loadDraft: () => {
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) return null;
      const draft = JSON.parse(raw) as DraftData;
      const applicationItems = generateApplicationItems(draft.divergenceResult.applicableItems);
      const corrections = generateCorrections(applicationItems);
      const progressStore = useProgressStore.getState();
      progressStore.setItemsAndCorrections(applicationItems, corrections);

      set({
        divergenceResult: draft.divergenceResult,
        materials: draft.materials,
        materialsStep: draft.materialsStep,
        applyStep: draft.applyStep,
        verifiedFather: draft.verifiedFather,
        verifiedMother: draft.verifiedMother,
        babyInfo: draft.babyInfo,
        fatherInfo: draft.fatherInfo,
        motherInfo: draft.motherInfo,
        lastPage: draft.lastPage,
        applicationSubmitted: false,
      });
      return draft;
    } catch {
      return null;
    }
  },

  clearDraft: () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  },

  hasDraft: () => {
    try {
      return !!localStorage.getItem(DRAFT_STORAGE_KEY);
    } catch {
      return false;
    }
  },
}));
