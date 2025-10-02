// API Service Layer - Mock implementation ready for real backend integration
// Base URL would come from environment variable in production
const API_BASE_URL = 'http://localhost:8080/api/v1';

// Types matching backend API
export interface Society {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  contactEmail?: string;
  contactPhone?: string;
  buildings?: Building[];
}

export interface Building {
  id: string;
  name: string;
  societyId: string;
  wings: Wing[];
  totalFloors: number;
  totalFlats: number;
}

export interface Wing {
  id: string;
  name: string;
  buildingId: string;
  floors: number;
  flatsPerFloor: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  societyCode: string;
  buildingId?: string;
  wingId?: string;
  flatNumber?: string;
  status: 'active' | 'inactive';
  avatar?: string;
  createdAt?: Date;
}

export interface SystemStatus {
  uptime: number;
  activeUsers: number;
  activeSessions: number;
  errorCount: number;
  lastError?: string;
  dbStatus: 'healthy' | 'degraded' | 'down';
  apiStatus: 'healthy' | 'degraded' | 'down';
}

// Mock data
const MOCK_SOCIETIES: Society[] = [
  {
    id: '1',
    name: 'Green Valley Apartments',
    code: 'GREEN001',
    address: '123 Green Valley Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001',
    contactEmail: 'admin@greenvalley.com',
    contactPhone: '+91-98765-43210'
  },
  {
    id: '2',
    name: 'Blue Hills Society',
    code: 'BLUE002',
    address: '456 Blue Hills Drive',
    city: 'Pune',
    state: 'Maharashtra',
    zipCode: '411001',
    contactEmail: 'admin@bluehills.com',
    contactPhone: '+91-98765-43211'
  }
];

const MOCK_BUILDINGS: Building[] = [
  {
    id: '1',
    name: 'Tower A',
    societyId: '1',
    totalFloors: 10,
    totalFlats: 40,
    wings: [
      { id: '1', name: 'A1', buildingId: '1', floors: 10, flatsPerFloor: 2 },
      { id: '2', name: 'A2', buildingId: '1', floors: 10, flatsPerFloor: 2 }
    ]
  },
  {
    id: '2',
    name: 'Tower B',
    societyId: '1',
    totalFloors: 12,
    totalFlats: 48,
    wings: [
      { id: '3', name: 'B1', buildingId: '2', floors: 12, flatsPerFloor: 2 },
      { id: '4', name: 'B2', buildingId: '2', floors: 12, flatsPerFloor: 2 }
    ]
  }
];

// API Service Class
class APIService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` })
    };
  }

  // Society APIs
  async validateSociety(code: string): Promise<{ valid: boolean; society?: Society }> {
    // Mock implementation
    await this.delay(300);
    const society = MOCK_SOCIETIES.find(s => s.code === code);
    return {
      valid: !!society,
      society: society
    };
  }

  async getSocieties(): Promise<Society[]> {
    await this.delay(300);
    return MOCK_SOCIETIES;
  }

  async createSociety(data: Partial<Society>): Promise<Society> {
    await this.delay(500);
    const newSociety: Society = {
      id: Date.now().toString(),
      name: data.name || '',
      code: data.code || '',
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      ...data
    };
    MOCK_SOCIETIES.push(newSociety);
    return newSociety;
  }

  // Building APIs
  async getBuildings(societyId?: string): Promise<Building[]> {
    await this.delay(300);
    return societyId 
      ? MOCK_BUILDINGS.filter(b => b.societyId === societyId)
      : MOCK_BUILDINGS;
  }

  async createBuilding(data: Partial<Building>): Promise<Building> {
    await this.delay(500);
    const newBuilding: Building = {
      id: Date.now().toString(),
      name: data.name || '',
      societyId: data.societyId || '',
      wings: data.wings || [],
      totalFloors: data.totalFloors || 0,
      totalFlats: data.totalFlats || 0
    };
    MOCK_BUILDINGS.push(newBuilding);
    return newBuilding;
  }

  async updateBuilding(id: string, data: Partial<Building>): Promise<Building> {
    await this.delay(500);
    const index = MOCK_BUILDINGS.findIndex(b => b.id === id);
    if (index !== -1) {
      MOCK_BUILDINGS[index] = { ...MOCK_BUILDINGS[index], ...data };
      return MOCK_BUILDINGS[index];
    }
    throw new Error('Building not found');
  }

  async deleteBuilding(id: string): Promise<void> {
    await this.delay(500);
    const index = MOCK_BUILDINGS.findIndex(b => b.id === id);
    if (index !== -1) {
      MOCK_BUILDINGS.splice(index, 1);
    }
  }

  // User APIs
  async getUsers(filters?: { role?: string; societyCode?: string }): Promise<User[]> {
    await this.delay(300);
    // Mock users - in real app this would come from backend
    return [];
  }

  async getUserStats(): Promise<any> {
    await this.delay(300);
    return {
      totalResidents: 156,
      activeVisitors: 12,
      pendingMaintenance: 8,
      activeSecurityPersonnel: 4
    };
  }

  async createUser(data: Partial<User>): Promise<User> {
    await this.delay(500);
    return {
      id: Date.now().toString(),
      name: data.name || '',
      email: data.email || '',
      role: data.role || 'resident',
      societyCode: data.societyCode || '',
      status: 'active',
      ...data
    } as User;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    await this.delay(500);
    return { id, ...data } as User;
  }

  async deleteUser(id: string): Promise<void> {
    await this.delay(500);
  }

  // System Monitoring APIs
  async getSystemStatus(): Promise<SystemStatus> {
    await this.delay(300);
    return {
      uptime: 99.8,
      activeUsers: 234,
      activeSessions: 187,
      errorCount: 3,
      lastError: 'Minor API timeout at visitor registration',
      dbStatus: 'healthy',
      apiStatus: 'healthy'
    };
  }

  async getErrorLogs(limit: number = 50): Promise<any[]> {
    await this.delay(300);
    return [
      {
        id: '1',
        timestamp: new Date(Date.now() - 3600000),
        level: 'error',
        message: 'Visitor QR generation timeout',
        service: 'visitor-api',
        resolved: true
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 7200000),
        level: 'warning',
        message: 'High database connection pool usage',
        service: 'database',
        resolved: false
      }
    ];
  }

  // Utility
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const apiService = new APIService();
