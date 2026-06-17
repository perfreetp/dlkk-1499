import { Phone, Mail, MapPin, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">出生一件事联办</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              一站式新生儿政务服务平台，让新手父母少跑腿、好办事。
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">快速入口</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  首页引导
                </a>
              </li>
              <li>
                <a href="/materials" className="hover:text-white transition-colors">
                  材料准备
                </a>
              </li>
              <li>
                <a href="/apply" className="hover:text-white transition-colors">
                  联合申报
                </a>
              </li>
              <li>
                <a href="/progress" className="hover:text-white transition-colors">
                  进度中心
                </a>
              </li>
              <li>
                <a href="/result" className="hover:text-white transition-colors">
                  结果领取
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">联系我们</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>服务热线：12345</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>service@example.gov.cn</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5" />
                <span>市民服务中心政务大厅</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">安全保障</h4>
            <div className="flex items-start gap-2">
              <Shield className="w-5 h-5 text-green-400 mt-0.5" />
              <p className="text-sm text-gray-400 leading-relaxed">
                本平台采用国家政务服务统一安全认证，您的个人信息将受到严格保护。
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>© 2024 市人民政府政务服务中心 版权所有</p>
          <p className="mt-1">技术支持：市大数据中心</p>
        </div>
      </div>
    </footer>
  );
}
