import type {
  BabyInfo,
  UserInfo,
  ApplicationItem,
  MaterialItem,
  CorrectionNotice,
  ECertificate,
  DivergenceResult,
} from '@/types';

export const mockBabyInfo: BabyInfo = {
  name: '张小宝',
  gender: 'male',
  birthDate: '2024-06-15',
  birthTime: '14:32',
  birthPlace: '市第一人民医院',
  hospital: '市第一人民医院',
  healthStatus: '健康',
  weight: '3.25kg',
  height: '50cm',
};

export const mockFatherInfo: UserInfo = {
  id: '1',
  name: '张伟',
  idCard: '310101199001011234',
  phone: '138****5678',
  relation: 'father',
};

export const mockMotherInfo: UserInfo = {
  id: '2',
  name: '李娜',
  idCard: '310101199202022345',
  phone: '139****8765',
  relation: 'mother',
};

export const mockApplicationItems: ApplicationItem[] = [
  {
    id: '1',
    name: '出生医学证明信息确认',
    department: '卫生健康委员会',
    status: 'completed',
    estimatedTime: '1个工作日',
    actualTime: '0.5个工作日',
    order: 1,
  },
  {
    id: '2',
    name: '户口登记',
    department: '公安局',
    status: 'processing',
    estimatedTime: '3个工作日',
    order: 2,
  },
  {
    id: '3',
    name: '城乡居民医保参保',
    department: '医疗保障局',
    status: 'pending',
    estimatedTime: '2个工作日',
    order: 3,
  },
  {
    id: '4',
    name: '社会保障卡申领',
    department: '人力资源和社会保障局',
    status: 'pending',
    estimatedTime: '5个工作日',
    order: 4,
  },
  {
    id: '5',
    name: '预防接种信息建档',
    department: '疾病预防控制中心',
    status: 'completed',
    estimatedTime: '1个工作日',
    actualTime: '1个工作日',
    order: 5,
  },
];

export const mockMaterials: MaterialItem[] = [
  {
    id: '1',
    name: '父母双方身份证',
    required: true,
    description: '需提供正反面照片，确保信息清晰可辨',
    uploaded: true,
    category: '身份证明',
    source: 'electronic',
  },
  {
    id: '2',
    name: '结婚证',
    required: true,
    description: '需提供结婚证照片，如为单亲家庭可免',
    uploaded: true,
    category: '婚姻证明',
    source: 'electronic',
  },
  {
    id: '3',
    name: '户口本',
    required: true,
    description: '需提供落户方户口本首页及本人页',
    uploaded: false,
    category: '户籍证明',
    source: 'manual',
  },
  {
    id: '4',
    name: '出生医学证明',
    required: false,
    description: '医院已联网推送，无需重复提交',
    uploaded: false,
    category: '出生证明',
    source: 'electronic',
  },
  {
    id: '5',
    name: '房产证/购房合同',
    required: false,
    description: '如落户地为自有住房需提供',
    uploaded: false,
    category: '房产证明',
    source: 'manual',
  },
];

export const mockCorrections: CorrectionNotice[] = [
  {
    id: '1',
    itemId: '2',
    itemName: '户口登记',
    content: '户口本首页照片模糊，请重新上传清晰的扫描件或照片',
    deadline: '2024-06-20',
    resolved: false,
    priority: 'high',
  },
  {
    id: '2',
    itemId: '3',
    itemName: '城乡居民医保参保',
    content: '请确认新生儿姓名与出生医学证明一致',
    deadline: '2024-06-22',
    resolved: false,
    priority: 'medium',
  },
];

export const mockCertificates: ECertificate[] = [
  {
    id: '1',
    type: '出生医学证明',
    name: '出生医学证明',
    number: 'M2024061500123',
    issueDate: '2024-06-16',
    issueAuthority: '市第一人民医院',
    validUntil: '长期有效',
    status: 'active',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: '2',
    type: '户口簿',
    name: '居民户口簿',
    number: '310101202400012345',
    issueDate: '2024-06-18',
    issueAuthority: '市公安局',
    validUntil: '长期有效',
    status: 'pending',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    id: '3',
    type: '社会保障卡',
    name: '社会保障卡',
    number: 'SH2024061500001',
    issueDate: '2024-06-20',
    issueAuthority: '市人力资源和社会保障局',
    validUntil: '2034-06-19',
    status: 'pending',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: '4',
    type: '预防接种证',
    name: '儿童预防接种证',
    number: 'Y2024061500789',
    issueDate: '2024-06-16',
    issueAuthority: '市疾病预防控制中心',
    validUntil: '长期有效',
    status: 'active',
    color: 'from-amber-500 to-orange-500',
  },
];

export const mockDivergenceResult: DivergenceResult = {
  maritalStatus: 'married',
  settlementType: 'local',
  settlementLocation: '本市户籍',
  applicableItems: ['出生医学证明', '户口登记', '城乡居民医保', '社会保障卡', '预防接种'],
  pathName: '本市户籍已婚家庭联办路径',
};

export function generateMaterials(
  maritalStatus: 'married' | 'single' | 'divorced',
  settlementType: 'local' | 'remote'
): MaterialItem[] {
  const base: MaterialItem[] = [
    {
      id: '1',
      name: maritalStatus === 'single' ? '母亲身份证' : '父母双方身份证',
      required: true,
      description: '电子证照已自动调取，无需手动上传',
      uploaded: true,
      category: '身份证明',
      source: 'electronic',
    },
  ];

  if (maritalStatus === 'married') {
    base.push({
      id: '2',
      name: '结婚证',
      required: true,
      description: '电子证照已自动调取，无需手动上传',
      uploaded: true,
      category: '婚姻证明',
      source: 'electronic',
    });
  } else {
    base.push({
      id: '2',
      name: '非婚生育说明',
      required: true,
      description: '需本人签署并上传扫描件',
      uploaded: false,
      category: '婚姻证明',
      source: 'manual',
    });
  }

  if (settlementType === 'local') {
    base.push({
      id: '3',
      name: '户口本',
      required: true,
      description: '需提供落户方户口本首页及本人页照片',
      uploaded: false,
      category: '户籍证明',
      source: 'manual',
    });
  } else {
    base.push({
      id: '3',
      name: '户口本（本市）',
      required: false,
      description: '外省市户籍暂不需要本市户口本',
      uploaded: false,
      category: '户籍证明',
      source: 'notApplicable',
    });
  }

  base.push({
    id: '4',
    name: '出生医学证明',
    required: false,
    description: '医院已联网推送，无需重复提交',
    uploaded: false,
    category: '出生证明',
    source: 'electronic',
  });

  if (settlementType === 'local') {
    base.push({
      id: '5',
      name: '房产证/购房合同',
      required: false,
      description: '如落户地为自有住房需提供',
      uploaded: false,
      category: '房产证明',
      source: 'manual',
    });
  } else {
    base.push({
      id: '5',
      name: '房产证/购房合同',
      required: false,
      description: '外省市户籍暂不需要本市房产证明',
      uploaded: false,
      category: '房产证明',
      source: 'notApplicable',
    });
  }

  return base;
}

export function generateApplicationItems(
  applicableItems: string[]
): ApplicationItem[] {
  const allItems: ApplicationItem[] = [
    {
      id: '1',
      name: '出生医学证明信息确认',
      department: '卫生健康委员会',
      status: 'completed',
      estimatedTime: '1个工作日',
      actualTime: '0.5个工作日',
      order: 1,
    },
    {
      id: '2',
      name: '户口登记',
      department: '公安局',
      status: 'rejected',
      estimatedTime: '3个工作日',
      order: 2,
    },
    {
      id: '3',
      name: '城乡居民医保参保',
      department: '医疗保障局',
      status: 'rejected',
      estimatedTime: '2个工作日',
      order: 3,
    },
    {
      id: '4',
      name: '社会保障卡申领',
      department: '人力资源和社会保障局',
      status: 'pending',
      estimatedTime: '5个工作日',
      order: 4,
    },
    {
      id: '5',
      name: '预防接种信息建档',
      department: '疾病预防控制中心',
      status: 'completed',
      estimatedTime: '1个工作日',
      actualTime: '1个工作日',
      order: 5,
    },
  ];

  const nameMap: Record<string, string> = {
    '出生医学证明': '出生医学证明信息确认',
    '户口登记': '户口登记',
    '城乡居民医保': '城乡居民医保参保',
    '社会保障卡': '社会保障卡申领',
    '预防接种': '预防接种信息建档',
  };

  const matchedNames = applicableItems.map((item) => nameMap[item] || item);
  return allItems
    .filter((item) => matchedNames.includes(item.name))
    .map((item, index) => ({ ...item, order: index + 1 }));
}

export function generateCorrections(
  applicationItems: ApplicationItem[]
): CorrectionNotice[] {
  const allCorrections: CorrectionNotice[] = [
    {
      id: '1',
      itemId: '2',
      itemName: '户口登记',
      content: '户口本首页照片模糊，请重新上传清晰的扫描件或照片',
      deadline: '2024-06-20',
      resolved: false,
      priority: 'high',
    },
    {
      id: '2',
      itemId: '3',
      itemName: '城乡居民医保参保',
      content: '请确认新生儿姓名与出生医学证明一致',
      deadline: '2024-06-22',
      resolved: false,
      priority: 'medium',
    },
  ];

  const itemNames = applicationItems.map((i) => i.name);
  return allCorrections.filter((c) => itemNames.includes(c.itemName));
}

export const applicationSteps = [
  { id: 'home', label: '首页引导', icon: 'home' },
  { id: 'materials', label: '材料准备', icon: 'file-text' },
  { id: 'apply', label: '联合申报', icon: 'clipboard-list' },
  { id: 'progress', label: '进度中心', icon: 'clock' },
  { id: 'result', label: '结果领取', icon: 'award' },
];
