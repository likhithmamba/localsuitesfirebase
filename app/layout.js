'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { useState, useEffect, createContext, useContext } from 'react'
import { SUPPORTED_LANGUAGES, t } from '@/lib/i18n'

const inter = Inter({ subsets: ['latin'] })

// Context for user session and app state
const AppContext = createContext()

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [shop, setShop] = useState(null)
  const [language, setLanguage] = useState('en')
  const [isLoading, setIsLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(true)
  
  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Auto-login demo user on app start
  useEffect(() => {
    const initApp = async () => {
      try {
        const response = await fetch('/api/auth/demo-login?role=owner')
        const data = await response.json()
        
        if (data.success) {
          setUser(data.user)
          setShop(data.shop)
        }
      } catch (error) {
        console.error('Auto-login failed:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    initApp()
  }, [])

  const login = async (role = 'owner') => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/auth/demo-login?role=${role}`)
      const data = await response.json()
      
      if (data.success) {
        setUser(data.user)
        setShop(data.shop)
        return data
      }
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setShop(null)
  }

  const switchLanguage = (lang) => {
    if (SUPPORTED_LANGUAGES[lang]) {
      setLanguage(lang)
      localStorage.setItem('smartlocal-language', lang)
    }
  }

  // Load saved language
  useEffect(() => {
    const saved = localStorage.getItem('smartlocal-language')
    if (saved && SUPPORTED_LANGUAGES[saved]) {
      setLanguage(saved)
    }
  }, [])

  const translate = (key) => t(key, language)

  return (
    <AppContext.Provider 
      value={{
        user,
        shop,
        language,
        isLoading,
        isOnline,
        login,
        logout,
        switchLanguage,
        translate
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* SEO Meta Tags */}
        <title>SmartLocal Suite - Digital Business Platform for Indian Shopkeepers</title>
        <meta name="description" content="All-in-one business platform for Indian shopkeepers. Digitize storefronts, manage inventory, dynamic pricing, WhatsApp marketing & more." />
        
        {/* Open Graph */}
        <meta property="og:title" content="SmartLocal Suite - Digital Business Platform" />
        <meta property="og:description" content="Empower your local business with digital tools" />
        <meta property="og:type" content="website" />
        
        {/* Schema.org structured data */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "SmartLocal Suite",
              "applicationCategory": "BusinessApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR"
              },
              "operatingSystem": "Web",
              "description": "Digital business platform for Indian shopkeepers and micro-entrepreneurs"
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AppProvider>
            <div className="min-h-screen bg-background">
              {children}
            </div>
            <Toaster />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}