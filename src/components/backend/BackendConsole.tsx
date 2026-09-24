import React, { useState } from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { 
  Database, 
  Terminal, 
  FolderTree, 
  Send, 
  Table, 
  FileCode, 
  CheckCircle2, 
  Layers, 
  Copy, 
  Check 
} from 'lucide-react';

export const BackendConsole: React.FC = () => {
  const { products, orders, cart } = useEcosystem();

  const [activeTab, setActiveTab] = useState<'api_tester' | 'db_tables' | 'architecture_tree' | 'prisma_schema'>('api_tester');
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('GET /products');
  const [requestBody, setRequestBody] = useState<string>('{\n  "category": "fashion"\n}');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseLatency, setResponseLatency] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const endpoints = [
    { method: 'GET', path: '/products', description: 'استرجاع قائمة المنتجات مع الفلترة والتصنيف' },
    { method: 'GET', path: '/products/:id', description: 'استرجاع تفاصيل منتج معين والتحقق من المخزون' },
    { method: 'POST', path: '/cart/items', description: 'إضافة صنف إلى سلة المستخدم والتحقق من الـStock' },
    { method: 'POST', path: '/orders', description: 'إنشاء طلب جديد، حجز المخزون، وإطلاق Event' },
    { method: 'GET', path: '/orders', description: 'استرجاع قائمة طلبات العميل الحالية والسابقة' },
    { method: 'PATCH', path: '/orders/:id/status', description: 'تحديث حالة الطلب وإرسال Webhook لـ n8n' },
    { method: 'POST', path: '/webhooks/shipping', description: 'استقبال تحديثات الشحن الموثقة من شركة التوصيل' },
  ];

  const handleExecuteApi = () => {
    setApiLoading(true);
    const start = performance.now();

    setTimeout(() => {
      const end = performance.now();
      setResponseLatency(Math.round(end - start + 45));

      if (selectedEndpoint === 'GET /products') {
        setResponseStatus(200);
        setApiResponse({
          statusCode: 200,
          data: products.slice(0, 3).map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            stock: p.stock,
            category: p.category
          })),
          meta: {
            total: products.length,
            page: 1,
            cached: true,
            cacheEngine: 'Redis v7.2'
          }
        });
      } else if (selectedEndpoint === 'GET /products/:id') {
        setResponseStatus(200);
        setApiResponse({
          statusCode: 200,
          data: products[0]
        });
      } else if (selectedEndpoint === 'POST /cart/items') {
        setResponseStatus(201);
        setApiResponse({
          statusCode: 201,
          success: true,
          message: 'Item reserved in cart session',
          cartItem: {
            id: 'cart-item-881',
            productId: 'prod-101',
            quantity: 1,
            unitPrice: 2450
          }
        });
      } else if (selectedEndpoint === 'POST /orders') {
        setResponseStatus(201);
        setApiResponse({
          statusCode: 201,
          orderId: orders[0]?.id || 'ord-10001',
          orderNumber: orders[0]?.orderNumber || '#10001',
          status: 'CONFIRMED',
          total: orders[0]?.total || 2450,
          paymentStatus: 'UNPAID',
          eventDispatched: 'ORDER_CREATED',
          webhookTriggered: true
        });
      } else if (selectedEndpoint === 'GET /orders') {
        setResponseStatus(200);
        setApiResponse({
          statusCode: 200,
          data: orders
        });
      } else if (selectedEndpoint === 'PATCH /orders/:id/status') {
        setResponseStatus(200);
        setApiResponse({
          statusCode: 200,
          orderId: orders[0]?.id,
          newStatus: 'SHIPPED',
          trackingNumber: 'EG-10001-NOON',
          webhookDispatched: {
            event: 'ORDER_SHIPPED',
            destination: 'https://n8n.mini-noon.internal/webhook/order'
          }
        });
      } else if (selectedEndpoint === 'POST /webhooks/shipping') {
        setResponseStatus(200);
        setApiResponse({
          statusCode: 200,
          acknowledged: true,
          carrierSignatureValid: true,
          orderUpdated: true
        });
      }

      setApiLoading(false);
    }, 180);
  };

  const handleSelectEndpoint = (ep: string) => {
    setSelectedEndpoint(ep);
    if (ep === 'POST /cart/items') {
      setRequestBody('{\n  "productId": "prod-101",\n  "quantity": 1\n}');
    } else if (ep === 'POST /orders') {
      setRequestBody('{\n  "paymentMethod": "CASH_ON_DELIVERY",\n  "addressId": "addr-cairo-01",\n  "couponCode": "NOON10"\n}');
    } else if (ep === 'PATCH /orders/:id/status') {
      setRequestBody('{\n  "status": "SHIPPED",\n  "trackingNumber": "EG-10001-NOON"\n}');
    } else if (ep === 'POST /webhooks/shipping') {
      setRequestBody('{\n  "trackingNumber": "EG-10001-NOON",\n  "event": "OUT_FOR_DELIVERY",\n  "courier": "Mahmoud Selim",\n  "etaMinutes": 15\n}');
    } else {
      setRequestBody('{}');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-slate-100 animate-fade-in">
      {/* Header */}
      <div className="bg-[#141624] border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            NestJS + TypeScript + PostgreSQL + Prisma Architecture
          </span>
        </div>
        <h1 className="text-xl font-bold text-white mt-1">
          معمارية الباك إند وقاعدة البيانات ونقاط الـREST APIs
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          هنا البنية التحتية الصلبة التي بنيناها أولاً قبل ربط واجهات Flutter و n8n:
          الـControllers، والـServices، ومخطط جداول PostgreSQL، والـORM (Prisma)، وكاش Redis.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('api_tester')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            activeTab === 'api_tester' ? 'bg-amber-400 text-black' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>منصة تجربة الـAPIs (Swagger / REST Runner)</span>
        </button>

        <button
          onClick={() => setActiveTab('db_tables')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            activeTab === 'db_tables' ? 'bg-amber-400 text-black' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>مستكشف جداول PostgreSQL الحية</span>
        </button>

        <button
          onClick={() => setActiveTab('architecture_tree')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            activeTab === 'architecture_tree' ? 'bg-amber-400 text-black' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>شجرة ملفات NestJS (src/ Architecture)</span>
        </button>

        <button
          onClick={() => setActiveTab('prisma_schema')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            activeTab === 'prisma_schema' ? 'bg-amber-400 text-black' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Prisma Schema (`schema.prisma`)</span>
        </button>
      </div>

      {/* Tab 1: API Tester */}
      {activeTab === 'api_tester' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Endpoints sidebar (4 cols) */}
          <div className="lg:col-span-4 bg-[#161927] border border-slate-800 rounded-2xl p-4 space-y-2">
            <h3 className="text-xs font-bold text-slate-300 mb-2">نقاط الـAPI المتاحة (NestJS Controllers)</h3>
            <div className="space-y-1.5">
              {endpoints.map(ep => {
                const fullStr = `${ep.method} ${ep.path}`;
                const isSelected = selectedEndpoint === fullStr;

                return (
                  <button
                    key={fullStr}
                    onClick={() => handleSelectEndpoint(fullStr)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                      isSelected
                        ? 'bg-amber-400/10 border-amber-400 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded font-mono font-bold text-[10px] ${
                        ep.method === 'GET' ? 'bg-sky-950 text-sky-400 border border-sky-800/50' :
                        ep.method === 'POST' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' :
                        ep.method === 'PATCH' ? 'bg-amber-950 text-amber-400 border border-amber-800/50' :
                        'bg-red-950 text-red-400'
                      }`}>
                        {ep.method}
                      </span>
                      <span className="font-mono font-semibold text-slate-200">{ep.path}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{ep.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Request / Response Pane (8 cols) */}
          <div className="lg:col-span-8 bg-[#161927] border border-slate-800 rounded-2xl p-5 space-y-4">
            {/* Request Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-700 font-mono text-xs">
                <span className="font-bold text-amber-400">{selectedEndpoint.split(' ')[0]}</span>
                <span className="text-slate-300">https://api.mini-noon.internal/v1{selectedEndpoint.split(' ')[1]}</span>
              </div>
              <button
                onClick={handleExecuteApi}
                disabled={apiLoading}
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {apiLoading ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>إرسال الطلب (Send)</span>
                  </>
                )}
              </button>
            </div>

            {/* Request Body input */}
            {selectedEndpoint.includes('POST') || selectedEndpoint.includes('PATCH') ? (
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Request Body (JSON Payload):</label>
                <textarea
                  value={requestBody}
                  onChange={e => setRequestBody(e.target.value)}
                  rows={4}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-amber-300 focus:outline-none focus:border-amber-400"
                />
              </div>
            ) : null}

            {/* Response Section */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300">Server Response:</span>
                  {responseStatus && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      responseStatus < 300 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400'
                    }`}>
                      {responseStatus} {responseStatus === 200 ? 'OK' : 'Created'}
                    </span>
                  )}
                  {responseLatency && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      Latency: {responseLatency}ms
                    </span>
                  )}
                </div>

                {apiResponse && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(apiResponse, null, 2));
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex items-center gap-1 text-[10px] text-amber-400 hover:underline"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'تم النسخ' : 'نسخ الاستجابة'}</span>
                  </button>
                )}
              </div>

              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto min-h-[160px] max-h-72">
                {apiResponse ? JSON.stringify(apiResponse, null, 2) : '// انقر على "إرسال الطلب" لتنفيذ الـAPI وملاحظة الاستجابة الحية'}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: PostgreSQL Tables Explorer */}
      {activeTab === 'db_tables' && (
        <div className="space-y-6 bg-[#161927] border border-slate-800 rounded-2xl p-5">
          <div>
            <h2 className="text-sm font-bold text-white">مستكشف بيانات جداول PostgreSQL</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              جداول قاعدة البيانات التي صممناها في الخطوة 5: <code className="text-amber-300 font-mono">User, Product, Order, OrderItem, Address</code>
            </p>
          </div>

          {/* Orders Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 font-mono">TABLE: orders</span>
              <span className="text-[11px] text-slate-400">{orders.length} rows</span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">id</th>
                    <th className="p-2.5">order_number</th>
                    <th className="p-2.5">customer_name</th>
                    <th className="p-2.5">total_amount</th>
                    <th className="p-2.5">payment_status</th>
                    <th className="p-2.5">status</th>
                    <th className="p-2.5">created_at</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-900/50">
                      <td className="p-2.5 text-slate-400">{o.id}</td>
                      <td className="p-2.5 font-bold text-amber-400">{o.orderNumber}</td>
                      <td className="p-2.5 text-white font-sans">{o.customerName}</td>
                      <td className="p-2.5 text-emerald-400">{o.total} EGP</td>
                      <td className="p-2.5 text-sky-400">{o.paymentStatus}</td>
                      <td className="p-2.5 text-white">{o.status}</td>
                      <td className="p-2.5 text-slate-500">{new Date(o.createdAt).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Products Table */}
          <div className="space-y-2 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 font-mono">TABLE: products</span>
              <span className="text-[11px] text-slate-400">{products.length} rows</span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">id</th>
                    <th className="p-2.5">name</th>
                    <th className="p-2.5">price</th>
                    <th className="p-2.5">stock_qty</th>
                    <th className="p-2.5">category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-900/50">
                      <td className="p-2.5 text-slate-400">{p.id}</td>
                      <td className="p-2.5 text-white font-sans">{p.name}</td>
                      <td className="p-2.5 text-amber-400">{p.price} EGP</td>
                      <td className={`p-2.5 font-bold ${p.stock <= 5 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {p.stock}
                      </td>
                      <td className="p-2.5 text-slate-400">{p.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: NestJS Architecture Tree */}
      {activeTab === 'architecture_tree' && (
        <div className="bg-[#161927] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white">هيكل مشروع NestJS النمطي (Modular Clean Architecture)</h2>
          <p className="text-xs text-slate-400">
            كما طلبت في القسم 2 و 4: تم تقسيم المشروع إلى وحدات مستقلة (Modules) داخل مجلد <code className="text-amber-300 font-mono">backend/src/</code>.
          </p>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
            {`backend/
├── src/
│   ├── auth/                 # تسجيل الدخول، JWT Tokens، Guards
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── jwt.strategy.ts
│   ├── users/                # إدارة بيانات العملاء، العناوين
│   ├── products/             # كتالوج المنتجات، البحث، المخزون
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   └── dto/create-product.dto.ts
│   ├── categories/           # تصنيفات السلع
│   ├── cart/                 # إدارة سلة التسوق مع Redis Cache
│   ├── orders/               # معالجة الطلبات، حجز المخزون، Transactions
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   └── events/order-created.event.ts
│   ├── payments/             # بوابات الدفع والـVerified Webhooks
│   ├── shipping/             # شركات الشحن وحساب الـETA
│   ├── notifications/        # إرسال إشعارات FCM و n8n Dispatcher
│   ├── admin/                # صلاحيات المشرفين ولوحة Next.js
│   └── common/               # Middleware, Filters, Interceptors, Prisma
└── prisma/
    └── schema.prisma         # تعريف قاعدة بيانات PostgreSQL`}
          </div>
        </div>
      )}

      {/* Tab 4: Prisma Schema */}
      {activeTab === 'prisma_schema' && (
        <div className="bg-[#161927] border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">ملف Prisma Schema لنمذجة الجداول والعلاقات</h2>
            <span className="text-xs text-slate-400 font-mono">schema.prisma</span>
          </div>

          <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-sky-300 leading-relaxed overflow-x-auto">
{`datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id           String    @id @default(uuid())
  name         String
  email        String    @unique
  phone        String
  passwordHash String
  addresses    Address[]
  orders       Order[]
  createdAt    DateTime  @default(now())
}

model Product {
  id          String      @id @default(uuid())
  name        String
  nameEn      String
  description String
  price       Float
  stock       Int
  image       String
  category    String
  orderItems  OrderItem[]
  createdAt   DateTime    @default(now())
}

model Order {
  id            String        @id @default(uuid())
  orderNumber   String        @unique // #10001
  userId        String
  user          User          @relation(fields: [userId], references: [id])
  status        OrderStatus   @default(CONFIRMED)
  subtotal      Float
  shippingFee   Float         @default(0)
  discount      Float         @default(0)
  total         Float
  paymentMethod PaymentMethod
  paymentStatus PaymentStatus @default(UNPAID)
  items         OrderItem[]
  address       Address       @relation(fields: [addressId], references: [id])
  addressId     String
  createdAt     DateTime      @default(now())
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PREPARING
  SHIPPED
  OUT_FOR_DELIVERY
  DELIVERED
  CANCELLED
}`}
          </pre>
        </div>
      )}
    </div>
  );
};
