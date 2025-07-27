import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArenaHeader from "@/components/ArenaHeader";
import BattleForm from "@/components/BattleForm";
import BattleVoting from "@/components/BattleVoting";
import RankingsSection from "@/components/RankingsSection";
import PersonalDashboard from "@/components/PersonalDashboard";
import { Zap, Trophy, User, Brain } from "lucide-react";

// Mock data for battle simulation - ONLY used as fallback
const mockResponses = [
  {
    id: "response-a",
    content: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Optimized version with memoization
def fibonacci_memo(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci_memo(n-1, memo) + fibonacci_memo(n-2, memo)
    return memo[n]`,
    responseTime: 2.3,
    cost: 0.03,
    modelName: "Modelo A",
    position: "A"
  },
  {
    id: "response-b", 
    content: `def fibonacci(n):
    """Calculate Fibonacci number using iterative approach."""
    if n <= 1:
        return n
    
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b

# Alternative: Generator for sequence
def fibonacci_sequence(limit):
    a, b = 0, 1
    while a < limit:
        yield a
        a, b = b, a + b`,
    responseTime: 1.8,
    cost: 0.02,
    modelName: "Modelo B",
    position: "B"
  },
  {
    id: "response-c",
    content: `def fibonacci(n):
    # Base cases
    if n == 0:
        return 0
    elif n == 1:
        return 1
    
    # Initialize first two numbers
    prev_prev, prev = 0, 1
    
    # Calculate iteratively
    for i in range(2, n + 1):
        current = prev + prev_prev
        prev_prev, prev = prev, current
    
    return prev

# Usage example:
print(f"10th Fibonacci number: {fibonacci(10)}")`,
    responseTime: 3.1,
    cost: 0.01,
    modelName: "Modelo C",
    position: "C"
  }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("battle");
  const [battleState, setBattleState] = useState<"form" | "voting" | "completed">("form");
  const [currentBattle, setCurrentBattle] = useState<any>(null);
  const [selectedRankingCategory, setSelectedRankingCategory] = useState("code");

  // ✅ FUNÇÃO PARA PROCESSAR DADOS REAIS DO WEBHOOK (formato correto)
  const parseWebhookResponses = (webhookResponses: any) => {
    if (!webhookResponses) {
      console.log("⚠️ Nenhuma resposta do webhook para processar");
      return [];
    }
    
    console.log("🔍 Processando respostas do webhook no Index:", webhookResponses);
    
    const responses = [];
    
    // MAPEAMENTO CORRETO: A, B, C baseado no formato do webhook
    if (webhookResponses.resposta_a) {
      const cleanContent = webhookResponses.resposta_a
        .replace(/<think>[\s\S]*?<\/think>/g, '') // Remove tags <think>
        .trim();
        
      if (cleanContent) {
        responses.push({
          id: "response-a",
          content: cleanContent,
          responseTime: 2.1,
          cost: 0.015,
          modelName: "Modelo A",
          position: "A"
        });
      }
    }
    
    if (webhookResponses.resposta_b) {
      const cleanContent = webhookResponses.resposta_b
        .replace(/<think>[\s\S]*?<\/think>/g, '') // Remove tags <think>
        .trim();
        
      if (cleanContent) {
        responses.push({
          id: "response-b",
          content: cleanContent,
          responseTime: 2.3,
          cost: 0.02,
          modelName: "Modelo B",
          position: "B"
        });
      }
    }
    
    if (webhookResponses.resposta_c) {
      const cleanContent = webhookResponses.resposta_c
        .replace(/<think>[\s\S]*?<\/think>/g, '') // Remove tags <think>
        .trim();
        
      if (cleanContent) {
        responses.push({
          id: "response-c",
          content: cleanContent,
          responseTime: 1.8,
          cost: 0.018,
          modelName: "Modelo C",
          position: "C"
        });
      }
    }
    
    console.log("✅ Respostas processadas no Index:", {
      total: responses.length,
      positions: responses.map(r => r.position)
    });
    
    return responses;
  };

  const handleStartBattle = (battleData: any) => {
    console.log("🚀 Iniciando batalha com dados:", battleData);
    
    // ✅ USAR DADOS REAIS DO WEBHOOK
    let responses = [];
    
    if (battleData.responses) {
      // Processar dados reais do webhook
      responses = parseWebhookResponses(battleData.responses);
      console.log("✅ Usando dados reais do webhook:", responses);
      
      // Se não conseguiu processar nenhuma resposta, usar fallback
      if (responses.length === 0) {
        console.log("⚠️ Nenhuma resposta válida processada, usando fallback mock");
        responses = mockResponses.slice(0, 3); // Sempre 3 respostas A, B, C
      }
    } else {
      // Fallback para dados mock apenas se webhook falhar completamente
      responses = mockResponses.slice(0, 3); // Sempre 3 respostas A, B, C
      console.log("⚠️ Usando dados mock (webhook falhou):", responses);
    }
    
    setCurrentBattle({
      ...battleData,
      responses
    });
    setBattleState("voting");
  };

  const handleVote = (responseId: string) => {
    console.log("🗳️ Voto registrado para:", responseId);
    
    // Aqui você pode implementar lógica para salvar o voto
    // Por exemplo, enviar para um backend ou analytics
  };

  const handleReveal = () => {
    setBattleState("completed");
  };

  const handleNewBattle = () => {
    setBattleState("form");
    setCurrentBattle(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <ArenaHeader />
      
      <div className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-md mx-auto mb-8 bg-muted/30 p-1">
            <TabsTrigger 
              value="battle" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Batalha</span>
            </TabsTrigger>
            <TabsTrigger 
              value="rankings"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Rankings</span>
            </TabsTrigger>
            <TabsTrigger 
              value="dashboard"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="about"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Sobre</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="battle" className="space-y-8">
            {battleState === "form" && (
              <BattleForm onStartBattle={handleStartBattle} />
            )}
            
            {battleState === "voting" && currentBattle && (
              <BattleVoting
                prompt={currentBattle.prompt}
                category={currentBattle.category}
                responses={currentBattle.responses}
                onVote={handleVote}
                onReveal={handleReveal}
              />
            )}
            
            {battleState === "completed" && currentBattle && (
              <BattleVoting
                prompt={currentBattle.prompt}
                category={currentBattle.category}
                responses={currentBattle.responses}
                onVote={handleVote}
                onReveal={handleReveal}
                votingComplete={true}
              />
            )}
            
            {/* Botão para nova batalha quando completada */}
            {battleState === "completed" && (
              <div className="text-center">
                <button
                  onClick={handleNewBattle}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  🔄 Nova Batalha
                </button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="rankings">
            <RankingsSection 
              selectedCategory={selectedRankingCategory}
              onCategoryChange={setSelectedRankingCategory}
            />
          </TabsContent>

          <TabsContent value="dashboard">
            <PersonalDashboard />
          </TabsContent>

          <TabsContent value="about" className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold bg-gradient-arena bg-clip-text text-transparent">
                🧠 Sobre o PromptArena AI
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 p-6 rounded-lg bg-gradient-battle border border-primary/20">
                <h3 className="text-xl font-bold text-primary">O Problema</h3>
                <p className="text-muted-foreground">
                  Profissionais perdem horas testando manualmente diferentes modelos de IA (GPT-4, Claude, Gemini) 
                  para encontrar qual gera melhor resposta. Não há forma sistemática de comparar outputs ou 
                  entender qual modelo funciona melhor para cada tipo de tarefa.
                </p>
              </div>
              
              <div className="space-y-4 p-6 rounded-lg bg-gradient-battle border border-primary/20">
                <h3 className="text-xl font-bold text-secondary">A Solução</h3>
                <p className="text-muted-foreground">
                  Arena onde múltiplos LLMs competem gerando respostas para o mesmo prompt, 
                  com votação cega determinando vencedor e construindo ranking por categoria de uso. 
                  Elimina viés de marca e revela real performance dos modelos.
                </p>
              </div>
              
              <div className="space-y-4 p-6 rounded-lg bg-gradient-battle border border-primary/20">
                <h3 className="text-xl font-bold text-accent">Diferenciais</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Comparação justa sem viés de marca</li>
                  <li>• Dados reais de preferência por tarefa</li>
                  <li>• Insights de custo e performance</li>
                  <li>• Rankings dinâmicos da comunidade</li>
                </ul>
              </div>
              
              <div className="space-y-4 p-6 rounded-lg bg-gradient-battle border border-primary/20">
                <h3 className="text-xl font-bold text-arena-gold">Impacto</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Economia de custos com modelo adequado</li>
                  <li>• Decisões baseadas em dados reais</li>
                  <li>• Redução de tempo de testes</li>
                  <li>• Melhores resultados de IA</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;