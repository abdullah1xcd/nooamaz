import React, { useState } from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { WebhookEventLog } from '../../types/ecommerce';
import { 
  Workflow, 
  Mail, 
  Bell, 
  MessageSquare, 
  ShieldAlert, 
  Send, 
  CheckCircle, 
  ArrowLeft, 
  Code, 
  Eye, 
  Copy, 
  Check, 
  RefreshCw 
} from 'lucide-react';

export const AutomationEngine: React.FC = () => {
  const { webhookLogs, orders } = useEcosystem();

  const [selectedLog, setSelectedLog] = useState<WebhookEventLog>(
    webhookLogs[0] || null
  );

  const [activePreviewTab, setActivePreviewTab] = useState<'email' | 'whatsapp' | 'push' | 'admin'>('email');
  const [copied, setCopied] = useState(false);

  // Fallback if selectedLog is null
  const currentLog = selectedLog || webhookLogs[0];
  const relatedOrder = orders.find(o => o.orderNumber === currentLog?.orderId) || orders[0];

  const handleCopyPayload = () => {
    if (!currentLog) return;
    navigator.clipboard.writeText(JSON.stringify(currentLog.payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-slate-100 animate-fade-in">
      {/* Header */}
      <div className="bg-[#141624] border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center gap-2">
          <Workflow className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Event-Driven Architecture & n8n Simulator
          </span>
        </div>
        <h1 className="text-xl font-bold text-white mt-1">
          محرك الأوتوميشن وتدفق الـWebhooks متعدد القنوات
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          وفقاً للقاعدة الذهبية: <span className="text-amber-300 font-semibold">«الـAutomation تبنى فوق نظام شغال»</span>. 
          عندما يقوم العميل بإجراء طلب أو يتغير مسار الشحنة، يقوم NestJS بإطلاق Event يرسل Webhook إلى n8n، والذي يتولى تشغيل الإجراءات المتوازية تلقائياً.
        </p>
      </div>

      {/* Visual Pipeline Graph */}
      <div className="bg-[#161927] border border-slate-800 rounded-2xl p-6">
        <div className="text-xs font-bold text-slate-300 mb-4 flex items-center justify-between">
          <span>مخطط سريان تدفق أحداث النظام (System Workflow Graph)</span>
          <span className="text-amber-400 text-[11px] font-mono-nums">
            {webhookLogs.length} أحداث مسجلة حتى الآن
          </span>
        </div>

        {/* Responsive Pipeline Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Node 1: Origin Source */}
          <div className="p-4 bg-slate-900 border border-slate-700/80 rounded-2xl relative space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">01. المصدر</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="text-sm font-bold text-white">NestJS Core API</div>
            <p className="text-[11px] text-slate-400">
              حدث داخلي: <code className="text-amber-300 font-mono">ORDER_CREATED</code> أو تحديث شحن
            </p>
          </div>

          {/* Node 2: Webhook Trigger */}
          <div className="p-4 bg-slate-900 border border-amber-400/40 rounded-2xl relative space-y-2 shadow-lg shadow-amber-400/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">02. الاستقبال</span>
              <span className="text-[10px] text-slate-400 font-mono">POST /webhook</span>
            </div>
            <div className="text-sm font-bold text-white">n8n Webhook Node</div>
            <p className="text-[11px] text-slate-400">
              استلام وتدقيق الـPayload مع التحقق من صحة التوقيع
            </p>
          </div>

          {/* Node 3: Router & Filter */}
          <div className="p-4 bg-slate-900 border border-slate-700/80 rounded-2xl relative space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">03. المعالجة</span>
              <span className="text-[10px] text-slate-400 font-mono">Router</span>
            </div>
            <div className="text-sm font-bold text-white">n8n Switch & Rules</div>
            <p className="text-[11px] text-slate-400">
              تحديد نوع الحدث وتوجيه البيانات للقنوات المعنية
            </p>
          </div>

          {/* Node 4: Dispatched Channels */}
          <div className="p-4 bg-slate-900 border border-slate-700/80 rounded-2xl relative space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">04. الإرسال المتوازي</span>
              <span className="text-[10px] text-emerald-400">4 قنوات</span>
            </div>
            <div className="text-sm font-bold text-white">Multi-Channel Broadcast</div>
            <div className="flex gap-1.5 pt-1">
              <span className="p-1 rounded bg-slate-800 text-sky-400" title="Email"><Mail className="w-3.5 h-3.5" /></span>
              <span className="p-1 rounded bg-slate-800 text-emerald-400" title="WhatsApp"><MessageSquare className="w-3.5 h-3.5" /></span>
              <span className="p-1 rounded bg-slate-800 text-amber-400" title="FCM Push"><Bell className="w-3.5 h-3.5" /></span>
              <span className="p-1 rounded bg-slate-800 text-purple-400" title="Admin Slack"><ShieldAlert className="w-3.5 h-3.5" /></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column View: Logs on Left/Right & Interactive Previewers on the other */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Logs Explorer (5 columns) */}
        <div className="lg:col-span-5 bg-[#161927] border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white">سجل الـWebhooks الواردة</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono-nums">
              انقر للعرض
            </span>
          </div>

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {webhookLogs.map(log => {
              const isSelected = currentLog?.id === log.id;
              return (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-400/10 border-amber-400 text-white shadow-sm'
                      : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-amber-400">
                      {log.event}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono-nums">
                      {log.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>الطلب: <b className="text-white font-mono">{log.orderId}</b></span>
                    <span className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                      {log.source}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Raw JSON viewer */}
          {currentLog && (
            <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300">
                  JSON Payload ({currentLog.event}):
                </span>
                <button
                  onClick={handleCopyPayload}
                  className="flex items-center gap-1 text-[10px] text-amber-400 hover:underline"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'تم النسخ' : 'نسخ الـJSON'}</span>
                </button>
              </div>

              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-emerald-400 font-mono overflow-x-auto max-h-48">
                {JSON.stringify(currentLog.payload, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Live Channel Previews (7 columns) */}
        <div className="lg:col-span-7 bg-[#161927] border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-400" />
                <span>المعاينة الحية لما يستلمه العميل والإدارة</span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                تأثير حدث <code className="text-amber-300 font-mono">{currentLog?.event}</code> على القنوات
              </p>
            </div>

            {/* Preview switcher tabs */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActivePreviewTab('email')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                  activePreviewTab === 'email' ? 'bg-amber-400 text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>الإيميل</span>
              </button>
              <button
                onClick={() => setActivePreviewTab('whatsapp')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                  activePreviewTab === 'whatsapp' ? 'bg-emerald-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>واتساب</span>
              </button>
              <button
                onClick={() => setActivePreviewTab('push')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                  activePreviewTab === 'push' ? 'bg-amber-400 text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>FCM Push</span>
              </button>
              <button
                onClick={() => setActivePreviewTab('admin')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                  activePreviewTab === 'admin' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin Alert</span>
              </button>
            </div>
          </div>

          {/* Dynamic Preview Container */}
          <div className="flex-1 min-h-[380px] bg-slate-950/60 rounded-xl border border-slate-800 p-4 flex items-center justify-center">
            {/* Preview 1: Email Receipt */}
            {activePreviewTab === 'email' && (
              <div className="w-full max-w-md bg-[#1c1f2e] border border-slate-700 rounded-2xl overflow-hidden shadow-xl text-slate-200 text-xs">
                {/* Email Header */}
                <div className="bg-[#12141c] p-3 border-b border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-amber-400 text-black font-bold text-xs flex items-center justify-center">
                      N
                    </div>
                    <div>
                      <div className="font-bold text-white text-[11px]">فريق نون مصر (orders@noon.com)</div>
                      <div className="text-[10px] text-slate-400">إلى: ahmed.khalil@example.com</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">منذ دقائق</span>
                </div>

                {/* Email Content */}
                <div className="p-4 space-y-3">
                  <div className="text-center py-2 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white">
                      {currentLog?.event === 'ORDER_CREATED' ? '🎉 تم استلام طلبك بنجاح' :
                       currentLog?.event === 'ORDER_SHIPPED' ? '🚚 طلبك خرج للشحن مع أكسبريس' :
                       currentLog?.event === 'OUT_FOR_DELIVERY' ? '📍 طلبك في الطريق إليك مع المندوب' :
                       'تحديث بخصوص طلبك في نون'}
                    </h3>
                    <p className="text-[11px] text-amber-400 font-mono mt-1">
                      رقم الطلب: {currentLog?.orderId}
                    </p>
                  </div>

                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    مرحباً {relatedOrder?.customerName || 'أحمد'}، يسعدنا إبلاغك بأن طلبك يتم معالجته فوراً في مستودع نون المركزي.
                  </p>

                  {/* Summary */}
                  <div className="bg-slate-900/90 rounded-xl p-3 space-y-1.5 border border-slate-800">
                    <div className="flex justify-between text-slate-400">
                      <span>إجمالي الفاتورة:</span>
                      <span className="font-mono-nums font-bold text-white">{relatedOrder?.total || 2450} ج.م</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>طريقة الدفع:</span>
                      <span className="text-amber-300">الدفع نقداً عند الاستلام (COD)</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>عنوان التسليم:</span>
                      <span className="text-slate-300">{relatedOrder?.address?.city} - {relatedOrder?.address?.area}</span>
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <button className="px-4 py-2 bg-amber-400 text-black font-bold rounded-xl text-xs">
                      تتبع حالة الشحنة مباشرة
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Preview 2: WhatsApp Chat Bubble */}
            {activePreviewTab === 'whatsapp' && (
              <div className="w-full max-w-sm bg-[#0b141a] border border-[#202c33] rounded-3xl p-4 shadow-2xl space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-[#202c33]">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                    noon
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>Noon Egypt Verified</span>
                      <span className="text-emerald-400 text-[10px]">✓</span>
                    </div>
                    <div className="text-[10px] text-slate-400">حساب أعمال رسمي</div>
                  </div>
                </div>

                {/* Bubble */}
                <div className="bg-[#005c4b] text-white p-3.5 rounded-2xl rounded-tr-none text-xs space-y-2 max-w-[90%] mr-auto shadow">
                  <p className="leading-relaxed">
                    مرحباً <b>{relatedOrder?.customerName || 'أحمد'}</b> 👋
                  </p>
                  <p className="leading-relaxed">
                    {currentLog?.event === 'ORDER_CREATED' && (
                      <>تم استلام طلبك رقم <b>{currentLog?.orderId}</b> بنجاح بقيمة <b>{relatedOrder?.total || 2450} ج.م</b>. جاري الآن التجهيز للشحن 📦</>
                    )}
                    {currentLog?.event === 'ORDER_SHIPPED' && (
                      <>أخبار سارة! شحنتك <b>{currentLog?.orderId}</b> تم تسليمها لشركة الشحن برقم تتبع <b>{relatedOrder?.trackingNumber || 'EG-12345'}</b> 🚚</>
                    )}
                    {currentLog?.event === 'OUT_FOR_DELIVERY' && (
                      <>المندوب محمود في طريقه إليك الآن! الوقت المتوقع: 15 دقيقة 🛵</>
                    )}
                    {currentLog?.event === 'ORDER_DELIVERED' && (
                      <>تم تسليم طلبك بنجاح! نتمنى لك تجربة ممتعة ونرجو تقييم الخدمة ⭐</>
                    )}
                  </p>
                  <div className="text-[9px] text-emerald-200 text-left pt-1">
                    {currentLog?.timestamp} · تم التسليم ✓✓
                  </div>
                </div>
              </div>
            )}

            {/* Preview 3: Mobile FCM Push Notification */}
            {activePreviewTab === 'push' && (
              <div className="w-full max-w-sm bg-slate-900/90 border border-slate-700 rounded-3xl p-5 shadow-2xl space-y-3">
                <div className="text-center text-[11px] text-slate-400">
                  شاشة قفل هاتف العميل (Lock Screen Notification)
                </div>

                <div className="bg-[#1e2235] border border-amber-400/30 rounded-2xl p-4 shadow-lg space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <Bell className="w-3.5 h-3.5" />
                      <span>NOON SHOPPING</span>
                    </div>
                    <span>الآن</span>
                  </div>
                  <h4 className="text-xs font-bold text-white pt-1">
                    {currentLog?.event === 'ORDER_CREATED' ? `📦 تم استلام طلبك ${currentLog?.orderId}` :
                     currentLog?.event === 'ORDER_SHIPPED' ? `🚚 شحنتك في الطريق مع شركة الشحن` :
                     currentLog?.event === 'OUT_FOR_DELIVERY' ? `📍 طلبك في الطريق إليك (15 دقيقة)` :
                     `تحديث الطلب ${currentLog?.orderId}`}
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    إجمالي الطلب: {relatedOrder?.total || 2450} ج.م · طريقة الدفع: {relatedOrder?.paymentMethod === 'CASH_ON_DELIVERY' ? 'كاش عند الاستلام' : 'بطاقة إلكترونية'}
                  </p>
                </div>
              </div>
            )}

            {/* Preview 4: Admin Slack / Discord Alert */}
            {activePreviewTab === 'admin' && (
              <div className="w-full max-w-md bg-[#1a1d28] border border-purple-500/30 rounded-2xl p-4 shadow-2xl space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                      #
                    </div>
                    <span className="font-bold text-white">#noon-operations-alerts</span>
                  </div>
                  <span className="text-[10px] text-slate-400">n8n Bot</span>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5 font-mono">
                  <div className="text-amber-400 font-bold">
                    🛒 New Order Notification: {currentLog?.orderId}
                  </div>
                  <div className="text-slate-300">
                    Customer: <span className="text-white">{relatedOrder?.customerName}</span>
                  </div>
                  <div className="text-slate-300">
                    Total Amount: <span className="text-emerald-400 font-bold">{relatedOrder?.total} EGP</span>
                  </div>
                  <div className="text-slate-300">
                    Payment Method: <span className="text-sky-400">{relatedOrder?.paymentMethod}</span>
                  </div>
                  <div className="text-slate-400 text-[10px] pt-1">
                    Timestamp: {currentLog?.timestamp} · Source: {currentLog?.source}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
