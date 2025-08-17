'use client';

import {
  Settings as SettingsIcon,
  User as UserIcon,
  Bell,
  ChevronRight,
  ChevronLeft,
  Loader2,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { ThemeToggle } from '@/components/settings/theme-toggle';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import userService from '@/services/userService';

const settingsNav = [
  {
    title: 'Profile',
    href: '/settings',
    icon: UserIcon,
  },
];

function SettingsPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser?.uid) return;

      try {
        setIsLoading(true);
        const userData = await userService.getUser(currentUser.uid);
        if (userData) {
          setDisplayName(userData.displayName || '');
          setEmail(userData.email || '');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleSaveProfile = async () => {
    if (!currentUser?.uid) return;

    try {
      setIsSaving(true);
      await userService.updateUser(currentUser.uid, {
        displayName,
        email,
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <div
        className={cn(
          'w-full md:w-64 border-r bg-background transition-all duration-300 ease-in-out',
          isCollapsed ? 'md:w-20' : 'md:w-64'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2
            className={cn(
              'text-lg font-semibold',
              isCollapsed ? 'hidden' : 'block'
            )}
          >
            Settings
          </h2>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-md hover:bg-accent"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            {settingsNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 p-2 rounded-md text-sm font-medium',
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                      isCollapsed ? 'justify-center' : 'px-3'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className={cn(isCollapsed ? 'hidden' : 'block')}>
                      {item.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <SettingsIcon className="h-6 w-6" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        <Separator />

        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Profile</h2>
            </div>
            <div className="space-y-3 pl-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="displayName"
                    className="block text-xs font-medium mb-1"
                  >
                    Display Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border rounded-md"
                    placeholder="Enter your display name"
                    disabled={isLoading || isSaving}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border rounded-md"
                    placeholder="your.email@example.com"
                    disabled={isLoading || isSaving}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSaveProfile}
                  disabled={isLoading || isSaving}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Preferences</h2>
            </div>
            <div className="space-y-4 pl-6">
              <ThemeToggle />
            </div>
          </div>

          <Separator />

          <div className="pt-3 flex justify-end">
            <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
