import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useData } from '@/context/DataContext';
import { GoldType, GoldPurpose, GoldRecord } from '@/types';
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
import { Plus, Search, Edit, Trash2, Gem, TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const goldTypes: GoldType[] = ['22K', '24K'];
const goldPurposes: GoldPurpose[] = ['Sell', 'Buy', 'Repair'];

export default function GoldManagement() {
  const { goldRecords, addGoldRecord, updateGoldRecord, deleteGoldRecord } = useData();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPurpose, setFilterPurpose] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<GoldRecord | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    mobileNumber: '',
    goldType: '22K' as GoldType,
    weight: '',
    ratePerGram: '',
    purpose: 'Sell' as GoldPurpose,
    date: new Date().toISOString().split('T')[0],
    remarks: ''
  });

  // Stats
  const total22K = goldRecords
    .filter(r => r.goldType === '22K')
    .reduce((sum, r) => {
      if (r.purpose === 'Buy') return sum + r.weight;
      if (r.purpose === 'Sell') return sum - r.weight;
      return sum;
    }, 0);

  const total24K = goldRecords
    .filter(r => r.goldType === '24K')
    .reduce((sum, r) => {
      if (r.purpose === 'Buy') return sum + r.weight;
      if (r.purpose === 'Sell') return sum - r.weight;
      return sum;
    }, 0);

  const totalBuyValue = goldRecords
    .filter(r => r.purpose === 'Buy')
    .reduce((sum, r) => sum + r.totalValue, 0);

  const totalSellValue = goldRecords
    .filter(r => r.purpose === 'Sell')
    .reduce((sum, r) => sum + r.totalValue, 0);

  const filteredRecords = goldRecords.filter(r => {
    const matchesSearch = 
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.mobileNumber.includes(search);
    const matchesType = filterType === 'all' || r.goldType === filterType;
    const matchesPurpose = filterPurpose === 'all' || r.purpose === filterPurpose;
    return matchesSearch && matchesType && matchesPurpose;
  });

  const resetForm = () => {
    setFormData({
      customerName: '',
      mobileNumber: '',
      goldType: '22K',
      weight: '',
      ratePerGram: '',
      purpose: 'Sell',
      date: new Date().toISOString().split('T')[0],
      remarks: ''
    });
    setEditingRecord(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.weight || !formData.ratePerGram) {
      toast.error('Please fill in required fields');
      return;
    }

    if (editingRecord) {
      updateGoldRecord(editingRecord.id, {
        ...formData,
        weight: Number(formData.weight),
        ratePerGram: Number(formData.ratePerGram)
      });
      toast.success('Record updated successfully');
    } else {
      addGoldRecord({
        ...formData,
        weight: Number(formData.weight),
        ratePerGram: Number(formData.ratePerGram)
      });
      toast.success('Gold record added successfully');
    }

    resetForm();
    setDialogOpen(false);
  };

  const handleEdit = (record: GoldRecord) => {
    setEditingRecord(record);
    setFormData({
      customerName: record.customerName,
      mobileNumber: record.mobileNumber,
      goldType: record.goldType,
      weight: record.weight.toString(),
      ratePerGram: record.ratePerGram.toString(),
      purpose: record.purpose,
      date: record.date,
      remarks: record.remarks
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      deleteGoldRecord(id);
      toast.success('Record deleted');
    }
  };

  const calculatedTotal = Number(formData.weight) * Number(formData.ratePerGram) || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Gold Management</h1>
            <p className="text-muted-foreground mt-1">Track gold transactions and stock</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="btn-gold">
                <Plus className="mr-2 h-4 w-4" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-display">
                  {editingRecord ? 'Edit Gold Record' : 'Add Gold Record'}
                </DialogTitle>
                <DialogDescription>
                  Enter the gold transaction details
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Customer Name *</Label>
                    <Input
                      placeholder="Enter customer name"
                      value={formData.customerName}
                      onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mobile Number</Label>
                    <Input
                      placeholder="9876543210"
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gold Type *</Label>
                    <Select 
                      value={formData.goldType} 
                      onValueChange={(v) => setFormData({...formData, goldType: v as GoldType})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {goldTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Purpose *</Label>
                    <Select 
                      value={formData.purpose} 
                      onValueChange={(v) => setFormData({...formData, purpose: v as GoldPurpose})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {goldPurposes.map(purpose => (
                          <SelectItem key={purpose} value={purpose}>{purpose}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Weight (grams) *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="10.5"
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rate per gram (₹) *</Label>
                    <Input
                      type="number"
                      placeholder="5800"
                      value={formData.ratePerGram}
                      onChange={(e) => setFormData({...formData, ratePerGram: e.target.value})}
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Auto-calculated total */}
                <div className="p-4 bg-gold/10 rounded-lg border border-gold/20">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Value</span>
                    <span className="text-2xl font-bold font-display text-gold-dark">
                      ₹{calculatedTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="input-field"
                  />
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
                    {editingRecord ? 'Update Record' : 'Add Record'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stock Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="metric-card-gold">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Scale className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary/70">22K Stock</p>
                  <p className="text-2xl font-bold font-display text-primary">{total22K.toFixed(2)}g</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="metric-card-gold">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Gem className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary/70">24K Stock</p>
                  <p className="text-2xl font-bold font-display text-primary">{total24K.toFixed(2)}g</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="metric-card-success">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/20">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Total Bought</p>
                  <p className="text-2xl font-bold font-display text-white">₹{totalBuyValue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="metric-card-primary">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/20">
                  <TrendingDown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Total Sold</p>
                  <p className="text-2xl font-bold font-display text-white">₹{totalSellValue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer name or mobile..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 input-field"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Gold Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {goldTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterPurpose} onValueChange={setFilterPurpose}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {goldPurposes.map(purpose => (
                    <SelectItem key={purpose} value={purpose}>{purpose}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Gold Transactions ({filteredRecords.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Rate/g</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map(record => (
                    <TableRow key={record.id} className="table-row-hover">
                      <TableCell>
                        <div>
                          <p className="font-medium">{record.customerName}</p>
                          <p className="text-xs text-muted-foreground">{record.mobileNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-gold/10 text-gold-dark border-gold/30">
                          {record.goldType}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{record.weight}g</TableCell>
                      <TableCell>₹{record.ratePerGram.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold text-gold-dark">₹{record.totalValue.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          record.purpose === 'Buy' ? 'bg-success/10 text-success hover:bg-success/20' :
                          record.purpose === 'Sell' ? 'bg-gold/10 text-gold-dark hover:bg-gold/20' :
                          'bg-primary/10 text-primary hover:bg-primary/20'
                        )}>
                          {record.purpose}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(record)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(record.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredRecords.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No gold records found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
