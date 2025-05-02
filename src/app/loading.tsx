import { Loader2, Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gradient-to-br from-background via-secondary/80 to-background backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-6 text-center p-8 bg-card/80 rounded-lg shadow-2xl max-w-sm">
        <div className="relative">
           <Loader2 className="h-20 w-20 animate-spin text-primary opacity-50" />
           <Sparkles className="absolute inset-0 m-auto h-12 w-12 text-accent animate-pulse" />
        </div>
        <p className="text-2xl font-semibold text-primary animate-pulse">
          Charting the Cosmos...
        </p>
        <p className="text-md text-muted-foreground">
           Aligning planets and calculating trajectories. Please wait a moment.
        </p>
      </div>
    </div>
  );
}
