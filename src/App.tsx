import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { Navigation } from './components/Navigation';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PageLoader } from './components/Loaders';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Characters = lazy(() => import('./pages/Characters'));
const SessionNotes = lazy(() => import('./pages/SessionNotes'));
const Calendar = lazy(() => import('./pages/Calendar'));
const InvestigationPage = lazy(() => import('./pages/InvestigationPage'));
const Profile = lazy(() => import('./pages/Profile'));
const Notes = lazy(() => import('./pages/Notes'));

// React Query client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Wrapper para páginas que precisam de container centralizado
function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
      {children}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-background text-foreground relative">
            {/* Background texture global */}
            <div className="fixed inset-0 bg-[url('/texture.png')] opacity-5 pointer-events-none z-0" />
            
            <Navigation />
            
            <main className="relative z-10">
              <ErrorBoundary>
                <Suspense fallback={<PageLoader message="Loading page..." />}>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/masks-coc/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    
                    {/* Protected routes - require authentication */}
                    <Route path="/characters" element={
                      <ProtectedRoute>
                        <PageLayout><Characters /></PageLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/sessions" element={
                      <ProtectedRoute>
                        <PageLayout><SessionNotes /></PageLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/calendar" element={
                      <ProtectedRoute>
                        <PageLayout><Calendar /></PageLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/investigation" element={
                      <ProtectedRoute>
                        <PageLayout><InvestigationPage /></PageLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <PageLayout><Profile /></PageLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/notes" element={
                      <ProtectedRoute>
                        <PageLayout><Notes /></PageLayout>
                      </ProtectedRoute>
                    } />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </main>
          </div>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
=======
import Header from './components/Header';
import Home from './pages/Home';
import Characters from './pages/Characters';
import SessionNotes from './pages/SessionNotes';
import Calendar from './pages/Calendar';
import InvestigationPage from './pages/InvestigationPage';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-background">
        {/* Background com textura e imagem de fundo */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black via-background to-black">
          <div 
            className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80')] bg-fixed bg-cover bg-center bg-blend-overlay"
          />
          <div className="absolute inset-0 bg-texture" />
          {/* Vinheta nas bordas */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/80" />
        </div>

        <Header />
        
        <main className="container mx-auto px-4 py-8 relative z-10">
          <Routes>
            <Route path="/masks-coc/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/characters" element={<Characters />} />
            <Route path="/sessions" element={<SessionNotes />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/investigation" element={<InvestigationPage />} />
          </Routes>
        </main>

        {/* Efeito de névoa sutil no rodapé */}
        <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none -z-5" />
      </div>
    </Router>
>>>>>>> 32e2be8d11ca913036da63f2d56aad9d9caca78a
  );
}

export default App;