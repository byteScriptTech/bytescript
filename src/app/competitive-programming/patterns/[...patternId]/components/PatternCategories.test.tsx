import { render, screen } from '@testing-library/react';

import { PatternCategories } from './PatternCategories';

describe('PatternCategories', () => {
  it('renders categories as badges', () => {
    const testCategories = 'Test Category 1, Test Category 2';
    const categoryList = testCategories.split(',').map((cat) => cat.trim());

    render(<PatternCategories categories={testCategories} />);
    const container = screen.getByTestId('pattern-categories');
    expect(container).toBeInTheDocument();

    const badges = screen.getAllByTestId('pattern-category');
    expect(badges).toHaveLength(categoryList.length);
    categoryList.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it('does not render when categories is null', () => {
    // @ts-ignore - Testing null case
    const { container } = render(<PatternCategories categories={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('handles empty categories string', () => {
    const { container } = render(<PatternCategories categories="" />);
    expect(container).toBeEmptyDOMElement();
  });
});
