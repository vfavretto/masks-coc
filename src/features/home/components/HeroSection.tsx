import { Moon } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Background Texture & Overlay */}
      <div className="absolute inset-0 bg-background mix-blend-multiply opacity-90 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0" />
      
      {/* Animated Elements */}
      <div className="relative z-10 animate-fade-in-up">
        <Moon className="w-24 h-24 text-primary/80 mx-auto mb-8 animate-pulse drop-shadow-[0_0_15px_rgba(201,165,92,0.5)]" />
        
        <h1 className="text-6xl md:text-8xl font-bold mb-8 text-primary font-[MedievalSharp] tracking-wider flicker text-shadow-lg">
          Masks of Nyarlathotep
        </h1>
        
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-2xl md:text-3xl text-muted-foreground font-serif italic leading-relaxed">
            "That is not dead which can eternal lie,
            <br />
            And with strange aeons even death may die."
          </p>
          
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto mt-8" />
        </div>
      </div>

      {/* Scroll indicator maybe? */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce opacity-50">
        <div className="w-1 h-16 bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0" />
      </div>
    </section>
  );
}
