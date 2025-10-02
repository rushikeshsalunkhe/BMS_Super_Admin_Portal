import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import MainLayout from "@/components/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import UserManagement from "@/pages/UserManagement";
import BuildingManagement from "@/pages/BuildingManagement";
import VisitorManagement from "@/pages/VisitorManagement";
import SystemMonitoring from "@/pages/SystemMonitoring";
import Settings from "@/pages/Settings";
import ComingSoon from "@/pages/ComingSoon";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading BMS Portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/buildings" element={<BuildingManagement />} />
        <Route path="/visitors" element={<VisitorManagement />} />
        <Route path="/payments" element={<ComingSoon title="Payments" />} />
        <Route path="/communication" element={<ComingSoon title="Communication" />} />
        <Route path="/maps" element={<ComingSoon title="Building Maps" />} />
        <Route path="/monitoring" element={<SystemMonitoring />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/support" element={<ComingSoon title="Support" />} />
      </Routes>
    </MainLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
