import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router";

const snakeImages = [
  {
    url: "https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=1200&h=800&fit=crop",
    title: "Ball Python",
    subtitle: "Stunning morphs available",
  },
  {
    url: "https://images.unsplash.com/photo-1570741066052-817c6de995c8?w=1200&h=800&fit=crop",
    title: "Corn Snake",
    subtitle: "Perfect for beginners",
  },
  {
    url: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=1200&h=800&fit=crop",
    title: "Boa Constrictor",
    subtitle: "Majestic specimens",
  },
  {
    url: "https://images.unsplash.com/photo-1585095595205-e68428a9e205?w=1200&h=800&fit=crop",
    title: "Green Tree Python",
    subtitle: "Exotic beauty",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNextSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % snakeImages.length);
      setIsTransitioning(false);
    }, 300);
  };

  const handlePrevSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + snakeImages.length) % snakeImages.length);
      setIsTransitioning(false);
    }, 300);
  };

  const goToSlide = (index: number) => {
    if (index !== currentSlide) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setIsTransitioning(false);
      }, 300);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleNextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden text-white bg-background">
      {/* Background Image Slideshow */}
      <div className="absolute inset-0 w-full h-full">
        {snakeImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? isTransitioning
                  ? "opacity-0 scale-105"
                  : "opacity-100 scale-100"
                : "opacity-0 scale-110"
            }`}
          >
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 hero-gradient-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-glow hidden md:block" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow hidden md:block" style={{ animationDelay: "1.5s" }} />

      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center w-full py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <p className="text-primary font-medium tracking-widest uppercase text-xs sm:text-sm animate-fade-in" style={{ animationDelay: "0.2s" }}>
                Premier Reptile Marketplace
              </p>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-[0.85] tracking-tight drop-shadow-2xl">
                The Art of <br/>
                <span className="relative inline-block text-[#E8DFCA] italic pr-2 sm:pr-4 z-30">
                  Scaled
                  <svg className="absolute -bottom-2 w-full h-2 sm:h-3 text-primary/50" preserveAspectRatio="none" viewBox="0 0 100 10">
                    <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="4"></path>
                  </svg>
                </span> <br/>
                Companionship
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-lg animate-fade-in" style={{ animationDelay: "0.6s" }}>
                Connect with trusted breeders worldwide. Discover rare morphs, 
                verified sellers, and exceptional reptiles for your collection.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link to="/marketplace">
                <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/80 text-base px-6 sm:px-8">
                  Browse Snakes
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-6 sm:px-8 hover:bg-white hover:text-black">
                Become a Seller
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-border/30 animate-fade-in" style={{ animationDelay: "1s" }}>
              <div>
                <p className="text-2xl sm:text-3xl font-display font-bold text-primary">2,500+</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Active Listings</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-display font-bold text-primary">500+</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Verified Breeders</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-display font-bold text-primary">50+</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Snake Species</p>
              </div>
            </div>
          </div>

          {/* Right Content - Slideshow Info Card */}
          <div className="hidden lg:flex lg:flex-col lg:space-y-8 lg:justify-end h-full relative">
            <div className="relative animate-float">
              {/* Main Card */}
              <div className="relative bg-card/80 backdrop-blur-xl rounded-2xl p-6 border border-border/50 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                      Featured Species
                    </span>
                    <span className="text-xs text-white font-medium">
                      {currentSlide + 1} / {snakeImages.length}
                    </span>
                  </div>
                  
                  <div className={`transition-all duration-300 ${isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
                    <h3 className="text-2xl font-display font-bold text-foreground">
                      {snakeImages[currentSlide].title}
                    </h3>
                    <p className="text-muted-foreground">
                      {snakeImages[currentSlide].subtitle}
                    </p>
                  </div>

                  {/* Slide Navigation */}
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex gap-2">
                      {snakeImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentSlide
                              ? "w-8 bg-primary"
                              : "w-2 bg-border hover:bg-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={handlePrevSlide}
                        className="p-2 rounded-full border border-border/50 hover:border-primary/50 hover:bg-secondary/50 transition-all"
                      >
                        <ChevronLeft className="w-4 h-4 text-foreground" />
                      </button>
                      <button
                        onClick={handleNextSlide}
                        className="p-2 rounded-full border border-border/50 hover:border-primary/50 hover:bg-secondary/50 transition-all"
                      >
                        <ChevronRight className="w-4 h-4 text-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative glow behind card */}
              <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-2xl -z-10 animate-pulse-glow" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Slide Indicators for Mobile */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 lg:hidden z-20">
        {snakeImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 bg-primary"
                : "w-2 bg-foreground/30 hover:bg-foreground/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
