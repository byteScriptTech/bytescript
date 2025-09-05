import { Badge } from '@/components/ui/badge';

interface PatternCategoriesProps {
  categories: string;
}

export function PatternCategories({ categories }: PatternCategoriesProps) {
  if (!categories) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2" data-testid="pattern-categories">
      {categories
        .split(',')
        .map((cat) => cat.trim())
        .filter(Boolean)
        .map((category) => (
          <Badge
            key={category}
            variant="secondary"
            className="text-sm"
            data-testid="pattern-category"
          >
            {category}
          </Badge>
        ))}
    </div>
  );
}
