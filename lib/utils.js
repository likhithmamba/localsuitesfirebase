import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Currency formatting for Indian Rupee
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Format date for Indian locale
export function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

// Format datetime for Indian locale
export function formatDateTime(date) {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

// Generate shop URL slug
export function generateShopSlug(shopName) {
  return shopName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 30)
}

// Generate QR code data URL (mock implementation)
export function generateQRCode(text) {
  return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==`
}

// Calculate price suggestions based on inputs
export function calculateDynamicPrice(basePrice, factors = {}) {
  let suggestedPrice = basePrice
  const { competition = 0, stockLevel = 'normal', demand = 'normal', weather = 'normal' } = factors
  
  // Competition adjustment
  if (competition > 0) {
    suggestedPrice = Math.max(suggestedPrice - competition, basePrice * 0.8)
  }
  
  // Stock level adjustment
  if (stockLevel === 'low') {
    suggestedPrice *= 1.1
  } else if (stockLevel === 'high') {
    suggestedPrice *= 0.95
  }
  
  // Demand adjustment
  if (demand === 'high') {
    suggestedPrice *= 1.05
  } else if (demand === 'low') {
    suggestedPrice *= 0.95
  }
  
  // Weather adjustment for relevant products
  if (weather === 'hot' && factors.category === 'beverages') {
    suggestedPrice *= 1.03
  }
  
  const confidence = Math.random() * 0.3 + 0.7 // 70-100% confidence
  const margin = ((suggestedPrice - basePrice) / basePrice) * 100
  
  return {
    suggestedPrice: Math.round(suggestedPrice * 100) / 100,
    confidence,
    margin,
    reasoning: generatePriceReasoning(factors)
  }
}

function generatePriceReasoning(factors) {
  const reasons = []
  if (factors.competition > 0) reasons.push('Competitor price adjustment')
  if (factors.stockLevel === 'low') reasons.push('Low stock premium')
  if (factors.demand === 'high') reasons.push('High demand surge')
  if (factors.weather === 'hot') reasons.push('Weather-driven demand')
  
  return reasons.length > 0 ? reasons.join(', ') : 'Standard pricing'
}

// Voice command parsing (mock implementation)
export function parseVoiceCommand(transcript) {
  const text = transcript.toLowerCase()
  
  // Pattern for adding products: "add 5 kg rice at 70 rupees"
  const addPattern = /add (\d+(?:\.\d+)?)\s*(\w+)?\s*(.+?)\s*(?:at|for)\s*(\d+)\s*(?:rupees?|rs?\.?)/i
  const match = text.match(addPattern)
  
  if (match) {
    return {
      action: 'ADD_PRODUCT',
      data: {
        quantity: parseFloat(match[1]),
        unit: match[2] || 'pieces',
        name: match[3].trim(),
        price: parseInt(match[4])
      }
    }
  }
  
  return { action: 'UNKNOWN', text }
}

// Festival bundle suggestions
export const FESTIVAL_BUNDLES = {
  diwali: {
    name: 'Diwali Special',
    products: ['sweets', 'diyas', 'rangoli', 'crackers'],
    discount: 15
  },
  ramzan: {
    name: 'Ramzan Essentials', 
    products: ['dates', 'oil', 'rice', 'spices'],
    discount: 10
  },
  holi: {
    name: 'Holi Colors',
    products: ['colors', 'sweets', 'drinks', 'snacks'],
    discount: 12
  }
}