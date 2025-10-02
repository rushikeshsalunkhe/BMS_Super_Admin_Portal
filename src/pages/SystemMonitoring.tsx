import React, { useState, useEffect } from 'react';
import { Activity, AlertCircle, CheckCircle, Clock, Database, Server, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiService, SystemStatus } from '@/services/api';
import DashboardCard from '@/components/dashboard/DashboardCard';

const SystemMonitoring = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [errorLogs, setErrorLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [statusData, logsData] = await Promise.all([
        apiService.getSystemStatus(),
        apiService.getErrorLogs(10)
      ]);
      setStatus(statusData);
      setErrorLogs(logsData);
    } catch (error) {
      console.error('Failed to load monitoring data', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'degraded': return 'text-yellow-500';
      case 'down': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return <Badge className="bg-green-500">Healthy</Badge>;
      case 'degraded': return <Badge className="bg-yellow-500">Degraded</Badge>;
      case 'down': return <Badge className="bg-red-500">Down</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">System Monitoring</h1>
        <p className="text-muted-foreground mt-1">Real-time system health and performance metrics</p>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="System Uptime"
          value={`${status?.uptime}%`}
          icon={Clock}
          trend={{
            value: status?.uptime || 0,
            isPositive: status?.uptime ? status.uptime > 99 : true
          }}
        />
        
        <DashboardCard
          title="Active Users"
          value={status?.activeUsers.toString() || '0'}
          icon={Users}
          trend={{
            value: 12,
            isPositive: true
          }}
        />
        
        <DashboardCard
          title="Active Sessions"
          value={status?.activeSessions.toString() || '0'}
          icon={Activity}
          trend={{
            value: 8,
            isPositive: true
          }}
        />
        
        <DashboardCard
          title="Error Count"
          value={status?.errorCount.toString() || '0'}
          icon={AlertCircle}
          trend={{
            value: status?.errorCount || 0,
            isPositive: false
          }}
        />
      </div>

      {/* Service Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Status
            </CardTitle>
            <CardDescription>MongoDB connection health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${status?.dbStatus === 'healthy' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-lg font-medium">
                  {status?.dbStatus === 'healthy' ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              {getStatusBadge(status?.dbStatus || 'unknown')}
            </div>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Response Time:</span>
                <span className="font-medium">12ms</span>
              </div>
              <div className="flex justify-between">
                <span>Active Connections:</span>
                <span className="font-medium">24/100</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              API Status
            </CardTitle>
            <CardDescription>Backend service health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${status?.apiStatus === 'healthy' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-lg font-medium">
                  {status?.apiStatus === 'healthy' ? 'Operational' : 'Down'}
                </span>
              </div>
              {getStatusBadge(status?.apiStatus || 'unknown')}
            </div>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Avg Response Time:</span>
                <span className="font-medium">45ms</span>
              </div>
              <div className="flex justify-between">
                <span>Requests/min:</span>
                <span className="font-medium">1,234</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Errors & Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Recent Errors & Logs
          </CardTitle>
          <CardDescription>Latest system errors and warnings</CardDescription>
        </CardHeader>
        <CardContent>
          {status?.lastError && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">Latest Error</p>
                  <p className="text-sm text-muted-foreground">{status.lastError}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {errorLogs.map((log) => (
              <div key={log.id} className="flex items-start justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-start gap-3">
                  {log.level === 'error' ? (
                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">{log.message}</p>
                    <p className="text-sm text-muted-foreground">
                      {log.service} • {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                {log.resolved ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Badge variant="destructive">Active</Badge>
                )}
              </div>
            ))}
          </div>

          {errorLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
              <p>No recent errors. System running smoothly!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMonitoring;
