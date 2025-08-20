import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-pets.jpg";
import Map from "@/components/Map";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-hero overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold">
              Zippty
            </h1>
            <h2 className="text-2xl md:text-3xl">
              If animals could talk, they'd talk about us!
            </h2>
            <p className="text-lg text-white/90">
              Visit our store or get in touch with us for any questions about our products.
            </p>
            <Link to="/shop">
              <Button variant="hero" size="lg">
                Shop Now →
              </Button>
            </Link>
            <div className="text-white/80">
              Collection of happy pet faces
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information and Map Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">
                Get in{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  touch with us
                </span>
              </h2>
              <p className="text-muted-foreground">
                Visit our store or contact us for any questions about our products and services.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="bg-card rounded-3xl p-8 border border-border shadow-soft space-y-6">
                <h3 className="text-2xl font-bold">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Address</h4>
                      <p className="text-muted-foreground">
                        JP Colony, Shastri Nagar, Jaipur, Rajasthan -302016
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Email</h4>
                      <p className="text-muted-foreground">info@zippty.in</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Phone</h4>
                      <p className="text-muted-foreground">+91- XXXXX XXXXX</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Business Hours</h4>
                      <p className="text-muted-foreground">Mon - Fri: 10AM - 10PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div>
                <Map />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;