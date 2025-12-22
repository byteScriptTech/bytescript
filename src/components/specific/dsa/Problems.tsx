'use client';

import React from 'react';

interface ProblemsProps {
  topic: string;
}

export function Problems({ topic: _topic }: ProblemsProps) {
  return (
    <div className="text-center py-12 border rounded-lg">
      <p className="text-muted-foreground">
        No practice problems available for this topic yet.
      </p>
    </div>
  );
}
