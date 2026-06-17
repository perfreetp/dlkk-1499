import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Home as HomeIcon,
  ClipboardList,
  Clock,
  Award,
  ChevronRight,
  Users,
  MapPin,
  HelpCircle,
  Phone,
  Shield,
  Zap,
  FileCheck,
  Baby,
  UserPlus,
  Building2,
  Stethoscope,
  CreditCard,
  Syringe,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/utils/helpers';
import { useApplicationStore } from '@/store/application';
import { faqData } from '@/data/faqData';

type MaritalStatus = 'married' | 'single' | null;
type SettlementType = 'local' | 'remote' | null;

const processSteps = [
  {
    icon: HomeIcon,
    title: '首页引导',
    desc: '智能分流，选择适合您的办理路径',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: ClipboardList,
    title: '材料准备',
    desc: '一键生成清单，材料不缺不漏',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: FileCheck,
    title: '联合申报',
    desc: '一次填写，五事联办',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: Clock,
    title: '进度中心',
    desc: '跨部门进度一目了然',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Award,
    title: '结果领取',
    desc: '电子证照直达卡包',
    color: 'from-rose-500 to-rose-600',
  },
];

const services = [
  { icon: Baby, title: '出生医学证明', desc: '卫生健康部门核发', color: 'bg-pink-100 text-pink-600' },
  { icon: Building2, title: '户口登记', desc: '公安部门办理', color: 'bg-blue-100 text-blue-600' },
  { icon: Stethoscope, title: '医保参保', desc: '医保部门办理', color: 'bg-emerald-100 text-emerald-600' },
  { icon: CreditCard, title: '社保卡申领', desc: '人社部门办理', color: 'bg-amber-100 text-amber-600' },
  { icon: Syringe, title: '预防接种建档', desc: '疾控部门办理', color: 'bg-purple-100 text-purple-600' },
];

export default function Home() {
  const navigate = useNavigate();
  const { setDivergenceResult } = useApplicationStore();
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>(null);
  const [settlementType, setSettlementType] = useState<SettlementType>(null);
  const [showDivergenceResult, setShowDivergenceResult] = useState(false);

  const canProceed = maritalStatus && settlementType;

  const handleStartApplication = () => {
    if (!canProceed) return;

    const pathName =
      maritalStatus === 'married' && settlementType === 'local'
        ? '本市户籍已婚家庭联办路径'
        : maritalStatus === 'single' && settlementType === 'local'
        ? '本市户籍单亲家庭联办路径'
        : settlementType === 'remote'
        ? '外省市户籍联办路径'
        : '标准联办路径';

    const applicableItems =
      settlementType === 'local'
        ? ['出生医学证明', '户口登记', '城乡居民医保', '社会保障卡', '预防接种']
        : ['出生医学证明', '预防接种'];

    setDivergenceResult({
      maritalStatus: maritalStatus || 'married',
      settlementLocation: settlementType === 'local' ? '本市户籍' : '外省市户籍',
      applicableItems,
      pathName,
    });

    setShowDivergenceResult(true);
  };

  const handleGoToMaterials = () => {
    navigate('/materials');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl" />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>新生儿"出生一件事"联办服务</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              一次申报，五事联办
              <br />
              <span className="text-cyan-200">让新手父母少跑腿</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              整合出生医学证明、户口登记、医保参保、社保卡申领、预防接种建档五大事项，
              智能分流、材料复用、进度透明，足不出户办好事。
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  document
                    .getElementById('divergence')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                立即开始办理
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/progress')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-all border border-white/30"
              >
                <Clock className="w-5 h-5" />
                查询办理进度
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 md:mt-16">
            {[
              { value: '5', label: '联办事项' },
              { value: '1次', label: '提交材料' },
              { value: '7-10天', label: '平均办结' },
              { value: '98%', label: '群众好评' },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center border border-white/20"
              >
                <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 可办理事项 */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              一次办理，五证齐全
            </h2>
            <p className="text-gray-600">涵盖新生儿出生后所需的全部政务服务事项</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white border border-gray-200 rounded-2xl p-5 text-center hover:shadow-lg hover:border-blue-200 transition-all hover:-translate-y-1"
              >
                <div
                  className={cn(
                    'w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center',
                    service.color
                  )}
                >
                  <service.icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{service.title}</h3>
                <p className="text-sm text-gray-500">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 智能分流 */}
      <section id="divergence" className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              智能分流，精准匹配
            </h2>
            <p className="text-gray-600">
              根据您的家庭情况，自动匹配最适合的办理路径和材料清单
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  请选择您的情况
                </h3>
              </div>

              <div className="p-6 md:p-8 space-y-8">
                {/* 婚姻状况 */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      1
                    </span>
                    <h4 className="font-semibold text-gray-900">婚姻状况</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { value: 'married' as const, label: '已婚家庭', desc: '父母双方共同办理' },
                      { value: 'single' as const, label: '单亲家庭', desc: '母亲一方办理' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setMaritalStatus(option.value)}
                        className={cn(
                          'p-4 rounded-2xl border-2 text-left transition-all',
                          'hover:shadow-md',
                          maritalStatus === option.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Users
                            className={cn(
                              'w-6 h-6',
                              maritalStatus === option.value
                                ? 'text-blue-500'
                                : 'text-gray-400'
                            )}
                          />
                          <div>
                            <p
                              className={cn(
                                'font-medium',
                                maritalStatus === option.value
                                  ? 'text-blue-600'
                                  : 'text-gray-900'
                              )}
                            >
                              {option.label}
                            </p>
                            <p className="text-sm text-gray-500">{option.desc}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 落户地 */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      2
                    </span>
                    <h4 className="font-semibold text-gray-900">落户情况</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { value: 'local' as const, label: '本市户籍', desc: '父母一方为本市户口' },
                      { value: 'remote' as const, label: '外省市户籍', desc: '父母均为外地户口' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSettlementType(option.value)}
                        className={cn(
                          'p-4 rounded-2xl border-2 text-left transition-all',
                          'hover:shadow-md',
                          settlementType === option.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <MapPin
                            className={cn(
                              'w-6 h-6',
                              settlementType === option.value
                                ? 'text-blue-500'
                                : 'text-gray-400'
                            )}
                          />
                          <div>
                            <p
                              className={cn(
                                'font-medium',
                                settlementType === option.value
                                  ? 'text-blue-600'
                                  : 'text-gray-900'
                              )}
                            >
                              {option.label}
                            </p>
                            <p className="text-sm text-gray-500">{option.desc}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 分流结果 */}
                {showDivergenceResult && (
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-emerald-800 mb-1">
                          为您匹配的办理路径
                        </h5>
                        <p className="text-emerald-700 font-medium mb-2">
                          {settlementType === 'local'
                            ? '本市户籍已婚家庭联办路径'
                            : '外省市户籍联办路径'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {settlementType === 'local'
                            ? [
                                '出生医学证明',
                                '户口登记',
                                '城乡居民医保',
                                '社会保障卡',
                                '预防接种',
                              ].map((item) => (
                                <span
                                  key={item}
                                  className="px-2 py-1 bg-white text-emerald-600 text-xs font-medium rounded-lg border border-emerald-200"
                                >
                                  {item}
                                </span>
                              ))
                            : ['出生医学证明', '预防接种'].map((item) => (
                                <span
                                  key={item}
                                  className="px-2 py-1 bg-white text-emerald-600 text-xs font-medium rounded-lg border border-emerald-200"
                                >
                                  {item}
                                </span>
                              ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 开始按钮 */}
                <button
                  onClick={
                    showDivergenceResult ? handleGoToMaterials : handleStartApplication
                  }
                  disabled={!canProceed}
                  className={cn(
                    'w-full py-4 rounded-2xl font-semibold text-lg transition-all',
                    'flex items-center justify-center gap-2',
                    canProceed
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  )}
                >
                  {showDivergenceResult ? (
                    <>
                      开始准备材料
                      <ArrowRight className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      查看我的办理路径
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 办理流程 */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              五步走，轻松办
            </h2>
            <p className="text-gray-600">清晰的办理流程，每一步都心中有数</p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 mx-16" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {processSteps.map((step, index) => (
                <div key={index} className="relative text-center">
                  <div
                    className={cn(
                      'w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br flex items-center justify-center',
                      'shadow-lg hover:shadow-xl transition-shadow',
                      step.color
                    )}
                  >
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="mt-4">
                    <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-500">{step.desc}</p>
                  </div>
                  <div className="hidden md:flex absolute top-10 -right-3 w-6 h-6 bg-white rounded-full items-center justify-center z-10">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 特色优势 */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              为什么选择联办
            </h2>
            <p className="text-gray-600">传统模式 vs 一件事联办</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
              <h3 className="font-bold text-red-700 mb-4 flex items-center gap-2">
                <span className="text-xl">😫</span>
                传统办理方式
              </h3>
              <ul className="space-y-3">
                {[
                  '跑5个部门，排队叫号费时间',
                  '重复提交材料，每份都要复印',
                  '不知道先办什么，顺序搞不清',
                  '每个部门进度分开查，信息分散',
                  '证件要自取，跑好几趟',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-red-600">
                    <span className="text-red-400 mt-0.5">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
              <h3 className="font-bold text-emerald-700 mb-4 flex items-center gap-2">
                <span className="text-xl">😊</span>
                一件事联办
              </h3>
              <ul className="space-y-3">
                {[
                  '一次登录，五事联办',
                  '材料一次提交，跨部门共享复用',
                  '智能引导，按顺序自动推进',
                  '统一进度中心，一目了然',
                  '电子证照直达卡包，快递送证上门',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-emerald-700">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 热门问题 */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                常见问题
              </h2>
              <p className="text-gray-600">新手父母最关心的问题</p>
            </div>
            <button
              onClick={() => navigate('/result')}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              查看更多
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {faqData.slice(0, 4).map((faq) => (
              <div
                key={faq.id}
                className="bg-gray-50 hover:bg-blue-50 rounded-2xl p-5 transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {faq.question}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 安全保障 */}
      <section className="py-10 md:py-12 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Shield className="w-12 h-12 text-green-400" />
              <div>
                <h3 className="text-xl font-bold">安全可靠，隐私保护</h3>
                <p className="text-gray-400 text-sm">
                  国家政务服务统一安全认证，您的信息受到严格保护
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">256位</div>
                <div className="text-xs text-gray-400">加密传输</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">三级</div>
                <div className="text-xs text-gray-400">等保认证</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">7×24</div>
                <div className="text-xs text-gray-400">安全监控</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 咨询浮窗 */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <button className="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center">
          <Phone className="w-6 h-6" />
        </button>
        <button className="w-14 h-14 bg-white hover:bg-gray-50 text-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center border border-gray-200">
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
