import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <Card className="max-w-lg w-full bg-black/60 border-red-900/50">
            <CardHeader className="text-center">
              <div className="mx-auto p-4 bg-red-900/20 rounded-full w-fit mb-4">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
              <CardTitle className="text-2xl font-[MedievalSharp] text-red-400">
                Something Went Wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground font-serif">
                An unexpected error has occurred. The Old Ones are restless.
              </p>
              {this.state.error && (
                <pre className="text-xs text-red-400/70 bg-black/40 p-3 rounded-lg overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              )}
              <Button 
                onClick={this.handleReset}
                variant="outline"
                className="gap-2 border-primary/30 hover:border-primary"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
