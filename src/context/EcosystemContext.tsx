import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  OrderStatus, 
  PaymentMethod, 
  Address, 
  WebhookEventLog, 
  AppNotification, 
  ViewPerspective,
  EventType
} from '../types/ecommerce';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_WEBHOOK_LOGS } from '../data/initialData';

interface EcosystemContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  activeOrder: Order | null;
  webhookLogs: WebhookEventLog[];
  notifications: AppNotification[];
  latestPushNotification: AppNotification | null;
  currentPerspective: ViewPerspective;
  isMobileFrame: boolean;
  selectedCategory: string;
  searchQuery: string;
  cartTotal: {
    subtotal: number;
    shippingFee: number;
    discount: number;
    total: number;
    itemsCount: number;
  };
  // Actions
  setCurrentPerspective: (perspective: ViewPerspective) => void;
  setIsMobileFrame: (val: boolean) => void;
  setSelectedCategory: (cat: string) => void;
  setSearchQuery: (query: string) => void;
  setActiveOrder: (order: Order | null) => void;
  addToCart: (product: Product, quantity?: number) => boolean;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  createOrder: (data: { address: Address; paymentMethod: PaymentMethod; couponCode?: string }) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  simulateShippingWebhook: (orderId: string, step: 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED') => void;
  simulatePaymentWebhook: (orderId: string, success: boolean) => void;
  updateProductStock: (productId: string, newStock: number) => void;
  updateProductPrice: (productId: string, newPrice: number) => void;
  addNewProduct: (product: Omit<Product, 'id'>) => void;
  dismissPushToast: () => void;
  markNotificationsAsRead: () => void;
  resetToInitialDemo: () => void;
}

const EcosystemContext = createContext<EcosystemContextType | undefined>(undefined);

export const EcosystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('mini_noon_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('mini_noon_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('mini_noon_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    return orders.length > 0 ? orders[0] : null;
  });

  const [webhookLogs, setWebhookLogs] = useState<WebhookEventLog[]>(() => {
    const saved = localStorage.getItem('mini_noon_webhooks');
    return saved ? JSON.parse(saved) : INITIAL_WEBHOOK_LOGS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: '📦 تم تأكيد طلبك #10001',
      body: 'طلبك بقيمة 2,450 ج.م تم تأكيده وجاري تجهيزه بالمستودع.',
      type: 'ORDER_UPDATE',
      timestamp: 'منذ 30 دقيقة',
      read: false,
      orderId: 'ord-10001'
    }
  ]);

  const [latestPushNotification, setLatestPushNotification] = useState<AppNotification | null>(null);
  const [currentPerspective, setCurrentPerspective] = useState<ViewPerspective>('CUSTOMER');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('mini_noon_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mini_noon_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('mini_noon_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('mini_noon_webhooks', JSON.stringify(webhookLogs));
  }, [webhookLogs]);

  // Cart calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const itemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  // Free shipping above 1000 EGP, otherwise 50 EGP
  const shippingFee = cartSubtotal > 1000 || cartSubtotal === 0 ? 0 : 50;
  const discount = 0;
  const cartTotal = {
    subtotal: cartSubtotal,
    shippingFee,
    discount,
    total: Math.max(0, cartSubtotal + shippingFee - discount),
    itemsCount
  };

  // Push Notification trigger helper
  const triggerNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: 'notif-' + Date.now(),
      timestamp: 'الآن',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    setLatestPushNotification(newNotif);
    // Auto dismiss after 6 seconds
    setTimeout(() => {
      setLatestPushNotification(prev => (prev?.id === newNotif.id ? null : prev));
    }, 6000);
  };

  // Add webhook log helper
  const addWebhookLog = (
    event: EventType, 
    orderId: string, 
    source: WebhookEventLog['source'], 
    payload: Record<string, unknown>,
    dispatchedTo = { email: true, pushFCM: true, whatsapp: true, adminSlack: true }
  ) => {
    const log: WebhookEventLog = {
      id: 'wh-' + Date.now(),
      event,
      orderId,
      timestamp: new Date().toLocaleTimeString('ar-EG'),
      source,
      payload,
      dispatchedTo
    };
    setWebhookLogs(prev => [log, ...prev]);
  };

  // Cart actions
  const addToCart = (product: Product, quantity = 1): boolean => {
    if (product.stock <= 0) return false;
    
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });
    return true;
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const boundedQty = Math.min(quantity, product.stock);
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity: boundedQty } : item));
  };

  const clearCart = () => setCart([]);

  // Create Order (The core flow from the prompt: Flutter -> NestJS -> PostgreSQL -> Event -> n8n)
  const createOrder = (data: { address: Address; paymentMethod: PaymentMethod; couponCode?: string }): Order => {
    // 1. Calculate final price and discounts
    let currentDiscount = 0;
    if (data.couponCode?.toUpperCase() === 'NOON10') {
      currentDiscount = Math.round(cartSubtotal * 0.1);
    }

    const currentShipping = cartSubtotal > 1000 ? 0 : 50;
    const finalTotal = Math.max(0, cartSubtotal + currentShipping - currentDiscount);

    const nextOrderNum = 10000 + orders.length + 1;
    const orderNumberStr = `#${nextOrderNum}`;

    // 2. Reserve / reduce inventory
    setProducts(prev => {
      return prev.map(prod => {
        const inCart = cart.find(c => c.product.id === prod.id);
        if (inCart) {
          return { ...prod, stock: Math.max(0, prod.stock - inCart.quantity) };
        }
        return prod;
      });
    });

    // 3. Create Order document in state (simulating PostgreSQL insert)
    const now = new Date();
    const newOrder: Order = {
      id: `ord-${nextOrderNum}`,
      orderNumber: orderNumberStr,
      userId: 'usr-901',
      customerName: data.address.fullName || 'أحمد محمد خليل',
      customerEmail: 'ahmed.khalil@example.com',
      customerPhone: data.address.phone || '+201012345678',
      address: data.address,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.image,
        price: item.product.price,
        quantity: item.quantity
      })),
      subtotal: cartSubtotal,
      shippingFee: currentShipping,
      discount: currentDiscount,
      couponCode: data.couponCode,
      total: finalTotal,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === 'CREDIT_CARD' ? 'PAID' : 'UNPAID',
      status: 'CONFIRMED',
      trackingNumber: `EG-${nextOrderNum}-NOON`,
      courierName: 'مندوب نون إكسبريس',
      courierEtaMinutes: 20,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      timeline: [
        {
          status: 'PENDING',
          label: 'تم إنشاء الطلب بنجاح',
          timestamp: now.toLocaleTimeString('ar-EG'),
          note: `طريقة الدفع: ${data.paymentMethod === 'CASH_ON_DELIVERY' ? 'الدفع عند الاستلام' : 'بطاقة بنكية'}`
        },
        {
          status: 'CONFIRMED',
          label: 'تم اعتماد الطلب وحجز المخزون',
          timestamp: now.toLocaleTimeString('ar-EG'),
          note: 'NestJS Event: ORDER_CREATED -> n8n Webhook Dispatched'
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    clearCart();

    // 4. Trigger Webhook Event (Matching prompt section 10 & 11)
    addWebhookLog('ORDER_CREATED', orderNumberStr, 'NESTJS_BACKEND', {
      event: 'ORDER_CREATED',
      orderId: `${nextOrderNum}`,
      customer: {
        name: newOrder.customerName,
        email: newOrder.customerEmail,
        phone: newOrder.customerPhone
      },
      items: newOrder.items.map(i => ({ name: i.productName, qty: i.quantity, price: i.price })),
      total: finalTotal,
      paymentMethod: data.paymentMethod,
      paymentStatus: newOrder.paymentStatus
    });

    // 5. Trigger customer Push Notification & simulated email/WhatsApp
    triggerNotification({
      title: `🎉 تم استلام طلبك ${orderNumberStr}`,
      body: `تم تأكيد طلبك بنجاح بإجمالي ${finalTotal.toLocaleString('ar-EG')} ج.م. جاري التجهيز للشحن!`,
      type: 'ORDER_UPDATE',
      orderId: newOrder.id
    });

    return newOrder;
  };

  // Update order status (Admin or Webhook action)
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    const now = new Date();
    setOrders(prev => {
      return prev.map(ord => {
        if (ord.id === orderId) {
          const updatedTimeline = [
            ...ord.timeline,
            {
              status: newStatus,
              label: getStatusArabicLabel(newStatus),
              timestamp: now.toLocaleTimeString('ar-EG'),
              note: note || `تحديث من لوحة الإدارة / Webhook`
            }
          ];

          const updated: Order = {
            ...ord,
            status: newStatus,
            updatedAt: now.toISOString(),
            timeline: updatedTimeline,
            paymentStatus: newStatus === 'DELIVERED' && ord.paymentMethod === 'CASH_ON_DELIVERY' ? 'PAID' : ord.paymentStatus
          };

          if (activeOrder?.id === orderId) {
            setActiveOrder(updated);
          }

          return updated;
        }
        return ord;
      });
    });

    // Find the order for notifications & webhooks
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    let eventType: EventType = 'ORDER_CONFIRMED';
    let notifTitle = `تحديث الطلب ${targetOrder.orderNumber}`;
    let notifBody = `حالة طلبك الآن: ${getStatusArabicLabel(newStatus)}`;

    if (newStatus === 'PREPARING') {
      eventType = 'ORDER_PREPARED';
      notifTitle = `📦 جاري تجهيز طلبك ${targetOrder.orderNumber}`;
      notifBody = `تم تجهيز الأصناف في المستودع وجاري التغليف للشحن.`;
    } else if (newStatus === 'SHIPPED') {
      eventType = 'ORDER_SHIPPED';
      notifTitle = `🚚 تم شحن طلبك ${targetOrder.orderNumber}`;
      notifBody = `الطلب في عهدة شركة الشحن برقم التتبع: ${targetOrder.trackingNumber || 'EG-123456'}`;
    } else if (newStatus === 'OUT_FOR_DELIVERY') {
      eventType = 'OUT_FOR_DELIVERY';
      notifTitle = `📍 طلبك في الطريق إليك!`;
      notifBody = `المندوب ${targetOrder.courierName || 'محمود'} على بعد ${targetOrder.courierEtaMinutes || 15} دقيقة من عنوانك.`;
    } else if (newStatus === 'DELIVERED') {
      eventType = 'ORDER_DELIVERED';
      notifTitle = `🎉 تم توصيل طلبك بنجاح!`;
      notifBody = `شكراً لطلبك من نون! نتمنى مشاركتنا تقييمك للمنتجات.`;
    } else if (newStatus === 'CANCELLED') {
      eventType = 'ORDER_CANCELLED';
      notifTitle = `❌ تم إلغاء الطلب ${targetOrder.orderNumber}`;
      notifBody = `تم إلغاء الطلب وإرجاع المنتجات للمخزون.`;
    }

    addWebhookLog(eventType, targetOrder.orderNumber, 'NESTJS_BACKEND', {
      event: eventType,
      orderId: targetOrder.orderNumber.replace('#', ''),
      status: newStatus,
      updatedAt: now.toISOString(),
      note: note || ''
    });

    triggerNotification({
      title: notifTitle,
      body: notifBody,
      type: 'ORDER_UPDATE',
      orderId: targetOrder.id
    });
  };

  // Simulate carrier webhook (Section 14 & 15 of prompt)
  const simulateShippingWebhook = (orderId: string, step: 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED') => {
    updateOrderStatus(orderId, step, `تم استلام Webhook مؤكد من شركة الشحن (Carrier API Callback)`);
  };

  // Simulate payment webhook (Section 12 of prompt)
  const simulatePaymentWebhook = (orderId: string, success: boolean) => {
    const now = new Date();
    setOrders(prev => {
      return prev.map(ord => {
        if (ord.id === orderId) {
          const updated: Order = {
            ...ord,
            paymentStatus: success ? 'PAID' : 'UNPAID',
            status: success ? 'CONFIRMED' : ord.status,
            timeline: [
              ...ord.timeline,
              {
                status: ord.status,
                label: success ? 'تم التحقق من الدفع الإلكتروني بنجاح' : 'فشلت عملية الدفع الإلكتروني',
                timestamp: now.toLocaleTimeString('ar-EG'),
                note: `Payment Gateway Verified Webhook (HMAC Signature Valid)`
              }
            ]
          };
          if (activeOrder?.id === orderId) setActiveOrder(updated);
          return updated;
        }
        return ord;
      });
    });

    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    addWebhookLog('PAYMENT_WEBHOOK', targetOrder.orderNumber, 'PAYMENT_GATEWAY', {
      event: 'PAYMENT_WEBHOOK',
      orderId: targetOrder.orderNumber.replace('#', ''),
      paymentStatus: success ? 'PAID' : 'FAILED',
      transactionId: 'txn_' + Math.random().toString(36).substring(2, 9),
      verified: true
    });

    if (success) {
      triggerNotification({
        title: `💳 تم تأكيد الدفع للطلب ${targetOrder.orderNumber}`,
        body: `تم استلام دفعتك بنجاح وجاري تجهيز الطلب فوراً.`,
        type: 'ORDER_UPDATE',
        orderId: targetOrder.id
      });
    }
  };

  const updateProductStock = (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p));
  };

  const updateProductPrice = (productId: string, newPrice: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, price: Math.max(1, newPrice) } : p));
  };

  const addNewProduct = (productData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...productData,
      id: 'prod-' + (products.length + 101)
    };
    setProducts(prev => [newProd, ...prev]);
  };

  const dismissPushToast = () => setLatestPushNotification(null);

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetToInitialDemo = () => {
    localStorage.removeItem('mini_noon_products');
    localStorage.removeItem('mini_noon_cart');
    localStorage.removeItem('mini_noon_orders');
    localStorage.removeItem('mini_noon_webhooks');
    setProducts(INITIAL_PRODUCTS);
    setCart([]);
    setOrders(INITIAL_ORDERS);
    setActiveOrder(INITIAL_ORDERS[0]);
    setWebhookLogs(INITIAL_WEBHOOK_LOGS);
    setNotifications([
      {
        id: 'notif-1',
        title: '📦 تم تأكيد طلبك #10001',
        body: 'طلبك بقيمة 2,450 ج.م تم تأكيده وجاري تجهيزه بالمستودع.',
        type: 'ORDER_UPDATE',
        timestamp: 'منذ 30 دقيقة',
        read: false,
        orderId: 'ord-10001'
      }
    ]);
  };

  return (
    <EcosystemContext.Provider
      value={{
        products,
        cart,
        orders,
        activeOrder,
        webhookLogs,
        notifications,
        latestPushNotification,
        currentPerspective,
        isMobileFrame,
        selectedCategory,
        searchQuery,
        cartTotal,
        setCurrentPerspective,
        setIsMobileFrame,
        setSelectedCategory,
        setSearchQuery,
        setActiveOrder,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        createOrder,
        updateOrderStatus,
        simulateShippingWebhook,
        simulatePaymentWebhook,
        updateProductStock,
        updateProductPrice,
        addNewProduct,
        dismissPushToast,
        markNotificationsAsRead,
        resetToInitialDemo
      }}
    >
      {children}
    </EcosystemContext.Provider>
  );
};

export const useEcosystem = () => {
  const ctx = useContext(EcosystemContext);
  if (!ctx) throw new Error('useEcosystem must be used within an EcosystemProvider');
  return ctx;
};

function getStatusArabicLabel(status: OrderStatus): string {
  switch (status) {
    case 'PENDING': return 'قيد المراجعة';
    case 'CONFIRMED': return 'تم التأكيد والحجز';
    case 'PREPARING': return 'جاري التجهيز بالمستودع';
    case 'SHIPPED': return 'تم الشحن';
    case 'OUT_FOR_DELIVERY': return 'في الطريق للتسليم';
    case 'DELIVERED': return 'تم التوصيل بنجاح';
    case 'CANCELLED': return 'تم الإلغاء';
    default: return status;
  }
}
