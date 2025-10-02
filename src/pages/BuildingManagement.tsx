import React, { useState, useEffect } from 'react';
import { Plus, Building2, Edit, Trash2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiService, Building, Society } from '@/services/api';
import { Badge } from '@/components/ui/badge';

const BuildingManagement = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [societies, setSocieties] = useState<Society[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    societyId: '',
    totalFloors: '',
    totalFlats: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [buildingsData, societiesData] = await Promise.all([
        apiService.getBuildings(),
        apiService.getSocieties()
      ]);
      setBuildings(buildingsData);
      setSocieties(societiesData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load buildings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingBuilding) {
        await apiService.updateBuilding(editingBuilding.id, {
          name: formData.name,
          societyId: formData.societyId,
          totalFloors: parseInt(formData.totalFloors),
          totalFlats: parseInt(formData.totalFlats)
        });
        toast({ title: 'Success', description: 'Building updated successfully' });
      } else {
        await apiService.createBuilding({
          name: formData.name,
          societyId: formData.societyId,
          totalFloors: parseInt(formData.totalFloors),
          totalFlats: parseInt(formData.totalFlats),
          wings: []
        });
        toast({ title: 'Success', description: 'Building created successfully' });
      }
      
      setDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save building',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (building: Building) => {
    setEditingBuilding(building);
    setFormData({
      name: building.name,
      societyId: building.societyId,
      totalFloors: building.totalFloors.toString(),
      totalFlats: building.totalFlats.toString()
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this building?')) return;
    
    try {
      await apiService.deleteBuilding(id);
      toast({ title: 'Success', description: 'Building deleted successfully' });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete building',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({ name: '', societyId: '', totalFloors: '', totalFlats: '' });
    setEditingBuilding(null);
  };

  const getSocietyName = (societyId: string) => {
    return societies.find(s => s.id === societyId)?.name || 'Unknown';
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Building Management</h1>
          <p className="text-muted-foreground mt-1">Manage buildings, wings, and infrastructure</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Building
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBuilding ? 'Edit Building' : 'Add New Building'}</DialogTitle>
              <DialogDescription>
                {editingBuilding ? 'Update building details' : 'Create a new building in the system'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Building Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Tower A"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="society">Society</Label>
                <select
                  id="society"
                  value={formData.societyId}
                  onChange={(e) => setFormData({ ...formData, societyId: e.target.value })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  required
                >
                  <option value="">Select Society</option>
                  {societies.map(society => (
                    <option key={society.id} value={society.id}>{society.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="floors">Total Floors</Label>
                  <Input
                    id="floors"
                    type="number"
                    value={formData.totalFloors}
                    onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
                    placeholder="10"
                    min="1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="flats">Total Flats</Label>
                  <Input
                    id="flats"
                    type="number"
                    value={formData.totalFlats}
                    onChange={(e) => setFormData({ ...formData, totalFlats: e.target.value })}
                    placeholder="40"
                    min="1"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingBuilding ? 'Update' : 'Create'} Building
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buildings.map((building) => (
          <Card key={building.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{building.name}</CardTitle>
                    <CardDescription>{getSocietyName(building.societyId)}</CardDescription>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(building)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(building.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Floors</p>
                    <p className="text-lg font-semibold">{building.totalFloors}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Flats</p>
                    <p className="text-lg font-semibold">{building.totalFlats}</p>
                  </div>
                </div>
              </div>
              
              {building.wings && building.wings.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Wings</p>
                  <div className="flex flex-wrap gap-2">
                    {building.wings.map(wing => (
                      <Badge key={wing.id} variant="secondary">
                        {wing.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {buildings.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No buildings yet</p>
            <p className="text-sm text-muted-foreground mb-4">Create your first building to get started</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Building
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BuildingManagement;
