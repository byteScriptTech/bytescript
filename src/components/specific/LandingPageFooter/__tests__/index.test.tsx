import { render, screen } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import LandingPageFooter from '../index';

describe('LandingPageFooter', () => {
  it('renders copyright text with current year', () => {
    const currentYear = new Date().getFullYear();
    render(<LandingPageFooter />);

    expect(
      screen.getByText(`© ${currentYear} BiteScript. All rights reserved.`)
    ).toBeInTheDocument();
  });

  it('has proper styling classes', () => {
    render(<LandingPageFooter />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass(
      'flex',
      'justify-center',
      'bg-muted/50',
      'border-t',
      'border-border'
    );

    // Add a test id to the container div in the component
    const container = footer.querySelector(
      'div[data-testid="footer-container"]'
    );
    expect(container).toHaveClass('max-w-[960px]', 'flex-1', 'flex-col');
  });

  it('has proper padding and spacing', () => {
    render(<LandingPageFooter />);

    const container = screen.getByRole('contentinfo').querySelector('div');
    const innerContainer = container?.querySelector('div');
    expect(innerContainer).toHaveClass('gap-6', 'px-5', 'py-10', 'text-center');
  });

  it('renders text with correct styling', () => {
    render(<LandingPageFooter />);

    const text = screen.getByText(/All rights reserved/);
    expect(text).toHaveClass(
      'text-muted-foreground',
      'text-base',
      'font-normal',
      'leading-normal'
    );
  });
});
