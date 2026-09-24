import React from 'react';
import { Product } from '../../types/ecommerce';
import { useEcosystem } from '../../context/EcosystemContext';
import { ShoppingBag, Star, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { addToCart, cart } = useEcosystem();
  const [justAdded, setJustAdded] = React.useState(false);

  const cartItem = cart.find(c => c.product.id === product.id);
  const currentQuantityInCart = cartItem?.quantity || 0;
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const ok = addToCart(product, 1);
    if (ok) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    }
  };

  return (
    <div 
      onClick={() => onOpenDetails(product)}
      className="group relative bg-[#181a24] border border-slate-800/80 rounded-2xl overflow-hidden hover:border-amber-400/40 hover:shadow-xl hover:shadow-amber-400/5 transition-all duration-200 cursor-pointer flex flex-col"
    >
      {/* Product Image Slot */}
      <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden flex items-center justify-center p-3">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />

        {/* Brand Kicker or Badge */}
        {product.badge && (
          <div className="absolute top-2.5 right-2.5 bg-amber-400 text-black text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
            {product.badge}
          </div>
        )}

        {/* Stock warning */}
        {product.stock <= 4 && product.stock > 0 && (
          <div className="absolute bottom-2 right-2 text-[10px] font-medium text-amber-300 bg-amber-950/80 border border-amber-500/30 px-2 py-0.5 rounded">
            متبقي {product.stock} فقط
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-xs font-bold text-red-300 px-2.5 py-1 rounded bg-red-950/90 border border-red-800/50">
              نفذت الكمية بالمخزن
            </span>
          </div>
        )}
      </div>

      {/* Content Block */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-medium text-slate-400">{product.brand} · {product.categoryNameAr}</span>
            <div className="flex items-center gap-1 text-amber-400 font-mono-nums text-[11px]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-500">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-bold text-slate-100 line-clamp-2 leading-relaxed group-hover:text-amber-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
            {product.nameEn}
          </p>
        </div>

        {/* Price & Action Module */}
        <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-amber-400 font-mono-nums">
                {product.price.toLocaleString('ar-EG')}
              </span>
              <span className="text-xs text-slate-400">ج.م</span>
            </div>
            {product.originalPrice && (
              <div className="text-[11px] text-slate-400 line-through font-mono-nums">
                {product.originalPrice.toLocaleString('ar-EG')} ج.م
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              isOutOfStock
                ? 'bg-slate-800/60 text-slate-600 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'bg-amber-400 hover:bg-amber-300 text-black shadow-md shadow-amber-400/10'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>أُضيف!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{currentQuantityInCart > 0 ? `أضف (${currentQuantityInCart})` : 'أضف للسلة'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
