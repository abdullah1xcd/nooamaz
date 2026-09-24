import React from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { ViewPerspective } from '../../types/ecommerce';
import { 
  Smartphone, 
  LayoutDashboard, 
  Workflow, 
  Database, 
  Map, 
  RotateCcw, 
  ShoppingBag, 
  Bell 
} from 'lucide-react';

export const TopNavigation: React.FC = () => {
  const { 
    currentPerspective, 
    setCurrentPerspective, 
    isMobileFrame, 
    setIsMobileFrame, 
    cartTotal, 
    orders, 
    resetToInitialDemo,
    notifications
  } = useEcosystem();

  const unreadCount = notifications.filter(n => !n.read).length;
  const activeOrdersCount = orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length;

  const navItems: { id: ViewPerspective; label: string; icon: React.ReactNode; badge?: string }[] = [
    { 
      id: 'CUSTOMER', 
      label: 'تطبيق العميل (Mini-Noon)', 
      icon: <ShoppingBag className="w-4 h-4" />,
      badge: cartTotal.itemsCount > 0 ? `${cartTotal.itemsCount}` : undefined
    },
    { 
      id: 'ADMIN', 
      label: 'لوحة تحكم الإدارة (Admin)', 
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: activeOrdersCount > 0 ? `${activeOrdersCount} نشط` : undefined
    },
    { 
      id: 'AUTOMATION', 
      label: 'محرك الأوتوميشن (n8n & Webhooks)', 
      icon: <Workflow className="w-4 h-4" />
    },
    { 
      id: 'BACKEND', 
      label: 'معمارية الباك إند (NestJS + Postgres)', 
      icon: <Database className="w-4 h-4" /> 
    },
    { 
      id: 'ROADMAP', 
      label: 'خريطة التنفيذ (8 مراحل)', 
      icon: <Map className="w-4 h-4" /> 
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#12141c]/95 backdrop-blur border-b border-slate-800/80 px-4 lg:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-amber-400 text-black flex items-center justify-center font-bold text-lg shadow-sm">
            N
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white">
                Mini-Noon
              </span>
              <span className="text-xs text-amber-400 font-mono-nums px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                E-Commerce Architecture
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links / Perspective Tabs */}
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-900/80 border border-slate-800 rounded-xl">
          {navItems.map(item => {
            const isActive = currentPerspective === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPerspective(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-400 text-black shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono-nums ${
                      isActive ? 'bg-black/20 text-black' : 'bg-slate-800 text-amber-400 border border-amber-400/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Quick Action Affordances */}
        <div className="flex items-center gap-2">
          {currentPerspective === 'CUSTOMER' && (
            <button
              onClick={() => setIsMobileFrame(!isMobileFrame)}
              title={isMobileFrame ? 'عرض كصفحة ويب كاملة' : 'عرض داخل شاشة هاتف محمول (Flutter)'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border transition-colors ${
                isMobileFrame 
                  ? 'bg-amber-400/15 text-amber-300 border-amber-400/40' 
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isMobileFrame ? 'شاشة الموبايل' : 'عرض متجاوب'}
              </span>
            </button>
          )}

          <button
            onClick={() => {
              if (confirm('هل تريد إعادة تعيين بيانات التجربة (الطلبات والمخزون) للوضع الابتدائي؟')) {
                resetToInitialDemo();
              }
            }}
            title="إعادة تعيين بيانات العرض التوضيحي"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg border border-slate-800/80 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile Perspective Navigation Row */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto pt-2 pb-1 border-t border-slate-800/50 mt-2 scrollbar-none">
        {navItems.map(item => {
          const isActive = currentPerspective === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPerspective(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-amber-400 text-black font-semibold'
                  : 'text-slate-400 hover:text-slate-100 bg-slate-900/60'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[10px] px-1 rounded bg-black/20">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
