'use client';

import { Loader2, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getAdminUsers, updateUserRole, type UserData } from '@/lib/admin';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const adminUsers = await getAdminUsers();
      setUsers(adminUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleUpdateRole = async (
    userId: string,
    newRole: 'admin' | 'user'
  ) => {
    if (userId === currentUser?.uid) {
      toast({
        title: 'Error',
        description: 'You cannot change your own role',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUpdatingUser(userId);
      const success = await updateUserRole(userId, newRole);

      if (success) {
        setUsers(
          users.map((user) =>
            user.uid === userId ? { ...user, role: newRole } : user
          )
        );
        toast({
          title: 'Success',
          description: `User role updated to ${newRole}`,
        });
      } else {
        throw new Error('Failed to update role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    } finally {
      setUpdatingUser(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">User Management</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      {user.photoURL && (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || 'User'}
                          className="h-8 w-8 rounded-full"
                        />
                      )}
                      <span>{user.displayName || 'Unknown User'}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email || 'No email'}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {user.role === 'admin' ? (
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                      ) : (
                        <ShieldAlert className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="capitalize">{user.role}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.role === 'admin' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateRole(user.uid, 'user')}
                        disabled={updatingUser === user.uid}
                      >
                        {updatingUser === user.uid ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Remove Admin
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateRole(user.uid, 'admin')}
                        disabled={updatingUser === user.uid}
                      >
                        {updatingUser === user.uid ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Make Admin
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
