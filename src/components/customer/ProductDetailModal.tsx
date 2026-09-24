import React, { useState } from 'react';
import { Product } from '../../types/ecommerce';
import { useEcosystem } from '../../context/EcosystemContext';
import { 
  X, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  Plus, 
  Minus 
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenCart: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product, 
  onClose,
  onOpenCart 
}) => {
  const { addToCart, cart } = useEcosystem();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if (!product) return null;

  const inCart = cart.find(c => c.product.id === product.id);
  const maxAvailable = product.stock - (inCart?.quantity || 0);
  const isOutOfStock = product.stock <= 0;

  const handleAdd = () => {
    if (isOutOfStock || maxAvailable <= 0) return;
    const ok = addToCart(product, quantity);
    if (ok) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-[#161822] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Image Gallery */}
            <div className="relative aspect-square bg-slate-900/80 rounded-xl p-4 flex items-center justify-center border border-slate-800">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
              {product.badge && (
                <span className="absolute top-3 right-3 bg-amber-400 text-black text-xs font-bold px-2 py-0.5 rounded">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Product Meta & Details */}
            <div className="space-y-4">
              <div>
                <div className="text-xs text-amber-400 font-semibold tracking-wide">
                  {product.brand} · {product.categoryNameAr}
                </div>
                <h2 className="text-lg font-bold text-white mt-1 leading-snug">
                  {product.name}
                </h2>
                <div className="text-xs text-slate-400 mt-0.5">
                  {product.nameEn}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold font-mono-nums">{product.rating}</span>
                </div>
                <span>·</span>
                <span>{product.reviewsCount} تقييم موثق من المشترين</span>
              </div>

              {/* Price Module */}
              <div className="p-3 bg-slate-900/70 border border-slate-800/80 rounded-xl flex items-baseline justify-between">
                <div>
                  <div className="text-2xl font-black text-amber-400 font-mono-nums">
                    {product.price.toLocaleString('ar-EG')}{' '}
                    <span className="text-xs font-normal text-slate-300">ج.م</span>
                  </div>
                  {product.originalPrice && (
                    <div className="text-xs text-slate-400 line-through font-mono-nums mt-0.5">
                      {product.originalPrice.toLocaleString('ar-EG')} ج.م
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    product.stock > 5 ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/30' :
                    product.stock > 0 ? 'text-amber-400 bg-amber-950/40 border border-amber-800/30' :
                    'text-red-400 bg-red-950/40 border border-red-800/30'
                  }`}>
                    {product.stock > 0 ? `متوفر بالمستودع (${product.stock})` : 'نفذت الكمية'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {product.description}
              </p>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>شحن سريع خلال 24 ساعة</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>منتج أصلي 100% ومضمون</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>إرجاع مجاني خلال 14 يوم</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Action Bar */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1 || isOutOfStock}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-bold font-mono-nums text-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock || isOutOfStock}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2 flex-1">
              <button
                onClick={handleAdd}
                disabled={isOutOfStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md ${
                  isOutOfStock
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : justAdded
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-400 hover:bg-amber-300 text-black shadow-amber-400/10'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>تمت الإضافة للسلة بنجاح</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>إضافة إلى سلة الشراء ({(product.price * quantity).toLocaleString('ar-EG')} ج.م)</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  handleAdd();
                  onClose();
                  onOpenCart();
                }}
                disabled={isOutOfStock}
                className="py-3 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors whitespace-nowrap"
              >
                شراء فوري
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
