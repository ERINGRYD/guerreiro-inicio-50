import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OfflineIndicator } from "@/components/ui/offline-indicator";
import { InstallPWA } from "@/components/ui/install-pwa";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "@/contexts/GameContext";
import { HeroProvider } from "@/contexts/HeroContext";
import Index from "./pages/Index";
import Game from "./pages/Game";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import AreaExploration from "./pages/AreaExploration";
import { CreateJourney } from "./pages/CreateJourney";
import JourneyManagement from "./pages/JourneyManagement";
import HeroJourneyManagement from "./pages/HeroJourneyManagement";
import DailyAgenda from "./pages/DailyAgenda";
import Rewards from "./pages/Rewards";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GameProvider>
      <HeroProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <OfflineIndicator />
          <InstallPWA />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/jogo" element={<Game />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/agenda" element={<DailyAgenda />} />
              <Route path="/area/:area" element={<AreaExploration />} />
              <Route path="/criar-jornada" element={<CreateJourney />} />
              <Route path="/jornada/:journeyId" element={<JourneyManagement />} />
              <Route path="/hero-jornada/:journeyId" element={<HeroJourneyManagement />} />
              <Route path="/recompensas" element={<Rewards />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </HeroProvider>
    </GameProvider>
  </QueryClientProvider>
);

export default App;
