import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, Heart, Eye, CheckCircle } from "lucide-react";

interface BattleResponse {
  id: string;
  content: string;
  responseTime: number;
  cost: number;
  modelName?: string;
  position: string;
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

  const parseWebhookResponses = (webhookResponses: any) => {
    const fixedResponses: BattleResponse[] = [];
    
    if (!webhookResponses) {
      console.log("⚠️ No webhook responses found");
      return [];
    }
    
    console.log("🔍 Processing webhook responses:", webhookResponses);
    
    // Response A
    if (webhookResponses.resposta_a) {
      const cleanContent = webhookResponses.resposta_a
        .replace(/<think>[\s\S]*?<\/think>/g, '')
        .trim();
      
      if (cleanContent) {
        fixedResponses.push({
          id: "response-a",
          content: cleanContent,
          responseTime: 2.1,
          cost: 0.015,
          modelName: "Model A",
          position: "A"
        });
      }
    }
    
    // Response B
    if (webhookResponses.resposta_b) {
      const cleanContent = webhookResponses.resposta_b
        .replace(/<think>[\s\S]*?<\/think>/g, '')
        .trim();
      
      if (cleanContent) {
        fixedResponses.push({
          id: "response-b",
          content: cleanContent,
          responseTime: 2.3,
          cost: 0.02,
          modelName: "Model B",
          position: "B"
        });
      }
    }
    
    // Response C
    if (webhookResponses.resposta_c) {
      const cleanContent = webhookResponses.resposta_c
        .replace(/<think>[\s\S]*?<\/think>/g, '')
        .trim();
      
      if (cleanContent) {
        fixedResponses.push({
          id: "response-c",
          content: cleanContent,
          responseTime: 1.8,
          cost: 0.018,
          modelName: "Model C",
          position: "C"
        });
      }
    }
    
    console.log("🔍 Processed responses mapping:", {
      "A": !!webhookResponses.resposta_a ? "✅" : "❌",
      "B": !!webhookResponses.resposta_b ? "✅" : "❌", 
      "C": !!webhookResponses.resposta_c ? "✅" : "❌",
      "Total processed": fixedResponses.length
    });
    
    return fixedResponses;
  };

  const processedResponses = responses.length > 0 && responses[0].position 
    ? responses 
    : parseWebhookResponses(responses);

  const getResponseLabel = (response: BattleResponse) => {
    return response.position || 'X';
  };

  return (
    <div className="space-apple-lg">
      {/* Header */}
      <div className="text-center space-apple-md">
        <h1 className="text-apple-title">Choose the Best Response</h1>
        <p className="text-apple-body max-w-2xl mx-auto">
          Vote for the response you think is best. Models are hidden until you reveal them.
        </p>
      </div>

      {/* Prompt Display */}
      <div className="max-w-4xl mx-auto">
        <Card className="card-apple">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-apple-subtitle">Prompt</h3>
              <Badge variant="outline" className="rounded-full">
                {category}
              </Badge>
            </div>
            <div className="card-apple p-4 bg-secondary/30">
              <p className="text-apple-body">{prompt}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Messages */}
      {processedResponses.length === 0 && (
        <div className="max-w-4xl mx-auto">
          <Card className="card-apple">
            <CardContent className="p-6">
              <div className="status-warning rounded-xl p-4">
                <div className="font-medium mb-2">⚠️ No responses processed</div>
                <p className="text-sm">
                  Check the browser console for debugging information.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {processedResponses.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <Card className="card-apple">
            <CardContent className="p-6">
              <div className="status-success rounded-xl p-4">
                <div className="font-medium mb-1">✅ Responses ready</div>
                <p className="text-sm">
                  Found {processedResponses.length} responses for comparison.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Responses Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {processedResponses.map((response) => (
            <Card 
              key={response.id}
              className={`card-apple transition-all duration-300 cursor-pointer ${
                selectedVote === response.id
                  ? 'ring-2 ring-primary bg-primary/5 scale-[1.02]'
                  : 'hover:scale-[1.01] hover:shadow-lg'
              }`}
              onClick={() => !votingComplete && !selectedVote && handleVote(response.id)}
            >
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg font-semibold">
                    Response {getResponseLabel(response)}
                  </span>
                  {showReveal && response.modelName && (
                    <Badge className="bg-primary text-primary-foreground rounded-full">
                      {response.modelName}
                    </Badge>
                  )}
                  {selectedVote === response.id && (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-apple-sm">
                {/* Response Content */}
                <div className="card-apple p-4 bg-secondary/30 max-h-80 overflow-y-auto scrollbar-apple">
                  <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                    {response.content}
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{response.responseTime.toFixed(1)}s</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>${response.cost.toFixed(3)}</span>
                  </div>
                </div>

                {/* Vote Button */}
                {!votingComplete && !selectedVote && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVote(response.id);
                    }}
                    className="btn-apple-primary w-full gap-2"
                  >
                    <Heart className="w-4 h-4" />
                    Vote for this
                  </button>
                )}

                {/* Selected State */}
                {selectedVote === response.id && !showReveal && (
                  <div className="status-success rounded-xl p-3 text-center">
                    <CheckCircle className="w-5 h-5 mx-auto mb-1" />
                    <div className="font-medium text-sm">Your Choice</div>
                  </div>
                )}

                {/* Winner Badge */}
                {votingComplete && selectedVote === response.id && (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl p-3 text-center font-medium">
                    🏆 Your Winner
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Reveal Button */}
      {selectedVote && !showReveal && processedResponses.length > 0 && (
        <div className="text-center">
          <button
            onClick={handleReveal}
            className="btn-apple-secondary px-8 py-4 text-base gap-3"
          >
            <Eye className="w-5 h-5" />
            Reveal Models
          </button>
        </div>
      )}

      {/* Post-Voting Summary */}
      {showReveal && (
        <div className="max-w-4xl mx-auto">
          <Card className="card-apple">
            <CardContent className="p-8 text-center space-apple-md">
              <div className="space-apple-sm">
                <h3 className="text-apple-title">🎉 Comparison Complete!</h3>
                <p className="text-apple-body">
                  Thank you for contributing to our AI model rankings.
                  Your vote helps others choose the best model for their needs.
                </p>
              </div>
              
              {/* Results Summary */}
              <div className="card-apple p-6 bg-secondary/30">
                <h4 className="font-semibold mb-4">Comparison Summary</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold">Response A</div>
                    <div className="text-muted-foreground">Model A</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">Response B</div>
                    <div className="text-muted-foreground">Model B</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">Response C</div>
                    <div className="text-muted-foreground">Model C</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                <button className="btn-apple-primary gap-2">
                  <Heart className="w-4 h-4" />
                  New Comparison
                </button>
                <button className="btn-apple-secondary gap-2">
                  View Rankings
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}