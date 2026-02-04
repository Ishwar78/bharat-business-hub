import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { User, Shield, Bell, Database, Gem } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { user } = useAuth();

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>

        {/* Profile Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="font-display">Admin Profile</CardTitle>
                <CardDescription>Your account information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={user?.name || 'Admin'} className="input-field" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user?.email || ''} className="input-field" readOnly />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gold/10 text-gold-dark">
                <Shield className="mr-1 h-3 w-3" />
                Admin
              </Badge>
              <Badge variant="outline">Active</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="font-display">Notifications</CardTitle>
                <CardDescription>Configure alert preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Payment Reminders</p>
                <p className="text-sm text-muted-foreground">Get notified about pending payments</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Monthly Reports</p>
                <p className="text-sm text-muted-foreground">Receive monthly summary reports</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Gold Stock Alerts</p>
                <p className="text-sm text-muted-foreground">Alert when stock levels are low</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                <Gem className="h-6 w-6 text-gold-dark" />
              </div>
              <div>
                <CardTitle className="font-display">Business Settings</CardTitle>
                <CardDescription>Configure default rates and values</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Default 22K Rate (₹/gram)</Label>
                <Input type="number" defaultValue="5800" className="input-field" />
              </div>
              <div className="space-y-2">
                <Label>Default 24K Rate (₹/gram)</Label>
                <Input type="number" defaultValue="6200" className="input-field" />
              </div>
              <div className="space-y-2">
                <Label>Default Flex Amount (₹/month)</Label>
                <Input type="number" defaultValue="1000" className="input-field" />
              </div>
              <div className="space-y-2">
                <Label>Payment Due Day</Label>
                <Input type="number" defaultValue="5" className="input-field" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Database className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <CardTitle className="font-display">Data Management</CardTitle>
                <CardDescription>Backup and export options</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This is a frontend-only demo. Data is stored in session storage and will be lost on page refresh. 
                Enable Lovable Cloud for persistent database storage.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => toast.info('Enable Lovable Cloud for data backup')}>
                Backup Data
              </Button>
              <Button variant="outline" onClick={() => toast.info('Enable Lovable Cloud for data restore')}>
                Restore Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="btn-gold" onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
