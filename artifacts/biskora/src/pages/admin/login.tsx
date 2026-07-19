import React, { useState, useEffect } from 'react';
import { useAdminLogin, useGetAdminMe } from '@workspace/api-client-react';
import { setAdminToken, getAdminHeaders } from '@/lib/utils';
import { useLocation } from 'wouter';
import { BiskoraLogo } from '@/components/ui/logo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const loginMutation = useAdminLogin();
  
  // Check if already logged in — retry: false so 401 resolves immediately
  const { data: me, isLoading } = useGetAdminMe({
    request: { headers: getAdminHeaders() as any },
    query: { retry: false, gcTime: 0 },
  });
  
  useEffect(() => {
    if (me && !isLoading) {
      setLocation('/admin');
    }
  }, [me, isLoading, setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { data: { email, password } },
      {
        onSuccess: (data) => {
          if (data.success && data.token) {
            setAdminToken(data.token);
            toast({ title: "Login successful" });
            setLocation('/admin');
          } else {
            toast({ title: "Login failed", description: "Invalid credentials", variant: "destructive" });
          }
        },
        onError: () => {
          toast({ title: "Login failed", description: "Invalid credentials or server error", variant: "destructive" });
        }
      }
    );
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card p-8 md:p-12 border border-border shadow-xl rounded-sm">
        <div className="flex justify-center mb-10">
          <BiskoraLogo className="h-16 w-48" />
        </div>
        
        <h1 className="text-2xl font-serif text-primary mb-8 text-center">Admin Portal</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-sans text-xs uppercase tracking-wider text-primary">Email</Label>
            <Input 
              id="email" 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="bg-background rounded-none border-border h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="font-sans text-xs uppercase tracking-wider text-primary">Password</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="bg-background rounded-none border-border h-12"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={loginMutation.isPending}
            className="w-full rounded-none bg-primary text-primary-foreground h-12 tracking-widest uppercase font-sans text-sm mt-4"
          >
            {loginMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Secure Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
