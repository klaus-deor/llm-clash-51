import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, Star, DollarSign, Users, Brain, Code, PenTool, BarChart3, Sparkles } from "lucide-react";

const rankingData = {
  code: [
    { model: "Claude-3 Opus", rating: 4.7, votes: 2341, wins: "72%", cost: "$0.02", color: "bg-orange-500" },
    { model: "GPT-4 Turbo", rating: 4.5, votes: 2298, wins: "68%", cost: "$0.03", color: "bg-green-500" },
    { model: "Gemini Ultra", rating: 4.2, votes: 1876, wins: "61%", cost: "$0.01", color: "bg-blue-500" },
  ],
  writing: [
    { model: "GPT-4 Turbo", rating: 4.6, votes: 3102, wins: "74%", cost: "$0.03", color: "bg-green-500" },
    { model: "Claude-3 Opus", rating: 4.4, votes: 2987, wins: "69%", cost: "$0.02", color: "bg-orange-500" },
    { model: "Gemini Ultra", rating: 4.1, votes: 2456, wins: "58%", cost: "$0.01", color: "bg-blue-500" },
  ],
  analysis: [
    { model: "Gemini Ultra", rating: 4.8, votes: 1987, wins: "76%", cost: "$0.01", color: "bg-blue-500" },
    { model: "GPT-4 Turbo", rating: 4.3, votes: 2143, wins: "65%", cost: "$0.03", color: "bg-green-500" },
    { model: "Claude-3 Opus", rating: 4.2, votes: 1876, wins: "63%", cost: "$0.02", color: "bg-orange-500" },
  ],
  creative: [
    { model: "Claude-3 Opus", rating: 4.9, votes: 2654, wins: "81%", cost: "$0.02", color: "bg-orange-500" },
    { model: "GPT-4 Turbo", rating: 4.4, votes: 2341, wins: "67%", cost: "$0.03", color: "bg-green-500" },
    { model: "Gemini Ultra", rating: 4.0, votes: 1987, wins: "55%", cost: "$0.01", color: "bg-blue-500" },
  ],
};

const categories = [
  { id: "code", label: "Código", icon: Code },
  { id: "writing", label: "Escrita", icon: PenTool },
  { id: "analysis", label: "Análise", icon: BarChart3 },
  { id: "creative", label: "Criativo", icon: Sparkles },
];

const insights = [
  {
    category: "Código",
    insight: "Claude vence 72% das batalhas em refatoração",
    icon: "💡",
  },
  {
    category: "Economia",
    insight: "Gemini é 3x mais barato com 90% da qualidade",
    icon: "💰",
  },
  {
    category: "Velocidade",
    insight: "GPT-4 Turbo é 40% mais rápido que Claude",
    icon: "⚡",
  },
  {
    category: "Criatividade",
    insight: "Claude domina em escrita criativa com 81% de vitórias",
    icon: "🎨",
  },
];

interface RankingsSectionProps {
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export default function RankingsSection({ 
  selectedCategory = "code", 
  onCategoryChange 
}: RankingsSectionProps) {
  const currentRankings = rankingData[selectedCategory as keyof typeof rankingData] || rankingData.code;

  const getRankIcon = (index: number) => {
    if (index === 0) return "🏆";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return "🏅";
  };

  const getRankColor = (index: number) => {
    if (index === 0) return "text-arena-gold";
    if (index === 1) return "text-arena-silver";
    if (index === 2) return "text-arena-bronze";
    return "text-muted-foreground";
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-arena bg-clip-text text-transparent">
          🏆 Rankings da Arena
        </h2>
        <p className="text-muted-foreground text-lg">
          Rankings baseados em votações cegas da comunidade
        </p>
      </div>

      {/* Category Selector */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "arena"}
              onClick={() => onCategoryChange?.(category.id)}
              className="gap-2"
            >
              <IconComponent className="w-4 h-4" />
              {category.label}
            </Button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Rankings */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="bg-gradient-battle border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-arena-gold" />
                Ranking Geral - {categories.find(c => c.id === selectedCategory)?.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentRankings.map((item, index) => (
                <div
                  key={item.model}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  {/* Rank */}
                  <div className={`text-2xl ${getRankColor(index)}`}>
                    {getRankIcon(index)}
                  </div>

                  {/* Model Info */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="font-bold text-lg">{item.model}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-arena-gold" />
                        <span>{item.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{item.votes.toLocaleString()} votos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>{item.wins} vitórias</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{item.cost}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <Badge 
                    className={index === 0 ? "bg-arena-gold text-background" : ""}
                  >
                    #{index + 1}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-battle border-primary/20">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary">12.4K</div>
                <div className="text-sm text-muted-foreground">Batalhas Concluídas</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-battle border-primary/20">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-secondary">3.2K</div>
                <div className="text-sm text-muted-foreground">Usuários Ativos</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-battle border-primary/20">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-accent">8</div>
                <div className="text-sm text-muted-foreground">Modelos Competindo</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Insights Sidebar */}
        <div className="space-y-6">
          <Card className="bg-gradient-battle border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Insights da Arena
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-muted/30 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{insight.icon}</span>
                    <span className="font-medium text-sm">{insight.category}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {insight.insight}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button variant="battle" className="w-full">
              <Trophy className="w-4 h-4" />
              Participar de Batalha
            </Button>
            <Button variant="arena" className="w-full">
              <Star className="w-4 h-4" />
              Ver Meu Histórico
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}