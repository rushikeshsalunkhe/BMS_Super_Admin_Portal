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
  UserCheck, 
  Search, 
  Plus, 
  Filter, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  QrCode,
  Car,
  Phone,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Visitor {
  id: string;
  name: string;
  phone: string;
  email?: string;
  purpose: string;
  hostName: string;
  hostFlat: string;
  building: string;
  checkInTime?: Date;
  checkOutTime?: Date;
  status: 'pending' | 'approved' | 'checked_in' | 'checked_out' | 'rejected';
  vehicleNumber?: string;
  photo?: string;
  qrCode?: string;
  verificationId?: string;
}

// Mock visitor data
const MOCK_VISITORS: Visitor[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    phone: '+1-234-567-8901',
    email: 'alex.johnson@email.com',
    purpose: 'Business Meeting',
    hostName: 'John Doe',
    hostFlat: '502',
    building: 'Tower A',
    status: 'checked_in',
    checkInTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    vehicleNumber: 'MH12AB1234',
    qrCode: 'QR123456789',
  },
  {
    id: '2',
    name: 'Maria Garcia',
    phone: '+1-234-567-8902',
    purpose: 'Family Visit',
    hostName: 'Jane Smith',
    hostFlat: '304',
    building: 'Tower A',
    status: 'pending',
    qrCode: 'QR123456790',
  },
  {
    id: '3',
    name: 'David Wilson',
    phone: '+1-234-567-8903',
    email: 'david.wilson@delivery.com',
    purpose: 'Delivery',
    hostName: 'Bob Brown',
    hostFlat: '203',
    building: 'Tower B',
    status: 'approved',
    vehicleNumber: 'MH12CD5678',
    qrCode: 'QR123456791',
  },
  {
    id: '4',
    name: 'Sarah Lee',
    phone: '+1-234-567-8904',
    purpose: 'Maintenance',
    hostName: 'Mike Wilson',
    hostFlat: 'Security Office',
    building: 'Tower A',
    status: 'checked_out',
    checkInTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    checkOutTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    qrCode: 'QR123456792',
  },
  {
    id: '5',
    name: 'Tom Anderson',
    phone: '+1-234-567-8905',
    purpose: 'Personal Visit',
    hostName: 'Jane Smith',
    hostFlat: '304',
    building: 'Tower A',
    status: 'rejected',
    qrCode: 'QR123456793',
  }
];

const getStatusBadgeVariant = (status: Visitor['status']) => {
  switch (status) {
    case 'pending':
      return 'secondary';
    case 'approved':
      return 'default';
    case 'checked_in':
      return 'default';
    case 'checked_out':
      return 'outline';
    case 'rejected':
      return 'destructive';
    default:
      return 'outline';
  }
};

const getStatusIcon = (status: Visitor['status']) => {
  switch (status) {
    case 'pending':
      return Clock;
    case 'approved':
      return CheckCircle;
    case 'checked_in':
      return UserCheck;
    case 'checked_out':
      return CheckCircle;
    case 'rejected':
      return XCircle;
    default:
      return AlertCircle;
  }
};

const VisitorManagement = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Visitor['status'] | 'all'>('all');

  if (!user) return null;

  // Filter visitors based on current user's permissions
  const getFilteredVisitors = () => {
    let filteredVisitors = MOCK_VISITORS;

    // Role-based filtering
    if (user.role === 'secretary' || user.role === 'security') {
      // Secretary and Security can only see visitors in their society/building
      filteredVisitors = filteredVisitors.filter(v => {
        if (user.society && user.building) {
          return v.building === user.building;
        }
        return true;
      });
    }

    // Search filtering
    if (searchTerm) {
      filteredVisitors = filteredVisitors.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.phone.includes(searchTerm) ||
        v.hostName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.purpose.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filtering
    if (selectedStatus !== 'all') {
      filteredVisitors = filteredVisitors.filter(v => v.status === selectedStatus);
    }

    return filteredVisitors;
  };

  const filteredVisitors = getFilteredVisitors();

  const getPageTitle = () => {
    switch (user.role) {
      case 'security':
        return 'Visitor Security';
      default:
        return 'Visitor Management';
    }
  };

  const getPageDescription = () => {
    switch (user.role) {
      case 'security':
        return 'Monitor and manage visitor entry/exit';
      case 'secretary':
        return `Approve and manage visitors for ${user.society}`;
      default:
        return 'Manage visitor access and tracking';
    }
  };

  const canApproveVisitors = ['super_admin', 'admin', 'secretary', 'security'].includes(user.role);
  const canAddVisitors = ['super_admin', 'admin', 'secretary'].includes(user.role);

  const getStatsCards = () => {
    const pendingCount = filteredVisitors.filter(v => v.status === 'pending').length;
    const checkedInCount = filteredVisitors.filter(v => v.status === 'checked_in').length;
    const todayVisitors = filteredVisitors.filter(v => {
      const today = new Date();
      const checkIn = v.checkInTime;
      return checkIn && checkIn.toDateString() === today.toDateString();
    }).length;
    const totalVisitors = filteredVisitors.length;

    return [
      {
        title: 'Pending Approval',
        value: pendingCount,
        description: 'Awaiting review',
        icon: Clock,
        color: 'text-warning'
      },
      {
        title: 'Currently Inside',
        value: checkedInCount,
        description: 'Active visitors',
        icon: UserCheck,
        color: 'text-success'
      },
      {
        title: 'Today\'s Visitors',
        value: todayVisitors,
        description: 'Total for today',
        icon: Calendar,
        color: 'text-primary'
      },
      {
        title: 'Total Visitors',
        value: totalVisitors,
        description: 'All time',
        icon: UserCheck,
        color: 'text-muted-foreground'
      }
    ];
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{getPageTitle()}</h1>
          <p className="text-muted-foreground">{getPageDescription()}</p>
        </div>
        {canAddVisitors && (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Visitor
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {getStatsCards().map((stat, index) => (
          <Card key={index} className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Visitors Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Visitors</CardTitle>
          <CardDescription>
            Monitor and manage visitor access to the building
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search visitors by name, phone, or host..."
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

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visitor</TableHead>
                  <TableHead>Host & Purpose</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVisitors.map((visitor) => {
                  const StatusIcon = getStatusIcon(visitor.status);
                  return (
                    <TableRow key={visitor.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={visitor.photo} alt={visitor.name} />
                            <AvatarFallback>
                              {visitor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{visitor.name}</p>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{visitor.phone}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{visitor.hostName}</p>
                          <p className="text-sm text-muted-foreground">
                            {visitor.building} - {visitor.hostFlat}
                          </p>
                          <p className="text-sm text-primary">{visitor.purpose}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StatusIcon className="h-4 w-4" />
                          <Badge variant={getStatusBadgeVariant(visitor.status)}>
                            {visitor.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {visitor.checkInTime && (
                            <div>
                              <p className="font-medium">In: {formatTime(visitor.checkInTime)}</p>
                              <p className="text-muted-foreground">{formatDate(visitor.checkInTime)}</p>
                            </div>
                          )}
                          {visitor.checkOutTime && (
                            <div className="mt-1">
                              <p className="font-medium">Out: {formatTime(visitor.checkOutTime)}</p>
                              <p className="text-muted-foreground">{formatDate(visitor.checkOutTime)}</p>
                            </div>
                          )}
                          {!visitor.checkInTime && visitor.status === 'pending' && (
                            <p className="text-muted-foreground">Not checked in</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {visitor.vehicleNumber && (
                          <div className="flex items-center gap-1">
                            <Car className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{visitor.vehicleNumber}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {visitor.qrCode && (
                            <Button variant="ghost" size="sm">
                              <QrCode className="h-4 w-4" />
                            </Button>
                          )}
                          {canApproveVisitors && visitor.status === 'pending' && (
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm" className="text-success">
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-destructive">
                                <XCircle className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                          {user.role === 'security' && visitor.status === 'approved' && (
                            <Button variant="outline" size="sm" className="text-primary">
                              Check In
                            </Button>
                          )}
                          {user.role === 'security' && visitor.status === 'checked_in' && (
                            <Button variant="outline" size="sm" className="text-warning">
                              Check Out
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredVisitors.length === 0 && (
            <div className="text-center py-8">
              <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No visitors found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VisitorManagement;