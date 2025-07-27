import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArenaHeader from "@/components/ArenaHeader";
import BattleForm from "@/components/BattleForm";
import BattleVoting from "@/components/BattleVoting";
import RankingsSection from "@/components/RankingsSection";
import PersonalDashboard from "@/components/PersonalDashboard";
import { Play, Trophy, User, Info } from "lucide-react";

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
    modelName: "Model A",
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
    modelName: "Model B",
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
    modelName: "Model C",
    position: "C"
  }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("compare");
  const [battleState, setBattleState] = useState<"form" | "voting" | "completed">("form");
  const [currentBattle, setCurrentBattle] = useState<any>(null);
  const [selectedRankingCategory, setSelectedRankingCategory] = useState("code");

  const parseWebhookResponses = (webhookResponses: any) => {
    if (!webhookResponses) {
      console.log("⚠️ No webhook responses to process");
      return [];
    }
    
    console.log("🔍 Processing webhook responses in Index:", webhookResponses);
    
    const responses = [];
    
    // Process A, B, C responses
    if (webhookResponses.resposta_a) {
      const cleanContent = webhookResponses.resposta_a
        .replace(/<think>[\s\S]*?<\/think>/g, '')
        .trim();
        
      if (cleanContent) {
        responses.push({
          id: "response-a",
          content: cleanContent,
          responseTime: 2.1,
          cost: 0.015,
          modelName: "Model A",
          position: "A"
        });
      }
    }
    
    if (webhookResponses.resposta_b) {
      const cleanContent = webhookResponses.resposta_b
        .replace(/<think>[\s\S]*?<\/think>/g, '')
        .trim();
        
      if (cleanContent) {
        responses.push({
          id: "response-b",
          content: cleanContent,
          responseTime: 2.3,
          cost: 0.02,
          modelName: "Model B",
          position: "B"
        });
      }
    }
    
    if (webhookResponses.resposta_c) {
      const cleanContent = webhookResponses.resposta_c
        .replace(/<think>[\s\S]*?<\/think>/g, '')
        .trim();
        
      if (cleanContent) {
        responses.push({
          id: "response-c",
          content: cleanContent,
          responseTime: 1.8,
          cost: 0.018,
          modelName: "Model C",
          position: "C"
        });
      }
    }
    
    console.log("✅ Responses processed in Index:", {
      total: responses.length,
      positions: responses.map(r => r.position)
    });
    
    return responses;
  };

  const handleStartBattle = (battleData: any) => {
    console.log("🚀 Starting comparison with data:", battleData);
    
    let responses = [];
    
    if (battleData.responses) {
      responses = parseWebhookResponses(battleData.responses);
      console.log("✅ Using real webhook data:", responses);
      
      if (responses.length === 0) {
        console.log("⚠️ No valid responses processed, using fallback mock");
        responses = mockResponses.slice(0, 3);
      }
    } else {
      responses = mockResponses.slice(0, 3);
      console.log("⚠️ Using mock data (webhook failed):", responses);
    }
    
    setCurrentBattle({
      ...battleData,
      responses
    });
    setBattleState("voting");
  };

  const handleVote = (responseId: string) => {
    console.log("🗳️ Vote registered for:", responseId);
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
      
      <div className="container-minimal py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Dark purple navigation */}
          <div className="flex justify-center mb-8">
            <TabsList className="nav-minimal">
              <TabsTrigger 
                value="compare" 
                className="nav-minimal-item"
                data-selected={activeTab === "compare"}
              >
                <Play className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Compare</span>
              </TabsTrigger>
              <TabsTrigger 
                value="rankings"
                className="nav-minimal-item"
                data-selected={activeTab === "rankings"}
              >
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Rankings</span>
              </TabsTrigger>
              <TabsTrigger 
                value="dashboard"
                className="nav-minimal-item"
                data-selected={activeTab === "dashboard"}
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="about"
                className="nav-minimal-item"
                data-selected={activeTab === "about"}
              >
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">About</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="compare" className="animate-minimal-fade-in">
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
            
            {battleState === "completed" && (
              <div className="text-center mt-8">
                <button
                  onClick={handleNewBattle}
                  className="btn-minimal-primary gap-2 shadow-lg shadow-primary/25"
                >
                  <Play className="w-4 h-4" />
                  New Comparison
                </button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="rankings" className="animate-minimal-fade-in">
            <RankingsSection 
              selectedCategory={selectedRankingCategory}
              onCategoryChange={setSelectedRankingCategory}
            />
          </TabsContent>

          <TabsContent value="dashboard" className="animate-minimal-fade-in">
            <PersonalDashboard />
          </TabsContent>

          <TabsContent value="about" className="animate-minimal-fade-in">
            <div className="max-w-4xl mx-auto space-minimal-lg">
              {/* Hero Section */}
              <div className="text-center space-minimal-md">
                <h1 className="text-5xl font-bold tracking-tight text-gradient-purple mb-4">
                  LLM Arena
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Compare AI models through blind testing and community voting
                </p>
              </div>
              
              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card-minimal p-8 space-minimal-sm border border-border/30">
                  <h3 className="text-minimal-subtitle text-primary">The Problem</h3>
                  <p className="text-minimal-body">
                    Professionals spend hours manually testing different AI models 
                    to find which generates the best response. There's no systematic 
                    way to compare outputs or understand which model works best for each task.
                  </p>
                </div>
                
                <div className="card-minimal p-8 space-minimal-sm border border-border/30">
                  <h3 className="text-minimal-subtitle text-emerald-400">The Solution</h3>
                  <p className="text-minimal-body">
                    Arena where multiple LLMs compete by generating responses to the same prompt, 
                    with blind voting determining the winner and building rankings by category. 
                    Eliminates brand bias and reveals real performance.
                  </p>
                </div>
                
                <div className="card-minimal p-8 space-minimal-sm border border-border/30">
                  <h3 className="text-minimal-subtitle text-blue-400">Key Features</h3>
                  <ul className="space-y-2 text-minimal-body">
                    <li>• Fair comparison without brand bias</li>
                    <li>• Real preference data by task type</li>
                    <li>• Cost and performance insights</li>
                    <li>• Dynamic community rankings</li>
                  </ul>
                </div>
                
                <div className="card-minimal p-8 space-minimal-sm border border-border/30">
                  <h3 className="text-minimal-subtitle text-orange-400">Impact</h3>
                  <ul className="space-y-2 text-minimal-body">
                    <li>• Cost savings with appropriate model selection</li>
                    <li>• Data-driven decisions</li>
                    <li>• Reduced testing time</li>
                    <li>• Better AI results</li>
                  </ul>
                </div>
              </div>
              
              {/* CTA */}
              <div className="text-center">
                <button 
                  onClick={() => setActiveTab("compare")}
                  className="btn-minimal-primary px-8 py-4 text-lg gap-3 shadow-lg shadow-primary/25"
                >
                  <Play className="w-5 h-5" />
                  Start Comparing
                </button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;