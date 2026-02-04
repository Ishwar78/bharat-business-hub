import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileDown, FileSpreadsheet, Car, Gem, AlertCircle, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function Reports() {
  const { vehicles, payments, goldRecords } = useData();

  // Flex Collection Report
  const paidPayments = payments.filter(p => p.status === 'Paid');
  const totalFlexCollection = paidPayments.reduce((sum, p) => sum + p.amountPaid, 0);

  // Pending Payments
  const pendingPayments = payments.filter(p => p.status === 'Pending');
  const totalPendingAmount = pendingPayments.reduce((sum, p) => {
    const vehicle = vehicles.find(v => v.id === p.vehicleId);
    return sum + (vehicle?.monthlyAmount || 0);
  }, 0);

  // Gold Summary
  const goldBuy = goldRecords.filter(r => r.purpose === 'Buy');
  const goldSell = goldRecords.filter(r => r.purpose === 'Sell');
  const totalBuyValue = goldBuy.reduce((sum, r) => sum + r.totalValue, 0);
  const totalSellValue = goldSell.reduce((sum, r) => sum + r.totalValue, 0);

  const handleExport = (type: 'pdf' | 'excel', report: string) => {
    // In a real app, this would generate actual files
    toast.success(`${report} exported as ${type.toUpperCase()}`);
  };

  const getVehicleDetails = (vehicleId: string) => {
    return vehicles.find(v => v.id === vehicleId);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">View and export business reports</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="metric-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-success/10">
                  <IndianRupee className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Flex Collection</p>
                  <p className="text-2xl font-bold font-display">₹{totalFlexCollection.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="metric-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-destructive/10">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Amount</p>
                  <p className="text-2xl font-bold font-display text-destructive">₹{totalPendingAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="metric-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gold/10">
                  <Gem className="h-6 w-6 text-gold-dark" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gold Bought</p>
                  <p className="text-2xl font-bold font-display">₹{totalBuyValue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="metric-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Gem className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gold Sold</p>
                  <p className="text-2xl font-bold font-display">₹{totalSellValue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports Tabs */}
        <Tabs defaultValue="flex" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="flex">Flex Collection</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="gold">Gold</TabsTrigger>
          </TabsList>

          {/* Flex Collection Report */}
          <TabsContent value="flex">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-display">Monthly Flex Collection Report</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">All paid flex advertisements</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExport('pdf', 'Flex Collection Report')}>
                    <FileDown className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport('excel', 'Flex Collection Report')}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Excel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Month</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paidPayments.map(payment => {
                      const vehicle = getVehicleDetails(payment.vehicleId);
                      return (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{vehicle?.vehicleNumber}</TableCell>
                          <TableCell>{vehicle?.ownerName}</TableCell>
                          <TableCell>{payment.month}</TableCell>
                          <TableCell className="font-semibold text-success">₹{payment.amountPaid.toLocaleString()}</TableCell>
                          <TableCell><Badge variant="outline">{payment.paymentMode}</Badge></TableCell>
                          <TableCell>{payment.paymentDate}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <div className="mt-4 p-4 bg-success/10 rounded-lg flex justify-between items-center">
                  <span className="font-medium">Total Collection</span>
                  <span className="text-2xl font-bold font-display text-success">₹{totalFlexCollection.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Payments Report */}
          <TabsContent value="pending">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-display">Pending Payment List</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Vehicles with pending payments</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExport('pdf', 'Pending Payments Report')}>
                    <FileDown className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport('excel', 'Pending Payments Report')}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Excel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Area</TableHead>
                      <TableHead>Month</TableHead>
                      <TableHead>Amount Due</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingPayments.map(payment => {
                      const vehicle = getVehicleDetails(payment.vehicleId);
                      return (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{vehicle?.vehicleNumber}</TableCell>
                          <TableCell>{vehicle?.ownerName}</TableCell>
                          <TableCell>{vehicle?.mobileNumber}</TableCell>
                          <TableCell>{vehicle?.area}</TableCell>
                          <TableCell>{payment.month}</TableCell>
                          <TableCell className="font-semibold text-destructive">₹{vehicle?.monthlyAmount.toLocaleString()}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                {pendingPayments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending payments! 🎉
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-destructive/10 rounded-lg flex justify-between items-center">
                    <span className="font-medium">Total Pending</span>
                    <span className="text-2xl font-bold font-display text-destructive">₹{totalPendingAmount.toLocaleString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gold Report */}
          <TabsContent value="gold">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-display">Gold Transaction Report</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">All gold buy/sell/repair records</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExport('pdf', 'Gold Report')}>
                    <FileDown className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport('excel', 'Gold Report')}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Excel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {goldRecords.map(record => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.customerName}</TableCell>
                        <TableCell><Badge variant="outline" className="bg-gold/10">{record.goldType}</Badge></TableCell>
                        <TableCell>{record.weight}g</TableCell>
                        <TableCell>₹{record.ratePerGram.toLocaleString()}</TableCell>
                        <TableCell className="font-semibold">₹{record.totalValue.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={cn(
                            record.purpose === 'Buy' ? 'bg-success/10 text-success' :
                            record.purpose === 'Sell' ? 'bg-gold/10 text-gold-dark' :
                            'bg-primary/10 text-primary'
                          )}>
                            {record.purpose}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-success/10 rounded-lg flex justify-between items-center">
                    <span className="font-medium">Total Bought</span>
                    <span className="text-xl font-bold font-display text-success">₹{totalBuyValue.toLocaleString()}</span>
                  </div>
                  <div className="p-4 bg-gold/10 rounded-lg flex justify-between items-center">
                    <span className="font-medium">Total Sold</span>
                    <span className="text-xl font-bold font-display text-gold-dark">₹{totalSellValue.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
