import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  CheckCircle2,
  Circle,
  Upload,
  ChevronRight,
  AlertCircle,
  Info,
  Check,
  X,
  Plus,
  Image as ImageIcon,
  FileText,
  Shield,
  ArrowRight,
  Download,
  Ban,
  Save,
} from 'lucide-react';
import { cn } from '@/utils/helpers';
import { useApplicationStore } from '@/store/application';
import StepProgress from '@/components/Steps/StepProgress';
import type { MaterialSource } from '@/types';

const materialSteps = [
  { id: '1', label: '条件自检' },
  { id: '2', label: '材料清单' },
  { id: '3', label: '材料上传' },
];

const sourceLabels: Record<MaterialSource, { label: string; className: string; icon: typeof Download }> = {
  electronic: {
    label: '电子证照已调取',
    className: 'bg-emerald-100 text-emerald-600',
    icon: Download,
  },
  manual: {
    label: '需手动上传',
    className: 'bg-amber-100 text-amber-600',
    icon: Upload,
  },
  notApplicable: {
    label: '暂不适用',
    className: 'bg-gray-200 text-gray-500',
    icon: Ban,
  },
};

export default function Materials() {
  const navigate = useNavigate();
  const {
    materials,
    setMaterialUploaded,
    divergenceResult,
    materialsStep,
    setMaterialsStep,
    saveDraft,
    setCurrentStep,
  } = useApplicationStore();

  const currentStep = materialsStep;
  const isRemote = divergenceResult?.settlementType === 'remote';
  const isSingle = divergenceResult?.maritalStatus === 'single';

  useEffect(() => {
    setCurrentStep('materials');
    saveDraft();
  }, [setCurrentStep, saveDraft]);

  const conditionItems = useMemo(() => {
    const items = [
      { id: '1', label: '新生儿已在本市助产机构出生', required: true },
    ];
    if (!isRemote) {
      items.push({ id: '2', label: '监护人一方为本市户籍', required: true });
    }
    if (isSingle) {
      items.push({ id: '3', label: '母亲持有有效身份证件', required: true });
      items.push({ id: '4', label: '已为新生儿起好正式姓名', required: true });
      items.push({ id: '5', label: '已准备非婚生育情况说明（单亲家庭）', required: true });
    } else {
      items.push({ id: '3', label: '父母双方均持有有效身份证件', required: true });
      items.push({ id: '4', label: '已为新生儿起好正式姓名', required: true });
      items.push({ id: '5', label: '父母婚姻关系存续', required: true });
    }
    return items;
  }, [isRemote, isSingle]);

  const [conditions, setConditions] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    conditionItems.forEach((item) => {
      initial[item.id] = item.required;
    });
    return initial;
  });

  const toggleCondition = (id: string) => {
    setConditions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checkedCount = Object.values(conditions).filter(Boolean).length;
  const allRequiredChecked = conditionItems
    .filter((c) => c.required)
    .every((c) => conditions[c.id]);

  const handleNextStep = (next: number) => {
    setMaterialsStep(next);
    setTimeout(saveDraft, 0);
  };

  const handleUploadToggle = (id: string, uploaded: boolean) => {
    setMaterialUploaded(id, uploaded);
    setTimeout(saveDraft, 0);
  };

  const handleGoApply = () => {
    setCurrentStep('apply');
    saveDraft();
    navigate('/apply');
  };

  const groupedMaterials = materials.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof materials>);

  const validMaterials = materials.filter((m) => m.source !== 'notApplicable');
  const uploadedCount = validMaterials.filter((m) => m.uploaded).length;
  const requiredCountMat = validMaterials.filter((m) => m.required).length;
  const allRequiredUploaded = validMaterials
    .filter((m) => m.required)
    .every((m) => m.uploaded);

  const electronicCount = materials.filter((m) => m.source === 'electronic').length;
  const manualCount = materials.filter((m) => m.source === 'manual').length;
  const notApplicableCount = materials.filter((m) => m.source === 'notApplicable').length;

  if (!divergenceResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">请先在首页完成智能分流选择</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">材料准备</h1>
          <p className="text-blue-100">{divergenceResult.pathName}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <StepProgress steps={materialSteps} currentStep={currentStep} />
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {currentStep === 0 && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">申报条件自检</h2>
                    <p className="text-sm text-gray-600">
                      {isSingle ? '请确认您作为单亲监护人是否符合以下申报条件' : '请确认您是否符合以下申报条件'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-3">
                {conditionItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleCondition(item.id)}
                    className={cn(
                      'w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4',
                      conditions[item.id]
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
                        conditions[item.id] ? 'bg-blue-500' : 'border-2 border-gray-300'
                      )}
                    >
                      {conditions[item.id] && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{item.label}</span>
                        {item.required && (
                          <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded">必填</span>
                        )}
                      </div>
                    </div>
                    {conditions[item.id] ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300" />
                    )}
                  </button>
                ))}
              </div>

              <div className="px-6 pb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">条件完成进度</span>
                    <span className="text-sm font-medium text-gray-900">
                      {checkedCount}/{conditionItems.length}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                      style={{ width: `${(checkedCount / conditionItems.length) * 100}%` }}
                    />
                  </div>
                  {!allRequiredChecked && (
                    <div className="mt-3 flex items-start gap-2 text-amber-600">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">请确认所有必填条件，否则可能影响后续办理</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  返回首页
                </button>
                <button
                  onClick={() => handleNextStep(1)}
                  disabled={!allRequiredChecked}
                  className={cn(
                    'flex-1 py-3 font-medium rounded-xl transition-all flex items-center justify-center gap-2',
                    allRequiredChecked
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  )}
                >
                  查看材料清单
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">材料清单</h2>
                      <p className="text-sm text-gray-600">共 {validMaterials.length} 份有效材料</p>
                    </div>
                  </div>
                  <div className="hidden md:flex gap-2">
                    {Object.entries(sourceLabels).map(([key, cfg]) => (
                      <span
                        key={key}
                        className={cn('px-2.5 py-1 text-xs font-medium rounded-full', cfg.className)}
                      >
                        {cfg.label}
                        {key === 'electronic' && ` ${electronicCount}份`}
                        {key === 'manual' && ` ${manualCount}份`}
                        {key === 'notApplicable' && ` ${notApplicableCount}份`}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {Object.entries(groupedMaterials).map(([category, items]) => (
                  <div key={category} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <span className="font-semibold text-gray-900">{category}</span>
                        <span className="text-sm text-gray-500">({items.length}份)</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="p-4 space-y-3">
                      {items.map((item) => {
                        const sourceCfg = sourceLabels[item.source];
                        const SourceIcon = sourceCfg.icon;
                        return (
                          <div
                            key={item.id}
                            className={cn(
                              'flex items-start gap-3 p-3 rounded-lg',
                              item.source === 'notApplicable' ? 'bg-gray-100 opacity-60' : 'bg-gray-50'
                            )}
                          >
                            <div
                              className={cn(
                                'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                                item.uploaded
                                  ? 'bg-green-500'
                                  : item.source === 'notApplicable'
                                    ? 'bg-gray-300'
                                    : 'border-2 border-gray-300'
                              )}
                            >
                              {item.uploaded && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={cn(
                                    'font-medium',
                                    item.source === 'notApplicable' ? 'text-gray-500 line-through' : 'text-gray-900'
                                  )}
                                >
                                  {item.name}
                                </span>
                                {item.required ? (
                                  <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded">必需</span>
                                ) : (
                                  <span className="px-1.5 py-0.5 bg-gray-200 text-gray-600 text-xs font-medium rounded">可选</span>
                                )}
                                <span
                                  className={cn(
                                    'px-2 py-0.5 text-xs font-medium rounded flex items-center gap-1',
                                    sourceCfg.className
                                  )}
                                >
                                  <SourceIcon className="w-3 h-3" />
                                  {sourceCfg.label}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-6 pb-6">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-2">
                      <div className="text-2xl font-bold text-emerald-600">{electronicCount}</div>
                      <p className="text-xs text-gray-600 mt-1">电子证照已调取</p>
                    </div>
                    <div className="text-center p-2 border-x border-blue-200">
                      <div className="text-2xl font-bold text-amber-600">{manualCount}</div>
                      <p className="text-xs text-gray-600 mt-1">需手动上传</p>
                    </div>
                    <div className="text-center p-2">
                      <div className="text-2xl font-bold text-gray-400">{notApplicableCount}</div>
                      <p className="text-xs text-gray-600 mt-1">暂不适用</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-blue-200 flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                      必需材料 <span className="font-bold text-gray-900">{requiredCountMat}</span> 份，已准备{' '}
                      <span className="font-bold text-green-600">{uploadedCount}</span> 份
                    </p>
                    {allRequiredUploaded ? (
                      <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        材料齐全
                      </span>
                    ) : (
                      <span className="text-sm text-amber-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        还需补充
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 flex gap-3">
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
                  去上传材料
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              {Object.entries(groupedMaterials).map(([category, items]) => {
                const uploadableItems = items.filter((i) => i.source !== 'notApplicable');
                if (uploadableItems.length === 0) return null;

                return (
                  <div key={category} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-500" />
                        {category}
                      </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {uploadableItems.map((item) => {
                        const sourceCfg = sourceLabels[item.source];
                        const SourceIcon = sourceCfg.icon;
                        return (
                          <div
                            key={item.id}
                            className={cn(
                              'border-2 border-dashed rounded-xl p-4 transition-all',
                              item.uploaded
                                ? 'border-green-300 bg-green-50'
                                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                            )}
                          >
                            {item.uploaded ? (
                              <div className="flex items-center gap-3">
                                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border border-green-200">
                                  <ImageIcon className="w-8 h-8 text-green-500" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{item.name}</p>
                                  <p className="text-sm text-green-600 flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4" />
                                    已上传
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleUploadToggle(item.id, false)}
                                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleUploadToggle(item.id, true)}
                                className="w-full text-left"
                                disabled={item.source === 'electronic'}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                    {item.source === 'electronic' ? (
                                      <Shield className="w-8 h-8 text-emerald-500" />
                                    ) : (
                                      <Upload className="w-8 h-8 text-gray-400" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">{item.name}</p>
                                    <p className="text-sm text-gray-500">
                                      {item.source === 'electronic' ? '电子证照已自动调取' : '点击上传或拖拽文件'}
                                    </p>
                                  </div>
                                  {item.source === 'electronic' ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                  ) : (
                                    <Plus className="w-5 h-5 text-gray-400" />
                                  )}
                                </div>
                              </button>
                            )}
                            <div
                              className={cn(
                                'mt-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium',
                                sourceCfg.className
                              )}
                            >
                              <SourceIcon className="w-3.5 h-3.5" />
                              {sourceCfg.label}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {notApplicableCount > 0 && (
                <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 flex items-start gap-3">
                  <Ban className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-700 mb-1">
                      有 {notApplicableCount} 份材料暂不适用
                    </p>
                    <p>根据您当前的办理路径，户口本和本市房产证明等材料暂不需要。如后续变更落户地，可重新选择路径。</p>
                  </div>
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">上传须知</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>支持 JPG、PNG、PDF 格式，单文件不超过 10MB</li>
                    <li>请确保照片清晰，文字可辨识</li>
                    <li>
                      {isSingle
                        ? '母亲身份证需上传正反面'
                        : !isRemote
                          ? '身份证需上传正反面，户口本需上传首页和本人页'
                          : '父母身份证需上传正反面'}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-gray-900">材料上传进度</p>
                    <p className="text-sm text-gray-500">
                      必需材料 {uploadedCount}/{requiredCountMat} 份已准备
                    </p>
                  </div>
                  {allRequiredUploaded ? (
                    <span className="px-3 py-1 bg-green-100 text-green-600 text-sm font-medium rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      材料齐全
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-amber-100 text-amber-600 text-sm font-medium rounded-full flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      材料不全
                    </span>
                  )}
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: requiredCountMat > 0 ? `${(uploadedCount / requiredCountMat) * 100}%` : '0%' }}
                  />
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                  <Save className="w-4 h-4" />
                  <span>系统已自动保存当前进度，可随时返回继续办理</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleNextStep(1)}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    上一步
                  </button>
                  <button
                    onClick={handleGoApply}
                    disabled={!allRequiredUploaded}
                    className={cn(
                      'flex-1 py-3 font-medium rounded-xl transition-all flex items-center justify-center gap-2',
                      allRequiredUploaded
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    )}
                  >
                    开始联合申报
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
