import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gem, Eye, EyeOff, Loader2, Download, CheckCircle2, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { usePWAInstall } from '@/hooks/usePWAInstall';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isInstallable, isInstalled, installApp } = usePWAInstall();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Login failed');
    }
  };

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      toast.success('App installed successfully!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary to-sidebar-accent p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gold-light rounded-full blur-3xl" />
      </div>

      {/* Install PWA Banner */}
      {(isInstallable || isInstalled) && (
        <div className="absolute top-4 left-4 right-4 z-20">
          <div className={`max-w-md mx-auto rounded-xl p-4 shadow-lg backdrop-blur-sm flex items-center gap-3 ${
            isInstalled 
              ? 'bg-success/20 border border-success/30' 
              : 'bg-gold/20 border border-gold/30'
          }`}>
            <div className={`p-2 rounded-lg ${isInstalled ? 'bg-success/20' : 'bg-gold/20'}`}>
              {isInstalled ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <Smartphone className="h-5 w-5 text-gold" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                {isInstalled ? 'App Installed!' : 'Install App'}
              </p>
              <p className="text-xs text-white/70">
                {isInstalled 
                  ? 'You can access from home screen' 
                  : 'Add to home screen for quick access'}
              </p>
            </div>
            {isInstallable && (
              <Button
                onClick={handleInstall}
                size="sm"
                className="bg-gold hover:bg-gold-dark text-primary font-semibold"
              >
                <Download className="h-4 w-4 mr-1" />
                Install
              </Button>
            )}
          </div>
        </div>
      )}

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-gold to-gold-light flex items-center justify-center mb-4 shadow-gold">
            <Gem className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-display">Bharat Flex & Gold</CardTitle>
          <CardDescription>
            Sign in to manage your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full btn-gold h-11" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* PWA Install Button */}
          <div className="mt-4">
            {isInstalled ? (
              <div className="flex items-center justify-center gap-2 p-3 bg-success/10 rounded-lg border border-success/30">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="text-sm font-medium text-success">App Installed!</span>
              </div>
            ) : isInstallable ? (
              <Button
                onClick={handleInstall}
                className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white"
              >
                <Download className="mr-2 h-5 w-5" />
                Install App on Device
              </Button>
            ) : (
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                <p className="text-xs text-muted-foreground text-center">
                  <Smartphone className="h-3 w-3 inline mr-1" />
                  <strong>Install App:</strong> Open in Chrome/Safari → Menu → Add to Home Screen
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Demo Credentials:</strong><br />
              Email: Admingold@gmail<br />
              Password: Gold98765
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
