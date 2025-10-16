// i18n configuration for SmartLocal Suite
export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸' },
  hi: { name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  mr: { name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  ta: { name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  te: { name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  gu: { name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  bn: { name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  ml: { name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  pa: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
}

// Translation keys and fallbacks
export const TRANSLATIONS = {
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      loading: 'Loading...',
      error: 'Something went wrong',
      success: 'Success!'
    },
    nav: {
      dashboard: 'Dashboard',
      inventory: 'Inventory', 
      orders: 'Orders',
      pricing: 'Pricing',
      marketing: 'Marketing',
      analytics: 'Analytics',
      settings: 'Settings'
    },
    dashboard: {
      welcome: 'Welcome back',
      totalSales: 'Total Sales',
      ordersToday: 'Orders Today', 
      lowStock: 'Low Stock Items',
      revenue: 'Revenue'
    },
    inventory: {
      addProduct: 'Add Product',
      productName: 'Product Name',
      price: 'Price',
      stock: 'Stock',
      category: 'Category',
      actions: 'Actions'
    }
  },
  hi: {
    common: {
      save: 'सेव करें',
      cancel: 'रद्द करें', 
      delete: 'डिलीट करें',
      edit: 'एडिट करें',
      add: 'जोड़ें',
      search: 'खोजें',
      loading: 'लोड हो रहा है...',
      error: 'कुछ गलत हुआ',
      success: 'सफल!'
    },
    nav: {
      dashboard: 'डैशबोर्ड',
      inventory: 'स्टॉक',
      orders: 'ऑर्डर',
      pricing: 'प्राइसिंग',
      marketing: 'मार्केटिंग', 
      analytics: 'एनालिटिक्स',
      settings: 'सेटिंग्स'
    },
    dashboard: {
      welcome: 'वापसी पर स्वागत है',
      totalSales: 'कुल बिक्री',
      ordersToday: 'आज के ऑर्डर',
      lowStock: 'कम स्टॉक आइटम',
      revenue: 'आय'
    },
    inventory: {
      addProduct: 'प्रोडक्ट जोड़ें',
      productName: 'प्रोडक्ट का नाम',
      price: 'कीमत',
      stock: 'स्टॉक',
      category: 'कैटेगरी',
      actions: 'एक्शन'
    }
  }
  // Additional languages can be added here
}

export function getTranslation(key, lang = 'en') {
  const keys = key.split('.')
  let value = TRANSLATIONS[lang] || TRANSLATIONS.en
  
  for (const k of keys) {
    value = value?.[k]
    if (!value) break
  }
  
  // Fallback to English if translation not found
  if (!value && lang !== 'en') {
    value = TRANSLATIONS.en
    for (const k of keys) {
      value = value?.[k]
      if (!value) break
    }
  }
  
  return value || key
}

export function t(key, lang) {
  return getTranslation(key, lang)
}