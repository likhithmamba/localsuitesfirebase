import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase, COLLECTIONS } from '@/lib/mongodb'
import { v4 as uuidv4 } from 'uuid'
import { DEMO_USERS } from '@/lib/auth'
import { calculateDynamicPrice, parseVoiceCommand, FESTIVAL_BUNDLES } from '@/lib/utils'
import { 
  FESTIVAL_CALENDAR, 
  generateFestivalBundle, 
  getUpcomingFestivals,
  generateHyperlocalAlerts,
  matchProductsForFestival 
} from '@/lib/festivals'
import { CashSessionManager } from '@/lib/cashSession'
import { QRCodeGenerator, getDemoQRCodes } from '@/lib/qrGenerator'

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

// Demo data for Shree Ganesh Kirana
const DEMO_SHOP = {
  id: 'demo-shop-123',
  name: 'Shree Ganesh Kirana',
  slug: 'shree-ganesh-kirana',
  owner: 'Ramesh Kumar',
  phone: '+919876543210',
  address: 'Shop No. 15, Gandhi Nagar, Mumbai - 400001',
  gstNumber: '27AADCS1234F1Z5',
  gstEnabled: true,
  upiId: 'shreeganesha@paytm',
  storefront: 'https://shreeganesha.smartlocal.in',
  languages: ['hi', 'en', 'mr'],
  timezone: 'Asia/Kolkata',
  currency: 'INR',
  createdAt: new Date('2024-01-15'),
  isActive: true
}

const DEMO_PRODUCTS = [
  { id: 'p1', name: 'Basmati Rice 1kg', category: 'Grains', price: 180, cost: 150, stock: 45, unit: 'kg', barcode: '1234567890123', image: '/api/placeholder/200/200' },
  { id: 'p2', name: 'Wheat Flour (Atta) 5kg', category: 'Grains', price: 250, cost: 200, stock: 30, unit: 'kg', barcode: '1234567890124', image: '/api/placeholder/200/200' },
  { id: 'p3', name: 'Sugar 1kg', category: 'Grocery', price: 60, cost: 50, stock: 25, unit: 'kg', barcode: '1234567890125', image: '/api/placeholder/200/200' },
  { id: 'p4', name: 'Sunflower Oil 1L', category: 'Oil', price: 130, cost: 110, stock: 20, unit: 'L', barcode: '1234567890126', image: '/api/placeholder/200/200' },
  { id: 'p5', name: 'Toor Dal 500g', category: 'Pulses', price: 85, cost: 70, stock: 35, unit: 'g', barcode: '1234567890127', image: '/api/placeholder/200/200' },
  { id: 'p6', name: 'Tea Powder 250g', category: 'Beverages', price: 120, cost: 95, stock: 40, unit: 'g', barcode: '1234567890128', image: '/api/placeholder/200/200' },
  { id: 'p7', name: 'Biscuits Pack', category: 'Snacks', price: 25, cost: 18, stock: 60, unit: 'pack', barcode: '1234567890129', image: '/api/placeholder/200/200' },
  { id: 'p8', name: 'Salt 1kg', category: 'Grocery', price: 20, cost: 15, stock: 50, unit: 'kg', barcode: '1234567890130', image: '/api/placeholder/200/200' },
  { id: 'p9', name: 'Chilli Powder 100g', category: 'Spices', price: 45, cost: 35, stock: 25, unit: 'g', barcode: '1234567890131', image: '/api/placeholder/200/200' },
  { id: 'p10', name: 'Turmeric Powder 200g', category: 'Spices', price: 55, cost: 42, stock: 30, unit: 'g', barcode: '1234567890132', image: '/api/placeholder/200/200' }
]

const DEMO_ORDERS = [
  { id: 'o1', customerName: 'Priya Mehta', items: [{ productId: 'p1', quantity: 2, price: 180 }, { productId: 'p3', quantity: 1, price: 60 }], total: 420, status: 'completed', paymentMethod: 'UPI', createdAt: new Date() },
  { id: 'o2', customerName: 'Amit Singh', items: [{ productId: 'p4', quantity: 1, price: 130 }], total: 130, status: 'pending', paymentMethod: 'Cash', createdAt: new Date() },
  { id: 'o3', customerName: 'Sunita Devi', items: [{ productId: 'p2', quantity: 1, price: 250 }, { productId: 'p5', quantity: 2, price: 85 }], total: 420, status: 'completed', paymentMethod: 'UPI', createdAt: new Date() }
]

export async function GET(request) {
  const { pathname, searchParams } = new URL(request.url)
  const pathSegments = pathname.split('/').filter(Boolean).slice(1) // Remove 'api'
  
  try {
    // Routes
    if (pathSegments[0] === 'auth' && pathSegments[1] === 'demo-login') {
      const role = searchParams.get('role') || 'owner'
      return NextResponse.json({ 
        success: true, 
        user: DEMO_USERS[role],
        shop: DEMO_SHOP
      }, { headers: corsHeaders })
    }

    if (pathSegments[0] === 'shop' && pathSegments[1] === 'demo') {
      return NextResponse.json({
        success: true,
        shop: DEMO_SHOP,
        products: DEMO_PRODUCTS,
        orders: DEMO_ORDERS
      }, { headers: corsHeaders })
    }

    if (pathSegments[0] === 'products') {
      const shopId = searchParams.get('shopId') || 'demo-shop-123'
      return NextResponse.json({
        success: true,
        products: DEMO_PRODUCTS
      }, { headers: corsHeaders })
    }

    if (pathSegments[0] === 'orders') {
      const shopId = searchParams.get('shopId') || 'demo-shop-123'
      return NextResponse.json({
        success: true,
        orders: DEMO_ORDERS
      }, { headers: corsHeaders })
    }

    if (pathSegments[0] === 'analytics' && pathSegments[1] === 'dashboard') {
      const shopId = searchParams.get('shopId') || 'demo-shop-123'
      
      const today = new Date()
      const salesData = [
        { date: '2024-01-01', sales: 1200, orders: 8 },
        { date: '2024-01-02', sales: 1500, orders: 12 },
        { date: '2024-01-03', sales: 900, orders: 6 },
        { date: '2024-01-04', sales: 1800, orders: 15 },
        { date: '2024-01-05', sales: 2100, orders: 18 },
        { date: '2024-01-06', sales: 1600, orders: 11 },
        { date: '2024-01-07', sales: 2300, orders: 20 }
      ]

      return NextResponse.json({
        success: true,
        analytics: {
          totalSales: 15600,
          ordersToday: 20,
          lowStockCount: 3,
          revenue: 2300,
          salesTrend: salesData,
          topProducts: DEMO_PRODUCTS.slice(0, 5),
          categoryBreakdown: [
            { category: 'Grains', sales: 45, value: 4200 },
            { category: 'Oil', sales: 30, value: 3900 },
            { category: 'Grocery', sales: 25, value: 2100 }
          ]
        }
      }, { headers: corsHeaders })
    }

    if (pathSegments[0] === 'pricing' && pathSegments[1] === 'suggest') {
      const productId = searchParams.get('productId')
      const product = DEMO_PRODUCTS.find(p => p.id === productId)
      
      if (!product) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404, headers: corsHeaders })
      }

      const suggestion = calculateDynamicPrice(product.price, {
        competition: Math.random() * 10,
        stockLevel: product.stock < 20 ? 'low' : 'normal',
        demand: Math.random() > 0.5 ? 'high' : 'normal',
        weather: 'normal',
        category: product.category.toLowerCase()
      })

      return NextResponse.json({
        success: true,
        suggestion: {
          ...suggestion,
          currentPrice: product.price,
          productId: product.id,
          productName: product.name
        }
      }, { headers: corsHeaders })
    }

    if (pathSegments[0] === 'voice' && pathSegments[1] === 'parse') {
      const transcript = searchParams.get('text') || 'add 5 kg rice at 70 rupees'
      const parsed = parseVoiceCommand(transcript)
      
      return NextResponse.json({
        success: true,
        parsed,
        transcript
      }, { headers: corsHeaders })
    }

    if (pathSegments[0] === 'bundles' && pathSegments[1] === 'festival') {
      const festival = searchParams.get('festival') || 'diwali'
      const bundle = FESTIVAL_BUNDLES[festival]
      
      if (!bundle) {
        return NextResponse.json({ success: false, error: 'Festival not found' }, { status: 404, headers: corsHeaders })
      }

      const bundleProducts = DEMO_PRODUCTS.filter(p => 
        bundle.products.some(bp => p.name.toLowerCase().includes(bp))
      ).slice(0, 4)

      return NextResponse.json({
        success: true,
        bundle: {
          ...bundle,
          products: bundleProducts,
          totalPrice: bundleProducts.reduce((sum, p) => sum + p.price, 0),
          discountedPrice: Math.round(bundleProducts.reduce((sum, p) => sum + p.price, 0) * (1 - bundle.discount / 100))
        }
      }, { headers: corsHeaders })
    }

    if (pathSegments[0] === 'cash-session') {
      return NextResponse.json({
        success: true,
        session: CashSessionManager.getDemoSession()
      }, { headers: corsHeaders })
    }

    // Festival Bundle Maker endpoints
    if (pathSegments[0] === 'festivals') {
      if (pathSegments[1] === 'upcoming') {
        return NextResponse.json({
          success: true,
          festivals: getUpcomingFestivals()
        }, { headers: corsHeaders })
      }

      if (pathSegments[1] === 'bundles') {
        const festival = searchParams.get('festival') || 'diwali'
        const bundleType = parseInt(searchParams.get('type') || '0')
        
        const bundle = generateFestivalBundle(festival, DEMO_PRODUCTS, bundleType)
        
        return NextResponse.json({
          success: true,
          bundle,
          festival: FESTIVAL_CALENDAR[festival]
        }, { headers: corsHeaders })
      }
    }

    // Hyperlocal Demand Radar
    if (pathSegments[0] === 'demand-radar') {
      const mockWeather = { temperature: 38, condition: 'sunny' }
      const alerts = generateHyperlocalAlerts(mockWeather, [], DEMO_PRODUCTS)
      
      return NextResponse.json({
        success: true,
        alerts,
        weather: mockWeather,
        lastUpdated: new Date()
      }, { headers: corsHeaders })
    }

    // QR Code Generation
    if (pathSegments[0] === 'qr') {
      if (pathSegments[1] === 'product') {
        const productId = searchParams.get('productId')
        const product = DEMO_PRODUCTS.find(p => p.id === productId)
        
        if (!product) {
          return NextResponse.json({ success: false, error: 'Product not found' }, 
            { status: 404, headers: corsHeaders })
        }

        const qrGenerator = new QRCodeGenerator()
        const qrCode = qrGenerator.generateProductQR(product, 'demo-shop-123')
        
        return NextResponse.json({
          success: true,
          qrCode
        }, { headers: corsHeaders })
      }

      if (pathSegments[1] === 'bulk') {
        const qrCodes = getDemoQRCodes('demo-shop-123')
        
        return NextResponse.json({
          success: true,
          qrCodes
        }, { headers: corsHeaders })
      }

      if (pathSegments[1] === 'shop') {
        const qrGenerator = new QRCodeGenerator()
        const shopQR = qrGenerator.generateStorefrontQR(DEMO_SHOP)
        
        return NextResponse.json({
          success: true,
          qrCode: shopQR
        }, { headers: corsHeaders })
      }
    }

    // Smart Notifications
    if (pathSegments[0] === 'notifications') {
      const notifications = [
        {
          id: 'n1',
          type: 'low_stock',
          title: '📦 Low Stock Alert',
          message: 'Sugar (1kg) running low - only 25 units left',
          severity: 'high',
          action: 'Reorder now',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: false
        },
        {
          id: 'n2', 
          type: 'festival',
          title: '🪔 Festival Opportunity',
          message: 'Diwali in 15 days - Create festive bundles now!',
          severity: 'medium',
          action: 'Create bundles',
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          isRead: false
        },
        {
          id: 'n3',
          type: 'competitor',
          title: '💰 Price Alert',
          message: 'Competitor reduced rice price by ₹10/kg',
          severity: 'high',
          action: 'Review pricing',
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
          isRead: true
        }
      ]

      return NextResponse.json({
        success: true,
        notifications,
        unreadCount: notifications.filter(n => !n.isRead).length
      }, { headers: corsHeaders })
    }

    // GST Invoice endpoints
    if (pathSegments[0] === 'gst') {
      if (pathSegments[1] === 'invoice') {
        const orderId = searchParams.get('orderId') || 'o1'
        const order = DEMO_ORDERS.find(o => o.id === orderId)
        
        if (!order) {
          return NextResponse.json({ success: false, error: 'Order not found' },
            { status: 404, headers: corsHeaders })
        }

        const gstInvoice = {
          invoiceNumber: `INV-${orderId.toUpperCase()}`,
          date: new Date(),
          shop: DEMO_SHOP,
          customer: {
            name: order.customerName,
            phone: order.customerPhone || '+919876543220'
          },
          items: order.items.map(item => ({
            ...item,
            gstRate: 5,
            gstAmount: Math.round(item.total * 0.05),
            totalWithGst: Math.round(item.total * 1.05)
          })),
          subtotal: order.total,
          totalGst: Math.round(order.total * 0.05),
          grandTotal: Math.round(order.total * 1.05),
          gstBreakdown: {
            cgst: Math.round(order.total * 0.025),
            sgst: Math.round(order.total * 0.025)
          }
        }

        return NextResponse.json({
          success: true,
          invoice: gstInvoice
        }, { headers: corsHeaders })
      }

      if (pathSegments[1] === 'summary') {
        const month = searchParams.get('month') || new Date().getMonth() + 1
        const year = searchParams.get('year') || new Date().getFullYear()
        
        const summary = {
          month,
          year,
          totalSales: 15600,
          gstCollected: 780,
          gstOrders: 12,
          nonGstOrders: 8,
          averageGstOrder: 1300,
          gstBreakdown: {
            cgst: 390,
            sgst: 390
          }
        }

        return NextResponse.json({
          success: true,
          summary
        }, { headers: corsHeaders })
      }
    }

    // Placeholder image endpoint
    if (pathSegments[0] === 'placeholder') {
      const width = pathSegments[1] || '200'
      const height = pathSegments[2] || '200'
      
      // Return a simple SVG placeholder
      const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="#f3f4f6"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial" font-size="14">Product Image</text>
      </svg>`
      
      return new Response(svg, {
        headers: { 
          'Content-Type': 'image/svg+xml',
          ...corsHeaders 
        }
      })
    }

    // Default 404
    return NextResponse.json({ 
      success: false, 
      error: 'Endpoint not found',
      path: pathSegments.join('/')
    }, { status: 404, headers: corsHeaders })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500, headers: corsHeaders })
  }
}

export async function POST(request) {
  const { pathname } = new URL(request.url)
  const pathSegments = pathname.split('/').filter(Boolean).slice(1)
  
  try {
    const body = await request.json()

    if (pathSegments[0] === 'products') {
      const newProduct = {
        id: uuidv4(),
        ...body,
        createdAt: new Date(),
        shopId: body.shopId || 'demo-shop-123'
      }
      
      return NextResponse.json({
        success: true,
        product: newProduct
      }, { headers: corsHeaders })
    }

    if (pathSegments[0] === 'orders') {
      const newOrder = {
        id: uuidv4(),
        ...body,
        status: 'pending',
        createdAt: new Date(),
        shopId: body.shopId || 'demo-shop-123'
      }
      
      return NextResponse.json({
        success: true,
        order: newOrder
      }, { headers: corsHeaders })
    }

    if (pathSegments[0] === 'pricing' && pathSegments[1] === 'approve') {
      return NextResponse.json({
        success: true,
        message: 'Price updated successfully',
        newPrice: body.newPrice,
        productId: body.productId
      }, { headers: corsHeaders })
    }

    if (pathSegments[0] === 'campaigns') {
      const newCampaign = {
        id: uuidv4(),
        ...body,
        status: 'active',
        createdAt: new Date(),
        shopId: body.shopId || 'demo-shop-123'
      }
      
      return NextResponse.json({
        success: true,
        campaign: newCampaign
      }, { headers: corsHeaders })
    }

    // Festival Bundle Creation
    if (pathSegments[0] === 'festivals' && pathSegments[1] === 'create-bundle') {
      const { festival, products, customName, customDiscount } = body
      
      const bundle = generateFestivalBundle(festival, products, 0)
      if (customName) bundle.name = customName
      if (customDiscount) bundle.discount = customDiscount
      
      return NextResponse.json({
        success: true,
        bundle,
        message: 'Festival bundle created successfully!'
      }, { headers: corsHeaders })
    }

    // Cash Session Management
    if (pathSegments[0] === 'cash-session') {
      const { action, ...sessionData } = body
      
      if (action === 'start') {
        const manager = new CashSessionManager()
        const session = manager.initializeSession(sessionData.openingCash)
        
        return NextResponse.json({
          success: true,
          session,
          message: 'Cash session started'
        }, { headers: corsHeaders })
      }
      
      if (action === 'update') {
        const manager = new CashSessionManager()
        manager.session = sessionData.session
        manager.updateSalesData(sessionData.cashSales, sessionData.upiSales)
        
        return NextResponse.json({
          success: true,
          session: manager.session
        }, { headers: corsHeaders })
      }
      
      if (action === 'close') {
        const manager = new CashSessionManager()
        manager.session = sessionData.session
        const summary = manager.closeSession(sessionData.notes)
        
        return NextResponse.json({
          success: true,
          summary,
          message: 'Cash session closed successfully'
        }, { headers: corsHeaders })
      }
    }

    // QR Code Generation
    if (pathSegments[0] === 'qr' && pathSegments[1] === 'generate') {
      const { type, productIds, shopId } = body
      const qrGenerator = new QRCodeGenerator()
      
      if (type === 'bulk-products' && productIds) {
        const products = DEMO_PRODUCTS.filter(p => productIds.includes(p.id))
        const qrCodes = products.map(product => qrGenerator.generateProductQR(product, shopId))
        
        return NextResponse.json({
          success: true,
          qrCodes,
          count: qrCodes.length
        }, { headers: corsHeaders })
      }
    }

    // Notification Management
    if (pathSegments[0] === 'notifications') {
      const { action, notificationId } = body
      
      if (action === 'mark_read') {
        return NextResponse.json({
          success: true,
          message: 'Notification marked as read'
        }, { headers: corsHeaders })
      }
      
      if (action === 'dismiss') {
        return NextResponse.json({
          success: true,
          message: 'Notification dismissed'
        }, { headers: corsHeaders })
      }
    }

    // GST Invoice Generation
    if (pathSegments[0] === 'gst' && pathSegments[1] === 'generate') {
      const { orderId, gstEnabled } = body
      
      return NextResponse.json({
        success: true,
        invoice: {
          id: `inv-${orderId}`,
          gstEnabled,
          generatedAt: new Date()
        },
        message: gstEnabled ? 'GST invoice generated' : 'Simple receipt generated'
      }, { headers: corsHeaders })
    }

    if (pathSegments[0] === 'shop' && pathSegments[1] === 'onboard') {
      const newShop = {
        id: uuidv4(),
        ...body,
        slug: body.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        storefront: `https://${body.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.smartlocal.in`,
        createdAt: new Date(),
        isActive: true
      }
      
      return NextResponse.json({
        success: true,
        shop: newShop
      }, { headers: corsHeaders })
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Endpoint not found' 
    }, { status: 404, headers: corsHeaders })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500, headers: corsHeaders })
  }
}

export async function PUT(request) {
  const { pathname } = new URL(request.url)
  const pathSegments = pathname.split('/').filter(Boolean).slice(1)
  
  try {
    const body = await request.json()
    const id = pathSegments[1]

    if (pathSegments[0] === 'products') {
      return NextResponse.json({
        success: true,
        product: { id, ...body, updatedAt: new Date() }
      }, { headers: corsHeaders })
    }

    if (pathSegments[0] === 'orders') {
      return NextResponse.json({
        success: true,
        order: { id, ...body, updatedAt: new Date() }
      }, { headers: corsHeaders })
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Endpoint not found' 
    }, { status: 404, headers: corsHeaders })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500, headers: corsHeaders })
  }
}

export async function DELETE(request) {
  const { pathname } = new URL(request.url)
  const pathSegments = pathname.split('/').filter(Boolean).slice(1)
  const id = pathSegments[1]
  
  try {
    if (pathSegments[0] === 'products' || pathSegments[0] === 'orders') {
      return NextResponse.json({
        success: true,
        message: 'Deleted successfully',
        id
      }, { headers: corsHeaders })
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Endpoint not found' 
    }, { status: 404, headers: corsHeaders })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500, headers: corsHeaders })
  }
}