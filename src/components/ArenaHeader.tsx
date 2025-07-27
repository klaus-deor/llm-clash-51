import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Trophy, Users, Brain } from "lucide-react";
import arenaHero from "@/assets/arena-hero.jpg";

export default function ArenaHeader() {
  return (
    <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${arenaHero})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Brain className="w-8 h-8 text-primary" />
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-arena bg-clip-text text-transparent">
            PromptArena AI
          </h1>
          <Zap className="w-8 h-8 text-secondary" />
        </div>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Arena competitiva para testar e comparar modelos de IA em tempo real. 
          <span className="text-primary font-semibold"> Votação cega, rankings justos.</span>
        </p>
        
        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-arena-gold" />
            <span className="text-sm font-medium">12.4K Batalhas</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-secondary" />
            <span className="text-sm font-medium">3.2K Usuários</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium">8 Modelos</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="battle" size="lg" className="text-lg px-8">
            <Zap className="w-5 h-5" />
            Iniciar Batalha
          </Button>
          <Button variant="arena" size="lg" className="text-lg px-8">
            <Trophy className="w-5 h-5" />
            Ver Rankings
          </Button>
        </div>
        
        {/* Live Battle Indicator */}
        <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-gradient-battle rounded-full border border-primary/20">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-sm font-medium">47 batalhas em andamento</span>
        </div>
      </div>
    </div>
  );
}