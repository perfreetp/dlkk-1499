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
  Shield,
  Bell,
  Calendar,
  User,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { cn, getStatusText, getStatusColor, formatDate } from '@/utils/helpers';
import { useProgressStore } from '@/store/progress';
import { useApplicationStore } from '@/store/application';

const statusIcons: Record<
  string,
  { icon: typeof CheckCircle2; color: string; bg: string }
> = {
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
  const { applicationItems, corrections } = useProgressStore();
  const { babyInfo } = useApplicationStore();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');

  const completedCount = applicationItems.filter(
    (item) => item.status === 'completed'
  ).length;
  const processingCount = applicationItems.filter(
    (item) => item.status === 'processing'
  ).length;
  const pendingCount = applicationItems.filter(
    (item) => item.status === 'pending'
  ).length;
  const totalProgress = Math.round(
    (completedCount / applicationItems.length) * 100
  );

  const unresolvedCorrections = corrections.filter((c) => !c.resolved);

  const filteredItems = applicationItems.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return item.status !== 'completed';
    if (activeTab === 'completed') return item.status === 'completed';
    return true;
  });

  const hasOverdue = processingCount > 0 && unresolvedCorrections.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* 页面标题 */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">进度中心</h1>
          <p className="text-blue-100">实时跟踪您的"出生一件事"办理进度</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 总体进度卡片 */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-6">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-blue-100 text-sm mb-1">整体办理进度</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{totalProgress}%</span>
                    <span className="text-blue-100 text-sm">
                      {completedCount}/{applicationItems.length} 项已完成</span>
                  </div>
                </div>
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-1000"
                    style={{ width: `${totalProgress}%` }}
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-blue-100">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  已完成 {completedCount}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  办理中 {processingCount}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  待办理 {pendingCount}
                </span>
              </div>
            </div>

            {/* 申请人信息 */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Baby className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{babyInfo.name}</p>
                    <p className="text-sm text-gray-500">
                      申报编号：BS2024061500123
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  提交时间：{formatDate('2024-06-15')}
                </p>
              </div>
            </div>
          </div>

          {/* 补正通知 */}
          {unresolvedCorrections.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-red-800">
                    有 {unresolvedCorrections.length} 项需要补正
                  </h3>
                  <p className="text-sm text-red-600">
                    请尽快补正材料，以免影响办理进度</p>
                </div>
                <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full">
                  待处理
                </span>
              </div>

              <div className="space-y-3">
                {unresolvedCorrections.map((correction) => (
                <div
                  key={correction.id}
                  className="bg-white rounded-xl p-4 border border-red-100"
                >
                  <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="font-medium text-gray-900">
                      {correction.itemName}
                    </span>
                  </div>
                  <span
                    className={cn(
                      'px-2 py-0.5 text-xs font-medium rounded',
                      correction.priority === 'high'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-amber-100 text-amber-600'
                    )}
                  >
                    {correction.priority === 'high' ? '紧急' : '一般'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{correction.content}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    截止日期：{formatDate(correction.deadline)}
                  </span>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                    去补正
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
              </div>
            </div>
          )}

          {/* 超时预警 */}
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

          {/* 事项进度列表 */}
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
                        activeTab === tab.key
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
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
                {/* 时间线 */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

                <div className="space-y-6">
                  {filteredItems.map((item, index) => {
                    const StatusIcon = statusIcons[item.status].icon;
                    const ServiceIcon = serviceIcons[item.name] || FileText;
                    const isLast = index === filteredItems.length - 1;

                    return (
                      <div key={item.id} className="relative flex gap-4">
                        {/* 时间节点 */}
                        <div className="relative z-10">
                          <div
                            className={cn(
                              'w-12 h-12 rounded-xl flex items-center justify-center',
                              'bg-gradient-to-br shadow-md',
                              serviceColors[item.name] || 'from-gray-500 to-gray-600'
                            )}
                          >
                            <ServiceIcon className="w-6 h-6 text-white" />
                          </div>
                          {!isLast && (
                            <div
                              className={cn(
                                'absolute top-14 left-1/2 -translate-x-1/2 w-0.5 h-full',
                                item.status === 'completed'
                                  ? 'bg-green-500'
                                  : 'bg-gray-200'
                              )}
                              style={{ height: 'calc(100% + 1.5rem)' }}
                            />
                          )}
                        </div>

                        {/* 内容卡片 */}
                        <div className="flex-1 pb-6">
                          <div
                            className={cn(
                              'bg-gray-50 rounded-xl p-4 border transition-all hover:shadow-sm',
                              item.status === 'processing' &&
                                'border-blue-200 bg-blue-50'
                            )}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {item.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {item.department}
                                </p>
                              </div>
                              <span
                                className={cn(
                                  'px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1',
                                  getStatusColor(item.status)
                                )}
                              >
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
                                <p className="text-sm text-gray-600">
                                  {item.remarks}
                                </p>
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

                            {item.status === 'rejected' && (
                              <button className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                                查看补正要求
                                <ChevronRight className="w-4 h-4" />
                              </button>
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

          {/* 操作入口 */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/result')}
              className="bg-white rounded-2xl p-5 text-left hover:shadow-md transition-shadow border border-gray-200 hover:border-blue-200 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">查看办理结果</h3>
              <p className="text-sm text-gray-500">
                已办结事项和电子证照
              </p>
            </button>

            <button className="bg-white rounded-2xl p-5 text-left hover:shadow-md transition-shadow border border-gray-200 hover:border-orange-200 group">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">常见问题</h3>
              <p className="text-sm text-gray-500">
                办理中遇到问题？查看解答
              </p>
            </button>
          </div>

          {/* 人工咨询 */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Phone className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">需要帮助？</h3>
                  <p className="text-gray-400 text-sm">
                    遇到问题可随时联系人工客服
                  </p>
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
