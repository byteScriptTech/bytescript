'use client';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

import { auth, githubProvider, googleProvider } from '../../../lib/firebase';

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('User info: ', user);
      router.push('/dashboard'); // Redirect to a dashboard after login
    } catch (error: any) {
      setError('Failed to sign in');
      toast({
        variant: 'destructive',
        description: error.message,
      });
    }
  };
  const handleGithubLogin = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      console.log(result.user);
      router.push('/dashboard');
    } catch (error: any) {
      setError('Failed to sign in');
      toast({
        variant: 'destructive',
        description: error.message,
      });
    }
  };
  useEffect(() => {}, []);

  return (
    <div className="grid place-content-center h-screen">
      {error && <p>{error}</p>}
      <Card className="sm:w-96 sm:h-48">
        <CardHeader>Register / Login</CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full mb-2"
            >
              Login with Google
            </Button>
          </div>
          <div className="grid gap-4">
            <Button
              onClick={handleGithubLogin}
              variant="outline"
              className="w-full"
            >
              Login with GitHub
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
