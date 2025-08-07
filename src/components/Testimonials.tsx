import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Cat Parent",
    content: "The Interactive Cat Toy with 2-speed adjustment has been a game-changer for my energetic Bengal cat, Leo! The 2-speed adjustment feature is perfect - I use the slower speed when he's just waking up and the faster speed for his evening play sessions. The remote control works flawlessly, and Leo absolutely loves chasing the laser dot. It's kept him entertained for hours and helped reduce his destructive behavior. The orange color is vibrant and easy to spot. Highly recommend for any cat parent!",
    rating: 5,
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold">
            What our{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Customers Say
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            What people say about us
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card rounded-3xl p-8 border border-border shadow-soft">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>
              
              <blockquote className="text-lg text-card-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </blockquote>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-card-foreground">{testimonial.name}</div>
                  <div className="text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;