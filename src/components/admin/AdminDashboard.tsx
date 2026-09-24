import React, { useState } from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { OrderStatus } from '../../types/ecommerce';
import { 
  Package, 
  DollarSign, 
  ShoppingBag, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowUpRight, 
  Plus, 
  Edit, 
  AlertTriangle, 
  CreditCard, 
  RefreshCw,
  ExternalLink 
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    orders, 
    products, 
    updateOrderStatus, 
    simulateShippingWebhook, 
    simulatePaymentWebhook,
    updateProductStock,
    updateProductPrice,
    addNewProduct,
    setCurrentPerspective
  } = useEcosystem();

  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'webhooks_sim'>('orders');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  // New product form state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdNameEn, setNewProdNameEn] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(1500);
  const [newProdStock, setNewProdStock] = useState(20);
  const [newProdCategory, setNewProdCategory] = useState('electronics');

  // Metrics
  const totalRevenue = orders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((acc, o) => acc + o.total, 0);

  const pendingOrdersCount = orders.filter(o => o.status === 'PENDING').length;
  const activeOrdersCount = orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length;
  const lowStockCount = products.filter(p => p.stock <= 5).length;

  const filteredOrders = orders.filter(o => {
    if (selectedStatusFilter === 'ALL') return true;
    return o.status === selectedStatusFilter;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    addNewProduct({
      name: newProdName,
      nameEn: newProdNameEn || newProdName,
      description: 'منتج جديد تمت إضافته من خلال لوحة تحكم الإدارة.',
      price: Number(newProdPrice),
      stock: Number(newProdStock),
      image: products[0]?.image || '',
      category: newProdCategory,
      categoryNameAr: newProdCategory === 'electronics' ? 'إلكترونيات' : 'أزياء',
      rating: 5.0,
      reviewsCount: 1,
      brand: 'Noon Store'
    });

    setShowAddProductModal(false);
    setNewProdName('');
    setNewProdNameEn('');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-slate-100 animate-fade-in">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141624] border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Next.js Operations Dashboard
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">لوحة تحكم إدارة المتجر والمستودع</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">
            إدارة طلبات ومخزون Mini-Noon
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPerspective('AUTOMATION')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            <span>مشاهدة مسار n8n للأحداث</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#161927] border border-slate-800/90 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>إجمالي المبيعات المؤكدة</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono-nums mt-2">
            {totalRevenue.toLocaleString('ar-EG')} <span className="text-xs text-slate-400 font-normal">ج.م</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+18% مقارنة بالأسبوع الماضي</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#161927] border border-slate-800/90 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>الطلبات النشطة للتجهيز</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono-nums mt-2">
            {activeOrdersCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {pendingOrdersCount > 0 ? `${pendingOrdersCount} طلب بانتظار الاعتماد` : 'جميع الطلبات معتمدة'}
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#161927] border border-slate-800/90 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>تنبيهات المخزون المنخفض</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400 font-mono-nums mt-2">
            {lowStockCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            منتجات أقل من 5 قطع بالمستودع
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#161927] border border-slate-800/90 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>إجمالي المنتجات المعروضة</span>
            <ShoppingBag className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono-nums mt-2">
            {products.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            جاهزة للشراء والتوصيل الفوري
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            activeTab === 'orders'
              ? 'bg-amber-400 text-black shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          قائمة الطلبات ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            activeTab === 'inventory'
              ? 'bg-amber-400 text-black shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          المخزون والأسعار ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('webhooks_sim')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            activeTab === 'webhooks_sim'
              ? 'bg-amber-400 text-black shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          محاكي الـWebhooks الخارجية
        </button>
      </div>

      {/* Tab 1: Orders Board */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {['ALL', 'CONFIRMED', 'PREPARING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map(st => (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors ${
                  selectedStatusFilter === st
                    ? 'bg-slate-700 text-white font-bold'
                    : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {st === 'ALL' ? 'كل الطلبات' : st}
              </button>
            ))}
          </div>

          {/* Orders List */}
          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                لا توجد طلبات مطابقة لهذا الفلتر
              </div>
            ) : (
              filteredOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-[#161927] border border-slate-800 rounded-2xl p-4 sm:p-5 transition-all hover:border-slate-700 space-y-4"
                >
                  {/* Order header row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black font-mono-nums text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {order.customerName}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({order.customerPhone})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        order.status === 'CONFIRMED' ? 'bg-sky-950 text-sky-400 border border-sky-800/40' :
                        order.status === 'PREPARING' ? 'bg-amber-950 text-amber-400 border border-amber-800/40' :
                        order.status === 'SHIPPED' ? 'bg-indigo-950 text-indigo-400 border border-indigo-800/40' :
                        order.status === 'OUT_FOR_DELIVERY' ? 'bg-purple-950 text-purple-400 border border-purple-800/40' :
                        order.status === 'DELIVERED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' :
                        'bg-red-950 text-red-400 border border-red-800/40'
                      }`}>
                        {order.status}
                      </span>

                      <span className="text-xs text-slate-400 font-mono-nums">
                        {new Date(order.createdAt).toLocaleTimeString('ar-EG')}
                      </span>
                    </div>
                  </div>

                  {/* Order Items & Address breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Items */}
                    <div className="md:col-span-2 space-y-1.5">
                      <div className="text-slate-400 font-semibold mb-1">الأصناف المطلوبة:</div>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-1.5 bg-slate-900/60 rounded-lg">
                          <span className="text-slate-200">
                            {item.quantity}× {item.productName}
                          </span>
                          <span className="font-mono-nums text-amber-400">
                            {(item.price * item.quantity).toLocaleString('ar-EG')} ج.م
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Delivery & Payment details */}
                    <div className="p-3 bg-slate-900/70 rounded-xl space-y-1.5 border border-slate-800">
                      <div className="flex justify-between">
                        <span className="text-slate-400">عنوان التوصيل:</span>
                        <span className="text-slate-200 font-medium truncate max-w-[140px]" title={order.address.street}>
                          {order.address.city} - {order.address.area}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">طريقة الدفع:</span>
                        <span className="text-amber-400 font-medium">
                          {order.paymentMethod === 'CASH_ON_DELIVERY' ? 'الدفع نقداً عند الاستلام' : 'بطاقة إلكترونية'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">حالة السداد:</span>
                        <span className={order.paymentStatus === 'PAID' ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                          {order.paymentStatus === 'PAID' ? 'تم الدفع ✓' : 'غير مدفوع بعد'}
                        </span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-800 text-sm font-bold">
                        <span>الإجمالي:</span>
                        <span className="text-amber-400 font-mono-nums">
                          {order.total.toLocaleString('ar-EG')} ج.م
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions row for Admin (Accept, Prepare, Ship, Out For Delivery, Deliver, Cancel) */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-[11px] text-slate-400">
                      إجراءات مسار العمل (Workflow Actions):
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {order.status === 'PENDING' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'CONFIRMED', 'تم قبول الطلب بواسطة موظف العمليات')}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                        >
                          [قبول الطلب - Accept]
                        </button>
                      )}

                      {order.status === 'CONFIRMED' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'PREPARING', 'بدء تجهيز الشحنة داخل المستودع')}
                          className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-xl transition-colors shadow-sm"
                        >
                          [بدء التجهيز - Prepare]
                        </button>
                      )}

                      {(order.status === 'CONFIRMED' || order.status === 'PREPARING') && (
                        <button
                          onClick={() => simulateShippingWebhook(order.id, 'SHIPPED')}
                          className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                        >
                          [تسليم لشركة الشحن - Dispatch]
                        </button>
                      )}

                      {order.status === 'SHIPPED' && (
                        <button
                          onClick={() => simulateShippingWebhook(order.id, 'OUT_FOR_DELIVERY')}
                          className="px-3 py-1.5 bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                        >
                          [خروج للتوصيل مع المندوب - Out for Delivery]
                        </button>
                      )}

                      {order.status === 'OUT_FOR_DELIVERY' && (
                        <button
                          onClick={() => simulateShippingWebhook(order.id, 'DELIVERED')}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                        >
                          [تأكيد التسليم للعميل - Mark Delivered]
                        </button>
                      )}

                      {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'CANCELLED', 'تم إلغاء الطلب وإرجاع المنتجات')}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-300 text-xs rounded-xl transition-colors border border-slate-700"
                        >
                          [إلغاء الطلب]
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Inventory Manager */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">إدارة مخزون وأسعار المنتجات</h2>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة منتج جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <div 
                key={product.id}
                className="bg-[#161927] border border-slate-800 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 object-contain rounded-xl bg-slate-800 p-1 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white truncate">{product.name}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{product.categoryNameAr}</p>
                    <div className="text-xs font-bold text-amber-400 font-mono-nums mt-0.5">
                      {product.price.toLocaleString('ar-EG')} ج.م
                    </div>
                  </div>
                </div>

                {/* Real-time adjusters */}
                <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">المخزون المتوفر</label>
                    <input
                      type="number"
                      min="0"
                      value={product.stock}
                      onChange={e => updateProductStock(product.id, parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono-nums focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">السعر (ج.م)</label>
                    <input
                      type="number"
                      min="1"
                      value={product.price}
                      onChange={e => updateProductPrice(product.id, parseInt(e.target.value) || 1)}
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono-nums focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className={product.stock > 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {product.stock > 0 ? `جاهز للبيع (${product.stock} قطعة)` : 'نفذت الكمية'}
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">
                    ID: {product.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Webhooks Simulator (Section 12, 14 of prompt) */}
      {activeTab === 'webhooks_sim' && (
        <div className="bg-[#161927] border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-white">محاكي الـWebhooks الخارجية (Carrier & Payment Gateways)</h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              كما شرحت في البند 12 و 14: لا نعتمد على رسالة تطبيق الموبايل، بل نعتمد على Webhook موثوق (Verified Webhook with HMAC Signature) يتم استقباله بواسطة NestJS ثم يحدّث قاعدة بيانات PostgreSQL ويطلق Event في n8n.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payment Gateway Webhook Simulation */}
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <h3 className="text-xs font-bold text-white">بوابة الدفع الإلكتروني (Paymob / Stripe Webhook)</h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                إرسال إشعار فوري لـ NestJS يؤكد نجاح أو فشل سداد العميل إلكترونياً.
              </p>

              <div className="space-y-2">
                <label className="text-[11px] text-slate-400 block">اختر الطلب:</label>
                <select 
                  id="pay_order_select"
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                >
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.orderNumber} - {o.customerName} ({o.total} ج.م)
                    </option>
                  ))}
                </select>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      const sel = (document.getElementById('pay_order_select') as HTMLSelectElement)?.value;
                      if (sel) simulatePaymentWebhook(sel, true);
                    }}
                    className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    محاكاة Webhook: تم السداد بنجاح (PAID)
                  </button>
                  <button
                    onClick={() => {
                      const sel = (document.getElementById('pay_order_select') as HTMLSelectElement)?.value;
                      if (sel) simulatePaymentWebhook(sel, false);
                    }}
                    className="py-2 px-3 bg-red-950/80 hover:bg-red-900 text-red-300 text-xs font-bold rounded-lg border border-red-800/60"
                  >
                    فشل السداد
                  </button>
                </div>
              </div>
            </div>

            {/* Shipping Carrier Webhook Simulation */}
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-400" />
                <h3 className="text-xs font-bold text-white">شركة الشحن والتوصيل (Shipping Provider Webhook)</h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                إشعار شركة الشحن بتحديثات حالة الطرد من المستودع حتى يد المستلم.
              </p>

              <div className="space-y-2">
                <label className="text-[11px] text-slate-400 block">اختر الطلب:</label>
                <select 
                  id="ship_order_select"
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                >
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.orderNumber} - {o.customerName} ({o.status})
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-3 gap-2 pt-2">
                  <button
                    onClick={() => {
                      const sel = (document.getElementById('ship_order_select') as HTMLSelectElement)?.value;
                      if (sel) simulateShippingWebhook(sel, 'SHIPPED');
                    }}
                    className="py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold rounded-lg"
                  >
                    SHIPPED
                  </button>
                  <button
                    onClick={() => {
                      const sel = (document.getElementById('ship_order_select') as HTMLSelectElement)?.value;
                      if (sel) simulateShippingWebhook(sel, 'OUT_FOR_DELIVERY');
                    }}
                    className="py-2 bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold rounded-lg"
                  >
                    OUT_FOR_DELIVERY
                  </button>
                  <button
                    onClick={() => {
                      const sel = (document.getElementById('ship_order_select') as HTMLSelectElement)?.value;
                      if (sel) simulateShippingWebhook(sel, 'DELIVERED');
                    }}
                    className="py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-lg"
                  >
                    DELIVERED
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#161927] border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">إضافة منتج جديد للمتجر</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">اسم المنتج بالعربية</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: سماعة رأس بلوتوث"
                  value={newProdName}
                  onChange={e => setNewProdName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">اسم المنتج بالإنجليزية</label>
                <input
                  type="text"
                  placeholder="e.g. Wireless Pro Earbuds"
                  value={newProdNameEn}
                  onChange={e => setNewProdNameEn(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">السعر (ج.م)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProdPrice}
                    onChange={e => setNewProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">كمية المخزون</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProdStock}
                    onChange={e => setNewProdStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">القسم</label>
                <select
                  value={newProdCategory}
                  onChange={e => setNewProdCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                >
                  <option value="electronics">إلكترونيات</option>
                  <option value="fashion">أزياء ورياضة</option>
                  <option value="perfumes">عطور وجمال</option>
                  <option value="accessories">إكسسوارات</option>
                </select>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-xl"
                >
                  إضافة للمتجر فوراً
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
