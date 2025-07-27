import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User, TrendingUp, DollarSign, Award, Calendar, Brain, Target } from "lucide-react";

const personalStats = {
  totalBattles: 127,
  totalVotes: 89,
  winRate: 68,
  savings: 47,
  streakDays: 12,
  favoriteModel: "Claude-3",
  preferences: {
    "Claude": 47,
    "GPT-4": 31,
    "Gemini": 22,
  },
  categoryStats: [
    { category: "Código", model: "Claude", percentage: 68, color: "bg-orange-500" },
    { category: "Escrita", model: "GPT-4", percentage: 54, color: "bg-green-500" },
    { category: "Análise", model: "Gemini", percentage: 61, color: "bg-blue-500" },
    { category: "Criativo", model: "Claude", percentage: 74, color: "bg-orange-500" },
  ],
  recentBattles: [
    {
      id: 1,
      category: "Código",
      prompt: "Criar função de ordenação...",
      yourChoice: "Claude-3",
      winner: "Claude-3",
      date: "2024-01-20",
      isCorrect: true,
    },
    {
      id: 2,
      category: "Escrita",
      prompt: "Escrever email marketing...",
      yourChoice: "GPT-4",
      winner: "GPT-4",
      date: "2024-01-19",
      isCorrect: true,
    },
    {
      id: 3,
      category: "Análise",
      prompt: "Analisar dados de vendas...",
      yourChoice: "GPT-4",
      winner: "Gemini",
      date: "2024-01-19",
      isCorrect: false,
    },
  ],
  achievements: [
    { title: "Voting Veteran", description: "100+ votos realizados", icon: "🗳️", unlocked: true },
    { title: "Trend Spotter", description: "Escolheu vencedor 10x seguidas", icon: "👁️", unlocked: true },
    { title: "Cost Saver", description: "Economizou $50+ este mês", icon: "💰", unlocked: false },
    { title: "Category Master", description: "Domine todas as categorias", icon: "🎯", unlocked: false },
  ],
};

export default function PersonalDashboard() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-arena bg-clip-text text-transparent">
          📊 Seu Dashboard
        </h2>
        <p className="text-muted-foreground text-lg">
          Suas preferências cegas e estatísticas pessoais
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-battle border-primary/20">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-primary">{personalStats.totalBattles}</div>
                <div className="text-xs text-muted-foreground">Batalhas</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-battle border-primary/20">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-arena-gold">{personalStats.winRate}%</div>
                <div className="text-xs text-muted-foreground">Taxa Acerto</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-battle border-primary/20">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-accent">${personalStats.savings}</div>
                <div className="text-xs text-muted-foreground">Economizado</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-battle border-primary/20">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-secondary">{personalStats.streakDays}</div>
                <div className="text-xs text-muted-foreground">Dias Seguidos</div>
              </CardContent>
            </Card>
          </div>

          {/* Blind Preferences */}
          <Card className="bg-gradient-battle border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Suas Preferências Cegas (Último Mês)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Você escolheu (sem saber qual era qual modelo):
                </p>
                {Object.entries(personalStats.preferences).map(([model, percentage]) => (
                  <div key={model} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{model}</span>
                      <span className="text-sm text-muted-foreground">{percentage}% das vezes</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Por Categoria:
                </h4>
                <div className="space-y-3">
                  {personalStats.categoryStats.map((stat) => (
                    <div key={stat.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                        <span className="text-sm">{stat.category}:</span>
                      </div>
                      <div className="text-sm font-medium">
                        {stat.model} ({stat.percentage}%)
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-accent" />
                  <span className="font-medium text-accent">Insight de Economia</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Poderia economizar <span className="font-bold text-accent">${personalStats.savings}/mês</span> usando 
                  o mix ideal de modelos baseado nas suas preferências.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Battles */}
          <Card className="bg-gradient-battle border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Batalhas Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {personalStats.recentBattles.map((battle) => (
                  <div
                    key={battle.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/30"
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      battle.isCorrect ? 'bg-accent' : 'bg-destructive'
                    }`} />
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {battle.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {battle.date}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{battle.prompt}</p>
                      <div className="text-xs text-muted-foreground">
                        Sua escolha: {battle.yourChoice} | Vencedor: {battle.winner}
                      </div>
                    </div>

                    <div className="text-right">
                      {battle.isCorrect ? (
                        <Badge className="bg-accent text-accent-foreground">
                          ✓ Acertou
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          ✗ Errou
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Achievements */}
          <Card className="bg-gradient-battle border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-arena-gold" />
                Conquistas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {personalStats.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    achievement.unlocked
                      ? 'bg-accent/10 border-accent/20'
                      : 'bg-muted/30 border-border opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{achievement.icon}</span>
                    <span className="font-medium text-sm">{achievement.title}</span>
                    {achievement.unlocked && (
                      <Badge className="bg-accent text-accent-foreground ml-auto">
                        ✓
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Profile Actions */}
          <div className="space-y-3">
            <Button variant="battle" className="w-full">
              <TrendingUp className="w-4 h-4" />
              Nova Batalha
            </Button>
            <Button variant="arena" className="w-full">
              <User className="w-4 h-4" />
              Editar Perfil
            </Button>
          </div>

          {/* Weekly Goal */}
          <Card className="bg-gradient-battle border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm">Meta Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Votos realizados</span>
                  <span>12/20</span>
                </div>
                <Progress value={60} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Faltam 8 votos para completar sua meta semanal!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}