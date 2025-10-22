# SmartLocal Suite 🏪

**A comprehensive digital business platform for Indian shopkeepers and micro-entrepreneurs**

Transform your local shop into a digital powerhouse with inventory management, dynamic pricing, WhatsApp marketing, and powerful analytics - all in one beautiful, mobile-first application.

---

## 🌟 Features

### 📱 **Core Business Management**
- **Digital Storefront**: Auto-generated online shop with SEO optimization
- **Inventory Management**: Add, edit, track stock with bulk operations & CSV import
- **Order Management**: Handle UPI, cash, and WhatsApp orders seamlessly
- **Smart Billing**: Auto-generate invoices with GST toggle support

### 🎯 **AI-Powered Tools**
- **Dynamic Pricing Engine**: AI-suggested pricing based on competition, demand, weather
- **Voice Assistant**: Hindi/English voice commands for inventory management
- **Smart Analytics**: Sales trends, demand forecasting, customer insights
- **Festival Bundle Maker**: Auto-create seasonal offers (Diwali, Holi, Eid)

### 📲 **Customer Engagement**
- **WhatsApp Marketing**: Automated campaigns, price alerts, customer segmentation
- **QR Code Generator**: Instant QR codes for products and storefront
- **Multi-language Support**: 10 Indian languages with native script support
- **PWA & Offline Mode**: Works offline, syncs when back online

### 💰 **Financial Tools**
- **Cash/UPI Reconciliation**: End-of-day tallying with denomination counter
- **GST Management**: Compliant invoicing with on/off toggle
- **Profit Analytics**: Margin tracking, cost analysis, ROI insights
- **Payment Integration**: UPI, Cash mode with Razorpay support

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- FIREBASE
- Yarn package manager

### Installation

1. **Clone & Install**
   ```bash
   git clone <repo-url>
   cd smartlocal-suite
   yarn install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Update MongoDB URL and other configs
   ```

3. **Start Development**
   ```bash
   yarn dev
   ```

4. **Access Application**
   - Main App: `http://localhost:3000`
   - Demo Shop: `http://localhost:3000/shop/shree-ganesh-kirana`

---

## 🏗️ Architecture

### **Frontend**
- **Next.js 14** with App Router
- **React 18** with TypeScript support
- **Tailwind CSS** + **shadcn/ui** components
- **Responsive Design** (Mobile-first)
- **PWA Support** with offline capabilities

### **Backend**
- **Next.js API Routes** (Serverless)
- **FIREBASE** with optimized queries
- **Multi-tenant Architecture** (Shop-scoped data)
- **RESTful APIs** with CORS support

### **Key Libraries**
- `recharts` - Analytics & charts
- `lucide-react` - Icon system
- `next-themes` - Dark mode support
- `sonner` - Toast notifications
- `react-hook-form` - Form management
- `zod` - Schema validation

---

## 📊 Demo Data

The application comes pre-loaded with **Shree Ganesh Kirana** demo shop:

### **Products** (10 items)
- Basmati Rice, Wheat Flour, Sugar, Oil, Dal, Tea, Biscuits, Salt, Spices

### **Sample Orders** 
- 3 completed orders with different payment methods
- Customer data with segments (New, Regular, High-value)

### **Demo Users**
- **Owner**: `owner@shreeganesha.shop` 
- **Staff**: `staff@shreeganesha.shop`

---

## 🛠️ API Endpoints

### **Authentication**
```
GET  /api/auth/demo-login?role=owner
```

### **Shop Management**
```
GET    /api/shop/demo
POST   /api/shop/onboard
```

### **Products**
```
GET    /api/products?shopId=xxx
POST   /api/products
PUT    /api/products/:id  
DELETE /api/products/:id
```

### **Orders**
```
GET    /api/orders?shopId=xxx
POST   /api/orders
PUT    /api/orders/:id
```

### **Analytics**
```
GET /api/analytics/dashboard?shopId=xxx
```

### **Dynamic Pricing**
```
GET  /api/pricing/suggest?productId=xxx
POST /api/pricing/approve
```

### **Voice Assistant**
```
GET /api/voice/parse?text=xxx
```

### **Festival Bundles**
```
GET /api/bundles/festival?festival=diwali
```

---

## 🎨 UI Components

Built with **shadcn/ui** component library:

- **Layout**: Cards, Containers, Separators
- **Forms**: Input, Select, Textarea, Switches  
- **Navigation**: Tabs, Breadcrumbs, Pagination
- **Feedback**: Alerts, Toasts, Loading states
- **Data Display**: Tables, Charts, Badges
- **Overlays**: Dialogs, Tooltips, Popovers

### **Design System**
- **Colors**: Blue primary (#3b82f6), semantic colors
- **Typography**: Inter font with proper hierarchy  
- **Spacing**: Consistent 4px grid system
- **Shadows**: Subtle depth with proper elevation
- **Animations**: Smooth transitions, loading states

---

## 🌍 Internationalization

### **Supported Languages**
1. **English** (en) - Default
2. **Hindi** (hi) - हिंदी  
3. **Marathi** (mr) - मराठी
4. **Tamil** (ta) - தமிழ்
5. **Telugu** (te) - తెలుగు
6. **Kannada** (kn) - ಕನ್ನಡ
7. **Gujarati** (gu) - ગુજરાતી
8. **Bengali** (bn) - বাংলা
9. **Malayalam** (ml) - മലയാളം
10. **Punjabi** (pa) - ਪੰਜਾਬੀ

### **Translation Structure**
```javascript
TRANSLATIONS = {
  en: {
    common: { save: 'Save', cancel: 'Cancel' },
    nav: { dashboard: 'Dashboard', inventory: 'Inventory' },
    // ... more sections
  },
  hi: {
    common: { save: 'सेव करें', cancel: 'रद्द करें' },
    // ... translated content
  }
}
```

---

## 📱 PWA Features

### **Offline Capabilities**
- **Data Caching**: Products, shop info, recent orders
- **Offline Queue**: Store actions when offline, sync later
- **Service Worker**: Background sync, push notifications
- **App-like Experience**: Install on home screen

### **Performance**
- **Code Splitting**: Optimized bundle loading
- **Image Optimization**: Next.js automatic optimization  
- **Lazy Loading**: Components loaded on demand
- **Caching Strategy**: Smart cache invalidation

---

## 🔐 Security & Privacy

### **Data Protection**
- **Multi-tenant Isolation**: Shop-scoped data access
- **Input Validation**: Zod schemas for all inputs
- **XSS Prevention**: Sanitized outputs
- **CORS Configuration**: Controlled API access

### **Authentication**
- **Demo Mode**: Instant access for evaluation
- **Role-based Access**: Owner, Staff, Viewer roles
- **Session Management**: Secure user sessions
- **API Rate Limiting**: Prevents abuse

---

## 📈 Analytics & Insights

### **Business Metrics**
- **Sales Trends**: 7-day, monthly, yearly views
- **Product Performance**: Top sellers, slow movers  
- **Customer Analytics**: Segments, lifetime value, churn
- **Inventory Insights**: Stock levels, turnover rates

### **Smart Alerts**
- **Low Stock Warnings**: Auto-generated alerts
- **Price Suggestions**: AI-driven recommendations  
- **Seasonal Trends**: Festival and weather-based insights
- **Competition Monitoring**: Price comparison alerts

---

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Environment Variables**
```bash
MONGO_URL=mongodb://localhost:27017
DB_NAME=smartlocal_suite
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### **Production Checklist**
- [ ] MongoDB Atlas setup
- [ ] Environment variables configured  
- [ ] Domain & SSL certificate
- [ ] Analytics tracking setup
- [ ] Error monitoring (Sentry)
- [ ] Performance monitoring

---

## 📚 Advanced Features

### **Voice Assistant Commands**
```
Add Products:
- "Add 5 kg rice at 70 rupees"  
- "Add 10 pieces biscuits at 25 each"

Update Stock:
- "Update rice stock to 50 kg"
- "Reduce sugar stock by 5 kg"

Check Information:  
- "Check stock for rice"
- "What is the price of dal"
```

### **WhatsApp Integration** (Planned)
- **Business API**: Automated messaging
- **Templates**: Pre-approved message formats
- **Campaigns**: Bulk messaging with tracking
- **Customer Support**: Two-way conversations

### **Advanced Pricing** 
- **Competition Tracking**: Monitor competitor prices
- **Demand Forecasting**: ML-based predictions
- **Dynamic Adjustments**: Real-time price optimization
- **Margin Protection**: Minimum profit safeguards

---

## 🤝 Contributing

### **Development Workflow**
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`  
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### **Code Style**
- **ESLint**: Consistent code formatting
- **Prettier**: Auto-formatting on save
- **TypeScript**: Type safety throughout
- **Component Structure**: Organized, reusable components

---

## 📞 Support & Community

### **Documentation**
- **API Reference**: Detailed endpoint documentation
- **Component Storybook**: UI component examples
- **Video Tutorials**: Step-by-step guides
- **FAQ Section**: Common questions answered

### **Community**
- **GitHub Issues**: Bug reports & feature requests
- **Discord Server**: Real-time community support  
- **Blog**: Updates, tutorials, case studies
- **Newsletter**: Product updates & tips

---

## 📄 License

MIT License - see [LICENSE.md](LICENSE.md) for details.

---

## 🙏 Acknowledgments

- **Indian Shopkeepers**: For inspiring this solution
- **Open Source Community**: For amazing tools & libraries
- **Beta Testers**: For valuable feedback & insights
- **Contributors**: For making SmartLocal Suite better

---

**Built with ❤️ for Indian Small Businesses**

*Empowering every neighborhood shop to thrive in the digital age*

---

### 📊 Quick Stats

- **10+ Features**: Comprehensive business management
- **10 Languages**: Full Indian language support  
- **PWA Ready**: Install on any device
- **Mobile First**: Optimized for smartphones
- **Offline Capable**: Works without internet
- **Open Source**: Free forever, community-driven

**Start your digital transformation today!** 🚀
