import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Ban } from "lucide-react";

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
                <Ban className="h-12 w-12 text-red-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold">
              No Returns Policy
            </h1>
            <p className="text-xl text-white/90">
              All sales are final. We do not accept returns or exchanges.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Policy Overview */}
            <GlassCard className="p-8">
              <div className="flex items-center mb-6">
                <Ban className="h-8 w-8 text-red-500 mr-3" />
                <h2 className="text-3xl font-bold text-primary">Final Sale Policy</h2>
              </div>
              
              <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 p-6 rounded-lg border border-red-500/30">
                <h3 className="text-xl font-semibold mb-3 text-red-400">All Sales Are Final</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Due to the nature of our products and hygiene considerations for pet items, we do not accept returns or exchanges. 
                  Please carefully review your order before purchasing.
                </p>
              </div>
            </GlassCard>

            {/* Quality Assurance */}
            <GlassCard className="p-8">
              <h2 className="text-3xl font-bold mb-8 text-primary text-center">Quality Assurance</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-green-400">✅ What We Guarantee</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-3">
                    <li>High-quality, tested products</li>
                    <li>Products arrive in perfect condition</li>
                    <li>Accurate product descriptions</li>
                    <li>Safe materials for pets</li>
                    <li>Products match advertised specifications</li>
                  </ul>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-blue-400">📞 Customer Support</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-3">
                    <li>Pre-purchase consultation available</li>
                    <li>Detailed product information provided</li>
                    <li>Product usage guidance</li>
                    <li>Technical support for smart products</li>
                    <li>Pet care advice included</li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            {/* Contact Information */}
            <GlassCard className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-6 text-primary">Questions Before Purchase?</h2>
              <p className="text-muted-foreground mb-6">
                Our customer service team is here to help you make the right choice:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Email</h4>
                  <p className="text-muted-foreground">support@zippty.com</p>
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