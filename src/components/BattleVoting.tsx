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

  const getResponseLabel = (index: number) => {
    const labels = ['A', 'B', 'C', 'D', 'E', 'F'];
    return labels[index] || `${index + 1}`;
  };

  // Parse LLM responses and shuffle labels
  const parseAndShuffleLLMResponses = (retornos_llms: string) => {
    const responses = [];
    const models = ['deepseek', 'gpt', 'claude', 'llama', 'mistral', 'cohere'];
    
    // Split by model names to extract individual responses
    const parts = retornos_llms.split(/(?=\b(?:deepseek|gpt|claude|llama|mistral|cohere)\b)/);
    
    for (const part of parts) {
      if (part.trim()) {
        const modelMatch = part.match(/^(\w+)\s+([\s\S]+)/);
        if (modelMatch) {
          const [, modelName, content] = modelMatch;
          const cleanContent = content
            .replace(/<think>[\s\S]*?<\/think>/g, '')
            .trim();
          
          if (cleanContent) {
            responses.push({
              id: `${modelName}-${Math.random()}`,
              content: cleanContent,
              responseTime: Math.random() * 3 + 1, // Random time between 1-4s
              cost: Math.random() * 0.05 + 0.01, // Random cost
              modelName: modelName
            });
          }
        }
      }
    }
    
    // Shuffle responses to randomize A, B, C assignment
    return responses.sort(() => Math.random() - 0.5);
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

      {/* Responses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {responses.map((response, index) => (
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
                <span className="text-lg">Resposta {getResponseLabel(index)}</span>
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