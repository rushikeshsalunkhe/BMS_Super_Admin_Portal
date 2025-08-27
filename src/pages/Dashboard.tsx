import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  UserCheck, 
  DollarSign, 
  MessageSquare, 
  AlertCircle,
  TrendingUp,
  Building,
  Shield,
  Activity,
  Calendar
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  const getSuperAdminStats = () => [
    {
      title: 'Total Residents',
      value: '1,247',
      description: 'Across all properties',
      icon: Users,
      trend: { value: 8.2, isPositive: true }
    },
    {
      title: 'Active Visitors',
      value: '23',
      description: 'Currently in buildings',
      icon: UserCheck,
      trend: { value: -2.1, isPositive: false }
    },
    {
      title: 'Monthly Revenue',
      value: '$45,230',
      description: 'Maintenance & fees',
      icon: DollarSign,
      trend: { value: 12.5, isPositive: true }
    },
    {
      title: 'Support Tickets',
      value: '12',
      description: '3 open issues',
      icon: MessageSquare,
      trend: { value: -15.3, isPositive: true }
    }
  ];

  const getAdminStats = () => [
    {
      title: 'Building Residents',
      value: '342',
      description: 'Tower A residents',
      icon: Users,
      trend: { value: 5.1, isPositive: true }
    },
    {
      title: 'Today\'s Visitors',
      value: '18',
      description: 'Checked in today',
      icon: UserCheck,
      trend: { value: 3.2, isPositive: true }
    },
    {
      title: 'Pending Payments',
      value: '$8,420',
      description: 'Outstanding dues',
      icon: DollarSign,
      trend: { value: -8.7, isPositive: true }
    },
    {
      title: 'Announcements',
      value: '5',
      description: 'Active notices',
      icon: MessageSquare,
      trend: { value: 0, isPositive: true }
    }
  ];

  const getSecretaryStats = () => [
    {
      title: 'Society Members',
      value: '156',
      description: 'Sunset Gardens',
      icon: Users,
      trend: { value: 2.3, isPositive: true }
    },
    {
      title: 'Visitor Requests',
      value: '7',
      description: 'Pending approval',
      icon: UserCheck,
      trend: { value: 12.1, isPositive: false }
    },
    {
      title: 'Maintenance Dues',
      value: '$3,240',
      description: 'This month collected',
      icon: DollarSign,
      trend: { value: 18.2, isPositive: true }
    },
    {
      title: 'Events',
      value: '3',
      description: 'Upcoming this month',
      icon: Calendar,
      trend: { value: 50, isPositive: true }
    }
  ];

  const getSecurityStats = () => [
    {
      title: 'Visitor Queue',
      value: '4',
      description: 'Waiting for entry',
      icon: UserCheck,
      trend: { value: -12.5, isPositive: true }
    },
    {
      title: 'Today\'s Entries',
      value: '45',
      description: 'Total check-ins',
      icon: Shield,
      trend: { value: 8.3, isPositive: true }
    },
    {
      title: 'Active Alerts',
      value: '1',
      description: 'Security notifications',
      icon: AlertCircle,
      trend: { value: -66.7, isPositive: true }
    },
    {
      title: 'Patrol Status',
      value: 'Normal',
      description: 'All systems operational',
      icon: Activity,
      trend: { value: 0, isPositive: true }
    }
  ];

  const getDeveloperStats = () => [
    {
      title: 'System Uptime',
      value: '99.8%',
      description: 'Last 30 days',
      icon: Activity,
      trend: { value: 0.2, isPositive: true }
    },
    {
      title: 'API Calls',
      value: '2.4M',
      description: 'This month',
      icon: TrendingUp,
      trend: { value: 15.7, isPositive: true }
    },
    {
      title: 'Error Rate',
      value: '0.02%',
      description: 'Below threshold',
      icon: AlertCircle,
      trend: { value: -12.3, isPositive: true }
    },
    {
      title: 'Active Users',
      value: '1,203',
      description: 'Monthly active',
      icon: Users,
      trend: { value: 7.8, isPositive: true }
    }
  ];

  const getStatsForRole = () => {
    switch (user.role) {
      case 'super_admin':
        return getSuperAdminStats();
      case 'admin':
        return getAdminStats();
      case 'secretary':
        return getSecretaryStats();
      case 'security':
        return getSecurityStats();
      case 'developer':
        return getDeveloperStats();
      default:
        return [];
    }
  };

  const getRoleTitle = () => {
    switch (user.role) {
      case 'super_admin':
        return 'Super Admin Dashboard';
      case 'admin':
        return 'Admin Dashboard';
      case 'secretary':
        return 'Secretary Dashboard';
      case 'security':
        return 'Security Dashboard';
      case 'developer':
        return 'Developer Dashboard';
      default:
        return 'Dashboard';
    }
  };

  const stats = getStatsForRole();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{getRoleTitle()}</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}. Here's what's happening today.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          {user.society && (
            <p className="text-sm font-medium text-primary">{user.society}</p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <DashboardCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Latest system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New visitor registered</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Payment reminder sent</p>
                  <p className="text-xs text-muted-foreground">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">System backup completed</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              <span>Alerts</span>
            </CardTitle>
            <CardDescription>Important notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user.role === 'security' && (
                <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                  <p className="text-sm font-medium text-warning">Security Alert</p>
                  <p className="text-xs text-muted-foreground">Visitor waiting at Gate B</p>
                </div>
              )}
              {user.role === 'secretary' && (
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium text-primary">Payment Due</p>
                  <p className="text-xs text-muted-foreground">5 residents have pending dues</p>
                </div>
              )}
              <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                <p className="text-sm font-medium text-success">System Status</p>
                <p className="text-xs text-muted-foreground">All services operational</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-accent" />
              <span>Upcoming</span>
            </CardTitle>
            <CardDescription>Schedule and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="text-center min-w-0">
                  <p className="text-xs text-muted-foreground">Today</p>
                  <p className="text-sm font-medium">15</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Society Meeting</p>
                  <p className="text-xs text-muted-foreground">7:00 PM - Community Hall</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-center min-w-0">
                  <p className="text-xs text-muted-foreground">Tomorrow</p>
                  <p className="text-sm font-medium">16</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Maintenance Work</p>
                  <p className="text-xs text-muted-foreground">9:00 AM - Water Tank</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;