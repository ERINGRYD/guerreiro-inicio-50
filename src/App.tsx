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
import Auth from "./pages/Auth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

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
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
              <Route path="/jogo" element={<ProtectedRoute><Game /></ProtectedRoute>} />
              <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/agenda" element={<ProtectedRoute><DailyAgenda /></ProtectedRoute>} />
              <Route path="/area/:area" element={<ProtectedRoute><AreaExploration /></ProtectedRoute>} />
              <Route path="/criar-jornada" element={<ProtectedRoute><CreateJourney /></ProtectedRoute>} />
              <Route path="/jornada/:journeyId" element={<ProtectedRoute><JourneyManagement /></ProtectedRoute>} />
              <Route path="/hero-jornada/:journeyId" element={<ProtectedRoute><HeroJourneyManagement /></ProtectedRoute>} />
              <Route path="/recompensas" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
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
