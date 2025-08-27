import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Building2, Lock, Mail, User } from 'lucide-react';
import { useAuth, UserRole } from '@/contexts/AuthContext';

const roleIcons: Record<UserRole, React.ComponentType<any>> = {
  super_admin: Building2,
  admin: Building2,
  secretary: User,
  security: Lock,
  developer: Building2,
  resident: User,
  guest: User,
};

const roleLabels: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  secretary: 'Secretary',
  security: 'Security',
  developer: 'Developer',
  resident: 'Resident',
  guest: 'Guest',
};

const roleDescriptions: Record<UserRole, string> = {
  super_admin: 'Full system access and management',
  admin: 'Administrative access to all buildings',
  secretary: 'Society and resident management',
  security: 'Visitor and security management',
  developer: 'System monitoring and maintenance',
  resident: 'Personal account and services',
  guest: 'Limited visitor access',
};

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  const quickLogin = async (role: UserRole) => {
    const roleEmails = {
      super_admin: 'admin@innovativelabs.com',
      admin: 'admin@innovativelabs.com',
      secretary: 'secretary@innovativelabs.com',
      security: 'security@innovativelabs.com',
      developer: 'dev@innovativelabs.com',
      resident: 'resident@innovativelabs.com',
      guest: 'guest@innovativelabs.com',
    };
    
    setEmail(roleEmails[role]);
    setPassword('password123');
    await login(roleEmails[role], 'password123');
  };

  const RoleIcon = roleIcons[selectedRole];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-hero">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-12 w-12 text-white mr-3" />
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white">Innovative Labs</h1>
              <p className="text-white/80 text-sm">Building Management System</p>
            </div>
          </div>
        </div>

        <Card className="shadow-elevated">
          <CardHeader className="space-y-3">
            <div className="flex items-center space-x-2">
              <RoleIcon className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Sign In</CardTitle>
            </div>
            <CardDescription>
              Access your BMS dashboard with role-based authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Demo Login</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {['admin', 'secretary', 'security', 'developer'].map((role) => (
                  <Button
                    key={role}
                    variant="outline"
                    size="sm"
                    onClick={() => quickLogin(role as UserRole)}
                    disabled={isLoading}
                    className="text-xs"
                  >
                    {roleLabels[role as UserRole]}
                  </Button>
                ))}
              </div>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              Demo credentials: Any listed role email / password123
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;