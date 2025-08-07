import { useLocation } from "wouter";
import SearchForm, { SearchFilters } from "./SearchForm";
import sereneHeroBackground from "@/assets/serene-hero-bg.jpg";

const HeroSection = () => {
  const [, setLocation] = useLocation();

  const handleSearch = (filters: SearchFilters) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        searchParams.append(key, value);
      }
    });
    
    setLocation(`/properties?${searchParams.toString()}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${sereneHeroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-secondary/70"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-secondary/20 rounded-full blur-2xl animate-pulse delay-300"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-primary-glow/30 rounded-full blur-xl animate-pulse delay-700"></div>

      <div className="relative z-10 container mx-auto px-4 py-20 flex items-center justify-center min-h-screen">
        {/* Centered Search Form */}
        <div className="w-full max-w-5xl">
          <SearchForm onSearch={handleSearch} />
        </div>
      </div>

      {/* Wave Effect at Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M0 120L48 105C96 90 192 60 288 45C384 30 480 30 576 37.5C672 45 768 60 864 67.5C960 75 1056 75 1152 67.5C1248 60 1344 45 1392 37.5L1440 30V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" 
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;