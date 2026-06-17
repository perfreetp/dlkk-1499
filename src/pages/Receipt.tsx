import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  FileCheck,
  Clock,
  ArrowRight,
  Baby,
  Building2,
  Stethoscope,
  CreditCard,
  Syringe,
  FileText,
  Calendar,
  Award,
  Bell,
  Shield,
  Copy,
  Check,
} from 'lucide-react';
import { cn, formatDate } from '@/utils/helpers';
import { useProgressStore } from '@/store/progress';
import { useApplicationStore } from '@/store/application';

const itemIcons: Record<string, { icon: typeof Baby; color: string; bg: string }> = {
  '出生医学证明信息确认': { icon: Baby, color: 'text-pink-600', bg: 'bg-pink-100' },
  '户口登记': { icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100' },
  '城乡居民医保参保': { icon: Stethoscope, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  '社会保障卡申领': { icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-100' },
  '预防接种信息建档': { icon: Syringe, color: 'text-purple-600', bg: 'bg-purple-100' },
};

function getItemConfig(name: string) {
  return itemIcons[name] || { icon: FileText, color: 'text-gray-600', bg: 'bg-gray-100' };
}

export default function Receipt() {
  const navigate = useNavigate();
  const { applicationItems } = useProgressStore();
  const { babyInfo, divergenceResult, applicationSubmitted } = useApplicationStore();

  const applicationNo = 'BS2024061500123';
  const submitDate = new Date();
  const submitDateStr = formatDate(submitDate.toISOString().split('T')[0]);

  // 预计办结时间（按最长的事项算）
  const maxEstimatedDays = applicationItems.reduce((max, item) => {
    const match = item.estimatedTime.match(/(\d+)/);
    const days = match ? parseInt(match[1], 10) : 0;
    return Math.max(max, days);
  }, 0);
  const estimatedFinishDate = new Date(submitDate);
  estimatedFinishDate.setDate(estimatedFinishDate.getDate() + maxEstimatedDays + 2);
  const estimatedFinishStr = formatDate(estimatedFinishDate.toISOString().split('T')[0]);

  // 如果还没提交过，直接跳首页
  useEffect(() => {
    if (!applicationSubmitted && applicationItems.length === 0) {
      navigate('/');
    }
  }, [applicationSubmitted, applicationItems.length, navigate]);

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(applicationNo);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* 头部成功区 */}
      <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white">
        <div className="container mx-auto px-4 pt-12 pb-20 text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">申报提交成功！</h1>
          <p className="text-emerald-100">
            您的"出生一件事"联办申报已成功提交，请耐心等待审批
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* 申报信息卡 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <FileCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">申报回执</h2>
                  <p className="text-sm text-gray-500">请妥善保存申报编号，便于后续查询</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* 申报编号 */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">申报编号</p>
                    <p className="text-xl font-bold text-blue-700 tracking-wider">{applicationNo}</p>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-200 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    复制
                  </button>
                </div>
              </div>

              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">申请人（新生儿）</p>
                  <p className="font-semibold text-gray-900">{babyInfo.name}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">办理路径</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {divergenceResult?.pathName || '标准联办路径'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">提交时间</p>
                  <p className="font-semibold text-gray-900">{submitDateStr}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4">
                  <p className="text-sm text-emerald-600 mb-1">预计办结</p>
                  <p className="font-semibold text-emerald-700">{estimatedFinishStr}</p>
                </div>
              </div>

              {/* 联办事项 */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  本次联办事项（{applicationItems.length} 项）
                </h3>
                <div className="space-y-2">
                  {applicationItems
                    .sort((a, b) => a.order - b.order)
                    .map((item, index) => {
                      const cfg = getItemConfig(item.name);
                      const IconComp = cfg.icon;
                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                        >
                          <div
                            className={cn(
                              'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                              cfg.bg
                            )}
                          >
                            <span className="text-xs font-bold text-white bg-gradient-to-br from-blue-500 to-cyan-500 w-6 h-6 rounded flex items-center justify-center">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1 flex items-center gap-3">
                            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', cfg.bg)}>
                              <IconComp className={cn('w-4 h-4', cfg.color)} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.name}</p>
                              <p className="text-xs text-gray-500">{item.department}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">预计</p>
                            <p className="text-sm font-medium text-gray-700">{item.estimatedTime}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* 温馨提示 */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-amber-800 space-y-1">
                    <p className="font-semibold">温馨提示</p>
                    <ul className="list-disc list-inside space-y-1 text-amber-700">
                      <li>您可以在"进度中心"实时查看各事项办理进度</li>
                      <li>如需补正材料，系统将通过短信和站内信通知您</li>
                      <li>所有事项办结后，电子证照将自动发放到卡包</li>
                      <li>如有疑问，请拨打 12345 人工服务热线</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => navigate('/progress')}
                  className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Clock className="w-5 h-5" />
                  去进度中心查看
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 py-3.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  返回首页
                </button>
              </div>
            </div>
          </div>

          {/* 安全保障 */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">信息安全保障</h3>
                <p className="text-sm text-gray-500">您的个人信息受到严格保护</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-lg font-bold text-green-600">256位</p>
                <p className="text-xs text-gray-500">加密传输</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-lg font-bold text-green-600">三级</p>
                <p className="text-xs text-gray-500">等保认证</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-lg font-bold text-green-600">7×24</p>
                <p className="text-xs text-gray-500">安全监控</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
