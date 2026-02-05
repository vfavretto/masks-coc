import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Users, BookOpen, Calendar, Search, LogIn, LogOut, Skull, Crown, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isKeeper, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', path: '/masks-coc/', icon: Home, public: true },
    { name: 'Characters', path: '/characters', icon: Users, public: false },
    { name: 'Sessions', path: '/sessions', icon: BookOpen, public: false },
    { name: 'Calendar', path: '/calendar', icon: Calendar, public: false },
    { name: 'Investigation', path: '/investigation', icon: Search, public: false },
    { name: 'Notes', path: '/notes', icon: FileText, public: false },
    { name: 'Profile', path: '/profile', icon: User, public: false },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/masks-coc/');
  };

  const handleLogin = () => {
    setIsOpen(false);
    navigate('/login');
  };

  // Filter navigation items based on auth status
  const visibleNavigation = navigation.filter(item => item.public || isAuthenticated);

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 flex justify-between items-center ${
        scrolled ? 'bg-black/90 backdrop-blur-md border-b border-primary/20 shadow-lg' : 'bg-transparent'
      }`}>
        <div className="flex items-center space-x-3 group z-50">
          <Link to="/masks-coc/" className="flex items-center gap-2">
            <Skull className={`h-8 w-8 transition-colors duration-300 ${scrolled ? 'text-primary' : 'text-primary drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]'}`} />
            <span className={`text-2xl font-[MedievalSharp] transition-colors duration-300 ${scrolled ? 'text-primary' : 'text-primary drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]'}`}>
              Nyarlathotep
            </span>
          </Link>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          className={`z-50 hover:bg-primary/20 hover:text-primary transition-all duration-300 ${
            scrolled ? 'text-primary' : 'text-primary drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]'
          }`}
        >
          <Menu className="h-8 w-8" />
        </Button>
      </div>

      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div className={`fixed top-0 right-0 h-full w-80 bg-[#0c0c0c] border-l-2 border-primary/30 z-[60] transform transition-transform duration-500 ease-in-out shadow-[0_0_50px_rgba(201,165,92,0.1)] flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex justify-between items-center p-6 border-b border-primary/20">
          <span className="text-xl font-[MedievalSharp] text-primary">Navigation</span>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-primary">
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* User Info (if logged in) */}
        {isAuthenticated && user && (
          <div className="p-4 mx-4 mt-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                {isKeeper ? <Crown className="w-5 h-5 text-primary" /> : <User className="w-5 h-5 text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-[MedievalSharp] text-foreground truncate">{user.username}</p>
                <Badge variant={isKeeper ? 'default' : 'secondary'} className="text-[10px] uppercase mt-1">
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {visibleNavigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-all duration-300 border border-transparent group ${
                location.pathname === item.path
                  ? 'bg-primary/10 border-primary/40 text-primary'
                  : 'hover:bg-primary/5 hover:border-primary/20 text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className={`h-5 w-5 transition-colors ${
                location.pathname === item.path ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
              }`} />
              <span className="font-serif text-lg tracking-wide">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-primary/20">
          {isAuthenticated ? (
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 font-[MedievalSharp] text-lg border-red-800/50 text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          ) : (
            <Button 
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-2 font-[MedievalSharp] text-lg hover:shadow-[0_0_15px_rgba(201,165,92,0.4)] transition-all duration-300"
            >
              <LogIn className="w-4 h-4" />
              Investigator Login
            </Button>
          )}
          <p className="text-center text-muted-foreground text-xs mt-4 font-serif italic opacity-60">
            "Ph'nglui mglw'nafh Cthulhu R'lyeh wgah'nagl fhtagn"
          </p>
        </div>
      </div>
    </>
  );
}
