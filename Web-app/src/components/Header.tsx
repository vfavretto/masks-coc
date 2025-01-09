import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Skull, Menu, X,  Home, Users, BookOpen, Calendar} from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', path: '/masks-coc/', icon: Home },
    { name: 'Characters', path: '/characters', icon: Users },
    { name: 'Session Notes', path: '/sessions', icon: BookOpen },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Investigation Board', path: '/investigation', icon: Menu },
  ];

  return (
    <header className="bg-black/90 backdrop-blur-md border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <Skull className="h-8 w-8 text-primary group-hover:text-primary/80 transition-colors duration-300" />
            <span className="text-2xl font-[MedievalSharp] text-primary group-hover:text-primary/80 transition-colors duration-300">
              Nyarlathotep
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-2 font-serif text-lg space-x-2 transition-all duration-300
                  ${location.pathname === item.path 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-gray-400 hover:text-primary hover:border-b-2 hover:border-primary/50'}`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-primary" />
            ) : (
              <Menu className="h-6 w-6 text-primary" />
            )}
          </button>
        </div>

        {isOpen && (
          <nav className="md:hidden py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block py-2 font-serif text-lg
                  ${location.pathname === item.path 
                    ? 'text-primary' 
                    : 'text-gray-400 hover:text-primary'}`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;