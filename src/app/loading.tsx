import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col flex-grow items-center justify-center min-h-screen bg-background">
      <div className="flex items-center space-x-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="text-xl text-muted-foreground">Loading the cosmos...</p>
      </div>
    </div>
  );
}
