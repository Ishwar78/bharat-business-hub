import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useData } from '@/context/DataContext';
import { Vehicle, VehicleType, FlexType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, Filter, Edit, Trash2, Car, Bike } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const vehicleTypes: VehicleType[] = ['Auto', 'E-Rickshaw', '2W', '3W'];
const flexTypes: FlexType[] = ['Front', 'Back', 'Full Wrap'];

export default function Vehicles() {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle, payments } = useData();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterArea, setFilterArea] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    vehicleType: 'Auto' as VehicleType,
    vehicleNumber: '',
    ownerName: '',
    mobileNumber: '',
    flexType: 'Full Wrap' as FlexType,
    flexStartDate: '',
    monthlyAmount: '',
    area: '',
    remarks: ''
  });

  const areas = [...new Set(vehicles.map(v => v.area))];

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = 
      v.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      v.mobileNumber.includes(search);
    const matchesType = filterType === 'all' || v.vehicleType === filterType;
    const matchesArea = filterArea === 'all' || v.area === filterArea;
    return matchesSearch && matchesType && matchesArea;
  });

  const getPaymentStatus = (vehicleId: string) => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const payment = payments.find(p => p.vehicleId === vehicleId && p.month.startsWith('2024'));
    return payment?.status === 'Paid' ? 'Paid' : 'Pending';
  };

  const resetForm = () => {
    setFormData({
      vehicleType: 'Auto',
      vehicleNumber: '',
      ownerName: '',
      mobileNumber: '',
      flexType: 'Full Wrap',
      flexStartDate: '',
      monthlyAmount: '',
      area: '',
      remarks: ''
    });
    setEditingVehicle(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vehicleNumber || !formData.ownerName || !formData.mobileNumber) {
      toast.error('Please fill in required fields');
      return;
    }

    if (editingVehicle) {
      updateVehicle(editingVehicle.id, {
        ...formData,
        monthlyAmount: Number(formData.monthlyAmount)
      });
      toast.success('Vehicle updated successfully');
    } else {
      addVehicle({
        ...formData,
        monthlyAmount: Number(formData.monthlyAmount)
      });
      toast.success('Vehicle added successfully');
    }

    resetForm();
    setDialogOpen(false);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      vehicleType: vehicle.vehicleType,
      vehicleNumber: vehicle.vehicleNumber,
      ownerName: vehicle.ownerName,
      mobileNumber: vehicle.mobileNumber,
      flexType: vehicle.flexType,
      flexStartDate: vehicle.flexStartDate,
      monthlyAmount: vehicle.monthlyAmount.toString(),
      area: vehicle.area,
      remarks: vehicle.remarks
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      deleteVehicle(id);
      toast.success('Vehicle deleted');
    }
  };

  const getVehicleIcon = (type: VehicleType) => {
    switch (type) {
      case '2W':
        return <Bike className="h-4 w-4" />;
      default:
        return <Car className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Flex Vehicles</h1>
            <p className="text-muted-foreground mt-1">Manage your vehicle advertisements</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="btn-gold">
                <Plus className="mr-2 h-4 w-4" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display">
                  {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
                </DialogTitle>
                <DialogDescription>
                  Enter the vehicle details for flex advertisement
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Vehicle Type *</Label>
                    <Select 
                      value={formData.vehicleType} 
                      onValueChange={(v) => setFormData({...formData, vehicleType: v as VehicleType})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Vehicle Number *</Label>
                    <Input
                      placeholder="UP32 AB 1234"
                      value={formData.vehicleNumber}
                      onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value.toUpperCase()})}
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Owner Name *</Label>
                    <Input
                      placeholder="Enter owner name"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mobile Number *</Label>
                    <Input
                      placeholder="9876543210"
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Flex Type</Label>
                    <Select 
                      value={formData.flexType} 
                      onValueChange={(v) => setFormData({...formData, flexType: v as FlexType})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {flexTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Flex Start Date</Label>
                    <Input
                      type="date"
                      value={formData.flexStartDate}
                      onChange={(e) => setFormData({...formData, flexStartDate: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Monthly Amount (₹)</Label>
                    <Input
                      type="number"
                      placeholder="1500"
                      value={formData.monthlyAmount}
                      onChange={(e) => setFormData({...formData, monthlyAmount: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Area / Route</Label>
                    <Input
                      placeholder="Hazratganj"
                      value={formData.area}
                      onChange={(e) => setFormData({...formData, area: e.target.value})}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Remarks</Label>
                  <Input
                    placeholder="Any additional notes..."
                    value={formData.remarks}
                    onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button type="submit" className="btn-gold">
                    {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by vehicle number, owner, or mobile..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 input-field"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {vehicleTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterArea} onValueChange={setFilterArea}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  {areas.map(area => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Vehicle List ({filteredVehicles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Flex Type</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map(vehicle => {
                    const status = getPaymentStatus(vehicle.id);
                    return (
                      <TableRow key={vehicle.id} className="table-row-hover">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                              {getVehicleIcon(vehicle.vehicleType)}
                            </div>
                            <div>
                              <p className="font-medium">{vehicle.vehicleNumber}</p>
                              <p className="text-xs text-muted-foreground">{vehicle.vehicleType}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{vehicle.ownerName}</p>
                            <p className="text-xs text-muted-foreground">{vehicle.mobileNumber}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{vehicle.flexType}</Badge>
                        </TableCell>
                        <TableCell>{vehicle.area}</TableCell>
                        <TableCell className="font-semibold">₹{vehicle.monthlyAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={cn("status-badge", status === 'Paid' ? 'status-paid' : 'status-pending')}>
                            {status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(vehicle)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(vehicle.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {filteredVehicles.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No vehicles found. Add your first vehicle to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
