
import React, { useState } from 'react';
import Layout from "@/components/layout/Layout";
import { useHero } from "@/contexts/HeroContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { XP_SYSTEM } from "@/types/hero";
import { 
  Trophy, 
  Target, 
  Zap, 
  Calendar, 
  Edit3, 
  Settings, 
  Award,
  User,
  BarChart3
} from "lucide-react";

// Import components
import EditProfileForm from "@/components/profile/EditProfileForm";
import AdvancedStats from "@/components/profile/AdvancedStats";
import AchievementsSection from "@/components/profile/AchievementsSection";
import AttributeSystem from "@/components/profile/AttributeSystem";
import ProfileSettings from "@/components/profile/ProfileSettings";
import AreaNavigationCard from "@/components/profile/AreaNavigationCard";

const Profile = () => {
  const { profile, stats, profileLoading, statsLoading, areas } = useHero();
  const [isEditing, setIsEditing] = useState(false);

  if (profileLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-xl text-muted-foreground">Carregando perfil...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-xl text-muted-foreground">Perfil não encontrado</p>
          </div>
        </div>
      </Layout>
    );
  }

  const xpProgress = XP_SYSTEM.calculateXpProgress(profile.totalXp);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="text-8xl mb-4">{profile.avatar}</div>
            {!isEditing && (
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 rounded-full"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          <h1 className="hero-title mb-2">
            {profile.heroName || 'Guerreiro Sem Nome'}
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            {profile.heroClass || 'Classe não definida'}
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Nível {profile.level}
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {profile.totalXp.toLocaleString()} XP Total
            </Badge>
          </div>
          
          {/* Level Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>{xpProgress.current} XP</span>
              <span>{xpProgress.needed} XP</span>
            </div>
            <Progress value={xpProgress.percentage} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {XP_SYSTEM.calculateXpForNextLevel(profile.totalXp)} XP para o próximo nível
            </p>
          </div>
        </div>

        {/* Edit Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <EditProfileForm profile={profile} onClose={() => setIsEditing(false)} />
          </div>
        )}

        {/* Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="attributes" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Atributos
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Estatísticas
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Conquistas
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {/* Quick Stats */}
            {!statsLoading && stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tarefas</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.completedTasks}</div>
                    <p className="text-xs text-muted-foreground">
                      de {stats.totalTasks} tarefas
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Hábitos</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeHabits}</div>
                    <p className="text-xs text-muted-foreground">
                      hábitos ativos
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Jornadas</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.completedJourneys}</div>
                    <p className="text-xs text-muted-foreground">
                      de {stats.totalJourneys} jornadas
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sequência</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.currentStreak}</div>
                    <p className="text-xs text-muted-foreground">
                      dias consecutivos
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Area Navigation Cards */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Explore suas Áreas</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.keys(areas).map((key) => (
                  <AreaNavigationCard key={key} area={key as keyof typeof areas} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="attributes" className="mt-6">
            <AttributeSystem />
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <AdvancedStats />
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            <AchievementsSection />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <ProfileSettings />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
