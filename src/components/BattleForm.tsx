import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Zap, Code, PenTool, BarChart3, Sparkles, Globe, Brain } from "lucide-react";

const categories = [
  { id: "code", label: "Código", icon: Code },
  { id: "writing", label: "Escrita", icon: PenTool },
  { id: "analysis", label: "Análise", icon: BarChart3 },
  { id: "creative", label: "Criativo", icon: Sparkles },
  { id: "translation", label: "Tradução", icon: Globe },
  { id: "other", label: "Outro", icon: Brain },
];

const models = [
  { id: "gpt4", name: "GPT-4", color: "bg-green-500", cost: "$0.03" },
  { id: "claude", name: "Claude-3", color: "bg-orange-500", cost: "$0.02" },
  { id: "gemini", name: "Gemini", color: "bg-blue-500", cost: "$0.01" },
  { id: "llama", name: "Llama-3", color: "bg-purple-500", cost: "$0.005" },
  { id: "mistral", name: "Mistral", color: "bg-red-500", cost: "$0.004" },
  { id: "cohere", name: "Cohere", color: "bg-yellow-500", cost: "$0.006" },
];

interface BattleFormProps {
  onStartBattle: (data: {
    prompt: string;
    category: string;
    selectedModels: string[];
    responses?: {
      retornos_llms: string;
      retorno_juiz: string; // ✅ CORRIGIDO: era "retono_juiz"
      resposta_deepseek: string;
      resposta_gpt: string;
      resposta_claude: string;
    };
  }) => void;
}

export default function BattleForm({ onStartBattle }: BattleFormProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("code");
  const [selectedModels, setSelectedModels] = useState(["gpt4", "claude", "gemini"]);
  const [isLoading, setIsLoading] = useState(false);

  const handleModelToggle = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const handleStartBattle = async () => {
    if (prompt.trim() && selectedModels.length >= 2 && !isLoading) {
      setIsLoading(true);
      
      const battleData = {
        prompt: prompt.trim(),
        category: selectedCategory,
        selectedModels,
      };

      // Send to webhook
      try {
        const response = await fetch("https://kaua1nagel.app.n8n.cloud/webhook/teste", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...battleData,
            timestamp: new Date().toISOString(),
            totalCost: totalCost.toFixed(3),
          }),
        });

        if (response.ok) {
          const responseData = await response.json();
          
          // Debug: Log para verificar estrutura dos dados recebidos
          console.log("🔍 Dados recebidos do webhook:", responseData);
          
          // Pass the webhook response to the parent component with specific variables
          onStartBattle({
            ...battleData,
            responses: {
              retornos_llms: responseData.retornos_llms || "",
              retorno_juiz: responseData.retorno_juiz || "", // ✅ CORRIGIDO: era "retono_juiz"
              resposta_deepseek: responseData.resposta_deepseek || "",
              resposta_gpt: responseData.resposta_gpt || "",
              resposta_claude: responseData.resposta_claude || ""
            }
          });
        } else {
          // If webhook fails, still proceed with battle
          onStartBattle(battleData);
        }
      } catch (error) {
        console.error("Error sending to webhook:", error);
        // If webhook fails, still proceed with battle
        onStartBattle(battleData);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const totalCost = selectedModels.reduce((sum, modelId) => {
    const model = models.find(m => m.id === modelId);
    return sum + parseFloat(model?.cost.replace('$', '') || '0');
  }, 0);

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-battle border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Zap className="w-6 h-6 text-primary" />
          Novo Desafio na Arena
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Prompt Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Seu prompt:</label>
          <Textarea
            placeholder="Digite seu prompt aqui... Ex: Crie uma função Python para calcular fibonacci"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px] resize-none bg-muted/50 border-primary/20 focus:border-primary"
          />
          <div className="text-xs text-muted-foreground">
            {prompt.length}/1000 caracteres
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Categoria:</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "arena"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="justify-start gap-2 h-12"
                >
                  <IconComponent className="w-4 h-4" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Model Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Modelos para competir:</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {models.map((model) => (
              <div
                key={model.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/40 transition-colors cursor-pointer"
                onClick={() => handleModelToggle(model.id)}
              >
                <Checkbox
                  checked={selectedModels.includes(model.id)}
                  onChange={() => handleModelToggle(model.id)}
                />
                <div className={`w-3 h-3 rounded-full ${model.color}`} />
                <span className="font-medium flex-1">{model.name}</span>
                <Badge variant="outline" className="text-xs">
                  {model.cost}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Battle Summary */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Modelos selecionados:</span>
            <Badge variant="outline">{selectedModels.length}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Custo total estimado:</span>
            <Badge className="bg-accent text-accent-foreground">
              ${totalCost.toFixed(3)}
            </Badge>
          </div>
        </div>

        {/* Start Battle Button */}
        <Button
          variant="battle"
          size="lg"
          onClick={handleStartBattle}
          disabled={!prompt.trim() || selectedModels.length < 2 || isLoading}
          className="w-full text-lg h-14"
        >
          <Zap className="w-5 h-5" />
          {isLoading ? "Processando..." : "Iniciar Batalha"}
          {selectedModels.length >= 2 && !isLoading && (
            <Badge className="ml-2 bg-primary-foreground text-primary">
              {selectedModels.length} vs {selectedModels.length}
            </Badge>
          )}
        </Button>
        
        {selectedModels.length < 2 && (
          <p className="text-sm text-muted-foreground text-center">
            Selecione pelo menos 2 modelos para iniciar a batalha
          </p>
        )}
      </CardContent>
    </Card>
  );
}