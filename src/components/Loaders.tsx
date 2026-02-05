import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="text-muted-foreground font-serif animate-pulse">{message}</p>
    </div>
  );
}

export function InlineLoader() {
  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className="w-6 h-6 text-primary animate-spin" />
    </div>
  );
}

export function CardLoader() {
  return (
    <div className="bg-card/50 border border-border rounded-lg p-6 animate-pulse">
      <div className="h-6 bg-primary/10 rounded w-3/4 mb-4" />
      <div className="space-y-2">
        <div className="h-4 bg-primary/5 rounded w-full" />
        <div className="h-4 bg-primary/5 rounded w-5/6" />
        <div className="h-4 bg-primary/5 rounded w-4/6" />
      </div>
    </div>
  );
}
