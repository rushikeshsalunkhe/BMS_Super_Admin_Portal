import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Building2, 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  CreditCard, 
  MessageSquare, 
  MapPin, 
  Settings, 
  HelpCircle,
  LogOut,
  Shield,
  Code,
  UserCog
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<any>;
  roles: UserRole[];
  badge?: string;
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    roles: ['super_admin', 'admin', 'secretary', 'security', 'developer']
  },
  {
    title: 'User Management',
    href: '/users',
    icon: Users,
    roles: ['super_admin', 'admin', 'secretary']
  },
  {
    title: 'Visitor Management',
    href: '/visitors',
    icon: UserCheck,
    roles: ['super_admin', 'admin', 'secretary', 'security']
  },
  {
    title: 'Payments',
    href: '/payments',
    icon: CreditCard,
    roles: ['super_admin', 'admin', 'secretary']
  },
  {
    title: 'Communication',
    href: '/communication',
    icon: MessageSquare,
    roles: ['super_admin', 'admin', 'secretary']
  },
  {
    title: 'Building Maps',
    href: '/maps',
    icon: MapPin,
    roles: ['super_admin', 'admin', 'secretary', 'security']
  },
  {
    title: 'System Monitoring',
    href: '/monitoring',
    icon: Code,
    roles: ['super_admin', 'developer']
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['super_admin', 'admin', 'secretary', 'security', 'developer']
  },
  {
    title: 'Support',
    href: '/support',
    icon: HelpCircle,
    roles: ['super_admin', 'admin', 'secretary', 'security', 'developer']
  }
];

const roleIcons: Record<UserRole, React.ComponentType<any>> = {
  super_admin: Shield,
  admin: UserCog,
  secretary: Users,
  security: Shield,
  developer: Code,
  resident: Users,
  guest: Users,
};

const roleColors: Record<UserRole, string> = {
  super_admin: 'text-destructive',
  admin: 'text-primary',
  secretary: 'text-accent',
  security: 'text-warning',
  developer: 'text-success',
  resident: 'text-muted-foreground',
  guest: 'text-muted-foreground',
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const allowedMenuItems = menuItems.filter(item => 
    item.roles.includes(user.role)
  );

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const RoleIcon = roleIcons[user.role];

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <Building2 className="h-8 w-8 text-sidebar-primary" />
          <div>
            <h2 className="text-lg font-semibold text-sidebar-foreground">BMS Portal</h2>
            <p className="text-xs text-sidebar-foreground/70">Innovative Labs</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user.name}
            </p>
            <div className="flex items-center space-x-1">
              <RoleIcon className={`h-3 w-3 ${roleColors[user.role]}`} />
              <p className="text-xs text-sidebar-foreground/70 capitalize">
                {user.role.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
        
        {user.society && (
          <div className="mt-2 text-xs text-sidebar-foreground/60">
            <p>{user.society}</p>
            {user.building && <p>{user.building} - {user.floor}/{user.flat}</p>}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {allowedMenuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={`
                flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${active 
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                }
              `}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
              {item.badge && (
                <span className="ml-auto text-xs bg-sidebar-primary text-sidebar-primary-foreground px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;