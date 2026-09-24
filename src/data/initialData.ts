import { Product, Order, WebhookEventLog } from '../types/ecommerce';

// Import our generated high fidelity product images
import sneakerImg from '../assets/images/noon_product_sneakers_1790221517422.jpg';
import smartwatchImg from '../assets/images/noon_product_smartwatch_1790221534303.jpg';
import headphonesImg from '../assets/images/noon_product_headphones_1790221550650.jpg';
import perfumeImg from '../assets/images/noon_product_perfume_1790221618078.jpg';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-101',
    name: 'حذاء نايكي إير ماكس بلس أوريجينال',
    nameEn: 'Nike Air Max Plus Zoom',
    description: 'حذاء رياضي مبطن بتقنية Air Max الفائقة، يوفر راحة تامة أثناء الجري والمشي اليومي، خامة مسامية داعمة للقدم.',
    price: 2450,
    originalPrice: 2950,
    stock: 14,
    image: sneakerImg,
    category: 'fashion',
    categoryNameAr: 'أزياء ورياضة',
    rating: 4.9,
    reviewsCount: 128,
    badge: 'الأكثر مبيعاً',
    brand: 'Nike'
  },
  {
    id: 'prod-102',
    name: 'ساعة ذكية ألترا تيتانيوم مقاومة للماء',
    nameEn: 'Titanium Ultra Smart Watch Pro',
    description: 'هيكل متين من التيتانيوم، تتبع دقيق لنبضات القلب والأكسجين، بطارية تدوم حتى 7 أيام، شاشة AMOLED ساطعة.',
    price: 3890,
    originalPrice: 4500,
    stock: 8,
    image: smartwatchImg,
    category: 'electronics',
    categoryNameAr: 'إلكترونيات',
    rating: 4.8,
    reviewsCount: 84,
    badge: 'عرض خاص',
    brand: 'Apex Tech'
  },
  {
    id: 'prod-103',
    name: 'سماعات رأس لاسلكية عازلة للضوضاء',
    nameEn: 'Studio Pro ANC Wireless Headphones',
    description: 'عزل ضوضاء نشط متطور Active Noise Cancelling، صوت نقي فائق الدقة Hi-Res، بطارية 40 ساعة، مريحة للأذن.',
    price: 4600,
    originalPrice: 5200,
    stock: 6,
    image: headphonesImg,
    category: 'electronics',
    categoryNameAr: 'إلكترونيات',
    rating: 4.9,
    reviewsCount: 92,
    brand: 'SoundMaster'
  },
  {
    id: 'prod-104',
    name: 'عطر عنبر ملكي شرقي فاخر 100 مل',
    nameEn: 'Royal Velvet Amber Oriental EDP',
    description: 'توليفة عطرية ملكية غنية بالعنبر الأسود والعود وخشب الصندل، ثبات يدوم طوال اليوم وفواحان لا يقاوم.',
    price: 1850,
    originalPrice: 2200,
    stock: 19,
    image: perfumeImg,
    category: 'perfumes',
    categoryNameAr: 'عطور وجمال',
    rating: 4.7,
    reviewsCount: 65,
    badge: 'حصري',
    brand: 'Luxe Orient'
  },
  {
    id: 'prod-105',
    name: 'شاحن سريع 65 واط جان ثلاثي المنافذ',
    nameEn: 'GaN 65W Triple Port Ultra Fast Charger',
    description: 'شاحن جان بتقنية GaN لشحن اللابتوب والهاتف معاً بأمان وسرعة قصوى، حماية ضد الحرارة والجهد الزائد.',
    price: 790,
    originalPrice: 950,
    stock: 25,
    image: smartwatchImg, // fallback high-res tech asset
    category: 'accessories',
    categoryNameAr: 'إكسسوارات',
    rating: 4.6,
    reviewsCount: 41,
    brand: 'VoltFlow'
  },
  {
    id: 'prod-106',
    name: 'محفظة جلد طبيعي يدوية الصنع بتقنية RFID',
    nameEn: 'Genuine Leather RFID Cardholder Wallet',
    description: 'محفظة رفيعة وأنيقة مصنوعة يدوياً من الجلد الطبيعي المدبوغ نباتياً، تحتوي على حماية كاملة ضد سرقة البطاقات.',
    price: 640,
    originalPrice: 800,
    stock: 11,
    image: perfumeImg, // fallback warm leather asset
    category: 'fashion',
    categoryNameAr: 'أزياء ورياضة',
    rating: 4.8,
    reviewsCount: 37,
    brand: 'Artisan Cuir'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-10001',
    orderNumber: '#10001',
    userId: 'usr-901',
    customerName: 'أحمد محمد خليل',
    customerEmail: 'ahmed.khalil@example.com',
    customerPhone: '+201012345678',
    address: {
      fullName: 'أحمد محمد خليل',
      phone: '+201012345678',
      city: 'القاهرة',
      area: 'مدينة نصر',
      street: 'شارع عباس العقاد - عمارة 42 الدور 5',
      building: 'شقة 12'
    },
    items: [
      {
        productId: 'prod-101',
        productName: 'حذاء نايكي إير ماكس بلس أوريجينال',
        productImage: sneakerImg,
        price: 2450,
        quantity: 1
      }
    ],
    subtotal: 2450,
    shippingFee: 0, // Free delivery for orders > 1000
    discount: 0,
    total: 2450,
    paymentMethod: 'CASH_ON_DELIVERY',
    paymentStatus: 'UNPAID',
    status: 'CONFIRMED',
    trackingNumber: 'EG-10001-NOON',
    courierName: 'كابتن محمود سليم (شركة أكسبريس)',
    courierEtaMinutes: 15,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    timeline: [
      {
        status: 'PENDING',
        label: 'تم استلام الطلب من العميل',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toLocaleTimeString('ar-EG'),
        note: 'طلب جديد عبر تطبيق الهاتف (Cash on Delivery)'
      },
      {
        status: 'CONFIRMED',
        label: 'تم تأكيد الطلب وحجز المخزون',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toLocaleTimeString('ar-EG'),
        note: 'تم فحص المخزون بواسطة نظام NestJS وتأكيده'
      }
    ]
  }
];

export const INITIAL_WEBHOOK_LOGS: WebhookEventLog[] = [
  {
    id: 'wh-evt-001',
    event: 'ORDER_CREATED',
    orderId: '#10001',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toLocaleTimeString('ar-EG'),
    source: 'NESTJS_BACKEND',
    payload: {
      event: 'ORDER_CREATED',
      orderId: '10001',
      customer: {
        name: 'Ahmed Khalil',
        email: 'ahmed.khalil@example.com',
        phone: '+201012345678'
      },
      items: [{ name: 'Nike Air Max Plus', qty: 1, price: 2450 }],
      total: 2450,
      paymentMethod: 'CASH_ON_DELIVERY'
    },
    dispatchedTo: {
      email: true,
      pushFCM: true,
      whatsapp: true,
      adminSlack: true
    }
  },
  {
    id: 'wh-evt-002',
    event: 'ORDER_CONFIRMED',
    orderId: '#10001',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toLocaleTimeString('ar-EG'),
    source: 'NESTJS_BACKEND',
    payload: {
      event: 'ORDER_CONFIRMED',
      orderId: '10001',
      status: 'CONFIRMED',
      warehouseId: 'CAIRO_HUB_01',
      estimatedDispatch: 'Today 18:00'
    },
    dispatchedTo: {
      email: true,
      pushFCM: true,
      whatsapp: true,
      adminSlack: false
    }
  }
];
