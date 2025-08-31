import { Plus, Search } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { patternService } from '@/services/patternService';

export default async function PatternsPage() {
  const patterns = await patternService.getPatterns();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Patterns</h2>
          <p className="text-muted-foreground">
            Manage coding patterns and their details
          </p>
        </div>
        <Link href="/admin/patterns/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New Pattern
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search patterns..."
              className="w-full bg-background pl-8"
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patterns.map((pattern) => (
              <TableRow key={pattern.id}>
                <TableCell className="font-medium">{pattern.title}</TableCell>
                <TableCell>{pattern.category || '-'}</TableCell>
                <TableCell>{pattern.slug}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/patterns/edit/${pattern.id}`}>
                        Edit
                      </Link>
                    </Button>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
