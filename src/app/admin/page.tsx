'use client';

import { Database, BookOpen, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dsaService } from '@/services/firebase/dsaService';

interface StatCard {
  title: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
  href: string;
  loading?: boolean;
}

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [dataStructures, setDataStructures] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topics = await dsaService.getAllTopics();
        setDataStructures(topics);
      } catch (error) {
        console.error('Error fetching data structures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats: StatCard[] = [
    {
      title: 'Data Structures & Algorithms',
      value: loading ? '...' : dataStructures?.length || 0,
      icon: Database,
      href: '/admin/dsa',
      loading,
    },
    {
      title: 'Problems',
      value: '0',
      icon: BookOpen,
      href: '/admin/problems',
      loading: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your application content and settings
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:bg-accent/10 transition-colors h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                {stat.loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stat.loading ? (
                    <div className="h-8 w-12 animate-pulse rounded bg-muted" />
                  ) : (
                    stat.value
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  View all {stat.title.toLowerCase()}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return <AdminDashboard />;
}
