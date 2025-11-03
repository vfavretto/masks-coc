import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Skull, Moon, Lock, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulação de login
    setTimeout(() => {
      setIsLoading(false);
      // Aqui você adicionaria a lógica real de autenticação
      console.log("Login:", { username, password });
      navigate("/masks-coc/");
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative">
      {/* Efeitos de fundo animados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <Card className="w-full max-w-md relative z-10 bg-card/80 backdrop-blur-xl border-border/50 shadow-2xl shadow-primary/10">
        <CardHeader className="space-y-4 text-center pb-8">
          {/* Ícone animado */}
          <div className="relative mx-auto">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <div className="relative bg-background p-4 rounded-full border-2 border-primary/30 shadow-lg shadow-primary/20">
              <Skull className="w-12 h-12 text-primary animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <CardTitle className="text-3xl font-heading text-primary animate-flicker">
              Portal dos Investigadores
            </CardTitle>
            <CardDescription className="text-muted-foreground font-serif">
              "Os segredos aguardam aqueles que ousam conhecer..."
            </CardDescription>
          </div>

          {/* Decoração */}
          <div className="flex items-center justify-center gap-3 opacity-30">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary" />
            <Moon className="w-4 h-4 text-primary animate-pulse" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary" />
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground font-serif flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Nome de Usuário
              </Label>
              <div className="relative group">
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu nome de investigador"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 pl-4 group-hover:border-primary/30"
                  required
                />
                <div className="absolute inset-0 -z-10 bg-primary/5 rounded-md blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            {/* Campo Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-serif flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Senha
              </Label>
              <div className="relative group">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha secreta"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 pr-12 pl-4 group-hover:border-primary/30"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                <div className="absolute inset-0 -z-10 bg-primary/5 rounded-md blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            {/* Botão de Login */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-lg h-12 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 relative overflow-hidden group"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Acessando...</span>
                </div>
              ) : (
                <>
                  <span className="relative z-10">Entrar no Portal</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </>
              )}
            </Button>

            {/* Link de volta */}
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => navigate("/masks-coc/")}
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 font-serif"
              >
                Voltar para a página inicial
              </button>
            </div>
          </form>
        </CardContent>

        {/* Decoração inferior */}
        <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm" />
      </Card>

      {/* Citação flutuante */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center max-w-2xl px-4">
        <p className="text-xs text-muted-foreground/50 font-serif italic">
          "The oldest and strongest emotion of mankind is fear, and the oldest and strongest kind of fear is fear of the unknown."
          <br />
          <span className="text-primary/70">— H.P. Lovecraft</span>
        </p>
      </div>
    </div>
  );
};

export default Login;

