import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal,
  Mail,
  Phone,
  Building,
  UserCheck,
  UserX
} from 'lucide-react';
import { useAuth, User, UserRole } from '@/contexts/AuthContext';

// Mock user data
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'john.doe@email.com',
    name: 'John Doe',
    role: 'resident',
    society: 'Sunset Gardens',
    building: 'Tower A',
    floor: '5',
    flat: '502',
    phone: '+1-234-567-8901',
    status: 'active',
  },
  {
    id: '2',
    email: 'jane.smith@email.com',
    name: 'Jane Smith',
    role: 'resident',
    society: 'Sunset Gardens',
    building: 'Tower A',
    floor: '3',
    flat: '304',
    phone: '+1-234-567-8902',
    status: 'active',
  },
  {
    id: '3',
    email: 'mike.wilson@security.com',
    name: 'Mike Wilson',
    role: 'security',
    society: 'Sunset Gardens',
    building: 'Tower A',
    phone: '+1-234-567-8903',
    status: 'active',
  },
  {
    id: '4',
    email: 'sarah.johnson@admin.com',
    name: 'Sarah Johnson',
    role: 'secretary',
    society: 'Sunset Gardens',
    building: 'Tower A',
    phone: '+1-234-567-8904',
    status: 'active',
  },
  {
    id: '5',
    email: 'bob.brown@email.com',
    name: 'Bob Brown',
    role: 'resident',
    society: 'Sunset Gardens',
    building: 'Tower B',
    floor: '2',
    flat: '203',
    phone: '+1-234-567-8905',
    status: 'inactive',
  }
];

const getRoleBadgeVariant = (role: UserRole) => {
  switch (role) {
    case 'super_admin':
      return 'destructive';
    case 'admin':
      return 'default';
    case 'secretary':
      return 'secondary';
    case 'security':
      return 'outline';
    case 'developer':
      return 'secondary';
    case 'resident':
      return 'outline';
    case 'guest':
      return 'secondary';
    default:
      return 'outline';
  }
};

const getStatusBadgeVariant = (status: string) => {
  return status === 'active' ? 'default' : 'secondary';
};

const UserManagement = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');

  if (!user) return null;

  // Filter users based on current user's permissions
  const getFilteredUsers = () => {
    let filteredUsers = MOCK_USERS;

    // Role-based filtering
    if (user.role === 'secretary') {
      // Secretary can only see residents in their society
      filteredUsers = filteredUsers.filter(u => 
        u.society === user.society && u.role === 'resident'
      );
    } else if (user.role === 'security') {
      // Security can see residents and visitors in their building
      filteredUsers = filteredUsers.filter(u => 
        u.society === user.society && u.building === user.building
      );
    }

    // Search filtering
    if (searchTerm) {
      filteredUsers = filteredUsers.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone?.includes(searchTerm)
      );
    }

    // Role filtering
    if (selectedRole !== 'all') {
      filteredUsers = filteredUsers.filter(u => u.role === selectedRole);
    }

    return filteredUsers;
  };

  const filteredUsers = getFilteredUsers();

  const getPageTitle = () => {
    switch (user.role) {
      case 'super_admin':
      case 'admin':
        return 'User Management';
      case 'secretary':
        return 'Resident Management';
      case 'security':
        return 'Building Residents';
      default:
        return 'Users';
    }
  };

  const getPageDescription = () => {
    switch (user.role) {
      case 'super_admin':
        return 'Manage all users across the system';
      case 'admin':
        return 'Manage users in your assigned properties';
      case 'secretary':
        return `Manage residents in ${user.society}`;
      case 'security':
        return `View residents in ${user.building || 'your building'}`;
      default:
        return 'User information';
    }
  };

  const canAddUsers = ['super_admin', 'admin', 'secretary'].includes(user.role);
  const canEditUsers = ['super_admin', 'admin', 'secretary'].includes(user.role);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{getPageTitle()}</h1>
          <p className="text-muted-foreground">{getPageDescription()}</p>
        </div>
        {canAddUsers && (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredUsers.filter(u => u.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((filteredUsers.filter(u => u.status === 'active').length / filteredUsers.length) * 100)}% active rate
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Residents</CardTitle>
            <Building className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredUsers.filter(u => u.role === 'resident').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all buildings
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
            <UserX className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredUsers.filter(u => u.status === 'inactive').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage and view user information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((userData) => (
                  <TableRow key={userData.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={userData.avatar} alt={userData.name} />
                          <AvatarFallback>
                            {userData.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{userData.name}</p>
                          <p className="text-sm text-muted-foreground">{userData.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(userData.role)}>
                        {userData.role.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[150px]">{userData.email}</span>
                        </div>
                        {userData.phone && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{userData.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {userData.society && <p className="font-medium">{userData.society}</p>}
                        {userData.building && (
                          <p className="text-muted-foreground">
                            {userData.building}
                            {userData.floor && userData.flat && ` - ${userData.floor}/${userData.flat}`}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(userData.status)}>
                        {userData.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {canEditUsers && (
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No users found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;