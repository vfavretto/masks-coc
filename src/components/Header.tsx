import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Skull, Menu, Home, Users, BookOpen, Calendar, Search, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', path: '/masks-coc/', icon: Home },
    { name: 'Personagens', path: '/characters', icon: Users },
    { name: 'Anotações', path: '/sessions', icon: BookOpen },
    { name: 'Calendário', path: '/calendar', icon: Calendar },
    { name: 'Investigação', path: '/investigation', icon: Search },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link to="/masks-coc/" className="flex items-center space-x-3 group mr-6">
          <Skull className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-300" />
          <span className="text-xl font-heading text-primary group-hover:text-primary/80 transition-colors duration-300 hidden sm:inline-block">
            Máscaras de Nyarlathotep
          </span>
          <span className="text-xl font-heading text-primary group-hover:text-primary/80 transition-colors duration-300 sm:hidden">
            Nyarlathotep
          </span>
        </Link>

        <Separator orientation="vertical" className="mr-6 h-6 hidden lg:block" />

        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 flex-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
            >
              <Button
                variant={location.pathname === item.path ? 'default' : 'ghost'}
                className={cn(
                  'flex items-center space-x-2 transition-all duration-300',
                  location.pathname === item.path 
                    ? 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden lg:inline">{item.name}</span>
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2 md:flex-none">
          <Link to="/login" className="hidden md:block">
            <Button
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
            >
              <LogIn className="h-4 w-4 mr-2" />
              <span>Login</span>
            </Button>
          </Link>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-primary hover:text-primary/80"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px] bg-card">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2 text-primary">
                  <Skull className="h-6 w-6" />
                  <span className="font-heading">Menu</span>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col space-y-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      variant={location.pathname === item.path ? 'default' : 'ghost'}
                      className={cn(
                        'w-full justify-start space-x-2',
                        location.pathname === item.path
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                ))}

                <Separator className="my-2" />
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full justify-start space-x-2 border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;