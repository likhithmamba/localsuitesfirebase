// Festival Bundle Maker - Advanced Festival Management System

export const FESTIVAL_CALENDAR = {
  diwali: {
    name: 'Diwali',
    emoji: '🪔',
    color: '#f59e0b',
    period: 'October-November',
    products: ['sweets', 'dry-fruits', 'oil', 'rice', 'diyas', 'decorative'],
    discount: 15,
    bundleIdeas: [
      {
        name: 'Diwali Sweets Special',
        products: ['sweets', 'dry-fruits', 'oil'],
        description: 'Traditional sweets with premium dry fruits and cooking oil',
        margin: 12
      },
      {
        name: 'Puja Essentials Pack',
        products: ['oil', 'rice', 'diyas'],
        description: 'Everything needed for Diwali puja rituals',
        margin: 10
      },
      {
        name: 'Family Celebration Bundle',
        products: ['sweets', 'decorative', 'dry-fruits'],
        description: 'Complete celebration pack for the whole family',
        margin: 15
      }
    ],
    whatsappTemplate: {
      greeting: '🪔 Diwali ki Shubh Kamnayein! 🪔',
      message: 'Light up your celebrations with our special Diwali offers!',
      cta: 'Order Now & Get FREE Delivery',
      emoji: '✨🎊🪔'
    }
  },
  holi: {
    name: 'Holi',
    emoji: '🎨',
    color: '#ec4899',
    period: 'March',
    products: ['colors', 'sweets', 'snacks', 'beverages', 'traditional-sweets'],
    discount: 12,
    bundleIdeas: [
      {
        name: 'Holi Colors Combo',
        products: ['colors', 'snacks', 'beverages'],
        description: 'Vibrant colors with delicious snacks and refreshing drinks',
        margin: 14
      },
      {
        name: 'Sweet Celebrations Pack',
        products: ['traditional-sweets', 'snacks'],
        description: 'Traditional sweets and savory snacks for Holi parties',
        margin: 11
      }
    ],
    whatsappTemplate: {
      greeting: '🎨 Holi Hai! 🌈',
      message: 'Add colors to your celebration with our festive collection!',
      cta: 'Shop Holi Specials',
      emoji: '🎊🎨🌈'
    }
  },
  eid: {
    name: 'Eid ul-Fitr',
    emoji: '🌙',
    color: '#10b981',
    period: 'Based on Lunar Calendar',
    products: ['dates', 'dry-fruits', 'sweets', 'rice', 'meat', 'vermicelli'],
    discount: 10,
    bundleIdeas: [
      {
        name: 'Iftar Special',
        products: ['dates', 'dry-fruits', 'sweets'],
        description: 'Premium dates and sweets for breaking fast',
        margin: 13
      },
      {
        name: 'Eid Feast Pack',
        products: ['rice', 'meat', 'vermicelli'],
        description: 'Essential ingredients for Eid feast preparation',
        margin: 9
      }
    ],
    whatsappTemplate: {
      greeting: '🌙 Eid Mubarak! 🕌',
      message: 'Celebrate Eid with our premium festive collection!',
      cta: 'Order Eid Specials',
      emoji: '✨🌙🎊'
    }
  },
  ramzan: {
    name: 'Ramzan',
    emoji: '🕌',
    color: '#6366f1',
    period: 'Based on Lunar Calendar',
    products: ['dates', 'oil', 'rice', 'spices', 'flour', 'lentils'],
    discount: 8,
    bundleIdeas: [
      {
        name: 'Sehri Essentials',
        products: ['dates', 'flour', 'oil'],
        description: 'Pre-dawn meal essentials for healthy sehri',
        margin: 10
      },
      {
        name: 'Iftar Delights',
        products: ['dates', 'oil', 'spices'],
        description: 'Traditional iftar preparation ingredients',
        margin: 12
      }
    ],
    whatsappTemplate: {
      greeting: '🕌 Ramzan Kareem! 🌙',
      message: 'Blessed Ramzan with our special collection!',
      cta: 'Shop Ramzan Essentials',
      emoji: '🌙✨🕌'
    }
  },
  pongal: {
    name: 'Pongal',
    emoji: '🌾',
    color: '#f97316',
    period: 'January',
    products: ['rice', 'jaggery', 'coconut', 'ghee', 'cashews', 'raisins'],
    discount: 10,
    bundleIdeas: [
      {
        name: 'Traditional Pongal Kit',
        products: ['rice', 'jaggery', 'ghee'],
        description: 'Traditional ingredients for authentic Pongal preparation',
        margin: 11
      },
      {
        name: 'Sweet Pongal Special',
        products: ['jaggery', 'coconut', 'cashews', 'raisins'],
        description: 'Premium ingredients for delicious sweet Pongal',
        margin: 14
      }
    ],
    whatsappTemplate: {
      greeting: '🌾 Thai Pirandhal Vazhi Pirakkum! 🎊',
      message: 'Celebrate Pongal with our traditional collection!',
      cta: 'Order Pongal Specials',
      emoji: '🌾🎊✨'
    }
  },
  navratri: {
    name: 'Navratri',
    emoji: '💃',
    color: '#8b5cf6',
    period: 'September-October',
    products: ['fruits', 'milk', 'nuts', 'rock-salt', 'buckwheat', 'water-chestnut'],
    discount: 12,
    bundleIdeas: [
      {
        name: 'Fasting Essentials',
        products: ['fruits', 'milk', 'nuts'],
        description: 'Nutritious fasting foods for Navratri',
        margin: 13
      },
      {
        name: 'Vrat Special Kit',
        products: ['rock-salt', 'buckwheat', 'water-chestnut'],
        description: 'Special ingredients allowed during Navratri fasting',
        margin: 15
      }
    ],
    whatsappTemplate: {
      greeting: '💃 Navratri Ki Shubhkamnayein! 🎊',
      message: 'Celebrate nine divine nights with our fasting collection!',
      cta: 'Shop Navratri Specials',
      emoji: '💃🎊✨'
    }
  }
}

// Weather-based demand patterns
export const WEATHER_DEMAND = {
  hot: {
    temperature: '>35°C',
    products: ['cold-drinks', 'ice-cream', 'water', 'coconut-water', 'lassi'],
    multiplier: 1.3,
    message: 'Beat the heat! Stock up on cooling beverages and ice cream.'
  },
  cold: {
    temperature: '<15°C',
    products: ['tea', 'coffee', 'hot-chocolate', 'soups', 'dry-fruits'],
    multiplier: 1.2,
    message: 'Winter warmth! Hot beverages and nutritious dry fruits in high demand.'
  },
  rainy: {
    condition: 'Monsoon/Heavy Rain',
    products: ['pakora-mix', 'tea', 'ginger', 'onions', 'instant-noodles'],
    multiplier: 1.25,
    message: 'Monsoon munchies! Perfect weather for hot snacks and tea.'
  }
}

// Competitor price tracking simulation
export const COMPETITOR_ALERTS = [
  {
    id: 'comp1',
    competitor: 'Mumbai Grocery Store',
    product: 'Sugar 1kg',
    ourPrice: 60,
    theirPrice: 55,
    difference: -5,
    action: 'Consider price adjustment',
    urgency: 'high',
    date: new Date()
  },
  {
    id: 'comp2',
    competitor: 'Local Kirana',
    product: 'Rice 1kg',
    ourPrice: 180,
    theirPrice: 185,
    difference: 5,
    action: 'Maintain competitive advantage',
    urgency: 'low',
    date: new Date()
  },
  {
    id: 'comp3',
    competitor: 'Super Mart',
    product: 'Oil 1L',
    ourPrice: 130,
    theirPrice: 125,
    difference: -5,
    action: 'Monitor closely',
    urgency: 'medium',
    date: new Date()
  }
]

export function matchProductsForFestival(festival, availableProducts) {
  const festivalData = FESTIVAL_CALENDAR[festival]
  if (!festivalData) return []

  return availableProducts.filter(product => {
    const productName = product.name.toLowerCase()
    return festivalData.products.some(festivalProduct => {
      // Enhanced matching logic
      const keywords = festivalProduct.split('-')
      return keywords.some(keyword => productName.includes(keyword))
    })
  })
}

export function generateFestivalBundle(festival, products, bundleType = 0) {
  const festivalData = FESTIVAL_CALENDAR[festival]
  if (!festivalData || !products.length) return null

  const bundleIdea = festivalData.bundleIdeas[bundleType] || festivalData.bundleIdeas[0]
  const matchedProducts = matchProductsForFestival(festival, products)
  
  if (matchedProducts.length < 2) return null

  const bundleProducts = matchedProducts.slice(0, 4) // Max 4 products per bundle
  const totalPrice = bundleProducts.reduce((sum, p) => sum + p.price, 0)
  const discountAmount = Math.round(totalPrice * (festivalData.discount / 100))
  const finalPrice = totalPrice - discountAmount

  return {
    id: `bundle-${festival}-${Date.now()}`,
    festival,
    name: bundleIdea.name,
    description: bundleIdea.description,
    products: bundleProducts,
    originalPrice: totalPrice,
    discount: festivalData.discount,
    discountAmount,
    finalPrice,
    savings: discountAmount,
    margin: bundleIdea.margin,
    whatsappTemplate: generateWhatsAppMessage(festivalData, bundleIdea.name, finalPrice),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  }
}

export function generateWhatsAppMessage(festivalData, bundleName, price) {
  const template = festivalData.whatsappTemplate
  
  return {
    message: `${template.greeting}

${template.message}

🎁 *${bundleName}* - Only ₹${price}
${template.emoji}

${template.cta}

Hurry! Limited time offer.

Order now: Call +919876543210
Visit: Shree Ganesh Kirana

${template.emoji}`,
    
    shortMessage: `${festivalData.emoji} ${bundleName} - ₹${price} ${template.emoji}\n${template.cta}! Call +919876543210`,
    
    image: `/festival-images/${festivalData.name.toLowerCase()}.jpg`,
    
    metadata: {
      festival: festivalData.name,
      bundle: bundleName,
      price,
      discount: festivalData.discount
    }
  }
}

export function getUpcomingFestivals() {
  const currentMonth = new Date().getMonth()
  const festivals = Object.entries(FESTIVAL_CALENDAR)
  
  // Simple logic to determine upcoming festivals
  // In real app, this would use proper date calculations
  return festivals.map(([key, festival]) => ({
    key,
    ...festival,
    daysUntil: Math.floor(Math.random() * 60) + 1, // Random for demo
    isUpcoming: Math.random() > 0.5
  })).sort((a, b) => a.daysUntil - b.daysUntil)
}

export function generateHyperlocalAlerts(weather, competitors, inventory) {
  const alerts = []
  
  // Weather-based alerts
  if (weather && weather.temperature > 35) {
    alerts.push({
      type: 'weather',
      severity: 'high',
      title: '🌡️ Heat Wave Alert',
      message: `${weather.temperature}°C today! Cold drinks demand expected to surge by 30%`,
      action: 'Stock up on beverages and ice cream',
      products: WEATHER_DEMAND.hot.products,
      impact: 'high'
    })
  }

  // Competitor alerts
  COMPETITOR_ALERTS.forEach(comp => {
    if (comp.urgency === 'high') {
      alerts.push({
        type: 'competitor',
        severity: comp.urgency,
        title: '💰 Price Alert',
        message: `${comp.competitor} selling ${comp.product} at ₹${comp.theirPrice} (₹${Math.abs(comp.difference)} ${comp.difference > 0 ? 'more' : 'less'})`,
        action: comp.action,
        product: comp.product,
        impact: 'medium'
      })
    }
  })

  // Low stock alerts
  inventory.filter(p => p.stock < 10).forEach(product => {
    alerts.push({
      type: 'inventory',
      severity: 'medium',
      title: '📦 Low Stock Warning',
      message: `${product.name} running low - only ${product.stock} ${product.unit} left`,
      action: 'Reorder immediately',
      product: product.name,
      impact: 'high'
    })
  })

  return alerts.sort((a, b) => {
    const severityOrder = { high: 3, medium: 2, low: 1 }
    return severityOrder[b.severity] - severityOrder[a.severity]
  })
}