'use client'

import { useState, useEffect } from 'react'
import { useApp } from './layout'

// Import UI components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

// Import icons
import {
  Store, Package, ShoppingCart, TrendingUp, Megaphone, BarChart3,
  Settings as SettingsIcon, Plus, Edit, Trash2, Eye, QrCode, Mic, Globe,
  IndianRupee, Users, Calendar, Clock, CheckCircle, AlertCircle,
  Smartphone, Wifi, WifiOff, Languages, Sun, Moon, Bell,
  Download, Upload, Search, Filter, RefreshCw, ChevronRight,
  Home, Inventory, Receipt, PriceTag, MessageSquare, Analytics,
  Wallet, Calculator, Camera, Volume2, Star, Heart, MapPin,
  Phone, Mail, ExternalLink, Share2, Copy, FileText,
  ArrowUp, ArrowDown, TrendingDown, DollarSign, Target
} from 'lucide-react'

// Import charts
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { toast } from 'sonner'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils'
import { SUPPORTED_LANGUAGES } from '@/lib/i18n'

export default function SmartLocalApp() {
  const { user, shop, language, isLoading, isOnline, translate, switchLanguage } = useApp()
  const [currentView, setCurrentView] = useState('dashboard')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [showOnboarding, setShowOnboarding] = useState(false)

  // Load initial data
  useEffect(() => {
    if (shop) {
      loadShopData()
    }
  }, [shop])

  const loadShopData = async () => {
    try {
      const [productsRes, ordersRes, analyticsRes] = await Promise.all([
        fetch(`/api/products?shopId=${shop.id}`),
        fetch(`/api/orders?shopId=${shop.id}`),
        fetch(`/api/analytics/dashboard?shopId=${shop.id}`)
      ])

      const [productsData, ordersData, analyticsData] = await Promise.all([
        productsRes.json(),
        ordersRes.json(), 
        analyticsRes.json()
      ])

      if (productsData.success) setProducts(productsData.products)
      if (ordersData.success) setOrders(ordersData.orders)
      if (analyticsData.success) setAnalytics(analyticsData.analytics)
    } catch (error) {
      console.error('Failed to load shop data:', error)
      toast.error('Failed to load shop data')
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-muted-foreground">Loading SmartLocal Suite...</p>
        </div>
      </div>
    )
  }

  // Onboarding flow
  if (showOnboarding || !shop) {
    return <OnboardingWizard onComplete={() => setShowOnboarding(false)} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-orange-500 text-white px-4 py-2 text-center text-sm">
          <WifiOff className="inline-block w-4 h-4 mr-2" />
          You're offline. Changes will sync when connection is restored.
        </div>
      )}

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <MobileNavigation currentView={currentView} setCurrentView={setCurrentView} />
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 border-r bg-card min-h-screen">
          <DesktopSidebar 
            currentView={currentView} 
            setCurrentView={setCurrentView}
            shop={shop}
            user={user}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 md:ml-0">
          <Header 
            shop={shop} 
            user={user} 
            language={language} 
            switchLanguage={switchLanguage}
            isOnline={isOnline}
          />

          <main className="p-4 pb-20 md:pb-4">
            <div key={currentView}>
              {currentView === 'dashboard' && (
                <Dashboard analytics={analytics} products={products} orders={orders} />
              )}
              {currentView === 'inventory' && (
                <InventoryManagement products={products} setProducts={setProducts} />
              )}
              {currentView === 'orders' && (
                <OrdersManagement orders={orders} setOrders={setOrders} products={products} />
              )}
              {currentView === 'pricing' && (
                <DynamicPricing products={products} setProducts={setProducts} />
              )}
              {currentView === 'marketing' && (
                <MarketingCampaigns shop={shop} products={products} />
              )}
              {currentView === 'analytics' && (
                <AnalyticsDashboard analytics={analytics} />
              )}
              {currentView === 'ledger' && (
                <CashUPILedger shop={shop} />
              )}
              {currentView === 'storefront' && (
                <StorefrontManager shop={shop} products={products} />
              )}
              {currentView === 'voice' && (
                <VoiceAssistant />
              )}
              {currentView === 'settings' && (
                <Settings shop={shop} user={user} language={language} switchLanguage={switchLanguage} />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

// Header Component
function Header({ shop, user, language, switchLanguage, isOnline }) {
  return (
    <header className="border-b bg-card px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Store className="h-6 w-6 text-blue-600" />
          <div>
            <h1 className="font-semibold text-lg">{shop?.name}</h1>
            <p className="text-sm text-muted-foreground">{user?.name}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Language Switcher */}
          <Select value={language} onValueChange={switchLanguage}>
            <SelectTrigger className="w-20">
              <Languages className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                <SelectItem key={code} value={code}>
                  <span className="mr-2">{lang.flag}</span>
                  {lang.nativeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Connection Status */}
          <div className="flex items-center space-x-1">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-orange-500" />
            )}
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}

// Desktop Sidebar
function DesktopSidebar({ currentView, setCurrentView, shop, user }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'pricing', label: 'Dynamic Pricing', icon: TrendingUp },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ledger', label: 'Cash/UPI Ledger', icon: Wallet },
    { id: 'storefront', label: 'Storefront', icon: Globe },
    { id: 'voice', label: 'Voice Assistant', icon: Mic },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ]

  return (
    <div className="p-4 space-y-2">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-blue-600">SmartLocal Suite</h2>
        <p className="text-sm text-muted-foreground">{shop?.name}</p>
      </div>

      {menuItems.map((item) => {
        const Icon = item.icon
        return (
          <Button
            key={item.id}
            variant={currentView === item.id ? "default" : "ghost"}
            className={`w-full justify-start ${currentView === item.id ? 'bg-blue-600 text-white' : ''}`}
            onClick={() => setCurrentView(item.id)}
          >
            <Icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        )
      })}
    </div>
  )
}

// Mobile Navigation
function MobileNavigation({ currentView, setCurrentView }) {
  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'inventory', label: 'Stock', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'pricing', label: 'Price', icon: TrendingUp },
    { id: 'more', label: 'More', icon: SettingsIcon }
  ]

  const [showMoreMenu, setShowMoreMenu] = useState(false)

  const handleMenuClick = (id) => {
    if (id === 'more') {
      setShowMoreMenu(!showMoreMenu)
    } else {
      setCurrentView(id)
      setShowMoreMenu(false)
    }
  }

  return (
    <>
      {/* More Menu Overlay */}
      {showMoreMenu && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowMoreMenu(false)}>
          <div className="absolute bottom-16 left-0 right-0 bg-white border-t p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start" onClick={() => { setCurrentView('marketing'); setShowMoreMenu(false) }}>
              <Megaphone className="mr-2 h-4 w-4" />
              Marketing
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => { setCurrentView('analytics'); setShowMoreMenu(false) }}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => { setCurrentView('ledger'); setShowMoreMenu(false) }}>
              <Wallet className="mr-2 h-4 w-4" />
              Ledger
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => { setCurrentView('storefront'); setShowMoreMenu(false) }}>
              <Globe className="mr-2 h-4 w-4" />
              Storefront
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => { setCurrentView('voice'); setShowMoreMenu(false) }}>
              <Mic className="mr-2 h-4 w-4" />
              Voice Assistant
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => { setCurrentView('settings'); setShowMoreMenu(false) }}>
              <SettingsIcon className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-30">
        <div className="flex">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id || (item.id === 'more' && showMoreMenu)
            return (
              <button
                key={item.id}
                className={`flex-1 py-2 px-1 text-center ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
                onClick={() => handleMenuClick(item.id)}
              >
                <Icon className="h-5 w-5 mx-auto mb-1" />
                <span className="text-xs">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}

// Dashboard Component
function Dashboard({ analytics, products, orders }) {
  const lowStockProducts = products?.filter(p => p.stock < 10) || []
  const todayOrders = orders?.filter(o => {
    const today = new Date().toDateString()
    return new Date(o.createdAt).toDateString() === today
  }) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{formatDate(new Date())}</Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Today's Revenue"
          value={formatCurrency(analytics?.revenue || 0)}
          change="+12%"
          icon={IndianRupee}
          positive={true}
        />
        <StatsCard
          title="Orders Today"
          value={analytics?.ordersToday || 0}
          change="+8%"
          icon={ShoppingCart}
          positive={true}
        />
        <StatsCard
          title="Low Stock Items"
          value={lowStockProducts.length}
          change={lowStockProducts.length > 5 ? "High" : "Normal"}
          icon={AlertCircle}
          positive={lowStockProducts.length <= 5}
        />
        <StatsCard
          title="Total Products"
          value={products?.length || 0}
          change="Active"
          icon={Package}
          positive={true}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Plus className="h-6 w-6" />
              <span>Add Product</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <QrCode className="h-6 w-6" />
              <span>Generate QR</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Mic className="h-6 w-6" />
              <span>Voice Command</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <MessageSquare className="h-6 w-6" />
              <span>Send Campaign</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sales Chart */}
      {analytics?.salesTrend && (
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.salesTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm text-muted-foreground">{formatDateTime(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(order.total)}</p>
                    <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-orange-600">{product.stock} {product.unit}</p>
                    <Badge variant="destructive">Low Stock</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Stats Card Component
function StatsCard({ title, value, change, icon: Icon, positive }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium leading-none">{title}</p>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <p className={`text-xs ${positive ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Inventory Management Component
function InventoryManagement({ products, setProducts }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showAddProduct, setShowAddProduct] = useState(false)

  const categories = [...new Set(products?.map(p => p.category) || []), 'All']
  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory
    return matchesSearch && matchesCategory
  }) || []

  const handleAddProduct = async (productData) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })
      
      const data = await response.json()
      if (data.success) {
        setProducts(prev => [...prev, data.product])
        setShowAddProduct(false)
        toast.success('Product added successfully!')
      }
    } catch (error) {
      toast.error('Failed to add product')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <Button onClick={() => setShowAddProduct(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category.toLowerCase()}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Add Product Dialog */}
      <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <AddProductForm onSubmit={handleAddProduct} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Product Card Component
function ProductCard({ product }) {
  const stockStatus = product.stock < 10 ? 'low' : product.stock < 20 ? 'medium' : 'high'
  const stockColor = stockStatus === 'low' ? 'text-red-600' : stockStatus === 'medium' ? 'text-orange-600' : 'text-green-600'

  return (
    <Card className="overflow-hidden">
      <div className="aspect-square bg-gray-100 relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary">{product.category}</Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-green-600">{formatCurrency(product.price)}</span>
          <div className="text-right">
            <p className={`font-medium ${stockColor}`}>{product.stock} {product.unit}</p>
            <p className="text-xs text-muted-foreground">Stock</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Cost: {formatCurrency(product.cost)}</span>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Edit className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline">
              <QrCode className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Add Product Form
function AddProductForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    cost: '',
    stock: '',
    unit: 'pieces',
    barcode: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Selling Price</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="cost">Cost Price</Label>
          <Input
            id="cost"
            type="number"
            value={formData.cost}
            onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="unit">Unit</Label>
          <Select value={formData.unit} onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pieces">Pieces</SelectItem>
              <SelectItem value="kg">Kilograms</SelectItem>
              <SelectItem value="g">Grams</SelectItem>
              <SelectItem value="L">Liters</SelectItem>
              <SelectItem value="mL">Milliliters</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="barcode">Barcode (Optional)</Label>
        <Input
          id="barcode"
          value={formData.barcode}
          onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
        />
      </div>
      <Button type="submit" className="w-full">Add Product</Button>
    </form>
  )
}

// Dynamic Pricing Component  
function DynamicPricing({ products, setProducts }) {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)

  const generateSuggestions = async () => {
    setLoading(true)
    try {
      const suggestionPromises = products.slice(0, 5).map(async (product) => {
        const response = await fetch(`/api/pricing/suggest?productId=${product.id}`)
        const data = await response.json()
        return data.success ? data.suggestion : null
      })

      const results = await Promise.all(suggestionPromises)
      setSuggestions(results.filter(Boolean))
    } catch (error) {
      toast.error('Failed to generate pricing suggestions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (products.length > 0) {
      generateSuggestions()
    }
  }, [products])

  const approvePricing = async (suggestion) => {
    try {
      const response = await fetch('/api/pricing/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: suggestion.productId,
          newPrice: suggestion.suggestedPrice
        })
      })

      const data = await response.json()
      if (data.success) {
        // Update local state
        setProducts(prev => 
          prev.map(p => 
            p.id === suggestion.productId 
              ? { ...p, price: suggestion.suggestedPrice }
              : p
          )
        )
        
        // Remove from suggestions
        setSuggestions(prev => 
          prev.filter(s => s.productId !== suggestion.productId)
        )
        
        toast.success('Price updated successfully!')
      }
    } catch (error) {
      toast.error('Failed to update price')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dynamic Pricing Engine</h1>
          <p className="text-muted-foreground">AI-powered price optimization</p>
        </div>
        <Button onClick={generateSuggestions} disabled={loading}>
          {loading ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <TrendingUp className="mr-2 h-4 w-4" />
          )}
          Generate Suggestions
        </Button>
      </div>

      {/* Pricing Strategy Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-semibold">Competition Analysis</h3>
            <p className="text-sm text-muted-foreground">Monitor competitor prices</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-semibold">Demand Forecasting</h3>
            <p className="text-sm text-muted-foreground">Predict demand patterns</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-semibold">Margin Optimization</h3>
            <p className="text-sm text-muted-foreground">Maximize profit margins</p>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Price Suggestions</CardTitle>
            <CardDescription>
              AI-generated pricing recommendations based on market conditions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestions.map((suggestion) => (
                <PricingSuggestionCard
                  key={suggestion.productId}
                  suggestion={suggestion}
                  onApprove={() => approvePricing(suggestion)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Pricing Suggestion Card
function PricingSuggestionCard({ suggestion, onApprove }) {
  const marginChange = suggestion.margin
  const isIncrease = marginChange > 0

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">{suggestion.productName}</h4>
        <Badge variant={isIncrease ? "default" : "destructive"}>
          {isIncrease ? "↑" : "↓"} {Math.abs(marginChange).toFixed(1)}%
        </Badge>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-muted-foreground">Current Price</p>
          <p className="font-semibold">{formatCurrency(suggestion.currentPrice)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Suggested Price</p>
          <p className="font-semibold text-blue-600">{formatCurrency(suggestion.suggestedPrice)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Confidence</p>
          <p className="font-semibold">{Math.round(suggestion.confidence * 100)}%</p>
        </div>
      </div>

      <div className="bg-muted p-3 rounded text-sm">
        <p><strong>Reasoning:</strong> {suggestion.reasoning}</p>
      </div>

      <div className="flex space-x-2">
        <Button onClick={onApprove} className="flex-1">
          <CheckCircle className="mr-2 h-4 w-4" />
          Approve
        </Button>
        <Button variant="outline" className="flex-1">
          Reject
        </Button>
      </div>
    </div>
  )
}

// Orders Management Component
function OrdersManagement({ orders, setOrders, products }) {
  const [filter, setFilter] = useState('all')

  const filteredOrders = orders?.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  }) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Order
        </Button>
      </div>

      {/* Order Filters */}
      <div className="flex space-x-2">
        {['all', 'pending', 'completed', 'cancelled'].map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}

// Order Card Component
function OrderCard({ order }) {
  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-semibold">{order.customerName}</h4>
            <p className="text-sm text-muted-foreground">Order #{order.id}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">{formatCurrency(order.total)}</p>
            <Badge className={statusColor[order.status] || 'bg-gray-100 text-gray-800'}>
              {order.status}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{item.quantity}x Product ID: {item.productId}</span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{order.paymentMethod}</Badge>
            <span className="text-xs text-muted-foreground">
              {formatDateTime(order.createdAt)}
            </span>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Eye className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline">
              <FileText className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Marketing Campaigns Component
function MarketingCampaigns({ shop, products }) {
  const [campaigns, setCampaigns] = useState([])
  const [showNewCampaign, setShowNewCampaign] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Marketing Campaigns</h1>
          <p className="text-muted-foreground">WhatsApp marketing automation</p>
        </div>
        <Button onClick={() => setShowNewCampaign(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {/* Campaign Templates */}
      <div className="grid md:grid-cols-3 gap-4">
        <CampaignTemplate
          title="Festival Offer"
          description="Create festive bundle offers"
          icon={Star}
          color="bg-orange-100 text-orange-600"
        />
        <CampaignTemplate
          title="Price Drop Alert"
          description="Notify customers of price reductions"
          icon={TrendingDown}
          color="bg-green-100 text-green-600"
        />
        <CampaignTemplate
          title="New Arrival"
          description="Announce new products"
          icon={Package}
          color="bg-blue-100 text-blue-600"
        />
      </div>

      {/* Active Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No active campaigns. Create your first campaign to start engaging customers!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Campaign Template Component
function CampaignTemplate({ title, description, icon: Icon, color }) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-3`}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

// Analytics Dashboard Component
function AnalyticsDashboard({ analytics }) {
  if (!analytics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">Loading analytics data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics & Insights</h1>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.categoryBreakdown}
                dataKey="value"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
              >
                {analytics.categoryBreakdown?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 60%)`} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.topProducts?.map((product, index) => (
              <div key={product.id} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                </div>
                <img src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover" />
                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(product.price)}</p>
                  <p className="text-sm text-muted-foreground">{product.stock} in stock</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Cash/UPI Ledger Component
function CashUPILedger({ shop }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadCashSession = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/cash-session')
      const data = await response.json()
      if (data.success) {
        setSession(data.session)
      }
    } catch (error) {
      toast.error('Failed to load cash session')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCashSession()
  }, [])

  if (loading) {
    return <div className="text-center py-12">Loading cash session...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cash/UPI Ledger</h1>
          <p className="text-muted-foreground">Daily reconciliation and tracking</p>
        </div>
        <Button>
          <Calculator className="mr-2 h-4 w-4" />
          End Day Session
        </Button>
      </div>

      {session && (
        <>
          {/* Session Summary */}
          <div className="grid md:grid-cols-4 gap-4">
            <StatsCard
              title="Opening Cash"
              value={formatCurrency(session.openingCash)}
              change="Start of day"
              icon={Wallet}
              positive={true}
            />
            <StatsCard
              title="Cash Sales"
              value={formatCurrency(session.cashSales)}
              change="Today"
              icon={IndianRupee}
              positive={true}
            />
            <StatsCard
              title="UPI Sales"
              value={formatCurrency(session.upiSales)}
              change="Today"
              icon={Smartphone}
              positive={true}
            />
            <StatsCard
              title="Difference"
              value={formatCurrency(Math.abs(session.difference))}
              change={session.difference >= 0 ? "Surplus" : "Shortage"}
              icon={session.difference >= 0 ? ArrowUp : ArrowDown}
              positive={session.difference >= 0}
            />
          </div>

          {/* Denomination Counter */}
          <Card>
            <CardHeader>
              <CardTitle>Cash Count</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(session.denominations).map(([denom, count]) => (
                  <div key={denom} className="text-center p-3 border rounded">
                    <p className="font-semibold">₹{denom}</p>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(parseInt(denom) * count)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

// Storefront Manager Component
function StorefrontManager({ shop, products }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Digital Storefront</h1>
          <p className="text-muted-foreground">{shop?.storefront}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <QrCode className="mr-2 h-4 w-4" />
            QR Code
          </Button>
          <Button>
            <ExternalLink className="mr-2 h-4 w-4" />
            Visit Store
          </Button>
        </div>
      </div>

      {/* Storefront Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Storefront Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
            <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-semibold mb-2">{shop?.name}</h3>
            <p className="text-muted-foreground">{products?.length || 0} products available</p>
            <Button className="mt-4">Configure Storefront</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Voice Assistant Component
function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [parsedCommand, setParsedCommand] = useState(null)

  const startListening = () => {
    setIsListening(true)
    // Mock voice recognition
    setTimeout(() => {
      const mockTranscript = "Add 5 kg rice at 70 rupees"
      setTranscript(mockTranscript)
      parseCommand(mockTranscript)
      setIsListening(false)
    }, 2000)
  }

  const parseCommand = async (text) => {
    try {
      const response = await fetch(`/api/voice/parse?text=${encodeURIComponent(text)}`)
      const data = await response.json()
      if (data.success) {
        setParsedCommand(data.parsed)
      }
    } catch (error) {
      console.error('Failed to parse command:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Voice Assistant</h1>
        <p className="text-muted-foreground">Speak in Hindi or English to manage your inventory</p>
      </div>

      {/* Voice Interface */}
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center transition-all ${
            isListening ? 'bg-red-100 animate-pulse' : 'bg-blue-100'
          }`}>
            {isListening ? (
              <Volume2 className="h-12 w-12 text-red-600" />
            ) : (
              <Mic className="h-12 w-12 text-blue-600" />
            )}
          </div>

          <Button
            onClick={startListening}
            disabled={isListening}
            size="lg"
            className="w-full"
          >
            {isListening ? 'Listening...' : 'Tap to Speak'}
          </Button>

          {transcript && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">You said:</p>
              <p className="text-lg">"{transcript}"</p>
            </div>
          )}

          {parsedCommand && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-800 mb-2">Understood:</p>
              {parsedCommand.action === 'ADD_PRODUCT' ? (
                <div className="text-sm text-green-700">
                  <p>Add {parsedCommand.data.quantity} {parsedCommand.data.unit} of {parsedCommand.data.name}</p>
                  <p>Price: ₹{parsedCommand.data.price}</p>
                </div>
              ) : (
                <p className="text-sm text-red-700">Command not recognized</p>
              )}
              <Button size="sm" className="mt-3 w-full">
                Execute Command
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Voice Commands Help */}
      <Card>
        <CardHeader>
          <CardTitle>Voice Commands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Add Products:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>"Add 5 kg rice at 70 rupees"</li>
                <li>"Add 10 pieces biscuits at 25 rupees"</li>
                <li>"Add 2 liters oil at 130 rupees"</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Stock Updates:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>"Update rice stock to 50 kg"</li>
                <li>"Reduce sugar stock by 5 kg"</li>
                <li>"Check stock for atta"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Settings Component
function Settings({ shop, user, language, switchLanguage }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={user?.name || ''} readOnly />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={user?.email || ''} readOnly />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={user?.phone || ''} readOnly />
          </div>
        </CardContent>
      </Card>

      {/* Shop Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Shop Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Shop Name</Label>
            <Input value={shop?.name || ''} />
          </div>
          <div>
            <Label>GST Number</Label>
            <Input value={shop?.gstNumber || ''} />
          </div>
          <div className="flex items-center justify-between">
            <Label>GST Enabled</Label>
            <Switch checked={shop?.gstEnabled || false} />
          </div>
          <div>
            <Label>UPI ID</Label>
            <Input value={shop?.upiId || ''} />
          </div>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Language & Region</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Display Language</Label>
            <Select value={language} onValueChange={switchLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                  <SelectItem key={code} value={code}>
                    <span className="mr-2">{lang.flag}</span>
                    {lang.nativeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Onboarding Wizard Component
function OnboardingWizard({ onComplete }) {
  const [step, setStep] = useState(0)
  const [shopData, setShopData] = useState({
    name: '',
    gstEnabled: false,
    gstNumber: '',
    upiId: '',
    language: 'en'
  })

  const steps = [
    { title: 'Welcome', component: WelcomeStep },
    { title: 'Shop Details', component: ShopDetailsStep },
    { title: 'Payment Setup', component: PaymentSetupStep },
    { title: 'Complete', component: CompleteStep }
  ]

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      onComplete()
    }
  }

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const CurrentStepComponent = steps[step].component

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-blue-600">SmartLocal Suite</CardTitle>
          <CardDescription>Let's set up your digital store</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index <= step ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <CurrentStepComponent
            data={shopData}
            setData={setShopData}
            onNext={nextStep}
            onPrev={prevStep}
            isFirst={step === 0}
            isLast={step === steps.length - 1}
          />
        </CardContent>
      </Card>
    </div>
  )
}

// Onboarding Step Components
function WelcomeStep({ onNext }) {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
        <Store className="h-10 w-10 text-blue-600" />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Welcome to SmartLocal Suite</h3>
        <p className="text-muted-foreground">Transform your shop into a digital powerhouse with inventory management, pricing optimization, and customer engagement tools.</p>
      </div>
      <Button onClick={onNext} className="w-full">
        Get Started
      </Button>
    </div>
  )
}

function ShopDetailsStep({ data, setData, onNext, onPrev }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Shop Information</h3>
      <div>
        <Label>Shop Name</Label>
        <Input
          value={data.name}
          onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Shree Ganesh Kirana"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          checked={data.gstEnabled}
          onCheckedChange={(checked) => setData(prev => ({ ...prev, gstEnabled: checked }))}
        />
        <Label>GST Registered</Label>
      </div>
      {data.gstEnabled && (
        <div>
          <Label>GST Number</Label>
          <Input
            value={data.gstNumber}
            onChange={(e) => setData(prev => ({ ...prev, gstNumber: e.target.value }))}
            placeholder="27AADCS1234F1Z5"
          />
        </div>
      )}
      <div className="flex space-x-2">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button onClick={onNext} className="flex-1" disabled={!data.name}>
          Continue
        </Button>
      </div>
    </div>
  )
}

function PaymentSetupStep({ data, setData, onNext, onPrev }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Payment Setup</h3>
      <div>
        <Label>UPI ID (Optional)</Label>
        <Input
          value={data.upiId}
          onChange={(e) => setData(prev => ({ ...prev, upiId: e.target.value }))}
          placeholder="yourshop@paytm"
        />
      </div>
      <div>
        <Label>Preferred Language</Label>
        <Select
          value={data.language}
          onValueChange={(value) => setData(prev => ({ ...prev, language: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(SUPPORTED_LANGUAGES).slice(0, 3).map(([code, lang]) => (
              <SelectItem key={code} value={code}>
                <span className="mr-2">{lang.flag}</span>
                {lang.nativeName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button onClick={onNext} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  )
}

function CompleteStep({ data, onNext }) {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">You're All Set!</h3>
        <p className="text-muted-foreground">Your shop "{data.name}" is ready. We've added some sample products to get you started.</p>
      </div>
      <Button onClick={onNext} className="w-full">
        Enter Dashboard
      </Button>
    </div>
  )
}