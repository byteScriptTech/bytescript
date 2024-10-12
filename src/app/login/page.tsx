'use client';
import Authentication from '@/components/specific/Authentication';
import { AuthProvider } from '@/context/AuthContext';

const Login = () => {
  return (
    <AuthProvider>
      <Authentication />
    </AuthProvider>
  );
};

export default Login;
