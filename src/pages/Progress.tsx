import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronRight,
  ArrowRight,
  Phone,
  HelpCircle,
  Building2,
  Baby,
  Stethoscope,
  CreditCard,
  Syringe,
  Bell,
  Calendar,
  FileText,
  AlertTriangle,
  Upload,
  Check,
  X,
  ChevronDown,
  Building,
} from 'lucide-react';
import { cn, getStatusText, getStatusColor, formatDate, formatDateTime, flowRecordIconMap, flowRecordColorMap } from '@/utils/helpers';
import { useProgressStore } from '@/store/progress';
import { useApplicationStore } from '@/store/application';

const statusIcons: Record<string, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  completed: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-100' },
  processing: { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-100' },
  pending: { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-100' },
  rejected: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100' },
};

const serviceIcons: Record<string, typeof Baby> = {
  '出生医学证明信息确认': Baby,
  '户口登记': Building2,
  '城乡居民医保参保': Stethoscope,
  '社会保障卡申领': CreditCard,
  '预防接种信息建档': Syringe,
};

const serviceColors: Record<string, string> = {
  '出生医学证明信息确认': 'from-pink-500 to-rose-500',
  '户口登记': 'from-blue-500 to-indigo-500',
  '城乡居民医保参保': 'from-emerald-500 to-teal-500',
  '社会保障卡申领': 'from-amber-500 to-orange-500',
  '预防接种信息建档': 'from-purple-500 to-violet-500',
};

export default function Progress() {
  const navigate = useNavigate();
  const { applicationItems, corrections, resolveCorrection } = useProgressStore();
  const { babyInfo } = useApplicationStore();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');
  const [activeCorrectionId, setActiveCorrectionId] = useState<string | null>(null);
  const [uploadingCorrection, setUploadingCorrection] = useState<string | null>(null);
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());
  const [expandedItemIds, setExpandedItemIds] = useState<Set<string>>(new Set());

  const completedCount = applicationItems.filter((item) => item.status === 'completed').length;
  const processingCount = applicationItems.filter((item) => item.status === 'processing').length;
  const pendingCount = applicationItems.filter((item) => item.status === 'pending').length;
  const rejectedCount = applicationItems.filter((item) => item.status === 'rejected').length;
  const totalProgress = applicationItems.length > 0 ? Math.round((completedCount / applicationItems.length) * 100) : 0;

  const unresolvedCorrections = corrections.filter((c) => !c.resolved);

  const filteredItems = applicationItems.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return item.status !== 'completed';
    if (activeTab === 'completed') return item.status === 'completed';
    return true;
  });

  const handleStartCorrection = (correctionId: string) => {
    setActiveCorrectionId(correctionId);
  };

  const handleCancelCorrection = () => {
    setActiveCorrectionId(null);
  };

  const handleSimulateUpload = (correctionId: string) => {
    setUploadingCorrection(correctionId);
    setTimeout(() => {
      resolveCorrection(correctionId);
      setUploadingCorrection(null);
      setActiveCorrectionId(null);
      setResolvedIds((prev) => new Set(prev).add(correctionId));
    }, 1500);
  };

  const toggleExpand = (itemId: string) => {
    setExpandedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">进度中心</h1>
          <p className="text-blue-100">实时跟踪您的"出生一件事"办理进度</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-6">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-blue-100 text-sm mb-1">整体办理进度</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{totalProgress}%</span>
                    <span className="text-blue-100 text-sm">{completedCount}/{applicationItems.length} 项已完成</span>
                  </div>
                </div>
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${totalProgress}%` }} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-blue-100 flex-wrap">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" />已完成 {completedCount}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />办理中 {processingCount}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />待办理 {pendingCount}</span>
                {rejectedCount > 0 && (
                  <span className="flex items-center gap-1 text-red-200"><AlertCircle className="w-4 h-4" />待补正 {rejectedCount}</span>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Baby className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{babyInfo.name}</p>
                    <p className="text-sm text-gray-500">申报编号：BS2024061500123</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">提交时间：{formatDate('2024-06-15')}</p>
              </div>
            </div>
          </div>

          {unresolvedCorrections.length > 0 && (
            <div className={cn(
              'rounded-2xl p-6 transition-all',
              unresolvedCorrections.length > 0 ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
            )}>
              <div className="flex items-start gap-3 mb-4">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                  unresolvedCorrections.length > 0 ? 'bg-red-500' : 'bg-green-500'
                )}>
                  {unresolvedCorrections.length > 0 ? (
                    <AlertTriangle className="w-5 h-5 text-white" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={cn('font-bold', unresolvedCorrections.length > 0 ? 'text-red-800' : 'text-green-800')}>
                    {unresolvedCorrections.length > 0
                      ? `有 ${unresolvedCorrections.length} 项需要补正`
                      : '所有补正已完成'}
                  </h3>
                  <p className={cn('text-sm', unresolvedCorrections.length > 0 ? 'text-red-600' : 'text-green-600')}>
                    {unresolvedCorrections.length > 0
                      ? '请尽快补正材料，以免影响办理进度'
                      : '补正材料已全部提交，继续等待审批'}
                  </p>
                </div>
                {unresolvedCorrections.length > 0 && (
                  <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full">待处理</span>
                )}
              </div>

              {unresolvedCorrections.length > 0 && (
                <div className="space-y-3">
                  {unresolvedCorrections.map((correction) => (
                    <div key={correction.id} className="bg-white rounded-xl p-4 border border-red-100">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-red-500" />
                          <span className="font-medium text-gray-900">{correction.itemName}</span>
                        </div>
                        <span className={cn(
                          'px-2 py-0.5 text-xs font-medium rounded',
                          correction.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                        )}>
                          {correction.priority === 'high' ? '紧急' : '一般'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{correction.content}</p>

                      {activeCorrectionId === correction.id ? (
                        <div className="border-2 border-dashed border-blue-300 rounded-xl p-4 bg-blue-50">
                          <p className="text-sm text-gray-700 font-medium mb-3">补传材料</p>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                              {uploadingCorrection === correction.id ? (
                                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Upload className="w-8 h-8 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-600">点击上传补正材料</p>
                              <p className="text-xs text-gray-400">支持 JPG、PNG、PDF，不超过 10MB</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSimulateUpload(correction.id)}
                              disabled={uploadingCorrection === correction.id}
                              className={cn(
                                'flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-1 transition-all',
                                uploadingCorrection === correction.id
                                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                  : 'bg-blue-500 text-white hover:bg-blue-600'
                              )}
                            >
                              {uploadingCorrection === correction.id ? (
                                <>上传中...</>
                              ) : (
                                <><Upload className="w-4 h-4" />确认上传并提交</>
                              )}
                            </button>
                            <button
                              onClick={handleCancelCorrection}
                              disabled={uploadingCorrection === correction.id}
                              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              取消
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            截止日期：{formatDate(correction.deadline)}
                          </span>
                          <button
                            onClick={() => handleStartCorrection(correction.id)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                          >
                            去补正
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {resolvedIds.size > 0 && unresolvedCorrections.length === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-green-800">补正已完成</p>
                <p className="text-sm text-green-600">所有补正材料已成功提交，相关事项将恢复办理</p>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-800">办理时限提醒</h3>
                <p className="text-sm text-amber-700 mt-1">
                  "户口登记"事项已办理 2 个工作日，预计还需 1 个工作日办结。
                  如超过承诺时限，系统将自动触发人工介入。
                </p>
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors">
                <Phone className="w-4 h-4" />
                人工咨询
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  事项办理进度
                </h2>
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  {[
                    { key: 'all', label: '全部' },
                    { key: 'pending', label: '办理中' },
                    { key: 'completed', label: '已完成' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as typeof activeTab)}
                      className={cn(
                        'px-4 py-1.5 text-sm font-medium rounded-md transition-all',
                        activeTab === tab.key ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
                <div className="space-y-6">
                  {filteredItems.map((item, index) => {
                    const StatusIcon = statusIcons[item.status].icon;
                    const ServiceIcon = serviceIcons[item.name] || FileText;
                    const isLast = index === filteredItems.length - 1;
                    const isExpanded = expandedItemIds.has(item.id);
                    const hasFlowRecords = item.flowRecords && item.flowRecords.length > 0;

                    return (
                      <div key={item.id} className="relative flex gap-4">
                        <div className="relative z-10">
                          <div className={cn(
                            'w-12 h-12 rounded-xl flex items-center justify-center',
                            'bg-gradient-to-br shadow-md',
                            serviceColors[item.name] || 'from-gray-500 to-gray-600'
                          )}>
                            <ServiceIcon className="w-6 h-6 text-white" />
                          </div>
                          {!isLast && (
                            <div
                              className={cn(
                                'absolute top-14 left-1/2 -translate-x-1/2 w-0.5',
                                item.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                              )}
                              style={{ height: 'calc(100% + 1.5rem)' }}
                            />
                          )}
                        </div>

                        <div className="flex-1 pb-6">
                          <div className={cn(
                            'bg-gray-50 rounded-xl border transition-all hover:shadow-sm overflow-hidden',
                            item.status === 'processing' && 'border-blue-200 bg-blue-50',
                            item.status === 'rejected' && 'border-red-200 bg-red-50'
                          )}>
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                  <p className="text-sm text-gray-500">{item.department}</p>
                                </div>
                                <span className={cn(
                                  'px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1',
                                  getStatusColor(item.status)
                                )}>
                                  <StatusIcon className="w-3.5 h-3.5" />
                                  {getStatusText(item.status)}
                                </span>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  预计 {item.estimatedTime}
                                </span>
                                {item.actualTime && (
                                  <span className="flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    实际用时 {item.actualTime}
                                  </span>
                                )}
                              </div>

                              {item.remarks && (
                                <div className="mt-3 p-3 bg-white rounded-lg border border-gray-100">
                                  <p className="text-sm text-gray-600">{item.remarks}</p>
                                </div>
                              )}

                              {item.status === 'processing' && (
                                <div className="mt-3">
                                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                    <span>办理进度</span>
                                    <span>60%</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full w-3/5" />
                                  </div>
                                </div>
                              )}

                              {item.status === 'rejected' && (() => {
                                const relatedCorrection = unresolvedCorrections.find((c) => c.itemId === item.id);
                                if (relatedCorrection && activeCorrectionId !== relatedCorrection.id) {
                                  return (
                                    <button
                                      onClick={() => handleStartCorrection(relatedCorrection.id)}
                                      className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                                    >
                                      查看补正要求并处理
                                      <ChevronRight className="w-4 h-4" />
                                    </button>
                                  );
                                }
                                if (relatedCorrection && activeCorrectionId === relatedCorrection.id) {
                                  return (
                                    <div className="mt-3 border-2 border-dashed border-red-300 rounded-xl p-4 bg-red-50">
                                      <p className="text-sm text-red-700 font-medium mb-1">补正要求</p>
                                      <p className="text-sm text-gray-600 mb-3">{relatedCorrection.content}</p>
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => handleSimulateUpload(relatedCorrection.id)}
                                          disabled={uploadingCorrection === relatedCorrection.id}
                                          className={cn(
                                            'flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-1',
                                            uploadingCorrection === relatedCorrection.id
                                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                              : 'bg-blue-500 text-white hover:bg-blue-600'
                                          )}
                                        >
                                          {uploadingCorrection === relatedCorrection.id ? '上传中...' : '上传补正材料'}
                                        </button>
                                        <button
                                          onClick={handleCancelCorrection}
                                          className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                                        >
                                          取消
                                        </button>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              })()}

                              {hasFlowRecords && (
                                <button
                                  onClick={() => toggleExpand(item.id)}
                                  className={cn(
                                    'mt-4 w-full flex items-center justify-between py-2 px-3 rounded-lg',
                                    'text-sm text-gray-600 hover:text-gray-900 hover:bg-white transition-colors'
                                  )}
                                >
                                  <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    查看流转记录（{item.flowRecords.length} 条）
                                  </span>
                                  <ChevronDown className={cn(
                                    'w-4 h-4 transition-transform',
                                    isExpanded && 'rotate-180'
                                  )} />
                                </button>
                              )}
                            </div>

                            {isExpanded && hasFlowRecords && (
                              <div className="border-t border-gray-200 bg-white px-4 py-4">
                                <div className="relative pl-8">
                                  <div className="absolute left-2.5 top-1 bottom-1 w-0.5 bg-gray-200" />
                                  <div className="space-y-5">
                                    {item.flowRecords.map((record, rIndex) => {
                                      const RecordIcon = flowRecordIconMap[record.type];
                                      const colorCfg = flowRecordColorMap[record.type];
                                      const isLastRecord = rIndex === item.flowRecords.length - 1;
                                      const isHighlighted = record.type === 'rejected' || record.type === 'corrected';

                                      return (
                                        <div key={record.id} className="relative">
                                          <div className={cn(
                                            'absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center z-10',
                                            colorCfg.dot
                                          )}>
                                            <RecordIcon className="w-3 h-3 text-white" />
                                          </div>
                                          {!isLastRecord && (
                                            <div
                                              className={cn(
                                                'absolute -left-[21px] top-5 w-0.5',
                                                colorCfg.line
                                              )}
                                              style={{ height: 'calc(100% + 0.5rem)' }}
                                            />
                                          )}
                                          <div className={cn(
                                            'rounded-lg p-3',
                                            isHighlighted ? colorCfg.bg : 'bg-gray-50'
                                          )}>
                                            <div className="flex items-start justify-between gap-3">
                                              <div className="flex-1">
                                                <p className={cn('text-sm font-semibold', colorCfg.text)}>
                                                  {record.title}
                                                </p>
                                                {record.remark && (
                                                  <p className="text-sm text-gray-600 mt-1">
                                                    {record.remark}
                                                  </p>
                                                )}
                                                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 flex-wrap">
                                                  <span className="flex items-center gap-1">
                                                    <Building className="w-3.5 h-3.5" />
                                                    {record.department}
                                                  </span>
                                                  <span className="flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {formatDateTime(record.time)}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/result')}
              className="bg-white rounded-2xl p-5 text-left hover:shadow-md transition-shadow border border-gray-200 hover:border-blue-200 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">查看办理结果</h3>
              <p className="text-sm text-gray-500">已办结事项和电子证照</p>
            </button>
            <button className="bg-white rounded-2xl p-5 text-left hover:shadow-md transition-shadow border border-gray-200 hover:border-orange-200 group">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">常见问题</h3>
              <p className="text-sm text-gray-500">办理中遇到问题？查看解答</p>
            </button>
          </div>

          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Phone className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">需要帮助？</h3>
                  <p className="text-gray-400 text-sm">遇到问题可随时联系人工客服</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  在线咨询
                </button>
                <button className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  12345
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
