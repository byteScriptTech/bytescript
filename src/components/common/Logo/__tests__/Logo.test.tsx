import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Logo from '../index';

describe('Logo component', () => {
  it('renders correctly', () => {
    render(<Logo />);

    expect(screen.getByText('bite')).toBeInTheDocument();
    expect(screen.getByText('Script.')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveClass('flex', 'items-center');
  });

  it('links to home page', () => {
    render(<Logo />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('has correct text styling', () => {
    render(<Logo />);

    const biteText = screen.getByText('bite');
    const scriptText = screen.getByText('Script.');

    expect(biteText).toHaveClass('text-black', 'text-base', 'font-bold');
    expect(scriptText).toHaveClass('text-[#00BFA6]', 'text-xl', 'font-bold');
  });

  it('is visible on all screen sizes', () => {
    // Test the logo
    const { container } = render(<Logo />);

    // Verify the text is visible
    expect(container).toHaveTextContent('bite');
    expect(container).toHaveTextContent('Script.');

    // Verify the link has proper classes
    const link = screen.getByRole('link');
    expect(link).toHaveClass('flex', 'items-center', 'gap-1');
  });
});
