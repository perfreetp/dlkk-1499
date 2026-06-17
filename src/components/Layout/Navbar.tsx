import { NavLink, useLocation } from 'react-router-dom';
import { Baby, User, HelpCircle, Phone } from 'lucide-react';
import { applicationSteps } from '@/data/mockData';
import { cn } from '@/utils/helpers';

export default function Navbar() {
  const location = useLocation();

  const getStepIndex = (path: string) => {
    const pathMap: Record<string, number> = {
      '/': 0,
      '/materials': 1,
      '/apply': 2,
      '/progress': 3,
      '/result': 4,
    };
    return pathMap[path] ?? 0;
  };

  const currentStepIndex = getStepIndex(location.pathname);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Baby className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">出生一件事</h1>
              <p className="text-xs text-gray-500">联办服务平台</p>
            </div>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1">
            {applicationSteps.map((step, index) => (
              <NavLink
                key={step.id}
                to={step.id === 'home' ? '/' : `/${step.id}`}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    'flex items-center gap-2',
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  )
                }
              >
                <span
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                    currentStepIndex >= index
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  )}
                >
                  {index + 1}
                </span>
                {step.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              <div className="w-7 h-7 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                张先生
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
