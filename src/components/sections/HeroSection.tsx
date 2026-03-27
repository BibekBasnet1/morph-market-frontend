import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router";

const snakeImages = [
  {
    url: "/ball_python_background.webp",
    title: "Ball Python",
    subtitle: "Stunning morphs available",
  },
  {
    url: "/corn_snake.webp",
    title: "Corn Snake",
    subtitle: "Perfect for beginners",
  },
  {
    url: "/boa_python.webp",
    title: "Boa Constrictor",
    subtitle: "Majestic specimens",
  },
  {
    url: "/green_tree_python.webp",
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
    const timer = setInterval(handleNextSlide, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  return (
    <section className="relative min-h-screen overflow-hidden text-white bg-background">
      <div className="absolute inset-0">
        {snakeImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
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
        <div className="absolute inset-0 hero-gradient-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-black/45 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full py-20">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-primary font-semibold tracking-widest uppercase text-xs sm:text-sm">
                Trusted reptile marketplace
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight tracking-tight drop-shadow-xl max-w-2xl">
                Find healthy, well-cared reptiles from verified sellers.
              </h1>
              <p className="text-base sm:text-lg text-gray-100/90 max-w-xl">
                Browse quality listings, compare breeders, and buy with confidence through a community focused on responsible reptile ownership.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/marketplace">
                <Button size="lg" className="bg-primary w-full md:w-auto text-primary-foreground hover:bg-primary/80 text-base px-8">
                  Browse Marketplace
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" className="w-full md:w-auto text-base px-8 bg-yellow-200 text-black hover:bg-yellow-300">
                  Become a Seller
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/30">
              <div>
                <p className="text-3xl font-display font-bold text-primary">2,500+</p>
                <p className="text-sm text-gray-100/80">Active Listings</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-primary">500+</p>
                <p className="text-sm text-gray-100/80">Verified Breeders</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-primary">50+</p>
                <p className="text-sm text-gray-100/80">Species Available</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:block space-y-8 justify-end h-full flex relative">
            <div className="relative animate-float">
              <div className="relative bg-black/35 backdrop-blur-xl rounded-2xl p-6 border border-white/25 shadow-2xl min-w-[320px]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium tracking-wider uppercase text-white/70">
                      Featured Species
                    </span>
                    <span className="text-xs text-white font-medium">
                      {currentSlide + 1} / {snakeImages.length}
                    </span>
                  </div>
                  
                  <div className={`transition-all duration-300 ${isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
                    <h3 className="text-2xl font-display font-bold text-white">
                      {snakeImages[currentSlide].title}
                    </h3>
                    <p className="text-white/75">
                      {snakeImages[currentSlide].subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex gap-2">
                      {snakeImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          aria-label={`Go to slide ${index + 1}`}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentSlide
                              ? "w-8 bg-primary"
                              : "w-2 bg-white/35 hover:bg-white/60"
                          }`}
                        />
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={handlePrevSlide}
                        aria-label="Previous slide"
                        className="p-2 rounded-full border border-white/40 hover:border-primary/60 hover:bg-white/10 transition-all"
                      >
                        <ChevronLeft className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={handleNextSlide}
                        aria-label="Next slide"
                        className="p-2 rounded-full border border-white/40 hover:border-primary/60 hover:bg-white/10 transition-all"
                      >
                        <ChevronRight className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-2xl -z-10 animate-pulse-glow" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 lg:hidden z-20">
        {snakeImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
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
