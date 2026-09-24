import React, { useState } from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { Product } from '../../types/ecommerce';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { CartDrawer } from './CartDrawer';
import { CheckoutModal } from './CheckoutModal';
import { OrderTrackingView } from './OrderTrackingView';
import { CustomerNotifications } from './CustomerNotifications';
import { 
  Search, 
  ShoppingBag, 
  Bell, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  Clock, 
  Tag, 
  SlidersHorizontal,
  ChevronLeft
} from 'lucide-react';

export const CustomerApp: React.FC = () => {
  const { 
    products, 
    cartTotal, 
    orders, 
    activeOrder, 
    setActiveOrder, 
    isMobileFrame,
    notifications 
  } = useEcosystem();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeCoupon, setActiveCoupon] = useState<string | undefined>(undefined);
  const [isTrackingMode, setIsTrackingMode] = useState(false);

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const categories = [
    { id: 'all', label: 'جميع المنتجات' },
    { id: 'fashion', label: 'أزياء ورياضة' },
    { id: 'electronics', label: 'إلكترونيات وسماعات' },
    { id: 'perfumes', label: 'عطور وجمال' },
    { id: 'accessories', label: 'إكسسوارات وشواحن' },
  ];

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOrderSuccess = (orderId: string) => {
    setIsTrackingMode(true);
  };

  const handleSelectOrderFromNotif = (orderId: string) => {
    const ord = orders.find(o => o.id === orderId);
    if (ord) {
      setActiveOrder(ord);
      setIsTrackingMode(true);
    }
  };

  // Main Customer Content
  const appContent = (
    <div className="min-h-full flex flex-col bg-[#0f1118] text-slate-100">
      {/* Mini-Noon Header within Customer View */}
      <div className="sticky top-0 z-30 bg-[#141622]/95 backdrop-blur border-b border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Brand & Tagline */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-black flex items-center justify-center font-bold text-sm shadow">
              noon
            </div>
            <div>
              <div className="text-xs font-bold text-white leading-tight">نون مصر</div>
              <div className="text-[10px] text-amber-400 font-medium">توصيل سريع للقاهرة والجيزة</div>
            </div>
          </div>

          {/* User actions: Order Tracker shortcut, Notifications, Cart */}
          <div className="flex items-center gap-2">
            {orders.length > 0 && (
              <button
                onClick={() => setIsTrackingMode(!isTrackingMode)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  isTrackingMode 
                    ? 'bg-amber-400 text-black font-bold' 
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-400'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {isTrackingMode ? 'كتالوج المنتجات' : 'تتبع طلباتي'}
                </span>
                <span className="font-mono-nums">({orders.length})</span>
              </button>
            )}

            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              title="الإشعارات"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-black font-bold text-[10px] rounded-full flex items-center justify-center font-mono-nums">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition-all shadow-md shadow-amber-400/10"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="font-mono-nums font-extrabold">{cartTotal.itemsCount}</span>
            </button>
          </div>
        </div>

        {/* Instant Search Bar */}
        {!isTrackingMode && (
          <div className="mt-3 relative">
            <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث عن نايكي إير ماكس، ساعة ذكية، عطور، سماعات..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pr-9 pl-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>
        )}
      </div>

      {/* Main Body */}
      <div className="flex-1 p-4 max-w-6xl mx-auto w-full">
        {isTrackingMode && activeOrder ? (
          <OrderTrackingView
            order={activeOrder}
            onBackToShopping={() => setIsTrackingMode(false)}
          />
        ) : (
          <div className="space-y-6">
            {/* Promotional Hero Card */}
            <div className="relative rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-slate-900 border border-amber-400/30 p-5 overflow-hidden">
              <div className="relative z-10 max-w-lg space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400 text-black text-[11px] font-bold px-2 py-0.5 rounded">
                    عروض الموسم
                  </span>
                  <span className="text-xs text-amber-300">
                    استخدم كود <b className="font-mono text-white">NOON10</b> لخصم 10%
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  أحدث منتجات الإلكترونيات والأزياء مع شحن مجاني
                </h1>
                <p className="text-xs text-slate-300 leading-relaxed">
                  توصيل فوري في نفس اليوم والدفع عند الاستلام كاش أو فيزا عند الباب.
                </p>
              </div>

              {/* Decorative Accent */}
              <div className="absolute left-4 -bottom-6 opacity-15 pointer-events-none">
                <span className="text-9xl font-black text-amber-400">noon</span>
              </div>
            </div>

            {/* Category Filter Pills (Interactive Buttons) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-amber-400 text-black shadow-sm'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div>
              <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
                <span>المعروض: {filteredProducts.length} منتج متاح للطلب الفوري</span>
                <span>الأسعار بالجنيه المصري (EGP)</span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
                  <p className="text-slate-400 text-sm">لم نجد منتجات مطابقة لبحثك</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="mt-2 text-xs text-amber-400 underline"
                  >
                    عرض كل المنتجات
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOpenDetails={p => setSelectedProduct(p)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Bar for Cart on Mobile if items exist */}
      {!isTrackingMode && cartTotal.itemsCount > 0 && !isCartOpen && (
        <div className="sticky bottom-3 mx-4 z-20">
          <div 
            onClick={() => setIsCartOpen(true)}
            className="bg-amber-400 hover:bg-amber-300 text-black px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-black text-amber-400 rounded-lg flex items-center justify-center font-bold text-xs font-mono-nums">
                {cartTotal.itemsCount}
              </div>
              <span className="text-xs font-bold">عرض سلة المشتريات</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-black font-mono-nums">
              <span>{cartTotal.total.toLocaleString('ar-EG')} ج.م</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={coupon => {
          setActiveCoupon(coupon);
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        couponCode={activeCoupon}
        onOrderSuccess={handleOrderSuccess}
      />

      <CustomerNotifications
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectOrder={handleSelectOrderFromNotif}
      />
    </div>
  );

  // Render inside Flutter Mobile Frame if toggled
  if (isMobileFrame) {
    return (
      <div className="py-6 px-4 flex justify-center items-center bg-[#0a0c12]">
        <div className="relative w-full max-w-[390px] h-[844px] bg-black rounded-[48px] p-3 shadow-2xl border-4 border-slate-700 overflow-hidden flex flex-col">
          {/* Phone Dynamic Island / Speaker */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-800" />
          </div>

          {/* Screen area */}
          <div className="relative flex-1 rounded-[38px] overflow-hidden flex flex-col bg-[#0f1118]">
            <div className="flex-1 overflow-y-auto">
              {appContent}
            </div>
          </div>

          {/* Bottom Bar indicator */}
          <div className="w-32 h-1 bg-slate-600 rounded-full mx-auto mt-2 shrink-0" />
        </div>
      </div>
    );
  }

  // Full Desktop Viewport
  return appContent;
};
