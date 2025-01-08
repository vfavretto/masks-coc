import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Characters from './pages/Characters';
import SessionNotes from './pages/SessionNotes';
import Calendar from './pages/Calendar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0908] bg-opacity-95 bg-[url('https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80')] bg-fixed bg-cover bg-center bg-blend-overlay">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/masks-coc/" element={<Home />} />
            <Route path="/characters" element={<Characters />} />
            <Route path="/sessions" element={<SessionNotes />} />
            <Route path="/calendar" element={<Calendar />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;