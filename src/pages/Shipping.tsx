import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Truck, Package } from "lucide-react";
const Shipping = () => {
  return <div className="min-h-screen bg-background">
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
                  <p className="text-sm text-muted-foreground mb-4">5-7 business days</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Tracking included</li>
                    <li>• Insurance up to $100</li>
                    <li>• Signature not required</li>
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
                <h3 className="text-xl font-semibold mb-3 text-green-400">Free Standard Shipping on Orders Over 50</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Enjoy free standard shipping on all orders of 50 or more.
                </p>
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
    </div>;
};
export default Shipping;