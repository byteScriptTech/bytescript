import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import LandingPageHeader from '../index';

describe('LandingPageHeader', () => {
  const mockHandleExploreByteScriptClick = jest.fn();

  beforeEach(() => {
    render(
      <LandingPageHeader
        handleExploreByteScriptClick={mockHandleExploreByteScriptClick}
      />
    );
  });

  it('renders menu items in desktop view', () => {
    const menuContainer = screen.getByTestId('header-menu');
    expect(menuContainer).toBeInTheDocument();

    const menuItems = menuContainer.querySelectorAll('a');
    expect(menuItems.length).toBe(4);

    const learnLink = menuItems[0];
    expect(learnLink).toBeInTheDocument();
    expect(learnLink).toHaveAttribute('href', '/learn');
    expect(learnLink).toHaveTextContent(/learn/i);

    const practiceLink = menuItems[1];
    expect(practiceLink).toBeInTheDocument();
    expect(practiceLink).toHaveAttribute('href', '/practice');
    expect(practiceLink).toHaveTextContent(/practice/i);

    const competitiveLink = menuItems[2];
    expect(competitiveLink).toBeInTheDocument();
    expect(competitiveLink).toHaveAttribute('href', '/competitive-programming');
    expect(competitiveLink).toHaveTextContent(/competitive/i);

    const playgroundLink = menuItems[3];
    expect(playgroundLink).toBeInTheDocument();
    expect(playgroundLink).toHaveAttribute('href', '/editor');
    expect(playgroundLink).toHaveTextContent(/playground/i);
  });

  it('renders get started button with correct styling', () => {
    const getStartedBtn = screen
      .getByTestId('header-container')
      .querySelector('button') as HTMLElement;
    expect(getStartedBtn).toBeInTheDocument();
    expect(getStartedBtn).toHaveClass('bg-[#00BFA6]', 'hover:bg-[#00A38C]');
    expect(getStartedBtn).toHaveClass('text-white');

    // Test button click
    fireEvent.click(getStartedBtn);
    expect(mockHandleExploreByteScriptClick).toHaveBeenCalled();
  });

  it('handles mobile menu toggle', () => {
    // Test mobile menu button
    const mobileMenuBtn = screen.getByTestId('mobile-menu-toggle');
    expect(mobileMenuBtn).toBeInTheDocument();

    // Initially menu should be closed
    const mobileMenu = screen.getByTestId('mobile-menu');
    expect(mobileMenu).toBeInTheDocument();
    expect(mobileMenu).toHaveClass('-translate-y-full');

    // Click to open menu
    fireEvent.click(mobileMenuBtn);
    expect(mobileMenu).toHaveClass('translate-y-0');

    // Click again to close menu
    fireEvent.click(mobileMenuBtn);
    expect(mobileMenu).toHaveClass('-translate-y-full');
  });
});
