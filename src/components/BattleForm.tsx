import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Play, Code, PenTool, BarChart3, Sparkles, Globe, Brain, Clock, DollarSign } from "lucide-react";

const categories = [
  { id: "code", label: "Code", icon: Code, color: "bg-blue-500" },
  { id: "writing", label: "Writing", icon: PenTool, color: "bg-purple-500" },
  { id: "analysis", label: "Analysis", icon: BarChart3, color: "bg-green-500" },
  { id: "creative", label: "Creative", icon: Sparkles, color: "bg-pink-500" },
  { id: "translation", label: "Translation", icon: Globe, color: "bg-orange-500" },
  { id: "other", label: "Other", icon: Brain, color: "bg-gray-500" },
];

const models = [
  { id: "gpt4", name: "GPT-4", color: "bg-emerald-500", cost: 0.03 },
  { id: "claude", name: "Claude", color: "bg-orange-500", cost: 0.02 },
  { id: "gemini", name: "Gemini", color: "bg-blue-500", cost: 0.01 },
  { id: "llama", name: "Llama", color: "bg-purple-500", cost: 0.005 },
  { id: "mistral", name: "Mistral", color: "bg-red-500", cost: 0.004 },
  { id: "cohere", name: "Cohere", color: "bg-yellow-500", cost: 0.006 },
];

interface BattleFormProps {
  onStartBattle: (data: {
    prompt: string;
    category: string;
    selectedModels: string[];
    responses?: {
      retorno_juiz: string;
      resposta_a: string;
      resposta_b: string;
      resposta_c: string;
    };
  }) => void;
}

export default function BattleForm({ onStartBattle }: BattleFormProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("code");
  const [selectedModels, setSelectedModels] = useState(["gpt4", "claude", "gemini"]);
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

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
      setDebugInfo(null);
      
      const battleData = {
        prompt: prompt.trim(),
        category: selectedCategory,
        selectedModels,
      };

      // Send to webhook
      try {
        console.log("🚀 Enviando para webhook:", {
          url: "https://kaua1nagel.app.n8n.cloud/webhook/teste",
          payload: {
            ...battleData,
            timestamp: new Date().toISOString(),
            totalCost: totalCost.toFixed(3),
          }
        });

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

        console.log("📡 Status da resposta:", response.status, response.statusText);

        if (response.ok) {
          const responseText = await response.text();
          console.log("📥 Resposta RAW do webhook:", responseText);
          
          try {
            const responseData = JSON.parse(responseText);
            console.log("🔍 Dados parseados do webhook:", responseData);
            console.log("🔍 Tipo de dados:", typeof responseData);
            console.log("🔍 É array?", Array.isArray(responseData));
            
            // ✅ PROCESSAR FORMATO ARRAY
            let processedData;
            if (Array.isArray(responseData) && responseData.length > 0) {
              processedData = responseData[0];
              console.log("✅ Processando primeiro item do array:", processedData);
            } else {
              processedData = responseData;
              console.log("✅ Processando objeto direto:", processedData);
            }
            
            console.log("🔍 Keys disponíveis:", Object.keys(processedData));
            console.log("🔍 Campos específicos:", {
              retorno_juiz: processedData.retorno_juiz,
              resposta_a: processedData.resposta_a,
              resposta_b: processedData.resposta_b,
              resposta_c: processedData.resposta_c
            });

            setDebugInfo(`✅ Connection successful!\n\nFormat: ${Array.isArray(responseData) ? 'Array' : 'Object'}\nFields: ${Object.keys(processedData).join(', ')}`);
            
            onStartBattle({
              ...battleData,
              responses: {
                retorno_juiz: processedData.retorno_juiz || "",
                resposta_a: processedData.resposta_a || "",
                resposta_b: processedData.resposta_b || "",
                resposta_c: processedData.resposta_c || ""
              }
            });
          } catch (parseError) {
            console.error("❌ Erro ao fazer parse da resposta:", parseError);
            setDebugInfo(`Parse error: ${parseError}`);
            onStartBattle(battleData);
          }
        } else {
          console.error("❌ Webhook retornou erro:", response.status, response.statusText);
          const errorText = await response.text();
          setDebugInfo(`HTTP ${response.status}: ${errorText}`);
          onStartBattle(battleData);
        }
      } catch (error) {
        console.error("❌ Erro na requisição do webhook:", error);
        setDebugInfo(`Network error: ${error}`);
        onStartBattle(battleData);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const totalCost = selectedModels.reduce((sum, modelId) => {
    const model = models.find(m => m.id === modelId);
    return sum + (model?.cost || 0);
  }, 0);

  return (
    <div className="space-apple-lg">
      {/* Header */}
      <div className="text-center space-apple-md">
        <h1 className="text-apple-title">New Comparison</h1>
        <p className="text-apple-body max-w-2xl mx-auto">
          Compare responses from different AI models and vote for the best one
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="card-apple">
          <CardContent className="p-8 space-apple-lg">
            {/* Debug Info */}
            {debugInfo && (
              <div className={`rounded-xl p-4 text-sm ${
                debugInfo.includes('✅ Connection successful') 
                  ? 'status-success' 
                  : 'status-warning'
              }`}>
                <div className="font-medium mb-2">Connection Status</div>
                <pre className="text-xs opacity-75">{debugInfo}</pre>
              </div>
            )}

            {/* Prompt Input */}
            <div className="space-apple-sm">
              <label className="block text-sm font-medium text-foreground mb-3">
                Your prompt
              </label>
              <Textarea
                placeholder="Enter your prompt here... e.g., Write a Python function to calculate fibonacci numbers"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="input-apple min-h-[120px] resize-none"
              />
              <div className="text-apple-caption mt-2">
                {prompt.length}/1000 characters
              </div>
            </div>

            {/* Categories */}
            <div className="space-apple-sm">
              <label className="block text-sm font-medium text-foreground mb-3">
                Category
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`btn-apple p-4 justify-start gap-3 transition-all ${
                        selectedCategory === category.id 
                          ? 'btn-apple-primary' 
                          : 'btn-apple-secondary'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${category.color} bg-opacity-10`}>
                        <IconComponent className={`w-4 h-4 ${category.color.replace('bg-', 'text-')}`} />
                      </div>
                      <span className="font-medium">{category.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Model Selection */}
            <div className="space-apple-sm">
              <label className="block text-sm font-medium text-foreground mb-3">
                Select models to compare
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {models.map((model) => (
                  <div
                    key={model.id}
                    onClick={() => handleModelToggle(model.id)}
                    className={`card-apple p-4 cursor-pointer transition-all ${
                      selectedModels.includes(model.id)
                        ? 'ring-2 ring-primary bg-primary/5'
                        : 'hover:bg-secondary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox checked={selectedModels.includes(model.id)} />
                      <div className={`w-3 h-3 rounded-full ${model.color}`} />
                      <span className="font-medium flex-1">{model.name}</span>
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <DollarSign className="w-3 h-3" />
                        <span>{model.cost.toFixed(3)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="card-apple p-4 bg-secondary/30">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Models selected:</span>
                  <Badge variant="outline">{selectedModels.length}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Est. cost:</span>
                  <span className="font-mono">${totalCost.toFixed(3)}</span>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartBattle}
              disabled={!prompt.trim() || selectedModels.length < 2 || isLoading}
              className="btn-apple-primary w-full h-14 text-base font-medium gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-5 h-5" />
              {isLoading ? "Starting comparison..." : "Start Comparison"}
            </button>
            
            {selectedModels.length < 2 && (
              <p className="text-apple-caption text-center">
                Select at least 2 models to start the comparison
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}