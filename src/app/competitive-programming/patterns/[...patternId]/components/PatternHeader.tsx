import { Cpu } from 'lucide-react';

interface PatternHeaderProps {
  title: string;
  description: string;
}

export function PatternHeader({ title, description }: PatternHeaderProps) {
  return (
    <div
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
      data-testid="pattern-header"
    >
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div
            className="p-2 rounded-lg bg-primary/10 text-primary"
            data-testid="pattern-icon"
          >
            <Cpu className="h-6 w-6" data-testid="cpu-icon" />
          </div>
          <h1
            className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            data-testid="pattern-title"
          >
            {title}
          </h1>
        </div>
        <p
          className="text-muted-foreground text-lg"
          data-testid="pattern-description"
        >
          {description}
        </p>
      </div>
    </div>
  );
}
