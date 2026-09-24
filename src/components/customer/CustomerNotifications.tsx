import React from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { Bell, X, Check, Smartphone } from 'lucide-react';

interface CustomerNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrder: (orderId: string) => void;
}

export const CustomerNotifications: React.FC<CustomerNotificationsProps> = ({
  isOpen,
  onClose,
  onSelectOrder
}) => {
  const { 
    notifications, 
    latestPushNotification, 
    dismissPushToast, 
    markNotificationsAsRead 
  } = useEcosystem();

  return (
    <>
      {/* Floating simulated mobile Push Notification (FCM banner) */}
      {latestPushNotification && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-3 animate-slide-down">
          <div className="bg-[#1c1f2e] border border-amber-400/40 rounded-2xl p-3.5 shadow-2xl backdrop-blur flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-black flex items-center justify-center shrink-0 font-bold">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  Firebase Cloud Messaging · Noon
                </span>
                <span className="text-[10px] text-slate-400">الآن</span>
              </div>
              <h4 className="text-xs font-bold text-white mt-0.5">
                {latestPushNotification.title}
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                {latestPushNotification.body}
              </p>
            </div>
            <button
              onClick={dismissPushToast}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Notifications Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-start">
          <div 
            className="w-full max-w-sm bg-[#151824] border-l border-slate-800 h-full flex flex-col shadow-2xl animate-slide-right"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">إشعارات التطبيق</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={markNotificationsAsRead}
                  className="text-[11px] text-slate-400 hover:text-amber-400 transition-colors"
                >
                  تحديد كمقروء
                </button>
                <button
                  onClick={onClose}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {notifications.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center p-6 text-slate-500 text-xs">
                  لا توجد إشعارات حتى الآن
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (n.orderId) onSelectOrder(n.orderId);
                      onClose();
                    }}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                      n.read 
                        ? 'bg-slate-900/40 border-slate-800/80 text-slate-300' 
                        : 'bg-amber-400/5 border-amber-400/30 text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-amber-300">{n.title}</span>
                      <span className="text-[10px] text-slate-500">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {n.body}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
