// Day-End Cash Session Management

import { formatCurrency } from './utils'

export const DENOMINATIONS = {
  notes: [
    { value: 2000, label: '₹2000', color: '#8b5cf6' },
    { value: 500, label: '₹500', color: '#06b6d4' },
    { value: 200, label: '₹200', color: '#f59e0b' },
    { value: 100, label: '₹100', color: '#10b981' },
    { value: 50, label: '₹50', color: '#ec4899' },
    { value: 20, label: '₹20', color: '#f97316' },
    { value: 10, label: '₹10', color: '#84cc16' }
  ],
  coins: [
    { value: 10, label: '₹10', color: '#6b7280' },
    { value: 5, label: '₹5', color: '#6b7280' },
    { value: 2, label: '₹2', color: '#6b7280' },
    { value: 1, label: '₹1', color: '#6b7280' }
  ]
}

export class CashSessionManager {
  constructor() {
    this.session = {
      id: null,
      date: new Date().toISOString().split('T')[0],
      startTime: new Date(),
      endTime: null,
      openingCash: 0,
      denominations: {},
      totalCounted: 0,
      expectedCash: 0,
      actualCash: 0,
      difference: 0,
      cashSales: 0,
      upiSales: 0,
      totalSales: 0,
      notes: '',
      discrepancies: [],
      status: 'open' // open, closed, reconciled
    }
  }

  initializeSession(openingCash = 5000) {
    this.session.id = `cs-${Date.now()}`
    this.session.openingCash = openingCash
    this.session.expectedCash = openingCash
    
    // Initialize denomination counts to 0
    DENOMINATIONS.notes.forEach(denom => {
      this.session.denominations[denom.value] = 0
    })
    DENOMINATIONS.coins.forEach(denom => {
      this.session.denominations[denom.value] = 0
    })
    
    return this.session
  }

  updateDenomination(value, count) {
    this.session.denominations[value] = Math.max(0, count)
    this.calculateTotals()
    return this.session
  }

  incrementDenomination(value, amount = 1) {
    this.session.denominations[value] = (this.session.denominations[value] || 0) + amount
    this.calculateTotals()
    return this.session
  }

  calculateTotals() {
    // Calculate total counted cash
    this.session.totalCounted = Object.entries(this.session.denominations)
      .reduce((total, [value, count]) => {
        return total + (parseInt(value) * count)
      }, 0)

    this.session.actualCash = this.session.totalCounted
    this.session.difference = this.session.actualCash - this.session.expectedCash
    
    return {
      totalCounted: this.session.totalCounted,
      difference: this.session.difference,
      shortfall: this.session.difference < 0 ? Math.abs(this.session.difference) : 0,
      surplus: this.session.difference > 0 ? this.session.difference : 0
    }
  }

  updateSalesData(cashSales, upiSales) {
    this.session.cashSales = cashSales
    this.session.upiSales = upiSales
    this.session.totalSales = cashSales + upiSales
    this.session.expectedCash = this.session.openingCash + cashSales
    
    this.calculateTotals()
    return this.session
  }

  addDiscrepancy(type, amount, reason) {
    const discrepancy = {
      id: `disc-${Date.now()}`,
      type, // 'shortage', 'surplus', 'damage', 'theft', 'other'
      amount,
      reason,
      timestamp: new Date()
    }
    
    this.session.discrepancies.push(discrepancy)
    return discrepancy
  }

  closeSession(notes = '') {
    this.session.endTime = new Date()
    this.session.notes = notes
    this.session.status = 'closed'
    
    // Final calculations
    this.calculateTotals()
    
    return this.getSessionSummary()
  }

  getSessionSummary() {
    const summary = {
      ...this.session,
      duration: this.session.endTime ? 
        Math.round((this.session.endTime - this.session.startTime) / 1000 / 60) : 0,
      
      denominationBreakdown: this.getDenominationBreakdown(),
      
      reconciliation: {
        expectedCash: this.session.expectedCash,
        actualCash: this.session.actualCash,
        difference: this.session.difference,
        percentageError: this.session.expectedCash > 0 ? 
          ((this.session.difference / this.session.expectedCash) * 100).toFixed(2) : 0,
        status: this.getReconciliationStatus()
      },
      
      salesBreakdown: {
        cash: {
          amount: this.session.cashSales,
          percentage: this.session.totalSales > 0 ? 
            ((this.session.cashSales / this.session.totalSales) * 100).toFixed(1) : 0
        },
        upi: {
          amount: this.session.upiSales,
          percentage: this.session.totalSales > 0 ? 
            ((this.session.upiSales / this.session.totalSales) * 100).toFixed(1) : 0
        }
      }
    }
    
    return summary
  }

  getDenominationBreakdown() {
    const breakdown = []
    
    // Process notes
    DENOMINATIONS.notes.forEach(denom => {
      const count = this.session.denominations[denom.value] || 0
      const total = denom.value * count
      
      breakdown.push({
        ...denom,
        count,
        total,
        type: 'note'
      })
    })
    
    // Process coins
    const coinTotal = DENOMINATIONS.coins.reduce((total, denom) => {
      const count = this.session.denominations[denom.value] || 0
      return total + (denom.value * count)
    }, 0)
    
    breakdown.push({
      value: 'coins',
      label: 'Coins',
      color: '#6b7280',
      count: coinTotal > 0 ? 1 : 0,
      total: coinTotal,
      type: 'coins'
    })
    
    return breakdown.filter(item => item.total > 0)
  }

  getReconciliationStatus() {
    const absDifference = Math.abs(this.session.difference)
    
    if (absDifference === 0) return 'perfect'
    if (absDifference <= 10) return 'acceptable' // Within ₹10
    if (absDifference <= 50) return 'minor_variance'
    if (absDifference <= 200) return 'major_variance'
    return 'significant_discrepancy'
  }

  exportToPDF() {
    // This would generate a PDF report
    // For now, return the data structure that would be used
    return {
      shopName: 'Shree Ganesh Kirana',
      address: 'Shop No. 15, Gandhi Nagar, Mumbai - 400001',
      date: this.session.date,
      sessionId: this.session.id,
      summary: this.getSessionSummary(),
      signature: {
        owner: 'Ramesh Kumar',
        staff: '',
        date: new Date().toLocaleDateString('en-IN')
      }
    }
  }

  // Utility method to get demo session data
  static getDemoSession() {
    const manager = new CashSessionManager()
    const session = manager.initializeSession(5000)
    
    // Add some demo data
    manager.updateSalesData(2300, 1800) // ₹2300 cash, ₹1800 UPI
    
    // Add some denominations
    manager.updateDenomination(2000, 2)  // 2 x ₹2000 notes
    manager.updateDenomination(500, 4)   // 4 x ₹500 notes
    manager.updateDenomination(200, 3)   // 3 x ₹200 notes
    manager.updateDenomination(100, 8)   // 8 x ₹100 notes
    manager.updateDenomination(50, 6)    // 6 x ₹50 notes
    manager.updateDenomination(20, 10)   // 10 x ₹20 notes
    manager.updateDenomination(10, 15)   // 15 x ₹10 notes
    manager.updateDenomination(5, 20)    // ₹100 in coins
    
    return manager.getSessionSummary()
  }
}

// Helper functions for cash session management
export function formatDenomination(value, count) {
  const total = value * count
  return `${count} × ₹${value} = ${formatCurrency(total)}`
}

export function calculateChangeBreakdown(amount) {
  const breakdown = []
  let remaining = amount
  
  // Use largest denominations first
  const allDenominations = [
    ...DENOMINATIONS.notes.map(d => d.value),
    ...DENOMINATIONS.coins.map(d => d.value)
  ].sort((a, b) => b - a)
  
  allDenominations.forEach(value => {
    if (remaining >= value) {
      const count = Math.floor(remaining / value)
      breakdown.push({ value, count, total: value * count })
      remaining = remaining % value
    }
  })
  
  return breakdown
}

export function validateCashCount(denominations) {
  const errors = []
  
  // Check for negative values
  Object.entries(denominations).forEach(([value, count]) => {
    if (count < 0) {
      errors.push(`${value} denomination cannot be negative`)
    }
  })
  
  // Check for unrealistic counts
  Object.entries(denominations).forEach(([value, count]) => {
    const intValue = parseInt(value)
    if (intValue >= 500 && count > 50) {
      errors.push(`Unusually high count for ₹${value} notes: ${count}`)
    }
  })
  
  return {
    isValid: errors.length === 0,
    errors
  }
}