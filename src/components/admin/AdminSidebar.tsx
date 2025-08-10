'use client';

import { Home, Database, BookOpen, Settings, Users, Code } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    {
      name: 'Data Structures',
      href: '/admin/dsa',
      icon: Database,
    },
    {
      name: 'Python',
      href: '/admin/python',
      icon: Code,
    },
    { name: 'Problems', href: '/admin/problems', icon: BookOpen },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">biteScript Admin</h1>
      </div>
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
