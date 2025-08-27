import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'super_admin' | 'admin' | 'secretary' | 'security' | 'developer' | 'resident' | 'guest';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  society?: string;
  building?: string;
  floor?: string;
  flat?: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'inactive';
  lastLogin?: Date;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@innovativelabs.com',
    name: 'John Anderson',
    role: 'super_admin',
    status: 'active',
    phone: '+1-234-567-8901',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '2',
    email: 'secretary@innovativelabs.com',
    name: 'Sarah Johnson',
    role: 'secretary',
    society: 'Sunset Gardens',
    building: 'Tower A',
    status: 'active',
    phone: '+1-234-567-8902'
  },
  {
    id: '3',
    email: 'security@innovativelabs.com',
    name: 'Mike Wilson',
    role: 'security',
    society: 'Sunset Gardens',
    building: 'Tower A',
    status: 'active',
    phone: '+1-234-567-8903'
  },
  {
    id: '4',
    email: 'dev@innovativelabs.com',
    name: 'Alex Chen',
    role: 'developer',
    status: 'active',
    phone: '+1-234-567-8904'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored auth data on app load
    const storedUser = localStorage.getItem('bms_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in real app, this would be an API call
    const foundUser = MOCK_USERS.find(u => u.email === email);
    
    if (foundUser && password === 'password123') {
      const userWithLogin = { ...foundUser, lastLogin: new Date() };
      setUser(userWithLogin);
      localStorage.setItem('bms_user', JSON.stringify(userWithLogin));
      toast({
        title: "Login Successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
      setIsLoading(false);
      return true;
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Try: admin@innovativelabs.com / password123",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bms_user');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};