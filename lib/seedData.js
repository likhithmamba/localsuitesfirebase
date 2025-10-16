// Seed data for SmartLocal Suite demo

export const DEMO_SHOP_DATA = {
  shop: {
    id: 'demo-shop-123',
    name: 'Shree Ganesh Kirana',
    slug: 'shree-ganesh-kirana',
    owner: 'Ramesh Kumar',
    phone: '+919876543210',
    email: 'ramesh@shreeganesha.shop',
    address: 'Shop No. 15, Gandhi Nagar, Mumbai - 400001',
    gstNumber: '27AADCS1234F1Z5',
    gstEnabled: true,
    upiId: 'shreeganesha@paytm',
    storefront: 'https://shreeganesha.smartlocal.in',
    languages: ['hi', 'en', 'mr'],
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    businessHours: {
      open: '07:00',
      close: '22:00',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    categories: ['Grains', 'Pulses', 'Oil', 'Spices', 'Grocery', 'Snacks', 'Beverages', 'Personal Care'],
    createdAt: new Date('2024-01-15'),
    isActive: true,
    subscription: 'premium',
    features: {
      dynamicPricing: true,
      whatsappMarketing: true,
      voiceAssistant: true,
      analytics: true,
      multiLanguage: true
    }
  },

  products: [
    {
      id: 'p1',
      name: 'Basmati Rice Premium 1kg',
      category: 'Grains',
      price: 180,
      cost: 150,
      stock: 45,
      minStock: 10,
      maxStock: 100,
      unit: 'kg',
      barcode: '1234567890123',
      sku: 'BGR001',
      description: 'Premium quality basmati rice, aged for perfect aroma and taste',
      brand: 'India Gate',
      supplier: 'Wholesale Grains Co.',
      tags: ['premium', 'aromatic', 'long-grain'],
      nutritionFacts: {
        calories: 365,
        protein: 7.1,
        carbs: 78,
        fiber: 0.4
      },
      images: ['/api/placeholder/400/400'],
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-02-15')
    },
    {
      id: 'p2',
      name: 'Wheat Flour (Atta) 5kg',
      category: 'Grains',
      price: 250,
      cost: 200,
      stock: 30,
      minStock: 5,
      maxStock: 50,
      unit: 'kg',
      barcode: '1234567890124',
      sku: 'WFA005',
      description: 'Fresh ground wheat flour, perfect for rotis and bread',
      brand: 'Aashirvaad',
      supplier: 'Flour Mills Ltd.',
      tags: ['fresh', 'whole-wheat', 'nutritious'],
      images: ['/api/placeholder/400/400'],
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-02-14')
    },
    {
      id: 'p3',
      name: 'Sugar Crystal 1kg',
      category: 'Grocery',
      price: 60,
      cost: 50,
      stock: 25,
      minStock: 15,
      maxStock: 80,
      unit: 'kg',
      barcode: '1234567890125',
      sku: 'SUG001',
      description: 'Pure crystal sugar, perfect for daily cooking and beverages',
      brand: 'Parle',
      supplier: 'Sugar Industries',
      tags: ['pure', 'crystal', 'sweetener'],
      images: ['/api/placeholder/400/400'],
      createdAt: new Date('2024-01-17'),
      updatedAt: new Date('2024-02-13')
    },
    {
      id: 'p4',
      name: 'Sunflower Oil 1L',
      category: 'Oil',
      price: 130,
      cost: 110,
      stock: 20,
      minStock: 8,
      maxStock: 40,
      unit: 'L',
      barcode: '1234567890126',
      sku: 'SFO001',
      description: 'Refined sunflower oil, rich in Vitamin E, perfect for cooking',
      brand: 'Fortune',
      supplier: 'Oil Refineries Pvt Ltd',
      tags: ['refined', 'healthy', 'vitamin-e'],
      images: ['/api/placeholder/400/400'],
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-02-12')
    },
    {
      id: 'p5',
      name: 'Toor Dal Premium 500g',
      category: 'Pulses',
      price: 85,
      cost: 70,
      stock: 35,
      minStock: 12,
      maxStock: 60,
      unit: 'g',
      barcode: '1234567890127',
      sku: 'TDL500',
      description: 'High-quality toor dal, rich in protein and essential nutrients',
      brand: 'Everest',
      supplier: 'Dal Suppliers Co.',
      tags: ['protein-rich', 'premium', 'nutritious'],
      images: ['/api/placeholder/400/400'],
      createdAt: new Date('2024-01-19'),
      updatedAt: new Date('2024-02-11')
    },
    {
      id: 'p6',
      name: 'Tea Powder Assam 250g',
      category: 'Beverages',
      price: 120,
      cost: 95,
      stock: 40,
      minStock: 15,
      maxStock: 70,
      unit: 'g',
      barcode: '1234567890128',
      sku: 'TEA250',
      description: 'Premium Assam tea powder with rich aroma and strong flavor',
      brand: 'Tata Tea',
      supplier: 'Tea Estates Ltd',
      tags: ['assam', 'premium', 'strong'],
      images: ['/api/placeholder/400/400'],
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-02-10')
    },
    {
      id: 'p7',
      name: 'Parle-G Biscuits 200g',
      category: 'Snacks',
      price: 25,
      cost: 18,
      stock: 60,
      minStock: 20,
      maxStock: 100,
      unit: 'pack',
      barcode: '1234567890129',
      sku: 'BIS200',
      description: 'Classic glucose biscuits, perfect with tea or milk',
      brand: 'Parle',
      supplier: 'Biscuit Distributors',
      tags: ['glucose', 'classic', 'tea-time'],
      images: ['/api/placeholder/400/400'],
      createdAt: new Date('2024-01-21'),
      updatedAt: new Date('2024-02-09')
    },
    {
      id: 'p8',
      name: 'Tata Salt 1kg',
      category: 'Grocery',
      price: 20,
      cost: 15,
      stock: 50,
      minStock: 25,
      maxStock: 100,
      unit: 'kg',
      barcode: '1234567890130',
      sku: 'SAL001',
      description: 'Iodized salt for healthy living, pure and clean',
      brand: 'Tata',
      supplier: 'Salt Works Ltd',
      tags: ['iodized', 'pure', 'healthy'],
      images: ['/api/placeholder/400/400'],
      createdAt: new Date('2024-01-22'),
      updatedAt: new Date('2024-02-08')
    },
    {
      id: 'p9',
      name: 'Red Chilli Powder 100g',
      category: 'Spices',
      price: 45,
      cost: 35,
      stock: 25,
      minStock: 10,
      maxStock: 50,
      unit: 'g',
      barcode: '1234567890131',
      sku: 'RCP100',
      description: 'Pure red chilli powder with authentic spicy flavor',
      brand: 'MDH',
      supplier: 'Spice Traders',
      tags: ['spicy', 'pure', 'authentic'],
      images: ['/api/placeholder/400/400'],
      createdAt: new Date('2024-01-23'),
      updatedAt: new Date('2024-02-07')
    },
    {
      id: 'p10',
      name: 'Turmeric Powder 200g',
      category: 'Spices',
      price: 55,
      cost: 42,
      stock: 30,
      minStock: 12,
      maxStock: 60,
      unit: 'g',
      barcode: '1234567890132',
      sku: 'TUR200',
      description: 'Pure turmeric powder with natural color and medicinal properties',
      brand: 'Everest',
      supplier: 'Spice Traders',
      tags: ['pure', 'medicinal', 'natural'],
      images: ['/api/placeholder/400/400'],
      createdAt: new Date('2024-01-24'),
      updatedAt: new Date('2024-02-06')
    }
  ],

  customers: [
    {
      id: 'c1',
      name: 'Priya Mehta',
      phone: '+919876543220',
      email: 'priya.mehta@email.com',
      address: '12, Laxmi Apartments, Andheri West, Mumbai - 400058',
      segment: 'regular',
      totalOrders: 15,
      totalSpent: 3500,
      lastOrderDate: new Date('2024-02-15'),
      preferences: ['organic', 'premium'],
      communicationChannel: 'whatsapp'
    },
    {
      id: 'c2',
      name: 'Amit Singh',
      phone: '+919876543221',
      email: 'amit.singh@email.com',
      address: '5B, Krishna Society, Borivali East, Mumbai - 400066',
      segment: 'new',
      totalOrders: 3,
      totalSpent: 850,
      lastOrderDate: new Date('2024-02-14'),
      preferences: ['budget-friendly'],
      communicationChannel: 'sms'
    },
    {
      id: 'c3',
      name: 'Sunita Devi',
      phone: '+919876543222',
      email: 'sunita.devi@email.com',
      address: '23, Ganesh Nagar, Malad West, Mumbai - 400064',
      segment: 'high-value',
      totalOrders: 28,
      totalSpent: 7200,
      lastOrderDate: new Date('2024-02-16'),
      preferences: ['bulk-orders', 'premium'],
      communicationChannel: 'whatsapp'
    }
  ],

  orders: [
    {
      id: 'o1',
      customerId: 'c1',
      customerName: 'Priya Mehta',
      customerPhone: '+919876543220',
      items: [
        { productId: 'p1', productName: 'Basmati Rice Premium 1kg', quantity: 2, price: 180, total: 360 },
        { productId: 'p3', productName: 'Sugar Crystal 1kg', quantity: 1, price: 60, total: 60 }
      ],
      subtotal: 420,
      tax: 0,
      discount: 0,
      total: 420,
      status: 'completed',
      paymentMethod: 'UPI',
      paymentStatus: 'paid',
      deliveryMethod: 'pickup',
      deliveryAddress: '12, Laxmi Apartments, Andheri West, Mumbai - 400058',
      orderDate: new Date('2024-02-15T10:30:00'),
      completedDate: new Date('2024-02-15T10:45:00'),
      notes: 'Customer preferred premium rice'
    },
    {
      id: 'o2',
      customerId: 'c2',
      customerName: 'Amit Singh',
      customerPhone: '+919876543221',
      items: [
        { productId: 'p4', productName: 'Sunflower Oil 1L', quantity: 1, price: 130, total: 130 }
      ],
      subtotal: 130,
      tax: 0,
      discount: 0,
      total: 130,
      status: 'pending',
      paymentMethod: 'Cash',
      paymentStatus: 'pending',
      deliveryMethod: 'pickup',
      deliveryAddress: '5B, Krishna Society, Borivali East, Mumbai - 400066',
      orderDate: new Date('2024-02-16T14:20:00'),
      notes: 'Cash on pickup'
    },
    {
      id: 'o3',
      customerId: 'c3',
      customerName: 'Sunita Devi',
      customerPhone: '+919876543222',
      items: [
        { productId: 'p2', productName: 'Wheat Flour (Atta) 5kg', quantity: 1, price: 250, total: 250 },
        { productId: 'p5', productName: 'Toor Dal Premium 500g', quantity: 2, price: 85, total: 170 }
      ],
      subtotal: 420,
      tax: 0,
      discount: 0,
      total: 420,
      status: 'completed',
      paymentMethod: 'UPI',
      paymentStatus: 'paid',
      deliveryMethod: 'delivery',
      deliveryAddress: '23, Ganesh Nagar, Malad West, Mumbai - 400064',
      orderDate: new Date('2024-02-16T16:15:00'),
      completedDate: new Date('2024-02-16T18:30:00'),
      deliveryFee: 0,
      notes: 'Regular customer, bulk order'
    }
  ],

  campaigns: [
    {
      id: 'camp1',
      name: 'Diwali Festival Special',
      type: 'festival',
      status: 'active',
      channel: 'whatsapp',
      template: 'diwali_offer',
      targetSegment: 'all',
      discount: 15,
      products: ['p1', 'p4', 'p9', 'p10'],
      message: '🪔 Diwali Special Offer! 15% off on premium items. Order now for fresh festival supplies! 🎉',
      scheduledDate: new Date('2024-10-28'),
      expiryDate: new Date('2024-11-05'),
      sentCount: 245,
      deliveredCount: 238,
      readCount: 156,
      clickCount: 78,
      conversionCount: 23,
      createdAt: new Date('2024-10-25')
    },
    {
      id: 'camp2',
      name: 'Weekly Price Drop Alert',
      type: 'price_drop',
      status: 'scheduled',
      channel: 'whatsapp',
      template: 'price_drop',
      targetSegment: 'regular',
      products: ['p3', 'p8'],
      message: '💰 Price Drop Alert! Sugar & Salt prices reduced. Stock up now!',
      scheduledDate: new Date('2024-02-20'),
      createdAt: new Date('2024-02-18')
    }
  ],

  analytics: {
    totalSales: 15600,
    ordersToday: 5,
    ordersThisWeek: 23,
    ordersThisMonth: 89,
    lowStockCount: 3,
    revenue: 2300,
    revenueGrowth: 12.5,
    avgOrderValue: 387,
    topSellingProducts: ['p1', 'p2', 'p4', 'p5', 'p6'],
    salesTrend: [
      { date: '2024-02-10', sales: 1200, orders: 8, customers: 6 },
      { date: '2024-02-11', sales: 1500, orders: 12, customers: 9 },
      { date: '2024-02-12', sales: 900, orders: 6, customers: 5 },
      { date: '2024-02-13', sales: 1800, orders: 15, customers: 12 },
      { date: '2024-02-14', sales: 2100, orders: 18, customers: 14 },
      { date: '2024-02-15', sales: 1600, orders: 11, customers: 8 },
      { date: '2024-02-16', sales: 2300, orders: 20, customers: 16 }
    ],
    categoryBreakdown: [
      { category: 'Grains', sales: 45, value: 4200, percentage: 27 },
      { category: 'Oil', sales: 30, value: 3900, percentage: 25 },
      { category: 'Grocery', sales: 25, value: 2100, percentage: 13 },
      { category: 'Pulses', sales: 28, value: 2800, percentage: 18 },
      { category: 'Spices', sales: 35, value: 1750, percentage: 11 },
      { category: 'Beverages', sales: 22, value: 850, percentage: 6 }
    ],
    customerSegments: {
      new: 23,
      regular: 45,
      highValue: 12,
      lapsed: 8
    },
    paymentMethods: {
      upi: 65,
      cash: 30,
      card: 5
    }
  }
}

export const FESTIVAL_OFFERS = {
  diwali: {
    name: 'Diwali Dhamaka',
    emoji: '🪔',
    products: ['sweets', 'oil', 'rice', 'spices'],
    discount: 15,
    message: 'Light up your celebrations with our Diwali special offers!'
  },
  holi: {
    name: 'Holi Special',
    emoji: '🎨',
    products: ['colors', 'sweets', 'snacks', 'beverages'],
    discount: 12,
    message: 'Add colors to your Holi celebration with amazing offers!'
  },
  eid: {
    name: 'Eid Mubarak',
    emoji: '🌙',
    products: ['dates', 'dry-fruits', 'sweets', 'rice'],
    discount: 10,
    message: 'Celebrate Eid with our special festive collection!'
  },
  christmas: {
    name: 'Christmas Joy',
    emoji: '🎄',
    products: ['cakes', 'chocolates', 'beverages', 'snacks'],
    discount: 18,
    message: 'Spread Christmas joy with delightful treats and offers!'
  }
}

export const VOICE_COMMANDS = {
  addProduct: [
    'add 5 kg rice at 70 rupees',
    'add 10 pieces biscuits at 25 rupees each',
    'add 2 liters oil at 130 rupees per liter',
    'add 500 grams dal at 85 rupees'
  ],
  updateStock: [
    'update rice stock to 50 kg',
    'reduce sugar stock by 5 kg',
    'increase oil stock by 10 liters',
    'set atta stock to 25 kg'
  ],
  checkStock: [
    'check stock for rice',
    'what is the stock of sugar',
    'show me oil inventory',
    'how much atta do we have'
  ],
  pricing: [
    'set rice price to 75 rupees per kg',
    'increase oil price by 5 rupees',
    'reduce sugar price to 58 rupees',
    'what is the price of dal'
  ]
}