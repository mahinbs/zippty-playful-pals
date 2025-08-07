import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Truck, Clock, MapPin, Package, Globe, Shield } from "lucide-react";

const Shipping = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-full">
                <Truck className="h-12 w-12 text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold">
              Shipping Information
            </h1>
            <p className="text-xl text-white/90">
              Fast, reliable shipping to get your pet products delivered safely and on time.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Shipping Options */}
            <GlassCard className="p-8">
              <h2 className="text-3xl font-bold mb-8 text-primary text-center">Shipping Options</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="text-3xl mb-4">🚚</div>
                  <h3 className="text-xl font-semibold mb-2">Standard Shipping</h3>
                  <p className="text-2xl font-bold text-primary mb-2">$5.99</p>
                  <p className="text-sm text-muted-foreground mb-4">5-7 business days</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Tracking included</li>
                    <li>• Insurance up to $100</li>
                    <li>• Signature not required</li>
                  </ul>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full">Most Popular</span>
                  </div>
                  <div className="text-3xl mb-4">⚡</div>
                  <h3 className="text-xl font-semibold mb-2">Express Shipping</h3>
                  <p className="text-2xl font-bold text-primary mb-2">$12.99</p>
                  <p className="text-sm text-muted-foreground mb-4">2-3 business days</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Priority tracking</li>
                    <li>• Insurance up to $500</li>
                    <li>• Signature delivery</li>
                  </ul>
                </div>
                
                <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="text-3xl mb-4">🚀</div>
                  <h3 className="text-xl font-semibold mb-2">Overnight Shipping</h3>
                  <p className="text-2xl font-bold text-primary mb-2">$24.99</p>
                  <p className="text-sm text-muted-foreground mb-4">Next business day</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Premium tracking</li>
                    <li>• Full insurance coverage</li>
                    <li>• Guaranteed delivery</li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            {/* Free Shipping */}
            <GlassCard className="p-8">
              <div className="flex items-center mb-6">
                <Package className="h-8 w-8 text-green-500 mr-3" />
                <h2 className="text-3xl font-bold text-primary">Free Shipping</h2>
              </div>
              
              <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 p-6 rounded-lg border border-green-500/30">
                <h3 className="text-xl font-semibold mb-3 text-green-400">Free Standard Shipping on Orders Over $50</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Enjoy free standard shipping on all orders of $50 or more. This applies to all domestic orders 
                  and select international destinations.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Eligible Items:</h4>
                    <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                      <li>All interactive pet toys</li>
                      <li>Smart feeding solutions</li>
                      <li>Pet health monitoring devices</li>
                      <li>Premium pet accessories</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Restrictions:</h4>
                    <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                      <li>Excludes oversized items</li>
                      <li>International shipping fees may apply</li>
                      <li>Cannot be combined with other offers</li>
                      <li>Subject to availability</li>
                    </ul>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Processing Times */}
            <GlassCard className="p-8">
              <div className="flex items-center mb-6">
                <Clock className="h-8 w-8 text-blue-500 mr-3" />
                <h2 className="text-3xl font-bold text-primary">Processing & Delivery Times</h2>
              </div>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Order Processing</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-muted-foreground">Orders placed before 2 PM EST: Same day processing</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-muted-foreground">Orders placed after 2 PM EST: Next day processing</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-muted-foreground">Weekend orders: Processed Monday</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Delivery Estimates</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                        <span className="font-medium">Standard Shipping</span>
                        <span className="text-primary font-semibold">5-7 days</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                        <span className="font-medium">Express Shipping</span>
                        <span className="text-primary font-semibold">2-3 days</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                        <span className="font-medium">Overnight Shipping</span>
                        <span className="text-primary font-semibold">1 day</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* International Shipping */}
            <GlassCard className="p-8">
              <div className="flex items-center mb-6">
                <Globe className="h-8 w-8 text-purple-500 mr-3" />
                <h2 className="text-3xl font-bold text-primary">International Shipping</h2>
              </div>
              
              <p className="text-muted-foreground leading-relaxed mb-6">
                We ship to most countries worldwide. International shipping rates and delivery times vary by location.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Available Regions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <h4 className="font-semibold text-sm">North America</h4>
                      <p className="text-xs text-muted-foreground">US, Canada, Mexico</p>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <h4 className="font-semibold text-sm">Europe</h4>
                      <p className="text-xs text-muted-foreground">EU, UK, Switzerland</p>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <h4 className="font-semibold text-sm">Asia Pacific</h4>
                      <p className="text-xs text-muted-foreground">Japan, Australia, Singapore</p>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <h4 className="font-semibold text-sm">Other Regions</h4>
                      <p className="text-xs text-muted-foreground">Contact us for availability</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">International Rates</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                      <span className="font-medium">Canada</span>
                      <span className="text-primary font-semibold">$15.99</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                      <span className="font-medium">Europe</span>
                      <span className="text-primary font-semibold">$25.99</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                      <span className="font-medium">Asia Pacific</span>
                      <span className="text-primary font-semibold">$35.99</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                      <span className="font-medium">Other Countries</span>
                      <span className="text-primary font-semibold">$45.99</span>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Tracking & Support */}
            <GlassCard className="p-8">
              <div className="flex items-center mb-6">
                <Shield className="h-8 w-8 text-green-500 mr-3" />
                <h2 className="text-3xl font-bold text-primary">Tracking & Support</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Order Tracking</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Tracking number sent via email</li>
                    <li>Real-time updates on our website</li>
                    <li>Mobile app notifications</li>
                    <li>Delivery confirmation</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Shipping Support</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>24/7 customer support</li>
                    <li>Live chat available</li>
                    <li>Email support: shipping@zippty.com</li>
                    <li>Phone: +1 (555) 123-4567</li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            {/* FAQ */}
            <GlassCard className="p-8">
              <h2 className="text-3xl font-bold mb-8 text-primary text-center">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div className="border-b border-slate-700 pb-4">
                  <h3 className="text-lg font-semibold mb-2">When will my order ship?</h3>
                  <p className="text-muted-foreground">Most orders ship within 1-2 business days. Orders placed before 2 PM EST typically ship the same day.</p>
                </div>
                
                <div className="border-b border-slate-700 pb-4">
                  <h3 className="text-lg font-semibold mb-2">How can I track my order?</h3>
                  <p className="text-muted-foreground">You'll receive a tracking number via email once your order ships. You can also track it in your account dashboard.</p>
                </div>
                
                <div className="border-b border-slate-700 pb-4">
                  <h3 className="text-lg font-semibold mb-2">Do you ship internationally?</h3>
                  <p className="text-muted-foreground">Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location.</p>
                </div>
                
                <div className="border-b border-slate-700 pb-4">
                  <h3 className="text-lg font-semibold mb-2">What if my package is damaged?</h3>
                  <p className="text-muted-foreground">All packages are insured. If your package arrives damaged, please contact us within 48 hours with photos for a replacement.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Can I change my shipping address?</h3>
                  <p className="text-muted-foreground">You can update your shipping address within 2 hours of placing your order by contacting our customer support team.</p>
                </div>
              </div>
            </GlassCard>

            {/* Contact Information */}
            <GlassCard className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-6 text-primary">Need Help?</h2>
              <p className="text-muted-foreground mb-6">
                Our shipping support team is here to help with any questions about your order:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Email</h4>
                  <p className="text-muted-foreground">shipping@zippty.com</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Phone</h4>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Live Chat</h4>
                  <p className="text-muted-foreground">Available 24/7</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shipping; 