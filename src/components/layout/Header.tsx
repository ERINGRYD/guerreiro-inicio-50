
import { Sword, Shield, Sparkles, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navLinkClass = (path: string) => 
    `flex items-center space-x-2 transition-colors duration-300 ${
      isActive(path) 
        ? 'text-primary font-medium' 
        : 'text-foreground hover:text-primary'
    }`;

  return (
    <header className="relative z-10 border-b border-white/10 backdrop-blur-md bg-card/30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-primary p-3 rounded-full">
                <Sword className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Guerreiro Interno
              </h1>
              <p className="text-xs text-muted-foreground">O Jogo da Vida</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/jogo" className={navLinkClass('/jogo')}>
              <Shield className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link to="/perfil" className={navLinkClass('/perfil')}>
              <User className="w-4 h-4" />
              <span>Perfil</span>
            </Link>
            <Link to="/agenda" className={navLinkClass('/agenda')}>
              <Sparkles className="w-4 h-4" />
              <span>Agenda</span>
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            <Link to="/jogo">
              <button className="btn-hero">
                Começar Jornada
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
