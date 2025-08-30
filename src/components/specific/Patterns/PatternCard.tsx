import Link from 'next/link';
import { ReactNode } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PatternCardProps {
  title: string;
  description: string;
  href: string;
  icon?: ReactNode;
  basePath?: string;
}

export const PatternCard = ({
  title,
  description,
  href,
  icon,
  basePath = '/competitive-programming/patterns',
}: PatternCardProps) => {
  return (
    <Link href={`${basePath}${href}`} className="block h-full">
      <Card className="h-full transition-all hover:shadow-md">
        <CardHeader className="pb-3">
          {icon && (
            <div className="flex items-center justify-center w-12 h-12 mb-3 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          )}
          <CardTitle className="text-lg font-semibold leading-tight">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};
