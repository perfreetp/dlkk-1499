import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  CheckCircle2,
  Circle,
  Upload,
  FileCheck,
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
} from 'lucide-react';
import { cn } from '@/utils/helpers';
import { useApplicationStore } from '@/store/application';
import StepProgress from '@/components/Steps/StepProgress';

const conditionItems = [
  { id: '1', label: '新生儿已在本市助产机构出生', required: true },
  { id: '2', label: '父母一方为本市户籍', required: true },
  { id: '3', label: '父母双方均持有有效身份证件', required: true },
  { id: '4', label: '已为新生儿起好正式姓名', required: true },
  { id: '5', label: '父母婚姻关系存续（单亲家庭无需）', required: false },
];

const materialSteps = [
  { id: '1', label: '条件自检' },
  { id: '2', label: '材料清单' },
  { id: '3', label: '材料上传' },
];

export default function Materials() {
  const navigate = useNavigate();
  const { materials, setMaterialUploaded, divergenceResult } = useApplicationStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [conditions, setConditions] = useState<Record<string, boolean>>({
    '1': true,
    '2': true,
    '3': true,
    '4': true,
    '5': false,
  });
  const [expandedCategory, setExpandedCategory] = useState<string | null>('身份证明');

  const checkedCount = Object.values(conditions).filter(Boolean).length;
  const requiredCount = conditionItems.filter((c) => c.required).length;
  const allRequiredChecked = conditionItems
    .filter((c) => c.required)
    .every((c) => conditions[c.id]);

  const toggleCondition = (id: string) => {
    setConditions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const groupedMaterials = materials.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof materials>);

  const uploadedCount = materials.filter((m) => m.uploaded).length;
  const requiredCountMat = materials.filter((m) => m.required).length;
  const allRequiredUploaded = materials
    .filter((m) => m.required)
    .every((m) => m.uploaded);

  const canProceedToApply = currentStep === 2 && allRequiredUploaded;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* 页面标题 */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">材料准备</h1>
          <p className="text-blue-100">
            {divergenceResult?.pathName || '本市户籍已婚家庭联办路径'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 步骤导航 */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <StepProgress steps={materialSteps} currentStep={currentStep} />
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* 步骤1：条件自检 */}
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
                      请确认您是否符合以下申报条件
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
                      'w-full p-4 rounded-xl border-2 text-left transition-all',
                      'flex items-center gap-4',
                      conditions[item.id]
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
                        conditions[item.id]
                          ? 'bg-blue-500'
                          : 'border-2 border-gray-300'
                      )}
                    >
                      {conditions[item.id] && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{item.label}</span>
                        {item.required && (
                          <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded">
                            必填
                          </span>
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

              {/* 进度提示 */}
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
                      style={{
                        width: `${(checkedCount / conditionItems.length) * 100}%`,
                      }}
                    />
                  </div>
                  {!allRequiredChecked && (
                    <div className="mt-3 flex items-start gap-2 text-amber-600">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">
                        请确认所有必填条件，否则可能影响后续办理
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  返回首页
                </button>
                <button
                  onClick={() => setCurrentStep(1)}
                  disabled={!allRequiredChecked}
                  className={cn(
                    'flex-1 py-3 font-medium rounded-xl transition-all',
                    'flex items-center justify-center gap-2',
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

          {/* 步骤2：材料清单 */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">材料清单</h2>
                    <p className="text-sm text-gray-600">
                      根据您的情况，以下是需要准备的材料
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {Object.entries(groupedMaterials).map(([category, items]) => (
                  <div
                    key={category}
                    className="border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedCategory(
                          expandedCategory === category ? null : category
                        )
                      }
                      className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <span className="font-semibold text-gray-900">
                          {category}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({items.length}份)
                        </span>
                      </div>
                      <ChevronRight
                        className={cn(
                          'w-5 h-5 text-gray-400 transition-transform',
                          expandedCategory === category && 'rotate-90'
                        )}
                      />
                    </button>
                    {expandedCategory === category && (
                      <div className="p-4 space-y-3">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <div
                              className={cn(
                                'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                                item.uploaded
                                  ? 'bg-green-500'
                                  : 'border-2 border-gray-300'
                              )}
                            >
                              {item.uploaded && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">
                                  {item.name}
                                </span>
                                {item.required ? (
                                  <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded">
                                    必需
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 bg-gray-200 text-gray-600 text-xs font-medium rounded">
                                    可选
                                  </span>
                                )}
                                {item.id === '4' && (
                                  <span className="px-1.5 py-0.5 bg-green-100 text-green-600 text-xs font-medium rounded">
                                    已联网
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 材料统计 */}
              <div className="px-6 pb-6">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <FileCheck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          共 {materials.length} 份材料
                        </p>
                        <p className="text-sm text-gray-600">
                          必需 {requiredCountMat} 份，可选 {materials.length - requiredCountMat} 份
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {uploadedCount}/{materials.length}
                      </p>
                      <p className="text-sm text-gray-500">已准备</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  上一步
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2"
                >
                  去上传材料
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* 步骤3：材料上传 */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {Object.entries(groupedMaterials).map(([category, items]) => (
                <div
                  key={category}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      {category}
                    </h3>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((item) => (
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
                              <p className="font-medium text-gray-900">
                                {item.name}
                              </p>
                              <p className="text-sm text-green-600 flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                已上传
                              </p>
                            </div>
                            <button
                              onClick={() => setMaterialUploaded(item.id, false)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setMaterialUploaded(item.id, true)}
                            className="w-full text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Upload className="w-8 h-8 text-gray-400" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  {item.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  点击上传或拖拽文件
                                </p>
                              </div>
                              <Plus className="w-5 h-5 text-gray-400" />
                            </div>
                          </button>
                        )}
                        {item.id === '4' && (
                          <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-blue-100/50 rounded-lg">
                            <Shield className="w-4 h-4 text-blue-600" />
                            <span className="text-xs text-blue-700">
                              医院已联网推送，无需重复提交
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* 提示信息 */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">上传须知</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>支持 JPG、PNG、PDF 格式，单文件不超过 10MB</li>
                    <li>请确保照片清晰，文字可辨识</li>
                    <li>身份证需上传正反面，户口本需上传首页和本人页</li>
                  </ul>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-gray-900">材料上传进度</p>
                    <p className="text-sm text-gray-500">
                      必需材料 {uploadedCount}/{requiredCountMat} 份已上传
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
                    style={{
                      width: `${(uploadedCount / requiredCountMat) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    上一步
                  </button>
                  <button
                    onClick={() => navigate('/apply')}
                    disabled={!allRequiredUploaded}
                    className={cn(
                      'flex-1 py-3 font-medium rounded-xl transition-all',
                      'flex items-center justify-center gap-2',
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
