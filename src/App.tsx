import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
  );
}

export default App;