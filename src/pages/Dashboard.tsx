import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useData } from '@/context/DataContext';
import { 
  Car, 
  CheckCircle, 
  AlertCircle, 
  IndianRupee, 
  Gem,
  Bell,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  variant?: 'default' | 'primary' | 'gold' | 'success' | 'warning';
  className?: string;
}

function MetricCard({ title, value, icon: Icon, trend, variant = 'default', className }: MetricCardProps) {
  const variantClasses = {
    default: 'metric-card',
    primary: 'metric-card metric-card-primary',
    gold: 'metric-card metric-card-gold',
    success: 'metric-card metric-card-success',
    warning: 'metric-card bg-warning/10 border-warning/20'
  };

  const iconBgClasses = {
    default: 'bg-primary/10 text-primary',
    primary: 'bg-white/20 text-white',
    gold: 'bg-primary/10 text-primary',
    success: 'bg-white/20 text-white',
    warning: 'bg-warning/20 text-warning'
  };

  const textClasses = {
    default: 'text-foreground',
    primary: 'text-white',
    gold: 'text-primary',
    success: 'text-white',
    warning: 'text-warning'
  };

  return (
    <div className={cn(variantClasses[variant], 'animate-slide-up', className)}>
      <div className="flex items-start justify-between">
        <div className={cn("p-3 rounded-xl", iconBgClasses[variant])}>
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <div className={cn("flex items-center gap-1 text-sm font-medium", textClasses[variant])}>
            <ArrowUpRight className="h-4 w-4" />
            {trend}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className={cn("text-sm font-medium opacity-80", variant === 'default' ? 'text-muted-foreground' : textClasses[variant])}>
          {title}
        </p>
        <p className={cn("text-3xl font-bold font-display mt-1", textClasses[variant])}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { getStats, vehicles, payments, goldRecords } = useData();
  const stats = getStats();

  const pendingPayments = payments.filter(p => p.status === 'Pending');
  const recentGold = goldRecords.slice(-3).reverse();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here's your business overview.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1.5">
              <span className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
              Live Data
            </Badge>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricCard
            title="Total Vehicles"
            value={stats.totalVehicles}
            icon={Car}
            variant="primary"
            trend="+12%"
          />
          <MetricCard
            title="Paid Vehicles"
            value={stats.paidVehicles}
            icon={CheckCircle}
            variant="success"
          />
          <MetricCard
            title="Pending Payments"
            value={stats.pendingPayments}
            icon={AlertCircle}
            variant="warning"
          />
          <MetricCard
            title="Monthly Collection"
            value={`₹${stats.monthlyCollection.toLocaleString()}`}
            icon={IndianRupee}
            variant="gold"
            trend="+8%"
          />
          <MetricCard
            title="Gold Stock Value"
            value={`₹${stats.goldStockValue.toLocaleString()}`}
            icon={Gem}
            variant="gold"
          />
          <MetricCard
            title="Pending Alerts"
            value={stats.pendingAlerts}
            icon={Bell}
            variant={stats.pendingAlerts > 0 ? 'warning' : 'default'}
          />
        </div>

        {/* Secondary Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Payments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-display">Pending Payments</CardTitle>
              <Badge variant="destructive">{pendingPayments.length} Pending</Badge>
            </CardHeader>
            <CardContent>
              {pendingPayments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">All payments are up to date! 🎉</p>
              ) : (
                <div className="space-y-3">
                  {pendingPayments.slice(0, 5).map(payment => {
                    const vehicle = vehicles.find(v => v.id === payment.vehicleId);
                    return (
                      <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                            <AlertCircle className="h-5 w-5 text-destructive" />
                          </div>
                          <div>
                            <p className="font-medium">{vehicle?.vehicleNumber || 'Unknown'}</p>
                            <p className="text-sm text-muted-foreground">{vehicle?.ownerName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-destructive">₹{vehicle?.monthlyAmount.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{payment.month}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Gold Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-display">Recent Gold Transactions</CardTitle>
              <Badge className="bg-gold text-primary">{goldRecords.length} Records</Badge>
            </CardHeader>
            <CardContent>
              {recentGold.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No gold transactions yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentGold.map(record => (
                    <div key={record.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          record.purpose === 'Buy' ? 'bg-success/10' : record.purpose === 'Sell' ? 'bg-gold/10' : 'bg-primary/10'
                        )}>
                          <Gem className={cn(
                            "h-5 w-5",
                            record.purpose === 'Buy' ? 'text-success' : record.purpose === 'Sell' ? 'text-gold' : 'text-primary'
                          )} />
                        </div>
                        <div>
                          <p className="font-medium">{record.customerName}</p>
                          <p className="text-sm text-muted-foreground">{record.goldType} • {record.weight}g</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{record.totalValue.toLocaleString()}</p>
                        <Badge variant="outline" className="text-xs">{record.purpose}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Bar */}
        <Card className="bg-gradient-to-r from-primary to-sidebar-accent text-white border-0">
          <CardContent className="py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-white/70 text-sm">Auto Rickshaws</p>
                <p className="text-2xl font-bold font-display">{vehicles.filter(v => v.vehicleType === 'Auto').length}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">E-Rickshaws</p>
                <p className="text-2xl font-bold font-display">{vehicles.filter(v => v.vehicleType === 'E-Rickshaw').length}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">22K Gold (g)</p>
                <p className="text-2xl font-bold font-display">
                  {goldRecords.filter(r => r.goldType === '22K').reduce((sum, r) => sum + r.weight, 0).toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-white/70 text-sm">24K Gold (g)</p>
                <p className="text-2xl font-bold font-display">
                  {goldRecords.filter(r => r.goldType === '24K').reduce((sum, r) => sum + r.weight, 0).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
