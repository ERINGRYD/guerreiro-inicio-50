import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useRewardSystem } from '@/hooks/useRewardSystem';
import { 
  Trophy,
  Gift,
  Star,
  Filter,
  Clock,
  Target,
  Sparkles,
  Package,
  Zap,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { ACHIEVEMENT_CATEGORIES, RARITY_COLORS, REWARD_TYPE_LABELS, RARITY_LABELS } from '@/types/reward';
import type { AchievementCategory, Achievement, Reward } from '@/types/reward';

const Rewards: React.FC = () => {
  const { 
    achievements, 
    inventory, 
    getRecentAchievements, 
    getAchievementsByCategory,
    applyTheme,
    applyAvatar,
    activateBooster
  } = useRewardSystem();

  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const [activeTab, setActiveTab] = useState('achievements');

  const recentAchievements = getRecentAchievements();
  const filteredAchievements = getAchievementsByCategory(selectedCategory as AchievementCategory);
  const unlockedAchievements = filteredAchievements.filter(a => a.isUnlocked);
  const lockedAchievements = filteredAchievements.filter(a => !a.isUnlocked);

  const renderAchievement = (achievement: Achievement, isUnlocked: boolean) => {
    const rarityStyle = RARITY_COLORS[achievement.rarity];
    
    return (
      <Card key={achievement.id} className={`transition-all hover:shadow-md ${isUnlocked ? 'opacity-100' : 'opacity-60'}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${isUnlocked ? rarityStyle : 'bg-muted text-muted-foreground'}`}>
              {achievement.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold">{achievement.name}</h4>
                <Badge variant={isUnlocked ? "default" : "secondary"} className={isUnlocked ? rarityStyle : ''}>
                  {RARITY_LABELS[achievement.rarity]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
              
              {achievement.progress !== undefined && achievement.target && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{achievement.progress.toLocaleString()}</span>
                    <span>{achievement.target.toLocaleString()}</span>
                  </div>
                  <Progress 
                    value={(achievement.progress / achievement.target) * 100} 
                    className="h-2"
                  />
                </div>
              )}
              
              {achievement.xpBonus && (
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-yellow-600">+{achievement.xpBonus} XP</span>
                </div>
              )}
            </div>
            {isUnlocked && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Trophy className="w-3 h-3 mr-1" />
                Desbloqueada
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderReward = (reward: Reward) => {
    const rarityStyle = RARITY_COLORS[reward.rarity];
    
    return (
      <Card key={reward.id} className="transition-all hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${rarityStyle}`}>
              <span className="text-xl">{reward.icon}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold">{reward.name}</h4>
                <div className="flex gap-2">
                  <Badge variant="outline">{REWARD_TYPE_LABELS[reward.type]}</Badge>
                  <Badge className={rarityStyle}>{RARITY_LABELS[reward.rarity]}</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{reward.description}</p>
              
              {reward.sourceAchievement && (
                <p className="text-xs text-muted-foreground">
                  Conquistado por: {achievements.find(a => a.id === reward.sourceAchievement)?.name}
                </p>
              )}
              
              {reward.sourceJourney && (
                <p className="text-xs text-muted-foreground">
                  Jornada: {reward.sourceJourney}
                </p>
              )}
              
              {reward.unlockedAt && (
                <p className="text-xs text-muted-foreground">
                  Desbloqueado em: {new Date(reward.unlockedAt).toLocaleDateString()}
                </p>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              {reward.type === 'resource' && reward.data?.colors && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => applyTheme(reward.id)}
                  className="text-xs"
                >
                  Aplicar Tema
                </Button>
              )}
              
              {reward.type === 'resource' && reward.data?.avatar && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => applyAvatar(reward.id)}
                  className="text-xs"
                >
                  Usar Avatar
                </Button>
              )}
              
              {reward.type === 'weapon' && reward.data?.xpMultiplier && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => activateBooster(reward.id, reward.data?.duration || 24)}
                  className="text-xs"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Ativar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold">Sistema de Recompensas</h1>
          </div>
          <p className="text-muted-foreground">
            Desbloqueie conquistas, ganhe recompensas e aprimore sua experiência
          </p>
        </div>

        {/* Recent Achievements Banner */}
        {recentAchievements.length > 0 && (
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <Sparkles className="w-5 h-5" />
                Conquistas Recentes (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {recentAchievements.slice(0, 3).map((reward) => {
                  const achievement = achievements.find(a => a.id === reward.sourceAchievement);
                  return achievement ? (
                    <Badge key={reward.id} variant="secondary" className="bg-yellow-100 text-yellow-800">
                      <Trophy className="w-3 h-3 mr-1" />
                      {achievement.name}
                    </Badge>
                  ) : null;
                })}
                {recentAchievements.length > 3 && (
                  <Badge variant="outline">+{recentAchievements.length - 3} mais</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">{unlockedAchievements.length}</div>
              <div className="text-sm text-muted-foreground">Conquistas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Gift className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">{inventory.rewards.length}</div>
              <div className="text-sm text-muted-foreground">Recompensas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{lockedAchievements.length}</div>
              <div className="text-sm text-muted-foreground">A Desbloquear</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">
                {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Progresso</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Conquistas
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Inventário
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Progresso
            </TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-6">
            {/* Category Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtrar por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {ACHIEVEMENT_CATEGORIES.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id as AchievementCategory | 'all')}
                      className="flex items-center gap-1"
                    >
                      <span>{category.icon}</span>
                      {category.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Unlocked Achievements */}
            {unlockedAchievements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Conquistas Desbloqueadas
                    <Badge variant="outline">{unlockedAchievements.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {unlockedAchievements.map(achievement => renderAchievement(achievement, true))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Locked Achievements */}
            {lockedAchievements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Próximas Conquistas
                    <Badge variant="outline">{lockedAchievements.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lockedAchievements.slice(0, 6).map(achievement => renderAchievement(achievement, false))}
                  </div>
                  {lockedAchievements.length > 6 && (
                    <div className="text-center mt-4">
                      <Button variant="outline">
                        Ver Todas ({lockedAchievements.length - 6} restantes)
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Seu Inventário
                  <Badge variant="outline">{inventory.rewards.length} itens</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {inventory.rewards.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {inventory.rewards.map(renderReward)}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Seu inventário está vazio.</p>
                    <p className="text-sm">Desbloqueie conquistas para ganhar recompensas!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Items */}
            {(inventory.activeTheme || inventory.activeAvatar || inventory.activeBooster) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Itens Ativos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {inventory.activeTheme && (
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-primary rounded-full"></div>
                        <span className="font-medium">Tema Ativo</span>
                      </div>
                      <Button variant="outline" size="sm">Trocar</Button>
                    </div>
                  )}
                  
                  {inventory.activeAvatar && (
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">⚔️</span>
                        <span className="font-medium">Avatar Ativo</span>
                      </div>
                      <Button variant="outline" size="sm">Trocar</Button>
                    </div>
                  )}
                  
                  {inventory.activeBooster && (
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <div>
                          <span className="font-medium">XP Booster Ativo</span>
                          <p className="text-xs text-muted-foreground">
                            Expira em: {new Date(inventory.activeBooster.expiresAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Ativo
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Progresso por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ACHIEVEMENT_CATEGORIES.slice(1).map((category) => {
                  const categoryAchievements = getAchievementsByCategory(category.id as AchievementCategory);
                  const unlockedCount = categoryAchievements.filter(a => a.isUnlocked).length;
                  const progressPercentage = categoryAchievements.length > 0 
                    ? (unlockedCount / categoryAchievements.length) * 100 
                    : 0;

                  return (
                    <div key={category.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {unlockedCount}/{categoryAchievements.length}
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Progress Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Conquistas Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentAchievements.length > 0 ? (
                  <div className="space-y-4">
                    {recentAchievements.slice(0, 5).map((reward) => {
                      const achievement = achievements.find(a => a.id === reward.sourceAchievement);
                      return achievement && reward.unlockedAt ? (
                        <div key={reward.id} className="flex items-center gap-3 p-3 rounded-lg border">
                          <div className="text-2xl">🏆</div>
                          <div className="flex-1">
                            <h4 className="font-medium">{achievement.name}</h4>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(reward.unlockedAt).toLocaleDateString()}
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma conquista recente.</p>
                    <p className="text-sm">Continue progredindo para desbloquear conquistas!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Rewards;