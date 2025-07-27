import { Brain, Sparkles } from "lucide-react";

export default function ArenaHeader() {
  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Apple-style blur background */}
      <div className="glass-apple border-b border-border/50">
        <div className="container-apple">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                  <Brain className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-foreground">
                  LLM Arena
                </h1>
                <p className="text-xs text-muted-foreground">
                  Compare AI models
                </p>
              </div>
            </div>

            {/* Right side - minimal */}
            <div className="flex items-center gap-4">
              {/* Status indicator */}
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-muted-foreground">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}