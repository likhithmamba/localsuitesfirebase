#!/usr/bin/env python3
"""
SmartLocal Suite Backend API Testing
Tests all critical backend endpoints for the SmartLocal Suite application.
"""

import requests
import json
import os
from datetime import datetime
import sys

# Get base URL from environment - use localhost for testing since external URL has routing issues
BASE_URL = "http://localhost:3000"
API_BASE = f"{BASE_URL}/api"

class SmartLocalAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        self.test_results = []
        self.failed_tests = []
        
    def log_test(self, test_name, success, details="", response_data=None):
        """Log test results"""
        result = {
            'test': test_name,
            'success': success,
            'details': details,
            'timestamp': datetime.now().isoformat(),
            'response_data': response_data
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"    Details: {details}")
        if not success:
            self.failed_tests.append(test_name)
        print()

    def test_authentication(self):
        """Test authentication endpoints"""
        print("🔐 Testing Authentication...")
        
        # Test demo login for owner
        try:
            response = self.session.get(f"{API_BASE}/auth/demo-login?role=owner")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and data.get('user') and data.get('shop'):
                    user = data['user']
                    shop = data['shop']
                    expected_fields = ['id', 'email', 'name', 'phone', 'role', 'shopId']
                    
                    if all(field in user for field in expected_fields):
                        self.log_test("Authentication - Owner Login", True, 
                                    f"User: {user['name']}, Shop: {shop['name']}")
                    else:
                        missing = [f for f in expected_fields if f not in user]
                        self.log_test("Authentication - Owner Login", False, 
                                    f"Missing user fields: {missing}")
                else:
                    self.log_test("Authentication - Owner Login", False, 
                                "Missing success, user, or shop in response")
            else:
                self.log_test("Authentication - Owner Login", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Authentication - Owner Login", False, f"Exception: {str(e)}")

        # Test demo login for staff
        try:
            response = self.session.get(f"{API_BASE}/auth/demo-login?role=staff")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and data.get('user'):
                    user = data['user']
                    if user.get('role') == 'STAFF':
                        self.log_test("Authentication - Staff Login", True, 
                                    f"Staff User: {user['name']}")
                    else:
                        self.log_test("Authentication - Staff Login", False, 
                                    f"Expected STAFF role, got: {user.get('role')}")
                else:
                    self.log_test("Authentication - Staff Login", False, 
                                "Invalid response structure")
            else:
                self.log_test("Authentication - Staff Login", False, 
                            f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Authentication - Staff Login", False, f"Exception: {str(e)}")

    def test_shop_data(self):
        """Test shop data endpoint"""
        print("🏪 Testing Shop Data...")
        
        try:
            response = self.session.get(f"{API_BASE}/shop/demo")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    shop = data.get('shop', {})
                    products = data.get('products', [])
                    orders = data.get('orders', [])
                    
                    # Validate shop data
                    required_shop_fields = ['id', 'name', 'owner', 'phone', 'address']
                    if all(field in shop for field in required_shop_fields):
                        if len(products) >= 10 and len(orders) >= 3:
                            self.log_test("Shop Data - Demo Shop", True, 
                                        f"Shop: {shop['name']}, Products: {len(products)}, Orders: {len(orders)}")
                        else:
                            self.log_test("Shop Data - Demo Shop", False, 
                                        f"Insufficient demo data - Products: {len(products)}, Orders: {len(orders)}")
                    else:
                        missing = [f for f in required_shop_fields if f not in shop]
                        self.log_test("Shop Data - Demo Shop", False, 
                                    f"Missing shop fields: {missing}")
                else:
                    self.log_test("Shop Data - Demo Shop", False, "Response success=false")
            else:
                self.log_test("Shop Data - Demo Shop", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Shop Data - Demo Shop", False, f"Exception: {str(e)}")

    def test_products_api(self):
        """Test products endpoints"""
        print("📦 Testing Products API...")
        
        # Test GET products
        try:
            response = self.session.get(f"{API_BASE}/products?shopId=demo-shop-123")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and data.get('products'):
                    products = data['products']
                    if len(products) >= 10:
                        # Validate product structure
                        product = products[0]
                        required_fields = ['id', 'name', 'category', 'price', 'stock', 'unit']
                        if all(field in product for field in required_fields):
                            self.log_test("Products - GET All", True, 
                                        f"Retrieved {len(products)} products")
                        else:
                            missing = [f for f in required_fields if f not in product]
                            self.log_test("Products - GET All", False, 
                                        f"Missing product fields: {missing}")
                    else:
                        self.log_test("Products - GET All", False, 
                                    f"Expected >=10 products, got {len(products)}")
                else:
                    self.log_test("Products - GET All", False, "Invalid response structure")
            else:
                self.log_test("Products - GET All", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Products - GET All", False, f"Exception: {str(e)}")

        # Test POST new product
        try:
            new_product = {
                "name": "Test Product",
                "category": "Test Category",
                "price": 100,
                "cost": 80,
                "stock": 50,
                "unit": "pieces",
                "barcode": "1234567890999",
                "shopId": "demo-shop-123"
            }
            
            response = self.session.post(f"{API_BASE}/products", json=new_product)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and data.get('product'):
                    product = data['product']
                    if product.get('name') == new_product['name'] and 'id' in product:
                        self.log_test("Products - POST Create", True, 
                                    f"Created product: {product['name']} (ID: {product['id']})")
                        
                        # Store product ID for update/delete tests
                        self.test_product_id = product['id']
                    else:
                        self.log_test("Products - POST Create", False, 
                                    "Product creation response invalid")
                else:
                    self.log_test("Products - POST Create", False, "Invalid response structure")
            else:
                self.log_test("Products - POST Create", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Products - POST Create", False, f"Exception: {str(e)}")

        # Test PUT update product
        if hasattr(self, 'test_product_id'):
            try:
                update_data = {
                    "name": "Updated Test Product",
                    "price": 120,
                    "stock": 45
                }
                
                response = self.session.put(f"{API_BASE}/products/{self.test_product_id}", 
                                          json=update_data)
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success') and data.get('product'):
                        product = data['product']
                        if product.get('name') == update_data['name']:
                            self.log_test("Products - PUT Update", True, 
                                        f"Updated product: {product['name']}")
                        else:
                            self.log_test("Products - PUT Update", False, 
                                        "Product update not reflected")
                    else:
                        self.log_test("Products - PUT Update", False, "Invalid response structure")
                else:
                    self.log_test("Products - PUT Update", False, f"HTTP {response.status_code}")
                    
            except Exception as e:
                self.log_test("Products - PUT Update", False, f"Exception: {str(e)}")

        # Test DELETE product
        if hasattr(self, 'test_product_id'):
            try:
                response = self.session.delete(f"{API_BASE}/products/{self.test_product_id}")
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success'):
                        self.log_test("Products - DELETE", True, 
                                    f"Deleted product ID: {self.test_product_id}")
                    else:
                        self.log_test("Products - DELETE", False, "Delete response success=false")
                else:
                    self.log_test("Products - DELETE", False, f"HTTP {response.status_code}")
                    
            except Exception as e:
                self.log_test("Products - DELETE", False, f"Exception: {str(e)}")

    def test_orders_api(self):
        """Test orders endpoints"""
        print("📋 Testing Orders API...")
        
        # Test GET orders
        try:
            response = self.session.get(f"{API_BASE}/orders?shopId=demo-shop-123")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and data.get('orders'):
                    orders = data['orders']
                    if len(orders) >= 3:
                        # Validate order structure
                        order = orders[0]
                        required_fields = ['id', 'customerName', 'items', 'total', 'status']
                        if all(field in order for field in required_fields):
                            self.log_test("Orders - GET All", True, 
                                        f"Retrieved {len(orders)} orders")
                        else:
                            missing = [f for f in required_fields if f not in order]
                            self.log_test("Orders - GET All", False, 
                                        f"Missing order fields: {missing}")
                    else:
                        self.log_test("Orders - GET All", False, 
                                    f"Expected >=3 orders, got {len(orders)}")
                else:
                    self.log_test("Orders - GET All", False, "Invalid response structure")
            else:
                self.log_test("Orders - GET All", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Orders - GET All", False, f"Exception: {str(e)}")

        # Test POST new order
        try:
            new_order = {
                "customerName": "Test Customer",
                "items": [
                    {"productId": "p1", "quantity": 2, "price": 180},
                    {"productId": "p3", "quantity": 1, "price": 60}
                ],
                "total": 420,
                "paymentMethod": "UPI",
                "shopId": "demo-shop-123"
            }
            
            response = self.session.post(f"{API_BASE}/orders", json=new_order)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and data.get('order'):
                    order = data['order']
                    if order.get('customerName') == new_order['customerName'] and 'id' in order:
                        self.log_test("Orders - POST Create", True, 
                                    f"Created order for: {order['customerName']} (ID: {order['id']})")
                    else:
                        self.log_test("Orders - POST Create", False, 
                                    "Order creation response invalid")
                else:
                    self.log_test("Orders - POST Create", False, "Invalid response structure")
            else:
                self.log_test("Orders - POST Create", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Orders - POST Create", False, f"Exception: {str(e)}")

    def test_analytics_api(self):
        """Test analytics dashboard endpoint"""
        print("📊 Testing Analytics API...")
        
        try:
            response = self.session.get(f"{API_BASE}/analytics/dashboard?shopId=demo-shop-123")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and data.get('analytics'):
                    analytics = data['analytics']
                    required_fields = ['totalSales', 'ordersToday', 'lowStockCount', 'revenue', 
                                     'salesTrend', 'topProducts', 'categoryBreakdown']
                    
                    if all(field in analytics for field in required_fields):
                        # Validate data types and structure
                        sales_trend = analytics['salesTrend']
                        top_products = analytics['topProducts']
                        category_breakdown = analytics['categoryBreakdown']
                        
                        if (isinstance(sales_trend, list) and len(sales_trend) > 0 and
                            isinstance(top_products, list) and len(top_products) > 0 and
                            isinstance(category_breakdown, list) and len(category_breakdown) > 0):
                            
                            self.log_test("Analytics - Dashboard", True, 
                                        f"Total Sales: ₹{analytics['totalSales']}, Orders Today: {analytics['ordersToday']}")
                        else:
                            self.log_test("Analytics - Dashboard", False, 
                                        "Analytics data structure invalid")
                    else:
                        missing = [f for f in required_fields if f not in analytics]
                        self.log_test("Analytics - Dashboard", False, 
                                    f"Missing analytics fields: {missing}")
                else:
                    self.log_test("Analytics - Dashboard", False, "Invalid response structure")
            else:
                self.log_test("Analytics - Dashboard", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Analytics - Dashboard", False, f"Exception: {str(e)}")

    def test_dynamic_pricing(self):
        """Test dynamic pricing endpoint"""
        print("💰 Testing Dynamic Pricing...")
        
        try:
            response = self.session.get(f"{API_BASE}/pricing/suggest?productId=p1")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and data.get('suggestion'):
                    suggestion = data['suggestion']
                    required_fields = ['suggestedPrice', 'confidence', 'margin', 'reasoning', 
                                     'currentPrice', 'productId', 'productName']
                    
                    if all(field in suggestion for field in required_fields):
                        confidence = suggestion['confidence']
                        if 0.7 <= confidence <= 1.0:  # Expected confidence range
                            self.log_test("Dynamic Pricing - Suggest", True, 
                                        f"Product: {suggestion['productName']}, "
                                        f"Current: ₹{suggestion['currentPrice']}, "
                                        f"Suggested: ₹{suggestion['suggestedPrice']}, "
                                        f"Confidence: {confidence:.2%}")
                        else:
                            self.log_test("Dynamic Pricing - Suggest", False, 
                                        f"Invalid confidence score: {confidence}")
                    else:
                        missing = [f for f in required_fields if f not in suggestion]
                        self.log_test("Dynamic Pricing - Suggest", False, 
                                    f"Missing suggestion fields: {missing}")
                else:
                    self.log_test("Dynamic Pricing - Suggest", False, "Invalid response structure")
            else:
                self.log_test("Dynamic Pricing - Suggest", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Dynamic Pricing - Suggest", False, f"Exception: {str(e)}")

        # Test invalid product ID
        try:
            response = self.session.get(f"{API_BASE}/pricing/suggest?productId=invalid")
            
            if response.status_code == 404:
                data = response.json()
                if not data.get('success'):
                    self.log_test("Dynamic Pricing - Invalid Product", True, 
                                "Correctly returned 404 for invalid product")
                else:
                    self.log_test("Dynamic Pricing - Invalid Product", False, 
                                "Should return success=false for invalid product")
            else:
                self.log_test("Dynamic Pricing - Invalid Product", False, 
                            f"Expected 404, got {response.status_code}")
                
        except Exception as e:
            self.log_test("Dynamic Pricing - Invalid Product", False, f"Exception: {str(e)}")

    def test_voice_parsing(self):
        """Test voice parsing endpoint"""
        print("🎤 Testing Voice Parsing...")
        
        try:
            test_text = "add 5 kg rice at 70 rupees"
            response = self.session.get(f"{API_BASE}/voice/parse?text={test_text}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and data.get('parsed'):
                    parsed = data['parsed']
                    transcript = data.get('transcript')
                    
                    if (parsed.get('action') == 'ADD_PRODUCT' and 
                        'data' in parsed and
                        transcript == test_text):
                        
                        product_data = parsed['data']
                        expected_fields = ['quantity', 'unit', 'name', 'price']
                        
                        if all(field in product_data for field in expected_fields):
                            self.log_test("Voice Parsing - Add Product", True, 
                                        f"Parsed: {product_data['quantity']} {product_data['unit']} "
                                        f"{product_data['name']} at ₹{product_data['price']}")
                        else:
                            missing = [f for f in expected_fields if f not in product_data]
                            self.log_test("Voice Parsing - Add Product", False, 
                                        f"Missing parsed fields: {missing}")
                    else:
                        self.log_test("Voice Parsing - Add Product", False, 
                                    f"Invalid parsing result: {parsed}")
                else:
                    self.log_test("Voice Parsing - Add Product", False, "Invalid response structure")
            else:
                self.log_test("Voice Parsing - Add Product", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Voice Parsing - Add Product", False, f"Exception: {str(e)}")

    def test_festival_bundles(self):
        """Test festival bundles endpoint"""
        print("🎉 Testing Festival Bundles...")
        
        festivals = ['diwali', 'ramzan', 'holi']
        
        for festival in festivals:
            try:
                response = self.session.get(f"{API_BASE}/bundles/festival?festival={festival}")
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success') and data.get('bundle'):
                        bundle = data['bundle']
                        required_fields = ['name', 'products', 'discount', 'totalPrice', 'discountedPrice']
                        
                        if all(field in bundle for field in required_fields):
                            products = bundle['products']
                            if isinstance(products, list) and len(products) > 0:
                                self.log_test(f"Festival Bundles - {festival.title()}", True, 
                                            f"Bundle: {bundle['name']}, Products: {len(products)}, "
                                            f"Discount: {bundle['discount']}%")
                            else:
                                self.log_test(f"Festival Bundles - {festival.title()}", False, 
                                            "No products in bundle")
                        else:
                            missing = [f for f in required_fields if f not in bundle]
                            self.log_test(f"Festival Bundles - {festival.title()}", False, 
                                        f"Missing bundle fields: {missing}")
                    else:
                        self.log_test(f"Festival Bundles - {festival.title()}", False, 
                                    "Invalid response structure")
                else:
                    self.log_test(f"Festival Bundles - {festival.title()}", False, 
                                f"HTTP {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"Festival Bundles - {festival.title()}", False, f"Exception: {str(e)}")

        # Test invalid festival
        try:
            response = self.session.get(f"{API_BASE}/bundles/festival?festival=invalid")
            
            if response.status_code == 404:
                data = response.json()
                if not data.get('success'):
                    self.log_test("Festival Bundles - Invalid Festival", True, 
                                "Correctly returned 404 for invalid festival")
                else:
                    self.log_test("Festival Bundles - Invalid Festival", False, 
                                "Should return success=false for invalid festival")
            else:
                self.log_test("Festival Bundles - Invalid Festival", False, 
                            f"Expected 404, got {response.status_code}")
                
        except Exception as e:
            self.log_test("Festival Bundles - Invalid Festival", False, f"Exception: {str(e)}")

    def test_cash_session(self):
        """Test cash session endpoint"""
        print("💵 Testing Cash Session...")
        
        try:
            response = self.session.get(f"{API_BASE}/cash-session")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and data.get('session'):
                    session = data['session']
                    required_fields = ['id', 'date', 'openingCash', 'sales', 'expectedCash', 
                                     'actualCash', 'difference', 'denominations']
                    
                    if all(field in session for field in required_fields):
                        denominations = session['denominations']
                        if isinstance(denominations, dict) and len(denominations) > 0:
                            self.log_test("Cash Session - Get Session", True, 
                                        f"Session ID: {session['id']}, "
                                        f"Sales: ₹{session['sales']}, "
                                        f"Difference: ₹{session['difference']}")
                        else:
                            self.log_test("Cash Session - Get Session", False, 
                                        "Invalid denominations structure")
                    else:
                        missing = [f for f in required_fields if f not in session]
                        self.log_test("Cash Session - Get Session", False, 
                                    f"Missing session fields: {missing}")
                else:
                    self.log_test("Cash Session - Get Session", False, "Invalid response structure")
            else:
                self.log_test("Cash Session - Get Session", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Cash Session - Get Session", False, f"Exception: {str(e)}")

    def test_placeholder_images(self):
        """Test placeholder image endpoint"""
        print("🖼️ Testing Placeholder Images...")
        
        try:
            response = self.session.get(f"{API_BASE}/placeholder/200/200")
            
            if response.status_code == 200:
                content_type = response.headers.get('Content-Type', '')
                if 'image/svg+xml' in content_type:
                    content = response.text
                    if '<svg' in content and 'Product Image' in content:
                        self.log_test("Placeholder Images - 200x200", True, 
                                    "SVG placeholder generated successfully")
                    else:
                        self.log_test("Placeholder Images - 200x200", False, 
                                    "Invalid SVG content")
                else:
                    self.log_test("Placeholder Images - 200x200", False, 
                                f"Expected SVG, got {content_type}")
            else:
                self.log_test("Placeholder Images - 200x200", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Placeholder Images - 200x200", False, f"Exception: {str(e)}")

    def test_cors_headers(self):
        """Test CORS headers are present"""
        print("🌐 Testing CORS Headers...")
        
        try:
            response = self.session.options(f"{API_BASE}/products")
            
            if response.status_code == 200:
                headers = response.headers
                cors_headers = [
                    'Access-Control-Allow-Origin',
                    'Access-Control-Allow-Methods',
                    'Access-Control-Allow-Headers'
                ]
                
                missing_headers = [h for h in cors_headers if h not in headers]
                
                if not missing_headers:
                    self.log_test("CORS Headers - OPTIONS", True, 
                                "All required CORS headers present")
                else:
                    self.log_test("CORS Headers - OPTIONS", False, 
                                f"Missing CORS headers: {missing_headers}")
            else:
                self.log_test("CORS Headers - OPTIONS", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("CORS Headers - OPTIONS", False, f"Exception: {str(e)}")

    def test_error_handling(self):
        """Test error handling for invalid endpoints"""
        print("⚠️ Testing Error Handling...")
        
        try:
            response = self.session.get(f"{API_BASE}/invalid/endpoint")
            
            if response.status_code == 404:
                data = response.json()
                if not data.get('success') and 'error' in data:
                    self.log_test("Error Handling - 404", True, 
                                f"Proper 404 response: {data['error']}")
                else:
                    self.log_test("Error Handling - 404", False, 
                                "Invalid error response structure")
            else:
                self.log_test("Error Handling - 404", False, 
                            f"Expected 404, got {response.status_code}")
                
        except Exception as e:
            self.log_test("Error Handling - 404", False, f"Exception: {str(e)}")

    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting SmartLocal Suite Backend API Tests")
        print(f"📍 Testing against: {API_BASE}")
        print("=" * 60)
        
        # Run all test methods
        self.test_authentication()
        self.test_shop_data()
        self.test_products_api()
        self.test_orders_api()
        self.test_analytics_api()
        self.test_dynamic_pricing()
        self.test_voice_parsing()
        self.test_festival_bundles()
        self.test_cash_session()
        self.test_placeholder_images()
        self.test_cors_headers()
        self.test_error_handling()
        
        # Print summary
        print("=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = len([t for t in self.test_results if t['success']])
        failed_tests = len(self.failed_tests)
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in self.failed_tests:
                print(f"  - {test}")
        
        print("\n" + "=" * 60)
        
        # Return success status
        return failed_tests == 0

if __name__ == "__main__":
    tester = SmartLocalAPITester()
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)