import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Baby,
  User,
  Shield,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Check,
  X,
  Edit3,
  Eye,
  Hospital,
  Clock,
  Building2,
  CreditCard,
  Syringe,
  FileCheck,
  Stethoscope,
  IdCard,
  Signature,
  FileText,
  Zap,
  Save,
} from 'lucide-react';
import { cn, maskIdCard, maskPhone } from '@/utils/helpers';
import { useApplicationStore } from '@/store/application';
import { useProgressStore } from '@/store/progress';
import type { ApplicationItem } from '@/types';

const applySteps = [
  { id: '1', label: '事项确认' },
  { id: '2', label: '信息校对' },
  { id: '3', label: '身份核验' },
  { id: '4', label: '提交申报' },
];

const itemIcons: Record<string, { icon: typeof Baby; color: string }> = {
  '出生医学证明信息确认': { icon: Baby, color: 'bg-pink-100 text-pink-600' },
  '户口登记': { icon: Building2, color: 'bg-blue-100 text-blue-600' },
  '城乡居民医保参保': { icon: Stethoscope, color: 'bg-emerald-100 text-emerald-600' },
  '社会保障卡申领': { icon: CreditCard, color: 'bg-amber-100 text-amber-600' },
  '预防接种信息建档': { icon: Syringe, color: 'bg-purple-100 text-purple-600' },
};

function getItemIcon(name: string) {
  return itemIcons[name] || { icon: FileText, color: 'bg-gray-100 text-gray-600' };
}

export default function Apply() {
  const navigate = useNavigate();
  const {
    babyInfo,
    fatherInfo,
    motherInfo,
    divergenceResult,
    materials,
    setBabyInfo,
    setFatherInfo,
    setMotherInfo,
    setApplicationSubmitted,
    applyStep,
    setApplyStep,
    verifiedFather,
    verifiedMother,
    setVerifiedFather,
    setVerifiedMother,
    saveDraft,
    setCurrentStep,
  } = useApplicationStore();
  const { applicationItems } = useProgressStore();

  const currentStep = applyStep;
  const isSingle = divergenceResult?.maritalStatus === 'single';

  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setCurrentStep('apply');
    saveDraft();
  }, [setCurrentStep, saveDraft]);

  // 单亲时父亲默认识别为通过（不要求）
  const allVerified = isSingle ? verifiedMother : verifiedFather && verifiedMother;

  const handleNextStep = (next: number) => {
    setApplyStep(next);
    setTimeout(saveDraft, 0);
  };

  const handleEdit = (field: string, value: string) => {
    setEditingField(field);
    setEditValue(value);
  };

  const handleSaveEdit = () => {
    if (!editingField) return;
    if (editingField.startsWith('baby.')) {
      const field = editingField.replace('baby.', '') as keyof typeof babyInfo;
      setBabyInfo({ [field]: editValue } as Partial<typeof babyInfo>);
    } else if (editingField.startsWith('father.')) {
      const field = editingField.replace('father.', '') as keyof typeof fatherInfo;
      setFatherInfo({ [field]: editValue } as Partial<typeof fatherInfo>);
    } else if (editingField.startsWith('mother.')) {
      const field = editingField.replace('mother.', '') as keyof typeof motherInfo;
      setMotherInfo({ [field]: editValue } as Partial<typeof motherInfo>);
    }
    setEditingField(null);
    setEditValue('');
    setTimeout(saveDraft, 0);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleVerifyFather = () => {
    setVerifiedFather(true);
    setTimeout(saveDraft, 0);
  };

  const handleVerifyMother = () => {
    setVerifiedMother(true);
    setTimeout(saveDraft, 0);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setApplicationSubmitted(true);
      navigate('/progress');
    }, 2000);
  };

  const InfoRow = ({
    label,
    value,
    field,
    editable = true,
    masked = false,
  }: {
    label: string;
    value: string;
    field: string;
    editable?: boolean;
    masked?: boolean;
  }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        {editingField === field ? (
          <>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-40 px-2 py-1 border border-blue-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button onClick={handleSaveEdit} className="p-1 text-green-500 hover:bg-green-50 rounded">
              <Check className="w-4 h-4" />
            </button>
            <button onClick={handleCancelEdit} className="p-1 text-red-500 hover:bg-red-50 rounded">
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <span className="font-medium text-gray-900">{masked ? maskIdCard(value) : value}</span>
            {editable && (
              <button
                onClick={() => handleEdit(field, value)}
                className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );

  if (!divergenceResult || applicationItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">请先完成材料准备</p>
          <button
            onClick={() => navigate('/materials')}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            前往材料准备
          </button>
        </div>
      </div>
    );
  }

  const electronicCount = materials.filter((m) => m.source === 'electronic').length;
  const manualCount = materials.filter((m) => m.source === 'manual').length;
  const notApplicableCount = materials.filter((m) => m.source === 'notApplicable').length;
  const validMaterialCount = materials.filter((m) => m.source !== 'notApplicable').length;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">联合申报</h1>
          <p className="text-blue-100">{divergenceResult.pathName}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              {applySteps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                return (
                  <div key={step.id} className="flex-1 flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                          isCompleted && 'bg-green-500 text-white',
                          isCurrent && 'bg-blue-500 text-white ring-4 ring-blue-100',
                          !isCompleted && !isCurrent && 'bg-gray-200 text-gray-500'
                        )}
                      >
                        {isCompleted ? <Check className="w-5 h-5" /> : <span>{index + 1}</span>}
                      </div>
                      <p
                        className={cn(
                          'mt-2 text-sm font-medium',
                          isCurrent ? 'text-blue-600' : 'text-gray-600',
                          !isCompleted && !isCurrent && 'text-gray-400'
                        )}
                      >
                        {step.label}
                      </p>
                    </div>
                    {index < applySteps.length - 1 && (
                      <div className="flex-1 mx-2 flex items-center">
                        <div
                          className={cn(
                            'h-1 w-full rounded-full transition-colors',
                            isCompleted ? 'bg-green-500' : 'bg-gray-200'
                          )}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-end gap-2 text-sm text-gray-500">
              <Save className="w-4 h-4" />
              <span>已自动保存草稿</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">联办事项清单</h2>
                      <p className="text-sm text-gray-600">
                        以下 {applicationItems.length} 个事项将一并办理
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid gap-3">
                    {applicationItems.map((item: ApplicationItem) => {
                      const iconConfig = getItemIcon(item.name);
                      const IconComp = iconConfig.icon;
                      return (
                        <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                          <div className="relative">
                            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', iconConfig.color)}>
                              <IconComp className="w-6 h-6" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                              {item.order}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-500">{item.department}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">办理顺序</p>
                            <p className="font-bold text-blue-600">第 {item.order} 步</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-amber-800">
                        <p className="font-medium mb-1">办理顺序说明</p>
                        <p>
                          事项按顺序依次办理，前一项完成后自动启动下一项。
                          {applicationItems.some((i) => i.name.includes('出生医学证明')) &&
                            '其中出生医学证明和预防接种建档可并行办理。'}
                          预计整体办理时间为 7-10 个工作日。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/materials')}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  返回材料准备
                </button>
                <button
                  onClick={() => handleNextStep(1)}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2"
                >
                  确认并继续
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 px-6 py-4 border-b border-pink-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center">
                        <Baby className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">新生儿信息</h2>
                        <p className="text-sm text-gray-600">信息由医院系统自动带入，请仔细核对</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-600 text-sm font-medium rounded-full flex items-center gap-1">
                      <Hospital className="w-4 h-4" />
                      医院已推送
                    </span>
                  </div>
                </div>
                <div className="p-6 grid md:grid-cols-2 gap-x-8">
                  <InfoRow label="姓名" value={babyInfo.name} field="baby.name" />
                  <InfoRow label="性别" value={babyInfo.gender === 'male' ? '男' : '女'} field="baby.gender" />
                  <InfoRow label="出生日期" value={babyInfo.birthDate} field="baby.birthDate" />
                  <InfoRow label="出生时间" value={babyInfo.birthTime} field="baby.birthTime" />
                  <InfoRow label="出生医院" value={babyInfo.hospital} field="baby.hospital" />
                  <InfoRow label="出生地点" value={babyInfo.birthPlace} field="baby.birthPlace" />
                  <InfoRow label="体重" value={babyInfo.weight} field="baby.weight" />
                  <InfoRow label="身高" value={babyInfo.height} field="baby.height" />
                  <InfoRow label="健康状况" value={babyInfo.healthStatus} field="baby.healthStatus" />
                </div>
              </div>

              {isSingle ? (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-gray-900">监护人信息（母亲）</h2>
                          <p className="text-sm text-gray-600">单亲家庭仅需核验母亲身份</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-purple-100 text-purple-600 text-xs font-medium rounded-full">
                        单亲路径
                      </span>
                    </div>
                  </div>
                  <div className="p-6 grid md:grid-cols-2 gap-x-8">
                    <InfoRow label="姓名" value={motherInfo.name} field="mother.name" />
                    <InfoRow label="身份证号" value={motherInfo.idCard} field="mother.idCard" masked />
                    <InfoRow label="手机号码" value={maskPhone(motherInfo.phone)} field="mother.phone" />
                    <InfoRow label="关系" value="母亲（监护人）" field="mother.relation" editable={false} />
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-gray-900">父亲信息</h2>
                          <p className="text-sm text-gray-600">监护人一方</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <InfoRow label="姓名" value={fatherInfo.name} field="father.name" />
                      <InfoRow label="身份证号" value={fatherInfo.idCard} field="father.idCard" masked />
                      <InfoRow label="手机号码" value={maskPhone(fatherInfo.phone)} field="father.phone" />
                      <InfoRow label="关系" value="父亲" field="father.relation" editable={false} />
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-gray-900">母亲信息</h2>
                          <p className="text-sm text-gray-600">监护人一方</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <InfoRow label="姓名" value={motherInfo.name} field="mother.name" />
                      <InfoRow label="身份证号" value={motherInfo.idCard} field="mother.idCard" masked />
                      <InfoRow label="手机号码" value={maskPhone(motherInfo.phone)} field="mother.phone" />
                      <InfoRow label="关系" value="母亲" field="mother.relation" editable={false} />
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <Eye className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">信息核对提示</p>
                  <p>
                    请仔细核对所有信息，确保准确无误。信息提交后将进入审批流程，
                    如需修改可能需要前往线下窗口办理。新生儿姓名一经确认，
                    修改需按照相关规定办理。
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleNextStep(0)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  上一步
                </button>
                <button
                  onClick={() => handleNextStep(2)}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2"
                >
                  信息确认无误
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">监护人身份核验</h2>
                      <p className="text-sm text-gray-600">
                        {isSingle ? '单亲家庭，需完成母亲身份核验' : '为保障您的信息安全，请完成双方身份核验'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className={cn('grid gap-6', isSingle ? 'md:grid-cols-1 max-w-xl mx-auto' : 'md:grid-cols-2')}>
                    {!isSingle && (
                      <div className={cn('border-2 rounded-2xl p-6 transition-all', verifiedFather ? 'border-green-300 bg-green-50' : 'border-gray-200')}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{fatherInfo.name}（父亲）</h3>
                            <p className="text-sm text-gray-500">{maskIdCard(fatherInfo.idCard)}</p>
                          </div>
                          {verifiedFather && <CheckCircle2 className="w-6 h-6 text-green-500 ml-auto" />}
                        </div>
                        {verifiedFather ? (
                          <div className="text-center py-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </div>
                            <p className="text-green-600 font-medium">身份核验通过</p>
                            <p className="text-sm text-gray-500 mt-1">人脸比对成功，身份已确认</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <IdCard className="w-4 h-4" />
                              <span>身份证信息已核验</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Signature className="w-4 h-4" />
                              <span>电子签名待确认</span>
                            </div>
                            <button
                              onClick={handleVerifyFather}
                              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                              <Shield className="w-5 h-5" />
                              开始人脸识别核验
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <div className={cn('border-2 rounded-2xl p-6 transition-all', verifiedMother ? 'border-green-300 bg-green-50' : 'border-gray-200')}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {motherInfo.name}（母亲）{isSingle && ' · 监护人'}
                          </h3>
                          <p className="text-sm text-gray-500">{maskIdCard(motherInfo.idCard)}</p>
                        </div>
                        {verifiedMother && <CheckCircle2 className="w-6 h-6 text-green-500 ml-auto" />}
                      </div>
                      {verifiedMother ? (
                        <div className="text-center py-4">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                          </div>
                          <p className="text-green-600 font-medium">身份核验通过</p>
                          <p className="text-sm text-gray-500 mt-1">人脸比对成功，身份已确认</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <IdCard className="w-4 h-4" />
                            <span>身份证信息已核验</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Signature className="w-4 h-4" />
                            <span>电子签名待确认</span>
                          </div>
                          <button
                            onClick={handleVerifyMother}
                            className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                          >
                            <Shield className="w-5 h-5" />
                            开始人脸识别核验
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {isSingle && (
                    <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-purple-800">
                          <p className="font-medium">单亲家庭说明</p>
                          <p>您选择了单亲家庭办理路径，本次仅核验母亲身份即可完成申报。如后续需要补充父亲信息，可在结果领取前联系人工窗口办理。</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-gray-600">
                        <p className="font-medium text-gray-900 mb-1">身份核验说明</p>
                        <ul className="space-y-1 list-disc list-inside">
                          <li>身份核验采用人脸识别技术，确保为本人操作</li>
                          <li>请在光线充足的环境下进行，确保面部清晰可见</li>
                          <li>核验数据将加密传输，仅用于身份验证，不会保存</li>
                          <li>如核验失败，可尝试重新核验或前往线下窗口办理</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleNextStep(1)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  上一步
                </button>
                <button
                  onClick={() => handleNextStep(3)}
                  disabled={!allVerified}
                  className={cn(
                    'flex-1 py-3 font-medium rounded-xl transition-all flex items-center justify-center gap-2',
                    allVerified
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  )}
                >
                  继续提交
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-emerald-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                        <FileCheck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">提交前核对</h2>
                        <p className="text-sm text-gray-600">请仔细核对以下信息，确认无误后提交</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                      {applicationItems.length} 项联办
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">办理路径</p>
                        <p className="font-bold text-gray-900">{divergenceResult.pathName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">申请人</p>
                        <p className="font-medium text-gray-900">{babyInfo.name}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <ClipboardList className="w-5 h-5 text-blue-500" />
                      联办事项及办理顺序
                    </h3>
                    <div className="relative">
                      <div className="absolute left-5 top-3 bottom-3 w-0.5 bg-gray-200" />
                      <div className="space-y-2">
                        {applicationItems.map((item) => {
                          const iconConfig = getItemIcon(item.name);
                          const IconComp = iconConfig.icon;
                          return (
                            <div key={item.id} className="relative flex items-center gap-4 pl-2">
                              <div
                                className="relative z-10 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm"
                                style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}
                              >
                                {item.order}
                              </div>
                              <div className="flex-1 flex items-center gap-3 py-2">
                                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', iconConfig.color)}>
                                  <IconComp className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{item.name}</p>
                                  <p className="text-xs text-gray-500">{item.department}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-500">预计</p>
                                <p className="font-medium text-gray-700">{item.estimatedTime}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">提交材料</p>
                          <p className="text-2xl font-bold text-gray-900">{validMaterialCount} 份</p>
                        </div>
                      </div>
                      <div className="mt-3 space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">电子证照</span>
                          <span className="text-emerald-600 font-medium">{electronicCount} 份</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">需上传</span>
                          <span className="text-amber-600 font-medium">{manualCount} 份</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">暂不适用</span>
                          <span className="text-gray-400 font-medium">{notApplicableCount} 份</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">预计总耗时</p>
                          <p className="text-2xl font-bold text-gray-900">7-10 天</p>
                        </div>
                      </div>
                      <div className="mt-3 space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">最快办结</span>
                          <span className="text-emerald-600 font-medium">5 个工作日</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">平均办结</span>
                          <span className="text-emerald-600 font-medium">7 个工作日</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">承诺时限</span>
                          <span className="text-gray-600 font-medium">10 个工作日</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      {isSingle ? '监护人信息（母亲）' : '监护人信息'}
                    </h3>
                    {isSingle ? (
                      <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                        <p className="text-sm text-gray-500 mb-1">母亲（监护人）</p>
                        <p className="font-medium text-gray-900">{motherInfo.name}</p>
                        <p className="text-xs text-gray-500">{maskIdCard(motherInfo.idCard)}</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                          <p className="text-sm text-gray-500 mb-1">父亲</p>
                          <p className="font-medium text-gray-900">{fatherInfo.name}</p>
                          <p className="text-xs text-gray-500">{maskIdCard(fatherInfo.idCard)}</p>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                          <p className="text-sm text-gray-500 mb-1">母亲</p>
                          <p className="font-medium text-gray-900">{motherInfo.name}</p>
                          <p className="text-xs text-gray-500">{maskIdCard(motherInfo.idCard)}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-0.5 w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600 leading-relaxed">
                        我已阅读并同意
                        <a href="#" className="text-blue-600 hover:underline">《"出生一件事"联办服务协议》</a>
                        、
                        <a href="#" className="text-blue-600 hover:underline">《个人信息处理告知书》</a>
                        ，确认所填信息真实有效，同意相关部门共享核查我的信息用于办理上述事项。
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleNextStep(2)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  上一步
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!agreed || submitting}
                  className={cn(
                    'flex-1 py-3.5 font-semibold rounded-xl transition-all flex items-center justify-center gap-2',
                    agreed && !submitting
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  )}
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      提交中...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      确认提交申报
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
