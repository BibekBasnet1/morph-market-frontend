import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getDefaultPathForRole } from '../config/routes';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(email, password);
    
    if (success) {
      // Small delay to ensure state is updated
      setTimeout(() => {
        const redirectPath = user ? getDefaultPathForRole(user.role) : from;
        
       console.log('Welcome back! Redirecting to:', redirectPath);
        
        navigate(redirectPath, { replace: true });
      }, 100);
    } else {
        alert('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen dark:bg-black dark:text-white flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10 px-4">
      <div className="flex items-center gap-2 mb-8">
        <span className="text-3xl">🐍</span>
        <span className="font-serif text-2xl font-bold text-foreground">SerpentMarket</span>
      </div>

      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to access your seller dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e:any) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e:any) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">Demo accounts (any password):</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 bg-accent/50 rounded-md">
                <span className="font-medium text-foreground">Super Admin:</span>
                <code className="text-xs text-muted-foreground">superadmin@demo.com</code>
              </div>
              <div className="flex justify-between p-2 bg-accent/50 rounded-md">
                <span className="font-medium text-foreground">Admin:</span>
                <code className="text-xs text-muted-foreground">admin@demo.com</code>
              </div>
              <div className="flex justify-between p-2 bg-accent/50 rounded-md">
                <span className="font-medium text-foreground">Seller:</span>
                <code className="text-xs text-muted-foreground">seller@demo.com</code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
