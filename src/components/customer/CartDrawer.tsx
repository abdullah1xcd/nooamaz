import React, { useState } from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowLeft, 
  Tag, 
  Check, 
  ShieldCheck 
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: (appliedCoupon?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  onProceedToCheckout 
}) => {
  const { cart, removeFromCart, updateCartQuantity, cartTotal } = useEcosystem();
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim().toUpperCase() === 'NOON10') {
      setAppliedCoupon('NOON10');
      setCouponError(null);
    } else {
      setCouponError('كود الخصم غير صالح. جرب كود NOON10 للحصول على 10% خصم.');
    }
  };

  const discountAmount = appliedCoupon === 'NOON10' ? Math.round(cartTotal.subtotal * 0.1) : 0;
  const finalTotal = Math.max(0, cartTotal.subtotal + cartTotal.shippingFee - discountAmount);
  const freeShippingThreshold = 1000;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartTotal.subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-fade-in flex justify-end">
      <div 
        className="w-full max-w-md bg-[#141620] border-r border-slate-800 h-full flex flex-col shadow-2xl animate-slide-left"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">
              سلة المشتريات ({cartTotal.itemsCount})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress bar */}
        <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800/80 text-xs">
          {amountToFreeShipping === 0 ? (
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Check className="w-4 h-4 shrink-0" />
              <span>تهانينا! حصلت على شحن مجاني لكافة طلباتك 🚚</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>الشحن المجاني عند 1,000 ج.م</span>
                <span className="font-mono-nums text-amber-400 font-bold">
                  متبقي {amountToFreeShipping.toLocaleString('ar-EG')} ج.م
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-400 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (cartTotal.subtotal / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Items Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 border border-slate-800">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-200">سلتك فارغة الآن</h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                استكشف تشكيلة منتجات نون المميزة وأضف منتجاتك المفضلة لبدء رحلة الشراء.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 text-xs font-semibold bg-amber-400 text-black rounded-xl hover:bg-amber-300 transition-colors"
              >
                تصفح المنتجات الآن
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div 
                key={item.product.id}
                className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl flex items-center gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="w-16 h-16 rounded-lg bg-slate-800/80 p-1 shrink-0 flex items-center justify-center">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-100 truncate">
                    {item.product.name}
                  </h4>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-mono-nums">
                    {item.product.price.toLocaleString('ar-EG')} ج.م
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5 bg-slate-800/90 rounded-lg p-0.5 border border-slate-700">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold font-mono-nums text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-400 font-mono-nums">
                        {(item.product.price * item.quantity).toLocaleString('ar-EG')} ج.م
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Order Summary */}
        {cart.length > 0 && (
          <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-3">
            {/* Promo Code input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 absolute right-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="كوبون الخصم (مثال: NOON10)"
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-400 border border-slate-700 rounded-xl transition-colors whitespace-nowrap"
              >
                تطبيق
              </button>
            </form>

            {appliedCoupon && (
              <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-800/30 px-3 py-1.5 rounded-lg">
                <span>تم تطبيق الكوبون {appliedCoupon} (خصم 10%)</span>
                <button 
                  onClick={() => setAppliedCoupon(null)}
                  className="text-slate-400 hover:text-white underline text-[11px]"
                >
                  إلغاء
                </button>
              </div>
            )}

            {couponError && (
              <p className="text-[11px] text-red-400">{couponError}</p>
            )}

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span className="font-mono-nums">{cartTotal.subtotal.toLocaleString('ar-EG')} ج.م</span>
              </div>
              <div className="flex justify-between">
                <span>رسوم التوصيل السريع:</span>
                <span className="font-mono-nums">
                  {cartTotal.shippingFee === 0 ? (
                    <span className="text-emerald-400 font-bold">مجاني</span>
                  ) : (
                    `${cartTotal.shippingFee.toLocaleString('ar-EG')} ج.م`
                  )}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>خصم الكوبون:</span>
                  <span className="font-mono-nums">- {discountAmount.toLocaleString('ar-EG')} ج.م</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                <span>الإجمالي النهائي:</span>
                <span className="font-mono-nums text-amber-400 text-base">
                  {finalTotal.toLocaleString('ar-EG')} ج.م
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => onProceedToCheckout(appliedCoupon || undefined)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-xl shadow-lg shadow-amber-400/10 transition-colors"
            >
              <span>متابعة إتمام الطلب</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>دفع آمن ومحمي 100% · ضمان نون الأصلي</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
