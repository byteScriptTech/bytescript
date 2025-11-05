'use client';

import {
  Loader2,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

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
import type { UserData } from '@/lib/admin';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to load users');
      const data = await response.json();
      setUsers(data);
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
  }, [toast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

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

    setUpdatingUser(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error('Failed to update user role');

      setUsers(
        users.map((user) =>
          user.uid === userId ? { ...user, role: newRole } : user
        )
      );
      console.log(users, userId, newRole);

      toast({
        title: 'Success',
        description: `User role updated to ${newRole}`,
      });
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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button onClick={loadUsers} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

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
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || 'User'}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                          <User className="h-4 w-4 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">
                          {user.displayName || 'Anonymous User'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ID: {user.uid.substring(0, 8)}...
                        </div>
                      </div>
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
                      <span className="capitalize">{user.role || 'user'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {user.role !== 'admin' && (
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
                      {user.role === 'admin' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateRole(user.uid, 'user')}
                          disabled={
                            updatingUser === user.uid ||
                            user.uid === currentUser?.uid
                          }
                          title={
                            user.uid === currentUser?.uid
                              ? "Can't modify your own role"
                              : ''
                          }
                        >
                          {updatingUser === user.uid ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Remove Admin
                        </Button>
                      )}
                    </div>
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
