import React, { useState } from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { PaymentMethod, Address } from '../../types/ecommerce';
import { 
  X, 
  MapPin, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2 
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  couponCode?: string;
  onOrderSuccess: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  couponCode,
  onOrderSuccess
}) => {
  const { cart, cartTotal, createOrder } = useEcosystem();

  const [address, setAddress] = useState<Address>({
    fullName: 'أحمد محمد خليل',
    phone: '01012345678',
    city: 'القاهرة',
    area: 'مدينة نصر',
    street: 'شارع عباس العقاد - عمارة 42 الدور 5',
    building: 'شقة 12'
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH_ON_DELIVERY');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const discountAmount = couponCode === 'NOON10' ? Math.round(cartTotal.subtotal * 0.1) : 0;
  const finalTotal = Math.max(0, cartTotal.subtotal + cartTotal.shippingFee - discountAmount);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);

    // Simulate network latency of NestJS backend API call (e.g. 450ms)
    setTimeout(() => {
      const createdOrder = createOrder({
        address,
        paymentMethod,
        couponCode
      });
      setIsSubmitting(false);
      onClose();
      onOrderSuccess(createdOrder.id);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-[#141622] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl my-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-black flex items-center justify-center font-bold text-sm">
              ✓
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">إتمام الطلب والدفع</h2>
              <p className="text-[11px] text-slate-400">حدد عنوان التوصيل وطريقة الدفع المناسبة لك</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="p-5 space-y-5">
          {/* Section 1: Delivery Address */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 mb-3">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>1. عنوان التوصيل في مصر</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">الاسم الكامل للمستلم</label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={e => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">رقم الهاتف للتواصل</label>
                <input
                  type="tel"
                  required
                  value={address.phone}
                  onChange={e => setAddress({ ...address, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">المحافظة / المدينة</label>
                <select
                  value={address.city}
                  onChange={e => setAddress({ ...address, city: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="القاهرة">القاهرة</option>
                  <option value="الجيزة">الجيزة</option>
                  <option value="الإسكندرية">الإسكندرية</option>
                  <option value="المنصورة">المنصورة</option>
                  <option value="طنطا">طنطا</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">المنطقة / الحي</label>
                <input
                  type="text"
                  required
                  value={address.area}
                  onChange={e => setAddress({ ...address, area: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 text-[11px] mb-1">الشارع والعمارة والشقة بالتفصيل</label>
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={e => setAddress({ ...address, street: e.target.value })}
                  placeholder="اسم الشارع، رقم العمارة، رقم الطابق والشقة"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 mb-3">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>2. طريقة الدفع</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Cash on Delivery */}
              <label 
                className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Banknote className="w-4 h-4" />
                  <input
                    type="radio"
                    name="payment"
                    value="CASH_ON_DELIVERY"
                    checked={paymentMethod === 'CASH_ON_DELIVERY'}
                    onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                    className="accent-amber-400"
                  />
                </div>
                <span className="text-xs font-bold">الدفع عند الاستلام</span>
                <span className="text-[10px] text-slate-400 mt-0.5">سدد نقداً للمندوب</span>
              </label>

              {/* Credit Card */}
              <label 
                className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'CREDIT_CARD'
                    ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <CreditCard className="w-4 h-4" />
                  <input
                    type="radio"
                    name="payment"
                    value="CREDIT_CARD"
                    checked={paymentMethod === 'CREDIT_CARD'}
                    onChange={() => setPaymentMethod('CREDIT_CARD')}
                    className="accent-amber-400"
                  />
                </div>
                <span className="text-xs font-bold">بطاقة بنكية / ميزة</span>
                <span className="text-[10px] text-slate-400 mt-0.5">فيزا / ماستركارد</span>
              </label>

              {/* Vodafone Cash */}
              <label 
                className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'VODAFONE_CASH'
                    ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Smartphone className="w-4 h-4" />
                  <input
                    type="radio"
                    name="payment"
                    value="VODAFONE_CASH"
                    checked={paymentMethod === 'VODAFONE_CASH'}
                    onChange={() => setPaymentMethod('VODAFONE_CASH')}
                    className="accent-amber-400"
                  />
                </div>
                <span className="text-xs font-bold">محافظ إلكترونية</span>
                <span className="text-[10px] text-slate-400 mt-0.5">فودافون كاش / إنستاباي</span>
              </label>
            </div>
          </div>

          {/* Section 3: Summary breakdown */}
          <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>الأصناف ({cart.length}):</span>
              <span className="font-mono-nums">{cartTotal.subtotal.toLocaleString('ar-EG')} ج.م</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>تكلفة الشحن:</span>
              <span className="font-mono-nums text-emerald-400">
                {cartTotal.shippingFee === 0 ? 'مجاني' : `${cartTotal.shippingFee} ج.م`}
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex items-center justify-between text-emerald-400">
                <span>خصم الكوبون ({couponCode}):</span>
                <span className="font-mono-nums">- {discountAmount.toLocaleString('ar-EG')} ج.م</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-sm font-bold text-white">
              <span>المجموع الكلي المطلوب:</span>
              <span className="text-base text-amber-400 font-mono-nums">
                {finalTotal.toLocaleString('ar-EG')} ج.م
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-xl shadow-lg shadow-amber-400/10 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>جاري تسجيل الطلب في قاعدة البيانات...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تأكيد الطلب الآن ({finalTotal.toLocaleString('ar-EG')} ج.م)</span>
                </>
              )}
            </button>

            <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>سيتم إرسال إشعار فوري بحالة الطلب ورقم التتبع</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
