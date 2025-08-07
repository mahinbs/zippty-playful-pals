import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Shield, Clock, Tool, CheckCircle, AlertTriangle, FileText } from "lucide-react";

const Warranty = () => {
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
                <Shield className="h-12 w-12 text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold">
              Warranty & Protection
            </h1>
            <p className="text-xl text-white/90">
              Comprehensive warranty coverage to protect your investment and ensure peace of mind.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Warranty Overview */}
            <GlassCard className="p-8">
              <div className="flex items-center mb-6">
                <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                <h2 className="text-3xl font-bold text-primary">Standard Warranty</h2>
              </div>
              
              <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 p-6 rounded-lg border border-green-500/30">
                <h3 className="text-xl font-semibold mb-3 text-green-400">1-Year Limited Warranty</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  All Zippty products come with a comprehensive 1-year limited warranty covering manufacturing defects 
                  and workmanship issues. We stand behind the quality of our products.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🔧</div>
                    <p className="text-sm font-semibold">Free Repairs</p>
                    <p className="text-xs text-muted-foreground">Covered under warranty</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🔄</div>
                    <p className="text-sm font-semibold">Easy Replacement</p>
                    <p className="text-xs text-muted-foreground">Quick turnaround</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">📞</div>
                    <p className="text-sm font-semibold">24/7 Support</p>
                    <p className="text-xs text-muted-foreground">Always available</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Warranty Coverage */}
            <GlassCard className="p-8">
              <h2 className="text-3xl font-bold mb-8 text-primary text-center">What's Covered</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-green-400">✅ Covered Under Warranty</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-3">
                    <li>Manufacturing defects in materials</li>
                    <li>Workmanship issues</li>
                    <li>Electronic component failures</li>
                    <li>Battery malfunctions (within warranty period)</li>
                    <li>Structural integrity problems</li>
                    <li>Software defects (for smart products)</li>
                  </ul>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-red-400">❌ Not Covered</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-3">
                    <li>Normal wear and tear</li>
                    <li>Damage from misuse or accidents</li>
                    <li>Unauthorized modifications</li>
                    <li>Damage from pets chewing or scratching</li>
                    <li>Cosmetic damage</li>
                    <li>Battery replacement after warranty period</li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            {/* Extended Warranty */}
            <GlassCard className="p-8">
              <div className="flex items-center mb-6">
                <Shield className="h-8 w-8 text-purple-500 mr-3" />
                <h2 className="text-3xl font-bold text-primary">Extended Warranty Options</h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="text-3xl mb-4">🛡️</div>
                  <h3 className="text-xl font-semibold mb-2">2-Year Extended</h3>
                  <p className="text-2xl font-bold text-primary mb-2">$29.99</p>
                  <p className="text-sm text-muted-foreground mb-4">Additional year of coverage</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Full warranty extension</li>
                    <li>• Priority service</li>
                    <li>• Free shipping</li>
                    <li>• Dedicated support</li>
                  </ul>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg border border-purple-500/30 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-3 py-1 rounded-full">Most Popular</span>
                  </div>
                  <div className="text-3xl mb-4">🛡️🛡️</div>
                  <h3 className="text-xl font-semibold mb-2">3-Year Premium</h3>
                  <p className="text-2xl font-bold text-primary mb-2">$49.99</p>
                  <p className="text-sm text-muted-foreground mb-4">Maximum protection</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Extended coverage</li>
                    <li>• Accidental damage</li>
                    <li>• Express replacement</li>
                    <li>• VIP support line</li>
                  </ul>
                </div>
                
                <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="text-3xl mb-4">👑</div>
                  <h3 className="text-xl font-semibold mb-2">Lifetime Protection</h3>
                  <p className="text-2xl font-bold text-primary mb-2">$99.99</p>
                  <p className="text-sm text-muted-foreground mb-4">Lifetime coverage</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Lifetime warranty</li>
                    <li>• All damages covered</li>
                    <li>• Free upgrades</li>
                    <li>• Concierge service</li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            {/* Warranty Process */}
            <GlassCard className="p-8">
              <h2 className="text-3xl font-bold mb-8 text-primary text-center">Warranty Claim Process</h2>
              
              <div className="space-y-8">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <h3 className="font-semibold mb-2">Contact Support</h3>
                    <p className="text-sm text-muted-foreground">Reach out to our warranty team</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <h3 className="font-semibold mb-2">Provide Details</h3>
                    <p className="text-sm text-muted-foreground">Share product info and issue</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h3 className="font-semibold mb-2">Ship Product</h3>
                    <p className="text-sm text-muted-foreground">Send item for evaluation</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold">4</span>
                    </div>
                    <h3 className="font-semibold mb-2">Receive Solution</h3>
                    <p className="text-sm text-muted-foreground">Get repair or replacement</p>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Start a Warranty Claim</h3>
                  <p className="text-muted-foreground mb-4">
                    Experiencing issues with your Zippty product? Our warranty team is here to help.
                  </p>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
                    Submit Warranty Claim
                  </button>
                </div>
              </div>
            </GlassCard>

            {/* Warranty Terms */}
            <GlassCard className="p-8">
              <div className="flex items-center mb-6">
                <FileText className="h-8 w-8 text-blue-500 mr-3" />
                <h2 className="text-3xl font-bold text-primary">Warranty Terms & Conditions</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Warranty Period</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    The warranty period begins on the date of purchase and extends for the duration specified 
                    in your warranty plan. Extended warranties start after the standard warranty expires.
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Standard warranty: 1 year from purchase date</li>
                    <li>Extended warranty: Additional coverage period</li>
                    <li>Lifetime warranty: Valid for the life of the product</li>
                    <li>Transferable to new owners (with proof of transfer)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Service Options</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Repair Service</h4>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                        <li>Free diagnosis and repair</li>
                        <li>Genuine replacement parts</li>
                        <li>Quality testing after repair</li>
                        <li>Return shipping included</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">Replacement Service</h4>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                        <li>Same or equivalent product</li>
                        <li>New or refurbished units</li>
                        <li>Warranty transfers to replacement</li>
                        <li>Quick turnaround time</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Product-Specific Warranties */}
            <GlassCard className="p-8">
              <h2 className="text-3xl font-bold mb-8 text-primary text-center">Product-Specific Warranties</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-800/50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Interactive Robots</h3>
                  <p className="text-muted-foreground mb-4">Advanced AI-powered pet companions</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Standard Warranty:</span>
                      <span className="text-sm font-semibold text-green-400">2 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Battery Coverage:</span>
                      <span className="text-sm font-semibold text-blue-400">1 year</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Software Updates:</span>
                      <span className="text-sm font-semibold text-purple-400">Lifetime</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-slate-800/50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Smart Feeders</h3>
                  <p className="text-muted-foreground mb-4">Automated feeding solutions</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Standard Warranty:</span>
                      <span className="text-sm font-semibold text-green-400">1 year</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Motor Coverage:</span>
                      <span className="text-sm font-semibold text-blue-400">2 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">App Support:</span>
                      <span className="text-sm font-semibold text-purple-400">3 years</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-slate-800/50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Cat Toys</h3>
                  <p className="text-muted-foreground mb-4">Interactive feline entertainment</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Standard Warranty:</span>
                      <span className="text-sm font-semibold text-green-400">1 year</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Mechanical Parts:</span>
                      <span className="text-sm font-semibold text-blue-400">1 year</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Safety Testing:</span>
                      <span className="text-sm font-semibold text-purple-400">Lifetime</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-slate-800/50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Dog Toys</h3>
                  <p className="text-muted-foreground mb-4">Durable canine companions</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Standard Warranty:</span>
                      <span className="text-sm font-semibold text-green-400">1 year</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Durability Coverage:</span>
                      <span className="text-sm font-semibold text-blue-400">6 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Safety Standards:</span>
                      <span className="text-sm font-semibold text-purple-400">Lifetime</span>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* FAQ */}
            <GlassCard className="p-8">
              <h2 className="text-3xl font-bold mb-8 text-primary text-center">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div className="border-b border-slate-700 pb-4">
                  <h3 className="text-lg font-semibold mb-2">How do I register my warranty?</h3>
                  <p className="text-muted-foreground">Warranties are automatically registered when you purchase from our website. For in-store purchases, you can register online using your receipt.</p>
                </div>
                
                <div className="border-b border-slate-700 pb-4">
                  <h3 className="text-lg font-semibold mb-2">Can I extend my warranty after purchase?</h3>
                  <p className="text-muted-foreground">Yes, you can purchase extended warranty coverage within 30 days of your original purchase date.</p>
                </div>
                
                <div className="border-b border-slate-700 pb-4">
                  <h3 className="text-lg font-semibold mb-2">What if I lose my receipt?</h3>
                  <p className="text-muted-foreground">We can look up your purchase using your email address or order number from our system.</p>
                </div>
                
                <div className="border-b border-slate-700 pb-4">
                  <h3 className="text-lg font-semibold mb-2">How long does warranty service take?</h3>
                  <p className="text-muted-foreground">Most warranty repairs are completed within 5-7 business days. Express service is available for extended warranty customers.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Is the warranty transferable?</h3>
                  <p className="text-muted-foreground">Yes, warranties can be transferred to new owners with proper documentation and proof of transfer.</p>
                </div>
              </div>
            </GlassCard>

            {/* Contact Information */}
            <GlassCard className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-6 text-primary">Warranty Support</h2>
              <p className="text-muted-foreground mb-6">
                Our warranty support team is here to help with any warranty-related questions or claims:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Email</h4>
                  <p className="text-muted-foreground">warranty@zippty.com</p>
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

export default Warranty; 