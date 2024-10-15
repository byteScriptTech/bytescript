'use client';
import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

const Authentication = () => {
  const [error, setError] = useState<string | null>(null);
  const { signInWithGoogle, signInWithGithub } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      setError('Failed to sign in with Google');
    }
  };

  const handleGithubLogin = async () => {
    try {
      await signInWithGithub();
    } catch (error: any) {
      setError('Failed to sign in with GitHub');
    }
  };

  return (
    <div className="grid place-content-center h-screen">
      {error && <p className="text-red-500">{error}</p>}
      <Card className="sm:w-96 sm:h-auto p-6 text-center bg-white rounded-lg transition-shadow hover:shadow-md">
        <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
          Welcome to biteScript
        </CardTitle>
        <CardDescription className="text-gray-600 mb-6">
          Let&apos;s kickstart your journey to becoming a Rockstar programmer!
        </CardDescription>
        <CardContent>
          <div className="mb-4">
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors rounded-md py-2"
            >
              <span className="mr-2">
                <FcGoogle size={23} />
              </span>
              Login with Google
            </Button>
          </div>
          <div>
            <Button
              onClick={handleGithubLogin}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors rounded-md py-2"
            >
              <span className="mr-2">
                <FaGithub size={23} />
              </span>
              Login with GitHub
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Authentication;
