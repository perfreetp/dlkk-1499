export interface UserInfo {
  id: string;
  name: string;
  idCard: string;
  phone: string;
  relation: 'father' | 'mother' | 'guardian';
}

export interface BabyInfo {
  name: string;
  gender: 'male' | 'female';
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  hospital: string;
  healthStatus: string;
  weight: string;
  height: string;
}

export type ApplicationStatus = 'pending' | 'processing' | 'completed' | 'rejected';

export type FlowRecordType =
  | 'accepted'
  | 'reviewing'
  | 'rejected'
  | 'corrected'
  | 'processing'
  | 'completed';

export interface FlowRecord {
  id: string;
  type: FlowRecordType;
  title: string;
  department: string;
  time: string;
  remark?: string;
}

export interface ApplicationItem {
  id: string;
  name: string;
  department: string;
  status: ApplicationStatus;
  estimatedTime: string;
  actualTime?: string;
  remarks?: string;
  order: number;
  flowRecords: FlowRecord[];
}

export type MaterialSource = 'electronic' | 'manual' | 'notApplicable';

export interface MaterialItem {
  id: string;
  name: string;
  required: boolean;
  description: string;
  uploaded: boolean;
  uploadUrl?: string;
  category: string;
  source: MaterialSource;
}

export interface CorrectionNotice {
  id: string;
  itemId: string;
  itemName: string;
  content: string;
  deadline: string;
  resolved: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface ECertificate {
  id: string;
  type: string;
  name: string;
  number: string;
  issueDate: string;
  issueAuthority: string;
  validUntil: string;
  status: 'active' | 'pending';
  color: string;
}

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface DivergenceResult {
  maritalStatus: 'married' | 'single' | 'divorced';
  settlementType: 'local' | 'remote';
  settlementLocation: string;
  applicableItems: string[];
  pathName: string;
}

export type PageStep = 'home' | 'materials' | 'apply' | 'progress' | 'result';

export const stepLabels: Record<PageStep, string> = {
  home: '首页引导',
  materials: '材料准备',
  apply: '联合申报',
  progress: '进度中心',
  result: '结果领取',
};

export interface DraftData {
  divergenceResult: DivergenceResult;
  materials: MaterialItem[];
  materialsStep: number;
  applyStep: number;
  verifiedFather: boolean;
  verifiedMother: boolean;
  babyInfo: BabyInfo;
  fatherInfo: UserInfo;
  motherInfo: UserInfo;
  lastPage: PageStep;
  updatedAt: string;
}
