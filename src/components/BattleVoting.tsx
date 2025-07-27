import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, ThumbsUp, Eye, Sparkles } from "lucide-react";

interface BattleResponse {
  id: string;
  content: string;
  responseTime: number;
  cost: number;
  modelName?: string; // Hidden until voting is complete
  position: string; // A, B, C
}

interface BattleVotingProps {
  prompt: string;
  category: string;
  responses: BattleResponse[];
  onVote: (responseId: string) => void;
  onReveal: () => void;
  votingComplete?: boolean;
}

export default function BattleVoting({
  prompt,
  category,
  responses,
  onVote,
  onReveal,
  votingComplete = false
}: BattleVotingProps) {
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [showReveal, setShowReveal] = useState(false);

  const handleVote = (responseId: string) => {
    setSelectedVote(responseId);
    onVote(responseId);
  };

  const handleReveal = () => {
    setShowReveal(true);
    onReveal();
  };

  // ✅ MAPEAMENTO FIXO: A=DeepSeek, B=GPT, C=Claude
  const parseFixedLLMResponses = (webhookResponses: any) => {
    const fixedResponses: BattleResponse[] = [];
    
    // RESPOSTA A - SEMPRE DEEPSEEK
    if (webhookResponses?.resposta_deepseek) {
      fixedResponses.push({
        id: "response-a-deepseek",
        content: webhookResponses.resposta_deepseek.trim(),
        responseTime: 2.1,
        cost: 0.005,
        modelName: "DeepSeek",
        position: "A"
      });
    }
    
    // RESPOSTA B - SEMPRE GPT
    if (webhookResponses?.resposta_gpt) {
      fixedResponses.push({
        id: "response-b-gpt", 
        content: webhookResponses.resposta_gpt.trim(),
        responseTime: 2.3,
        cost: 0.03,
        modelName: "GPT-4",
        position: "B"
      });
    }
    
    // RESPOSTA C - SEMPRE CLAUDE
    if (webhookResponses?.resposta_claude) {
      fixedResponses.push({
        id: "response-c-claude",
        content: webhookResponses.resposta_claude.trim(), 
        responseTime: 1.8,
        cost: 0.02,
        modelName: "Claude-3",
        position: "C"
      });
    }
    
    // Debug: Log para verificar mapeamento
    console.log("🔍 Mapeamento de Respostas:", {
      "A (DeepSeek)": !!webhookResponses?.resposta_deepseek ? "✅" : "❌",
      "B (GPT)": !!webhookResponses?.resposta_gpt ? "✅" : "❌", 
      "C (Claude)": !!webhookResponses?.resposta_claude ? "✅" : "❌",
      "Total": `${fixedResponses.length}/3`
    });
    
    return fixedResponses;
  };

  // Use fixed mapping if we have webhook data, otherwise use provided responses
  const processedResponses = responses.length > 0 && responses[0].position 
    ? responses 
    : parseFixedLLMResponses(responses);

  const getResponseLabel = (response: BattleResponse) => {
    // Retorna sempre a posição fixa (A, B, C)
    return response.position || 'X';
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Battle Info */}
      <Card className="bg-gradient-battle border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Vote na Melhor Resposta
            <Badge variant="outline" className="ml-auto">
              {category}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="font-medium text-sm text-muted-foreground mb-2">Prompt:</p>
            <p className="text-foreground">{prompt}</p>
          </div>
        </CardContent>
      </Card>

      {/* Debug Info - Remove in production */}
      {processedResponses.length === 0 && (
        <Card className="border-amber-500/20 bg-amber-50/10">
          <CardContent className="pt-6">
            <p className="text-amber-600 text-sm">
              ⚠️ Nenhuma resposta processada. Verifique se o webhook está retornando os dados corretos.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Responses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {processedResponses.map((response) => (
          <Card
            key={response.id}
            className={`relative transition-all duration-300 hover:shadow-battle ${
              selectedVote === response.id
                ? 'border-primary shadow-glow scale-105'
                : 'border-border hover:border-primary/40'
            }`}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">Resposta {getResponseLabel(response)}</span>
                {showReveal && response.modelName && (
                  <Badge className="bg-primary text-primary-foreground">
                    {response.modelName}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Response Content */}
              <div className="bg-muted/30 p-4 rounded-lg max-h-64 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-foreground font-mono">
                  {response.content}
                </pre>
              </div>

              {/* Metrics */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{response.responseTime.toFixed(1)}s</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span>${response.cost.toFixed(3)}</span>
                </div>
              </div>

              {/* Vote Button */}
              {!votingComplete && (
                <Button
                  variant={selectedVote === response.id ? "default" : "vote"}
                  onClick={() => handleVote(response.id)}
                  disabled={selectedVote !== null && selectedVote !== response.id}
                  className="w-full"
                >
                  <ThumbsUp className="w-4 h-4" />
                  {selectedVote === response.id ? 'Voto Confirmado!' : 'Votar'}
                </Button>
              )}

              {/* Winner Badge */}
              {votingComplete && selectedVote === response.id && (
                <Badge className="w-full justify-center bg-arena-gold text-background font-bold">
                  🏆 Sua Escolha Vencedora
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reveal Button */}
      {selectedVote && !showReveal && (
        <div className="text-center">
          <Button
            variant="arena"
            size="lg"
            onClick={handleReveal}
            className="text-lg px-8"
          >
            <Eye className="w-5 h-5" />
            Revelar Modelos
          </Button>
        </div>
      )}

      {/* Post-Voting Info */}
      {showReveal && (
        <Card className="bg-gradient-battle border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold text-primary">
                🎉 Votação Concluída!
              </h3>
              <p className="text-muted-foreground">
                Obrigado por contribuir para melhorar nossos rankings! 
                Seus dados ajudam outros usuários a escolher o melhor modelo.
              </p>
              
              {/* Results Summary */}
              <div className="bg-muted/30 rounded-lg p-4 mt-4">
                <h4 className="font-semibold mb-2">📊 Resumo da Batalha:</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold">Resposta A</div>
                    <div className="text-muted-foreground">DeepSeek</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">Resposta B</div>
                    <div className="text-muted-foreground">GPT-4</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">Resposta C</div>
                    <div className="text-muted-foreground">Claude-3</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <Button variant="battle">
                  <Sparkles className="w-4 h-4" />
                  Nova Batalha
                </Button>
                <Button variant="arena">
                  Ver Rankings Atualizados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}