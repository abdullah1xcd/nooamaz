import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Map, 
  ArrowLeft, 
  Layers, 
  Code, 
  Server, 
  Smartphone, 
  LayoutDashboard, 
  CreditCard, 
  Truck, 
  Workflow, 
  Zap 
} from 'lucide-react';

export const RoadmapGuide: React.FC = () => {
  const [activePhase, setActivePhase] = useState<number>(1);

  const phases = [
    {
      number: 1,
      title: 'المرحلة الأولى: التأسيس (Foundation)',
      subtitle: 'GitHub · NestJS · PostgreSQL · Prisma · JWT Auth',
      icon: <Server className="w-4 h-4 text-sky-400" />,
      tag: 'قاعدة النظام',
      tasks: [
        'إنشاء المستودع وتأسيس هيكل الـ Monorepo أو الـ Multi-repo (backend, mobile, admin)',
        'تثبيت NestJS مع TypeScript وإعداد الـ Linter و Prettier',
        'تجهيز قاعدة بيانات PostgreSQL وربط Prisma ORM وتفعيل الـ Migrations',
        'بناء Auth Module (تسجيل حساب جديد، تسجيل دخول، تشفير كلمات المرور بـ bcrypt، إصدار JWT Tokens)',
        'تأمين الـ Endpoints عبر JwtAuthGuard'
      ],
      codeSnippet: `// 1. Prisma User Model
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  name         String
  passwordHash String
  createdAt    DateTime @default(now())
}`
    },
    {
      number: 2,
      title: 'المرحلة الثانية: نواة التجارة الإلكترونية (E-commerce Core)',
      subtitle: 'Products · Categories · Cart · Checkout · Orders',
      icon: <Layers className="w-4 h-4 text-amber-400" />,
      tag: 'جوهر الـBusiness',
      tasks: [
        'إنشاء Products Module مع إمكانية التصفية بحسب القسم والبحث',
        'برمجة Cart Module وحساب الأسعار التلقائي مع التحقق من كمية الـ Stock',
        'برمجة Order Module وعمل Database Transaction لحجز المخزون ومنع الـ Race Conditions',
        'إصدار رقم الطلب الفرعي (مثل #10001) وحفظ عناوين الشحن'
      ],
      codeSnippet: `// 2. Order Transaction in NestJS
await this.prisma.$transaction(async (tx) => {
  // Check stock
  for (const item of cart.items) {
    await tx.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } }
    });
  }
  // Create order
  return tx.order.create({ data: orderDto });
});`
    },
    {
      number: 3,
      title: 'المرحلة الثالثة: تطبيق الموبايل (Flutter Customer App)',
      subtitle: 'Flutter · Dart · Clean Architecture · Bloc/Riverpod',
      icon: <Smartphone className="w-4 h-4 text-emerald-400" />,
      tag: 'تجربة العميل',
      tasks: [
        'تصميم شاشات الـ UI/UX (Home, Products, Details, Cart, Checkout, Order Tracking)',
        'إدارة الحالة عبر Bloc أو Riverpod وفصل الطبقات (Presentation, Domain, Data)',
        'ربط الـ HTTP Client (Dio) مع الـ NestJS API وتخزين الـ Tokens محلياً',
        'بناء شاشة التتبع اللحظي لمسار الطلب'
      ],
      codeSnippet: `// 3. Flutter Product Model
class Product {
  final String id;
  final String name;
  final double price;
  final int stock;
  
  Product.fromJson(Map<String, dynamic> json)
    : id = json['id'],
      name = json['name'],
      price = (json['price'] as num).toDouble(),
      stock = json['stock'];
}`
    },
    {
      number: 4,
      title: 'المرحلة الرابعة: لوحة الإدارة (Next.js Admin)',
      subtitle: 'Next.js · Tailwind CSS · React Query · Operations Desk',
      icon: <LayoutDashboard className="w-4 h-4 text-purple-400" />,
      tag: 'إدارة العمليات',
      tasks: [
        'بناء لوحة القيادة لعرض المبيعات اليومية وحالات الطلبات',
        'شاشة إدارة الطلبات مع أزرار الإجراءات السريعة (Accept, Prepare, Ship)',
        'شاشة تعديل المخزون والأسعار وإضافة المنتجات الجديدة',
        'صلاحيات المشرفين (Admin RBAC)'
      ],
      codeSnippet: `// 4. Admin Order Quick Action
const handleAcceptOrder = async (orderId: string) => {
  await api.patch('/orders/' + orderId + '/status', {
    status: 'CONFIRMED'
  });
};`
    },
    {
      number: 5,
      title: 'المرحلة الخامسة: الدفع الإلكتروني (Payments)',
      subtitle: 'Payment Gateways · HMAC Signatures · Webhooks',
      icon: <CreditCard className="w-4 h-4 text-yellow-400" />,
      tag: 'المدفوعات',
      tasks: [
        'دمج بوابة دفع مثل Paymob أو Stripe',
        'إنشاء نقطة استقبال Webhook (POST /webhooks/payment)',
        'التحقق الصارم من التوقيع الرقمي (Signature Verification) لمنع التزوير',
        'تحديث حالة الطلب إلى PAID عند تأكيد العملية'
      ],
      codeSnippet: `// 5. Webhook Signature Verification
const isValid = crypto
  .createHmac('sha256', process.env.PAYMENT_SECRET)
  .update(rawBody)
  .digest('hex') === signatureHeader;`
    },
    {
      number: 6,
      title: 'المرحلة السادسة: الشحن والتوصيل (Shipping & Logistics)',
      subtitle: 'Shipping API · Tracking Number · Courier Routing',
      icon: <Truck className="w-4 h-4 text-indigo-400" />,
      tag: 'اللوجستيات',
      tasks: [
        'الربط مع شركة الشحن لإنشاء البوليصة ورقم التتبع فور جاهزية الطرد',
        'استقبال Webhook شركة الشحن عند تغيير الحالة (Shipped -> Out for delivery -> Delivered)',
        'عرض وقت الوصول المتوقع (ETA) في تطبيق العميل'
      ],
      codeSnippet: `// 6. Carrier Status Update
@Post('webhooks/shipping')
async handleCarrierUpdate(@Body() body: CarrierWebhookDto) {
  return this.shippingService.updateOrderStatus(body.trackingNumber, body.status);
}`
    },
    {
      number: 7,
      title: 'المرحلة السابعة: الأوتوميشن (n8n & Multi-Channel)',
      subtitle: 'n8n Workflows · FCM · WhatsApp Business · Email',
      icon: <Workflow className="w-4 h-4 text-pink-400" />,
      tag: 'الأوتوميشن والرسائل',
      tasks: [
        'إعداد خادم n8n وتوصيل الـ Webhooks من NestJS',
        'بناء سيناريو ORDER_CREATED لإرسال إيميل الفاتورة وإشعار الـ Push وتنبيه الإدارة',
        'ربط WhatsApp Business Cloud API لإرسال رسائل التتبع اللحظية',
        'التعامل مع الأخطاء وإعادة المحاولة التلقائية (Retry Mechanism)'
      ],
      codeSnippet: `// 7. NestJS Event Emitter
this.eventEmitter.emit('order.created', new OrderCreatedEvent(order));`
    },
    {
      number: 8,
      title: 'المرحلة الثامنة: المستوى المتقدم (Advanced Scale)',
      subtitle: 'Redis · BullMQ · Live GPS Tracking · Analytics',
      icon: <Zap className="w-4 h-4 text-amber-300" />,
      tag: 'الأداء والنمو',
      tasks: [
        'تفعيل Redis لتخزين بيانات الـ Caching وتقليل الضغط على قاعدة البيانات',
        'استخدام BullMQ لمعالجة الطوابير والمهام الخلفية (Queues & Workers)',
        'تطبيق التتبع المباشر للخريطة للـ Couriers عبر WebSockets',
        'محرك التوصيات الذكي للمنتجات وأنظمة الكوبونات المتقدمة'
      ],
      codeSnippet: `// 8. Redis Caching in NestJS
@Get()
@UseInterceptors(CacheInterceptor)
@CacheKey('featured_products')
@CacheTTL(3600)
async getFeatured() { return this.productsService.findAll(); }`
    },
  ];

  const current = phases.find(p => p.number === activePhase) || phases[0];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-slate-100 animate-fade-in">
      {/* Header */}
      <div className="bg-[#141624] border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Execution Strategy Roadmap
          </span>
        </div>
        <h1 className="text-xl font-bold text-white mt-1">
          خطة التنفيذ البرمجية المعتمدة (من الصفر حتى مرحلة الـ Advanced)
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          «ما تشتتش نفسك. ابدأ بالـ Core Architecture الأول، ولما الـ Order flow يشتغل كامل.. ركّب عليه Payment ثم Shipping ثم n8n.»
        </p>
      </div>

      {/* Grid of 8 Phases */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {phases.map(p => {
          const isSelected = activePhase === p.number;
          return (
            <button
              key={p.number}
              onClick={() => setActivePhase(p.number)}
              className={`text-right p-3.5 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-amber-400/10 border-amber-400 text-white shadow-lg shadow-amber-400/5'
                  : 'bg-[#161927] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold font-mono-nums text-amber-400">
                  Phase 0{p.number}
                </span>
                {p.icon}
              </div>
              <h3 className="text-xs font-bold text-white line-clamp-1">{p.title.split(':')[1]}</h3>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{p.tag}</p>
            </button>
          );
        })}
      </div>

      {/* Active Phase Detailed View */}
      <div className="bg-[#161927] border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-400 text-black font-mono-nums">
                المرحلة {current.number} من 8
              </span>
              <span className="text-xs text-slate-400">{current.subtitle}</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              {current.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={activePhase <= 1}
              onClick={() => setActivePhase(p => p - 1)}
              className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl disabled:opacity-40"
            >
              السابق
            </button>
            <button
              disabled={activePhase >= 8}
              onClick={() => setActivePhase(p => p + 1)}
              className="px-3 py-1.5 text-xs bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-xl disabled:opacity-40"
            >
              المرحلة التالية
            </button>
          </div>
        </div>

        {/* Tasks Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300">قائمة المهام المطلوب إنجازها في هذه المرحلة:</h4>
            <div className="space-y-2.5">
              {current.tasks.map((task, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-slate-900/70 rounded-xl border border-slate-800 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-slate-200 leading-relaxed">{task}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Code Starter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300">نموذج الكود المرجعي (Starter Code Pattern):</h4>
            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-amber-300 leading-relaxed overflow-x-auto min-h-[220px]">
              {current.codeSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
