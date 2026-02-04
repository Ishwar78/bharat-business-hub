import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useData } from '@/context/DataContext';
import { PaymentMode, PaymentStatus } from '@/types';
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
import { Plus, Search, Filter, CheckCircle, AlertCircle, CreditCard, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const paymentModes: PaymentMode[] = ['Cash', 'UPI', 'Bank'];

export default function Payments() {
  const { vehicles, payments, addPayment, updatePayment } = useData();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    vehicleId: '',
    month: '',
    amountPaid: '',
    paymentMode: 'UPI' as PaymentMode,
    paymentDate: new Date().toISOString().split('T')[0]
  });

  const months = [...new Set(payments.map(p => p.month))].sort().reverse();

  const getVehicleDetails = (vehicleId: string) => {
    return vehicles.find(v => v.id === vehicleId);
  };

  const filteredPayments = payments.filter(p => {
    const vehicle = getVehicleDetails(p.vehicleId);
    const matchesSearch = 
      vehicle?.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||
      vehicle?.ownerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchesMonth = filterMonth === 'all' || p.month === filterMonth;
    return matchesSearch && matchesStatus && matchesMonth;
  });

  const totalCollection = filteredPayments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amountPaid, 0);

  const pendingCount = filteredPayments.filter(p => p.status === 'Pending').length;
  const paidCount = filteredPayments.filter(p => p.status === 'Paid').length;

  const resetForm = () => {
    setFormData({
      vehicleId: '',
      month: '',
      amountPaid: '',
      paymentMode: 'UPI',
      paymentDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vehicleId || !formData.month) {
      toast.error('Please select vehicle and month');
      return;
    }

    const vehicle = getVehicleDetails(formData.vehicleId);
    
    addPayment({
      vehicleId: formData.vehicleId,
      month: formData.month,
      amountPaid: Number(formData.amountPaid) || vehicle?.monthlyAmount || 0,
      paymentMode: formData.paymentMode,
      paymentDate: formData.paymentDate,
      status: 'Paid'
    });
    
    toast.success('Payment recorded successfully');
    resetForm();
    setDialogOpen(false);
  };

  const handleMarkPaid = (paymentId: string, vehicleId: string) => {
    const vehicle = getVehicleDetails(vehicleId);
    updatePayment(paymentId, {
      status: 'Paid',
      amountPaid: vehicle?.monthlyAmount || 0,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMode: 'Cash'
    });
    toast.success('Payment marked as paid');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Payments</h1>
            <p className="text-muted-foreground mt-1">Track and manage flex payments</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="btn-gold">
                <Plus className="mr-2 h-4 w-4" />
                Record Payment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">Record Payment</DialogTitle>
                <DialogDescription>
                  Record a new payment for a vehicle
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Select Vehicle *</Label>
                  <Select 
                    value={formData.vehicleId} 
                    onValueChange={(v) => setFormData({...formData, vehicleId: v})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map(v => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.vehicleNumber} - {v.ownerName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Month *</Label>
                    <Input
                      type="month"
                      value={formData.month}
                      onChange={(e) => setFormData({...formData, month: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount (₹)</Label>
                    <Input
                      type="number"
                      placeholder={getVehicleDetails(formData.vehicleId)?.monthlyAmount?.toString() || '0'}
                      value={formData.amountPaid}
                      onChange={(e) => setFormData({...formData, amountPaid: e.target.value})}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Payment Mode</Label>
                    <Select 
                      value={formData.paymentMode} 
                      onValueChange={(v) => setFormData({...formData, paymentMode: v as PaymentMode})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentModes.map(mode => (
                          <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Date</Label>
                    <Input
                      type="date"
                      value={formData.paymentDate}
                      onChange={(e) => setFormData({...formData, paymentDate: e.target.value})}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button type="submit" className="btn-gold">
                    Record Payment
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="metric-card-gold">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <IndianRupee className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary/70">Total Collection</p>
                  <p className="text-2xl font-bold font-display text-primary">₹{totalCollection.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="metric-card-success">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/20">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Paid</p>
                  <p className="text-2xl font-bold font-display text-white">{paidCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-destructive/20">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-destructive/70">Pending</p>
                  <p className="text-2xl font-bold font-display text-destructive">{pendingCount}</p>
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
                  placeholder="Search by vehicle or owner..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 input-field"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {months.map(month => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Payment Records ({filteredPayments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map(payment => {
                    const vehicle = getVehicleDetails(payment.vehicleId);
                    return (
                      <TableRow key={payment.id} className="table-row-hover">
                        <TableCell className="font-medium">{vehicle?.vehicleNumber || 'Unknown'}</TableCell>
                        <TableCell>{vehicle?.ownerName || 'Unknown'}</TableCell>
                        <TableCell>{payment.month}</TableCell>
                        <TableCell className="font-semibold">
                          ₹{payment.status === 'Paid' ? payment.amountPaid.toLocaleString() : vehicle?.monthlyAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{payment.paymentMode}</Badge>
                        </TableCell>
                        <TableCell>{payment.paymentDate || '-'}</TableCell>
                        <TableCell>
                          <span className={cn("status-badge", payment.status === 'Paid' ? 'status-paid' : 'status-pending')}>
                            {payment.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {payment.status === 'Pending' && (
                            <Button 
                              size="sm" 
                              className="btn-gold"
                              onClick={() => handleMarkPaid(payment.id, payment.vehicleId)}
                            >
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Mark Paid
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {filteredPayments.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No payments found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
