import React from 'react';

interface BreadcrumbsProps {
  repoLink: string;
  onCrumbClick: (path: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  repoLink,
  onCrumbClick,
}) => {
  const match = repoLink.match(/\/contents\/(.+)$/);
  const path = match ? match[1] : '';
  let crumbs = path ? path.split('/') : [];
  if (crumbs[0] === 'javascript') {
    crumbs = crumbs.slice(1);
  }

  let accumulated = '';
  return (
    <nav className="mb-4 flex items-center gap-1">
      {crumbs.map((crumb, idx) => {
        accumulated = crumbs.slice(0, idx + 1).join('/');
        return (
          <React.Fragment key={accumulated}>
            <span>/</span>
            <button
              className="text-blue-600 hover:underline"
              onClick={() => onCrumbClick(accumulated)}
            >
              {crumb}
            </button>
          </React.Fragment>
        );
      })}
    </nav>
  );
};
