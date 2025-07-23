
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { User, Calendar, Award, Settings } from 'lucide-react';

const QuickNavigation: React.FC = () => {
  const navigationItems = [
    {
      icon: <User className="w-4 h-4" />,
      label: 'Perfil do Herói',
      path: '/perfil',
      variant: 'outline' as const
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: 'Agenda do Herói',
      path: '/agenda',
      variant: 'outline' as const
    },
    {
      icon: <Award className="w-4 h-4" />,
      label: 'Recompensas',
      path: '/recompensas',
      variant: 'outline' as const
    },
    {
      icon: <Settings className="w-4 h-4" />,
      label: 'Configurações',
      path: '/configuracoes',
      variant: 'ghost' as const
    }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {navigationItems.map((item, index) => (
        <Link key={index} to={item.path}>
          <Button variant={item.variant} size="sm" className="space-x-2">
            {item.icon}
            <span className="hidden sm:inline">{item.label}</span>
          </Button>
        </Link>
      ))}
    </div>
  );
};

export default QuickNavigation;
