'use client';

import { Database, Code, BookOpen, Users } from 'lucide-react';
import Link from 'next/link';

import AuthGuard from '@/components/misc/authGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthProvider } from '@/context/AuthContext';
import { ContentProvider } from '@/context/ContentContext';
import { LanguagesProvider } from '@/context/LanguagesContext';
import { LocalStorageProvider } from '@/context/LocalhostContext';

export default function AdminDashboard() {
  const stats = [
    {
      title: 'Data Structures',
      value: '24',
      icon: Database,
      href: '/admin/data-structures',
    },
    {
      title: 'Algorithms',
      value: '45',
      icon: Code,
      href: '/admin/algorithms',
    },
    {
      title: 'Problems',
      value: '128',
      icon: BookOpen,
      href: '/admin/problems',
    },
    {
      title: 'Active Users',
      value: '1.2K',
      icon: Users,
      href: '/admin/users',
    },
  ];

  return (
    <AuthProvider>
      <AuthGuard requireAuth={true}>
        <ContentProvider>
          <LocalStorageProvider>
            <LanguagesProvider>
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Dashboard
                  </h1>
                  <p className="text-muted-foreground">
                    Welcome back! Here&apos;s what&apos;s happening with your
                    platform.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {stats.map((stat) => (
                    <Link key={stat.title} href={stat.href}>
                      <Card className="hover:bg-accent/10 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            {stat.title}
                          </CardTitle>
                          <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{stat.value}</div>
                          <p className="text-xs text-muted-foreground">
                            View all {stat.title.toLowerCase()}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </LanguagesProvider>
          </LocalStorageProvider>
        </ContentProvider>
      </AuthGuard>
    </AuthProvider>
  );
}
