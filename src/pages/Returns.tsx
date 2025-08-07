import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GlassCard } from "@/components/ui/glass-card";
import { RotateCcw, Package, Clock, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";

const Returns = () => {
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
                <RotateCcw className="h-12 w-12 text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold">
              Returns & Exchanges
            </h1>
            <p className="text-xl text-white/90">
              We want you to be completely satisfied with your purchase. Easy returns and exchanges.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Return Policy Overview */}
            <GlassCard className="p-8">
              <div className="flex items-center mb-6">
                <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                <h2 className="text-3xl font-bold text-primary">30-Day Return Policy</h2>
              </div>
              
              <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 p-6 rounded-lg border border-green-500/30">
                <h3 className="text-xl font-semibold mb-3 text-green-400">Hassle-Free Returns</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We offer a 30-day return window for most items. If you're not completely satisfied with your purchase, 
                  we'll make it right with a full refund or exchange.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📦</div>
                    <p className="text-sm font-semibold">Easy Returns</p>
                    <p className="text-xs text-muted-foreground">Simple process</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">💰</div>
                    <p className="text-sm font-semibold">Full Refunds</p>
                    <p className="text-xs text-muted-foreground">No questions asked</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🔄</div>
                    <p className="text-sm font-semibold">Free Exchanges</p>
                    <p className="text-xs text-muted-foreground">Quick turnaround</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Return Requirements */}
            <GlassCard className="p-8">
              <h2 className="text-3xl font-bold mb-8 text-primary text-center">Return Requirements</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-green-400">✅ What's Required</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-3">
                    <li>Item must be unused and in original condition</li>
                    <li>Original packaging and all accessories included</li>
                    <li>Return within 30 days of delivery</li>
                    <li>Valid proof of purchase (order number)</li>
                    <li>Return authorization number (RMA)</li>
                  </ul>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-red-400">❌ What's Not Eligible</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-3">
                    <li>Used or damaged items</li>
                    <li>Items without original packaging</li>
                    <li>Personalized or custom items</li>
                    <li>Downloadable software or digital content</li>
                    <li>Items marked as "Final Sale"</li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            {/* Return Process */}
            <GlassCard className="p-8">
              <h2 className="text-3xl font-bold mb-8 text-primary text-center">How to Return</h2>
              
              <div className="space-y-8">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <h3 className="font-semibold mb-2">Initiate Return</h3>
                    <p className="text-sm text-muted-foreground">Log into your account and request a return</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <h3 className="font-semibold mb-2">Get RMA Number</h3>
                    <p className="text-sm text-muted-foreground">Receive your return authorization number</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h3 className="font-semibold mb-2">Package & Ship</h3>
                    <p className="text-sm text-muted-foreground">Pack item securely and ship to our facility</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold">4</span>
                    </div>
                    <h3 className="font-semibold mb-2">Receive Refund</h3>
                    <p className="text-sm text-muted-foreground">Get your refund within 5-7 business days</p>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Start Your Return</h3>
                  <p className="text-muted-foreground mb-4">
                    Ready to return an item? Click the button below to begin the return process.
                  </p>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
                    Start Return Process
                    <ArrowRight className="inline ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </GlassCard>

            {/* Refund Information */}
            <GlassCard className="p-8">
              <div className="flex items-center mb-6">
                <Package className="h-8 w-8 text-green-500 mr-3" />
                <h2 className="text-3xl font-bold text-primary">Refund Information</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Refund Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                      <span className="font-medium">Return Received</span>
                      <span className="text-green-400 font-semibold">1-2 days</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                      <span className="font-medium">Processing Time</span>
                      <span className="text-blue-400 font-semibold">1-3 days</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                      <span className="font-medium">Refund Issued</span>
                      <span className="text-purple-400 font-semibold">1-2 days</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                      <span className="font-medium">Bank Processing</span>
                      <span className="text-yellow-400 font-semibold">3-5 days</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Refund Methods</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <h4 className="font-semibold mb-1">Original Payment Method</h4>
                      <p className="text-sm text-muted-foreground">Refunds are processed to the original payment method used for the purchase.</p>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <h4 className="font-semibold mb-1">Store Credit</h4>
                      <p className="text-sm text-muted-foreground">You can choose to receive store credit for future purchases.</p>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <h4 className="font-semibold mb-1">Exchange</h4>
                      <p className="text-sm text-muted-foreground">Exchange for a different size, color, or product of equal value.</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Shipping Costs */}
            <GlassCard className="p-8">
              <h2 className="text-3xl font-bold mb-8 text-primary text-center">Return Shipping Costs</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="text-3xl mb-4">✅</div>
                  <h3 className="text-xl font-semibold mb-2">Free Returns</h3>
                  <p className="text-sm text-muted-foreground mb-4">For defective items or our error</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Manufacturing defects</li>
                    <li>• Wrong item shipped</li>
                    <li>• Damaged in transit</li>
                    <li>• Prepaid return label</li>
                  </ul>
                </div>
                
                <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="text-3xl mb-4">💰</div>
                  <h3 className="text-xl font-semibold mb-2">Customer Pays</h3>
                  <p className="text-sm text-muted-foreground mb-4">For change of mind returns</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Change of mind</li>
                    <li>• Wrong size/color</li>
                    <li>• No longer needed</li>
                    <li>• $8.99 return fee</li>
                  </ul>
                </div>
                
                <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="text-3xl mb-4">🎁</div>
                  <h3 className="text-xl font-semibold mb-2">VIP Members</h3>
                  <p className="text-sm text-muted-foreground mb-4">Always free returns</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Premium membership</li>
                    <li>• Free return shipping</li>
                    <li>• Extended return window</li>
                    <li>• Priority processing</li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            {/* Exchanges */}
            <GlassCard className="p-8">
              <div className="flex items-center mb-6">
                <RotateCcw className="h-8 w-8 text-blue-500 mr-3" />
                <h2 className="text-3xl font-bold text-primary">Exchanges</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Exchange Options</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Size exchanges (if available)</li>
                    <li>Color or style changes</li>
                    <li>Different product of equal value</li>
                    <li>Upgrade to higher-priced item (pay difference)</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Exchange Process</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Same 30-day window applies</li>
                    <li>Original item must be returned first</li>
                    <li>New item shipped once return is received</li>
                    <li>Price differences handled at checkout</li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            {/* FAQ */}
            <GlassCard className="p-8">
              <h2 className="text-3xl font-bold mb-8 text-primary text-center">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div className="border-b border-slate-700 pb-4">
                  <h3 className="text-lg font-semibold mb-2">How long do I have to return an item?</h3>
                  <p className="text-muted-foreground">You have 30 days from the date of delivery to initiate a return.</p>
                </div>
                
                <div className="border-b border-slate-700 pb-4">
                  <h3 className="text-lg font-semibold mb-2">Do I need to pay for return shipping?</h3>
                  <p className="text-muted-foreground">Return shipping is free for defective items or our errors. For change of mind returns, there's a $8.99 return fee.</p>
                </div>
                
                <div className="border-b border-slate-700 pb-4">
                  <h3 className="text-lg font-semibold mb-2">How long does it take to get my refund?</h3>
                  <p className="text-muted-foreground">Refunds are typically processed within 5-7 business days after we receive your return.</p>
                </div>
                
                <div className="border-b border-slate-700 pb-4">
                  <h3 className="text-lg font-semibold mb-2">Can I exchange for a different size?</h3>
                  <p className="text-muted-foreground">Yes, you can exchange for a different size if it's available in our inventory.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">What if my item arrives damaged?</h3>
                  <p className="text-muted-foreground">If your item arrives damaged, please contact us within 48 hours with photos for a replacement or refund.</p>
                </div>
              </div>
            </GlassCard>

            {/* Contact Information */}
            <GlassCard className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-6 text-primary">Need Help with Returns?</h2>
              <p className="text-muted-foreground mb-6">
                Our customer service team is here to help with any return-related questions:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Email</h4>
                  <p className="text-muted-foreground">returns@zippty.com</p>
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

export default Returns; 