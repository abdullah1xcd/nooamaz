import React, { useState, useEffect } from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { Order, OrderStatus } from '../../types/ecommerce';
import { 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin, 
  Navigation, 
  PhoneCall, 
  Star, 
  ExternalLink, 
  AlertCircle 
} from 'lucide-react';

interface OrderTrackingViewProps {
  order: Order;
  onBackToShopping: () => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({ order, onBackToShopping }) => {
  const { updateOrderStatus, simulateShippingWebhook, setCurrentPerspective } = useEcosystem();

  // Simulated live courier countdown when status is OUT_FOR_DELIVERY
  const [liveMinutes, setLiveMinutes] = useState(order.courierEtaMinutes || 15);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [selectedStar, setSelectedStar] = useState(5);

  useEffect(() => {
    if (order.status === 'OUT_FOR_DELIVERY') {
      const interval = setInterval(() => {
        setLiveMinutes(prev => {
          if (prev <= 2) {
            // Auto deliver when countdown finishes
            updateOrderStatus(order.id, 'DELIVERED', 'تم تسليم الشحنة للعميل بنجاح بواسطة مندوب التوصيل');
            return 0;
          }
          return prev - 1;
        });
      }, 5000); // changes every 5 seconds for interactive demo feel
      return () => clearInterval(interval);
    }
  }, [order.status, order.id, updateOrderStatus]);

  const steps: { key: OrderStatus; title: string; subtitle: string; icon: React.ReactNode }[] = [
    {
      key: 'CONFIRMED',
      title: 'تم التأكيد والحجز',
      subtitle: 'تم التحقق من المخزون واعتماد الطلب',
      icon: <CheckCircle2 className="w-4 h-4" />
    },
    {
      key: 'PREPARING',
      title: 'جاري التجهيز والتغليف',
      subtitle: 'يتم تجميع الأصناف داخل مستودع نون',
      icon: <Package className="w-4 h-4" />
    },
    {
      key: 'SHIPPED',
      title: 'تم الشحن مع الناقل',
      subtitle: `رقم الشحنة: ${order.trackingNumber || 'EG-89412-NOON'}`,
      icon: <Truck className="w-4 h-4" />
    },
    {
      key: 'OUT_FOR_DELIVERY',
      title: 'خرج للتوصيل مع المندوب',
      subtitle: `الوقت المتبقي للوصول: ${liveMinutes} دقيقة`,
      icon: <Navigation className="w-4 h-4" />
    },
    {
      key: 'DELIVERED',
      title: 'تم التوصيل بنجاح',
      subtitle: 'استلمت الشحنة بنجاح',
      icon: <CheckCircle2 className="w-4 h-4" />
    }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === order.status);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in p-4">
      {/* Top Banner / Hero */}
      <div className="bg-[#151824] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-nums text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                {order.orderNumber}
              </span>
              <span className="text-xs text-slate-400">
                {new Date(order.createdAt).toLocaleDateString('ar-EG')}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mt-1">
              تتبع مسار الطلب لحظة بلحظة
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              المستلم: {order.customerName} · {order.address.city} - {order.address.area}
            </p>
          </div>

          <button
            onClick={onBackToShopping}
            className="self-start sm:self-auto px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors border border-slate-700"
          >
            ← العودة للتسوق
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div className="mt-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
            {steps.map((step, idx) => {
              const isPast = currentStepIndex > idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div 
                  key={step.key}
                  className={`p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-amber-400/10 border-amber-400 text-amber-300 shadow-lg shadow-amber-400/5'
                      : isPast
                      ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                      : 'bg-slate-900/30 border-slate-900 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      isCurrent 
                        ? 'bg-amber-400 text-black font-bold animate-pulse' 
                        : isPast 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-slate-800 text-slate-600'
                    }`}>
                      {step.icon}
                    </div>
                    <span className="text-xs font-bold truncate">{step.title}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    {step.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Out for delivery / Live Courier Simulation Card (Prompt Section 15 & 16) */}
      {order.status === 'OUT_FOR_DELIVERY' && (
        <div className="bg-gradient-to-br from-amber-500/10 via-[#151824] to-[#12141c] border border-amber-400/30 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black">
                <Truck className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-400">مندوب نون يقترب من موقعك!</div>
                <div className="text-sm font-black text-white">
                  الوقت التقديري للوصول: {liveMinutes} دقيقة
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a 
                href="tel:0100000000"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span>اتصال بالمندوب</span>
              </a>
            </div>
          </div>

          {/* Interactive Simulated Map */}
          <div className="relative h-44 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
            {/* Street Grid Graphic */}
            <div className="absolute inset-0 opacity-25">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#64748b" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                {/* Simulated Road Path */}
                <path 
                  d="M 50 120 Q 200 40, 380 90 T 600 50" 
                  fill="none" 
                  stroke="#fbbf24" 
                  strokeWidth="4" 
                  strokeDasharray="6,6"
                  className="animate-pulse"
                />
              </svg>
            </div>

            {/* Courier Marker */}
            <div 
              className="absolute z-10 flex flex-col items-center transition-all duration-1000"
              style={{
                left: `${Math.min(75, 20 + (15 - liveMinutes) * 4)}%`,
                top: '38%'
              }}
            >
              <div className="bg-amber-400 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow mb-1 flex items-center gap-1">
                <span>المندوب: محمود</span>
                <span className="font-mono-nums">({liveMinutes}m)</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-lg shadow-amber-400/30">
                <Truck className="w-4 h-4" />
              </div>
            </div>

            {/* Customer Location Marker */}
            <div className="absolute right-12 top-10 z-10 flex flex-col items-center">
              <div className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow mb-1">
                موقعك: {order.address.area}
              </div>
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delivered Feedback State (Section 17 of Prompt) */}
      {order.status === 'DELIVERED' && (
        <div className="bg-[#151824] border border-emerald-500/30 rounded-2xl p-6 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">🎉 تم تسليم طلبك بنجاح!</h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
              تم تسليم الشحنة للعميل {order.customerName}. نأمل أن تكون تجربتك مع نون ممتازة!
            </p>
          </div>

          {!ratingSubmitted ? (
            <div className="p-4 bg-slate-900 rounded-xl max-w-sm mx-auto border border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-slate-200">ما تقييمك لتجربة الشراء والتوصيل؟</div>
              <div className="flex justify-center gap-1.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setSelectedStar(star)}
                    className="p-1 text-slate-600 hover:text-amber-400 transition-colors"
                  >
                    <Star 
                      className={`w-6 h-6 ${
                        star <= selectedStar ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                      }`} 
                    />
                  </button>
                ))}
              </div>
              <button
                onClick={() => setRatingSubmitted(true)}
                className="px-4 py-1.5 bg-amber-400 text-black text-xs font-bold rounded-lg hover:bg-amber-300"
              >
                إرسال التقييم
              </button>
            </div>
          ) : (
            <div className="text-xs text-emerald-400 font-semibold bg-emerald-950/30 border border-emerald-800/30 py-2 px-4 rounded-xl inline-block">
              شكراً جزيلاً! تم حفظ تقييمك بنجاح.
            </div>
          )}
        </div>
      )}

      {/* Simulator Shortcut Box (Allows testing status transition directly or via Admin) */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>لوحة تحكم مهندس البرمجيات (Developer State Simulator)</span>
          </div>
          <button
            onClick={() => setCurrentPerspective('ADMIN')}
            className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>أو انتقل إلى لوحة تحكم Admin</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
          يمكنك محاكاة دورة حياة الطلب وتدفق أحداث الـWebhooks و n8n بالنقر على الأزرار أدناه:
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateOrderStatus(order.id, 'PREPARING', 'تم قبول الطلب وبدء التجهيز')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              order.status === 'PREPARING'
                ? 'bg-amber-400 text-black font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            1. بدء التجهيز بالمستودع
          </button>

          <button
            onClick={() => simulateShippingWebhook(order.id, 'SHIPPED')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              order.status === 'SHIPPED'
                ? 'bg-amber-400 text-black font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            2. شحن مع شركة التوصيل (Webhook)
          </button>

          <button
            onClick={() => simulateShippingWebhook(order.id, 'OUT_FOR_DELIVERY')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              order.status === 'OUT_FOR_DELIVERY'
                ? 'bg-amber-400 text-black font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            3. خروج للتوصيل (Out For Delivery + ETA)
          </button>

          <button
            onClick={() => simulateShippingWebhook(order.id, 'DELIVERED')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              order.status === 'DELIVERED'
                ? 'bg-emerald-500 text-white font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            4. تم التسليم (Delivered + Review)
          </button>
        </div>
      </div>

      {/* Order Itemized Receipt & Timeline Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Items list */}
        <div className="bg-[#151824] border border-slate-800 rounded-2xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-300">محتويات الطلب</h3>
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 bg-slate-900/60 rounded-xl border border-slate-800">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 object-contain rounded-lg bg-slate-800 p-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">{item.productName}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">الكمية: {item.quantity} × {item.price.toLocaleString('ar-EG')} ج.م</div>
                </div>
                <div className="text-xs font-bold text-amber-400 font-mono-nums">
                  {(item.price * item.quantity).toLocaleString('ar-EG')} ج.م
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-1 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>المجموع الفرعي:</span>
              <span className="font-mono-nums">{order.subtotal.toLocaleString('ar-EG')} ج.م</span>
            </div>
            <div className="flex justify-between">
              <span>رسوم الشحن:</span>
              <span className="font-mono-nums text-emerald-400">
                {order.shippingFee === 0 ? 'مجاني' : `${order.shippingFee} ج.م`}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>الخصم:</span>
                <span className="font-mono-nums">- {order.discount.toLocaleString('ar-EG')} ج.م</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-white pt-1.5 border-t border-slate-800">
              <span>الإجمالي الكلي:</span>
              <span className="text-amber-400 font-mono-nums">{order.total.toLocaleString('ar-EG')} ج.م</span>
            </div>
          </div>
        </div>

        {/* Timeline Log */}
        <div className="bg-[#151824] border border-slate-800 rounded-2xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-300">سجل تتبع الأحداث (Timeline Events)</h3>
          <div className="space-y-3">
            {order.timeline.map((entry, idx) => (
              <div key={idx} className="flex gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <div>
                  <div className="font-bold text-slate-200">{entry.label}</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{entry.timestamp}</span>
                  </div>
                  {entry.note && (
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      {entry.note}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
