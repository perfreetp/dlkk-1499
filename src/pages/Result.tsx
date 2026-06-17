import { useState } from 'react';
import {
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Search,
  Download,
  Share2,
  Wallet,
  FileText,
  Shield,
  Phone,
  Calendar,
  Building,
  Clock,
  QrCode,
} from 'lucide-react';
import { cn, formatDate } from '@/utils/helpers';
import { useProgressStore } from '@/store/progress';
import { faqData, faqCategories } from '@/data/faqData';

export default function Result() {
  const { certificates } = useProgressStore();
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  const filteredFaqs = faqData.filter((faq) => {
    const matchesCategory =
      activeCategory === '全部' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.includes(searchQuery) || faq.answer.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const activeCerts = certificates.filter((c) => c.status === 'active');
  const pendingCerts = certificates.filter((c) => c.status === 'pending');

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* 页面标题 */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">结果领取</h1>
          <p className="text-emerald-100">
            您的电子证照和办理结果都在这里
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 完成统计 */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">办理结果</h2>
                <p className="text-gray-500">
                  已完成 {activeCerts.length} 项，待完成 {pendingCerts.length} 项
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-emerald-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-1">
                  {activeCerts.length}
                </div>
                <div className="text-sm text-emerald-700">已办结</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {pendingCerts.length}
                </div>
                <div className="text-sm text-blue-700">办理中</div>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-amber-600 mb-1">
                  7-10
                </div>
                <div className="text-sm text-amber-700">工作日(总)</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  5
                </div>
                <div className="text-sm text-purple-700">联办事项</div>
              </div>
            </div>
          </div>

          {/* 电子卡包 */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-blue-500" />
                  电子证照卡包
                </h2>
                <span className="text-sm text-gray-500">
                  {activeCerts.length} 张可用
                </span>
              </div>
            </div>

            <div className="p-6">
              {/* 证照卡片堆叠效果 */}
              <div className="relative h-64 mb-6">
                {certificates.map((cert, index) => (
                  <div
                    key={cert.id}
                    onClick={() =>
                      cert.status === 'active' && setSelectedCert(cert.id)
                    }
                    className={cn(
                      'absolute left-1/2 -translate-x-1/2 w-full max-w-sm',
                      'transition-all duration-300 cursor-pointer',
                      cert.status === 'active'
                        ? 'hover:scale-105 hover:z-10'
                        : 'opacity-60'
                    )}
                    style={{
                      top: `${index * 20}px`,
                      zIndex: certificates.length - index,
                      transform: `translateX(-50%) rotate(${(index - 1) * 2}deg)`,
                    }}
                  >
                    <div
                      className={cn(
                        'rounded-2xl p-5 text-white shadow-lg',
                        'bg-gradient-to-br',
                        cert.color
                      )}
                    >
                      <div className="flex items-start justify-between mb-8">
                        <div>
                          <p className="text-xs text-white/80 mb-1">
                            {cert.type}
                          </p>
                          <h3 className="text-lg font-bold">{cert.name}</h3>
                        </div>
                        {cert.status === 'active' ? (
                          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <Clock className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-white/70">证件编号</p>
                          <p className="font-mono font-medium">{cert.number}</p>
                        </div>
                        <div className="flex justify-between text-xs">
                          <div>
                            <p className="text-white/70">签发机关</p>
                            <p className="font-medium">
                              {cert.issueAuthority.slice(0, 4)}...
                            </p>
                          </div>
                          <div>
                            <p className="text-white/70">有效期至</p>
                            <p className="font-medium">
                              {cert.validUntil.slice(0, 7)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {cert.status === 'pending' && (
                        <div className="mt-4 py-2 bg-white/20 rounded-lg text-center text-sm">
                          办理中，请耐心等待
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 证照列表 */}
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-xl border transition-all',
                      cert.status === 'active'
                        ? 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-200 cursor-pointer'
                        : 'bg-gray-50/50 border-gray-100'
                    )}
                    onClick={() =>
                      cert.status === 'active' && setSelectedCert(cert.id)
                    }
                  >
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center',
                        cert.color
                      )}
                    >
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {cert.name}
                        </h3>
                        {cert.status === 'active' ? (
                          <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs font-medium rounded">
                            已生效
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded">
                            办理中
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {cert.issueAuthority}
                      </p>
                    </div>
                    {cert.status === 'active' ? (
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          <Download className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        预计5个工作日
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* 添加到卡包提示 */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">电子证照效力说明</p>
                  <p>
                    根据国家有关规定，电子证照与实体证件具有同等法律效力。
                    您可以将电子证照添加到手机卡包，在政务服务、就医购药等场景出示使用。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 实体证件邮寄 */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-purple-500" />
                实体证件邮寄
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <QrCode className="w-10 h-10 text-purple-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    EMS 快递配送
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    实体证件将通过EMS寄送到您填写的地址
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">
                      快递单号：暂无
                    </span>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs font-medium rounded">
                      待发货
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 常见问题 */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-orange-500" />
                常见问题
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {/* 搜索框 */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索问题关键词..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* 分类标签 */}
              <div className="flex flex-wrap gap-2">
                {faqCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
                      activeCategory === category
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* FAQ列表 */}
              <div className="space-y-2">
                {filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="border border-gray-200 rounded-xl overflow-hidden transition-all hover:border-blue-200"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="font-medium text-gray-900">
                          {faq.question}
                        </span>
                      </div>
                      {expandedFaq === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="px-5 pb-4 pl-14">
                        <div className="pt-2 border-t border-gray-100">
                          <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded mb-2">
                            {faq.category}
                          </span>
                          <p className="text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredFaqs.length === 0 && (
                <div className="text-center py-8">
                  <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">没有找到相关问题</p>
                </div>
              )}
            </div>
          </div>

          {/* 人工咨询 */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-6 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Phone className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">还有疑问？</h3>
                  <p className="text-blue-100 text-sm">
                    人工客服为您解答，工作日 9:00-17:00
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-colors flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  在线咨询
                </button>
                <button className="px-5 py-2.5 bg-white text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  12345
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 证照详情弹窗 */}
      {selectedCert && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const cert = certificates.find((c) => c.id === selectedCert);
              if (!cert) return null;

              return (
                <>
                  <div className={cn('p-6 text-white bg-gradient-to-br', cert.color)}>
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <p className="text-sm text-white/80 mb-1">{cert.type}</p>
                        <h3 className="text-2xl font-bold">{cert.name}</h3>
                      </div>
                      <button
                        onClick={() => setSelectedCert(null)}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="bg-white/20 rounded-2xl p-4 mb-4">
                      <div className="flex items-center justify-center mb-3">
                        <QrCode className="w-24 h-24 text-white" />
                      </div>
                      <p className="text-center text-sm text-white/80">
                        扫码核验证照真伪
                      </p>
                    </div>

                    <p className="font-mono text-lg text-center tracking-wider">
                      {cert.number}
                    </p>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">持有人</p>
                        <p className="font-medium text-gray-900">张小宝</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">签发日期</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(cert.issueDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">签发机关</p>
                        <p className="font-medium text-gray-900">
                          {cert.issueAuthority}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">有效期至</p>
                        <p className="font-medium text-gray-900">{cert.validUntil}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
                        <Download className="w-5 h-5" />
                        下载证照
                      </button>
                      <button className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                        <Share2 className="w-5 h-5" />
                        分享
                      </button>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
                      <Shield className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-green-700">
                        本电子证照已通过国家政务服务平台认证，与实体证件具有同等法律效力
                      </span>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
