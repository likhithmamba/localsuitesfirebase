// QR Code Generation and Management for Price Tags and Products

export class QRCodeGenerator {
  constructor(baseUrl = 'https://shreeganesha.smartlocal.in') {
    this.baseUrl = baseUrl
  }

  // Generate product QR code with live pricing
  generateProductQR(product, shopId) {
    const qrData = {
      type: 'product',
      productId: product.id,
      shopId,
      name: product.name,
      price: product.price,
      url: `${this.baseUrl}/product/${product.id}?shop=${shopId}`,
      timestamp: new Date().toISOString()
    }

    return {
      id: `qr-${product.id}-${Date.now()}`,
      productId: product.id,
      data: JSON.stringify(qrData),
      displayUrl: qrData.url,
      qrCodeUrl: this.generateQRImageUrl(qrData.url),
      printableData: {
        productName: product.name,
        price: product.price,
        unit: product.unit,
        category: product.category,
        shopName: 'Shree Ganesh Kirana',
        qrCode: qrData.url
      },
      createdAt: new Date()
    }
  }

  // Generate storefront QR code
  generateStorefrontQR(shop) {
    const qrData = {
      type: 'storefront',
      shopId: shop.id,
      name: shop.name,
      url: `${this.baseUrl}/shop/${shop.slug}`,
      contact: shop.phone,
      timestamp: new Date().toISOString()
    }

    return {
      id: `qr-shop-${shop.id}-${Date.now()}`,
      shopId: shop.id,
      data: JSON.stringify(qrData),
      displayUrl: qrData.url,
      qrCodeUrl: this.generateQRImageUrl(qrData.url),
      printableData: {
        shopName: shop.name,
        address: shop.address,
        phone: shop.phone,
        upiId: shop.upiId,
        qrCode: qrData.url
      },
      createdAt: new Date()
    }
  }

  // Generate payment QR code
  generatePaymentQR(amount, orderId, shop) {
    // UPI payment URL format
    const upiUrl = `upi://pay?pa=${shop.upiId}&pn=${encodeURIComponent(shop.name)}&am=${amount}&tid=${orderId}&cu=INR&tn=${encodeURIComponent(`Payment for Order ${orderId}`)}`

    return {
      id: `qr-payment-${orderId}-${Date.now()}`,
      orderId,
      amount,
      upiUrl,
      qrCodeUrl: this.generateQRImageUrl(upiUrl),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      createdAt: new Date()
    }
  }

  // Generate WhatsApp contact QR
  generateWhatsAppQR(phone, message = '') {
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}${message ? `?text=${encodeURIComponent(message)}` : ''}`
    
    return {
      id: `qr-whatsapp-${Date.now()}`,
      phone,
      message,
      url: whatsappUrl,
      qrCodeUrl: this.generateQRImageUrl(whatsappUrl),
      createdAt: new Date()
    }
  }

  // Generate festival offer QR
  generateOfferQR(offer, shop) {
    const offerUrl = `${this.baseUrl}/offer/${offer.id}?shop=${shop.id}`
    
    return {
      id: `qr-offer-${offer.id}-${Date.now()}`,
      offerId: offer.id,
      offerName: offer.name,
      discount: offer.discount,
      url: offerUrl,
      qrCodeUrl: this.generateQRImageUrl(offerUrl),
      validUntil: offer.validUntil,
      createdAt: new Date()
    }
  }

  // Generate QR image URL (using QR API service)
  generateQRImageUrl(data, size = 200) {
    // Using a public QR code generation API
    const encodedData = encodeURIComponent(data)
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedData}&format=png&margin=10`
  }

  // Generate printable QR tags for multiple products
  generateBulkPrintTags(products, shopId, layout = 'grid') {
    const tags = products.map(product => this.generateProductQR(product, shopId))
    
    return {
      id: `bulk-print-${Date.now()}`,
      layout,
      tags,
      printSettings: {
        pageSize: 'A4',
        orientation: 'portrait',
        tagsPerPage: layout === 'grid' ? 12 : 6,
        margins: { top: 20, right: 20, bottom: 20, left: 20 }
      },
      createdAt: new Date()
    }
  }

  // Parse scanned QR code data
  parseQRData(qrString) {
    try {
      // Try to parse as JSON first (our internal QR codes)
      const data = JSON.parse(qrString)
      return {
        success: true,
        type: data.type,
        data,
        isInternal: true
      }
    } catch {
      // Handle external QR codes (URLs, UPI, etc.)
      if (qrString.startsWith('upi://')) {
        return {
          success: true,
          type: 'upi',
          data: this.parseUPIString(qrString),
          isInternal: false
        }
      }
      
      if (qrString.startsWith('http://') || qrString.startsWith('https://')) {
        return {
          success: true,
          type: 'url',
          data: { url: qrString },
          isInternal: false
        }
      }

      if (qrString.startsWith('tel:') || /^\+?[\d\s-()]+$/.test(qrString)) {
        return {
          success: true,
          type: 'phone',
          data: { phone: qrString.replace('tel:', '') },
          isInternal: false
        }
      }

      return {
        success: true,
        type: 'text',
        data: { text: qrString },
        isInternal: false
      }
    }
  }

  // Parse UPI QR string
  parseUPIString(upiString) {
    const params = new URLSearchParams(upiString.split('?')[1])
    
    return {
      payeeAddress: params.get('pa'),
      payeeName: params.get('pn'),
      amount: params.get('am'),
      transactionId: params.get('tid'),
      currency: params.get('cu'),
      transactionNote: params.get('tn')
    }
  }

  // Generate QR codes for shelf pricing
  generateShelfPricingSystem(products, shopId) {
    const pricingQRs = products.map(product => {
      const qr = this.generateProductQR(product, shopId)
      
      return {
        ...qr,
        shelfDisplay: {
          productName: product.name,
          price: `₹${product.price}`,
          unit: product.unit,
          mrp: product.mrp || product.price * 1.1,
          discount: product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0,
          qrSize: 'medium', // small, medium, large
          template: 'modern' // classic, modern, minimal
        }
      }
    })

    return {
      id: `shelf-pricing-${shopId}-${Date.now()}`,
      shopId,
      products: pricingQRs,
      printLayout: {
        format: 'shelf-tags',
        size: '6cm x 4cm',
        orientation: 'landscape'
      },
      createdAt: new Date()
    }
  }

  // Track QR code scans for analytics
  trackQRScan(qrId, scanData) {
    return {
      qrId,
      scannedAt: new Date(),
      location: scanData.location,
      userAgent: scanData.userAgent,
      referrer: scanData.referrer,
      scanType: scanData.scanType // 'camera', 'image', 'manual'
    }
  }
}

// Pre-configured QR generator for the shop
export const shopQRGenerator = new QRCodeGenerator('https://shreeganesha.smartlocal.in')

// QR Code templates for different use cases
export const QR_TEMPLATES = {
  product: {
    name: 'Product Price Tag',
    size: '5cm x 3cm',
    elements: ['name', 'price', 'unit', 'qr'],
    style: 'modern'
  },
  
  shelf: {
    name: 'Shelf Display',
    size: '8cm x 6cm', 
    elements: ['name', 'price', 'mrp', 'discount', 'qr'],
    style: 'bold'
  },

  payment: {
    name: 'Payment QR',
    size: '10cm x 10cm',
    elements: ['amount', 'shopName', 'qr'],
    style: 'clean'
  },

  contact: {
    name: 'Contact Card',
    size: '9cm x 5cm',
    elements: ['shopName', 'phone', 'address', 'qr'],
    style: 'business'
  }
}

// Bulk QR operations
export class BulkQRManager {
  constructor() {
    this.generator = new QRCodeGenerator()
    this.queue = []
  }

  addToQueue(operation) {
    this.queue.push({
      ...operation,
      id: `bulk-op-${Date.now()}`,
      status: 'pending',
      createdAt: new Date()
    })
  }

  async processBulkGeneration(products, shopId, options = {}) {
    const results = {
      success: [],
      failed: [],
      total: products.length
    }

    for (const product of products) {
      try {
        const qr = this.generator.generateProductQR(product, shopId)
        results.success.push({
          productId: product.id,
          productName: product.name,
          qrId: qr.id,
          qrUrl: qr.qrCodeUrl
        })
      } catch (error) {
        results.failed.push({
          productId: product.id,
          productName: product.name,
          error: error.message
        })
      }
    }

    return {
      ...results,
      generatedAt: new Date(),
      options
    }
  }

  exportForPrinting(qrCodes, format = 'pdf') {
    return {
      format,
      qrCodes,
      printSettings: {
        pageSize: 'A4',
        orientation: 'portrait',
        margin: 20,
        columns: 3,
        rows: 4
      },
      exportedAt: new Date()
    }
  }
}

// Demo QR codes for testing
export function getDemoQRCodes(shopId = 'demo-shop-123') {
  const generator = new QRCodeGenerator()
  
  const demoProducts = [
    { id: 'p1', name: 'Basmati Rice 1kg', price: 180, unit: 'kg' },
    { id: 'p2', name: 'Sugar 1kg', price: 60, unit: 'kg' },
    { id: 'p3', name: 'Oil 1L', price: 130, unit: 'L' }
  ]

  return {
    productQRs: demoProducts.map(product => generator.generateProductQR(product, shopId)),
    
    shopQR: generator.generateStorefrontQR({
      id: shopId,
      name: 'Shree Ganesh Kirana',
      slug: 'shree-ganesh-kirana',
      phone: '+919876543210',
      address: 'Gandhi Nagar, Mumbai',
      upiId: 'shreeganesha@paytm'
    }),
    
    paymentQR: generator.generatePaymentQR(420, 'ORD123', {
      upiId: 'shreeganesha@paytm',
      name: 'Shree Ganesh Kirana'
    }),
    
    whatsappQR: generator.generateWhatsAppQR('+919876543210', 'Hello! I would like to place an order.')
  }
}