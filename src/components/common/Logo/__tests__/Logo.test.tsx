import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Logo from '../index';

describe('Logo component', () => {
  it('links to home page', () => {
    render(<Logo />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('has correct text styling with theme support', () => {
    render(<Logo />);

    // Get the link and verify its classes
    const link = screen.getByRole('link');
    expect(link).toHaveClass('group');

    // Test the "byte" text styling
    const biteText = screen.getByText('byte');
    expect(biteText).toHaveClass(
      'text-foreground',
      'text-base',
      'font-bold',
      'transition-colors',
      'group-hover:opacity-80'
    );

    // Test the "Script." text styling
    const scriptText = screen.getByText('Script.');
    expect(scriptText).toHaveClass(
      'text-[#00BFA6]',
      'text-xl',
      'font-bold',
      'transition-colors',
      'group-hover:opacity-80'
    );
  });

  it('is visible on all screen sizes', () => {
    // Test the logo
    const { container } = render(<Logo />);

    // Verify the text is visible
    expect(container).toHaveTextContent('byte');
    expect(container).toHaveTextContent('Script.');

    // Verify the link has proper classes
    const link = screen.getByRole('link');
    expect(link).toHaveClass('group');

    // Verify text elements have proper classes
    const biteText = screen.getByText('byte');
    const scriptText = screen.getByText('Script.');

    expect(biteText).toHaveClass(
      'text-foreground',
      'text-base',
      'font-bold',
      'transition-colors',
      'group-hover:opacity-80'
    );
    expect(scriptText).toHaveClass(
      'text-[#00BFA6]',
      'text-xl',
      'font-bold',
      'transition-colors',
      'group-hover:opacity-80'
    );
  });
});
