import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Zap, Heart, Cpu, Shield, Award, Users, Clock, Star } from "lucide-react";
import heroImage from "@/assets/hero-pets.jpg";
const features = [{
  icon: Award,
  title: "Premium Quality",
  description: "We specialize in high-quality interactive toys that keep your pets engaged, active, and entertained."
}, {
  icon: Shield,
  title: "Trusted Quality",
  description: "We believe your pets deserve only the best entertainment. That's why we offer interactive toys from brands you can rely on."
}, {
  icon: Zap,
  title: "For Every Energy Level",
  description: "Whether your pet is highly energetic and playful or prefers more gentle stimulation, we have the perfect interactive toys."
}, {
  icon: Users,
  title: "Seamless Shopping Experience",
  description: "Finding the perfect interactive toy for your pet has never been easier. Our website is user-friendly and fast."
}];
const services = [{
  icon: Clock,
  title: "Quick & Reliable",
  description: "Fast, reliable shipping so you can get your pet's supplies right when you need them."
}, {
  icon: Star,
  title: "Expert Advice",
  description: "We offer the guidance and resources you need to give your pets the best care."
}, {
  icon: Heart,
  title: "Affordable Quality",
  description: "Premium products at competitive prices, ensuring your pets get the best without breaking the bank."
}];
const stats = [{
  number: "2k+",
  label: "Happy Clients"
}, {
  number: "72",
  label: "Brands"
}, {
  number: "1.8k+",
  label: "Products"
}, {
  number: "28",
  label: "Years in Business"
}];
const About = () => {
  return <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{
        backgroundImage: `url(${heroImage})`
      }} />
        
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold">
              Zippty
            </h1>
            <h2 className="text-2xl md:text-3xl">
              Welcome to Zippty – Where Your Pet's Entertainment Comes First
            </h2>
            <p className="text-lg text-white/90 max-w-3xl mx-auto">
              At Zippty, we understand that pets are more than just animals—they're family members who deserve the best interactive experiences. We specialize in premium interactive toys that keep your furry friends engaged, active, and happy.
            </p>
            <Button variant="hero" size="lg">
              Shop Now →
            </Button>
            <div className="text-white/80">
              Collection of happy pet faces
            </div>
          </div>
        </div>
      </section>

      {/* About Our Store Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold text-center">
              About our{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                store
              </span>
            </h2>
            
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                At Zippty, we understand that pets are more than just animals—they're cherished family members who need mental stimulation and physical activity to thrive. Our passion for pet enrichment drives us to provide the highest quality interactive toys that keep your pets engaged, entertained, and healthy.
              </p>
              
              <p>
                Whether you have a playful young pet, an energetic adult, or a wise senior companion, we're here to offer innovative solutions that satisfy their natural instincts and curiosity.
              </p>
              
              <p>
                With years of experience in understanding pet behavior, we've seen the transformative impact that the right interactive toys can have on a pet's well-being. That's why we've carefully selected our premium toy range, featuring the advanced Interactive Cat Toy with its 2-speed adjustment and remote control capabilities, and the Joyzzz Automatic Laser Toy with its 5-angle patterns and USB power system.
              </p>
              
              <p>
                At Zippty, we believe every pet deserves engaging entertainment, and we're committed to making that a reality for you and your beloved companions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => <div key={index} className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-primary">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">
              Why Choose{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Us?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Interactive Toys for Your Pets
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => <div key={index} className="text-center space-y-4">
                <div className="bg-primary/10 p-4 rounded-lg w-16 h-16 flex items-center justify-center mx-auto">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">
                Our{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Mission
                </span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our mission at Zippty is simple: to make pet care easy, affordable, and enjoyable. We're here to provide you with the best products that cater to your pet's unique needs, whether that's nutrition, play, or grooming. We aim to be your go-to source for everything your pet needs to lead a happy, healthy life. Your pet's well-being is our top priority, and we'll continue to offer only the best products and expert guidance to help you care for them.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20" />
              <div className="relative bg-card rounded-3xl p-8 border border-border shadow-soft">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold">Be Part of the Zippty Family</h3>
                  <p className="text-muted-foreground">
                    When you shop with Zippty, you're not just a customer—you're part of our community.
                  </p>
                  <Button variant="hero" size="lg" className="w-full">
                    Shop Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">
              Why Choose Our{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Services?
              </span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {services.map((service, index) => <div key={index} className="text-center space-y-4">
                <div className="bg-accent/10 p-4 rounded-lg w-16 h-16 flex items-center justify-center mx-auto">
                  <service.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-lg">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>)}
          </div>
          
          <div className="text-center mt-16 space-y-4">
            <h3 className="text-2xl font-bold">
              Start Shopping with Zippty Today!
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our wide range of products and enjoy a shopping experience that's as convenient and satisfying as it is helpful for you and your pet.
            </p>
            <Button variant="hero" size="lg">
              Explore Products
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default About;