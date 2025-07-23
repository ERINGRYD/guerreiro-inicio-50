import { ReactNode } from "react";
import Header from "./Header";
import ParticleBackground from "./ParticleBackground";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-mystic"></div>
      
      {/* Particle System */}
      <ParticleBackground />
      
      {/* Main Content */}
      <div className="relative z-10">
        <Header />
        <main className="relative">
          {children}
        </main>
      </div>

      {/* Bottom Glow Effect */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-t from-primary/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
};

export default Layout;