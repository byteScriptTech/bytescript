import { render } from '@testing-library/react';

import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders empty state with title', () => {
    const { getByText } = render(<EmptyState />);
    expect(getByText('Select a topic')).toBeInTheDocument();
  });

  it('renders inbox icon', () => {
    const { container } = render(<EmptyState />);
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});
