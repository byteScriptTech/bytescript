import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import { useBreadcrumbContext } from '@/context/BreadCrumbContext';

jest.mock('@/components/ui/breadcrumb', () => ({
  ...jest.requireActual('@/components/ui/breadcrumb'),
  BreadcrumbLink: ({ onClick, children, ...props }: any) => {
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      onClick(e);
    };
    return (
      <button {...props} onClick={handleClick}>
        {children}
      </button>
    );
  },
}));

jest.mock('next/navigation', () => {
  const useRouter = jest.fn();
  const usePathname = jest.fn();
  const useSearchParams = jest.fn();

  return {
    useRouter,
    usePathname,
    useSearchParams,
  };
});

jest.mock('@/context/BreadCrumbContext', () => {
  const useBreadcrumbContext = jest.fn();
  return { useBreadcrumbContext };
});

import LearnScreenBreadCrumb from './index';

describe('LearnScreenBreadCrumb', () => {
  let mockRouter: { push: jest.Mock };
  let mockRemoveItem: jest.Mock;
  let mockData: { id: string; name: string }[];

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(() => Promise.resolve()),
    };
    mockRemoveItem = jest.fn();
    mockData = [
      { id: '1', name: 'Topic 1' },
      { id: '2', name: 'Topic 2' },
    ];

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (usePathname as jest.Mock).mockReturnValue(
      '/learn/javascript?name=Topic 1&id=1'
    );
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => {
        if (key === 'name') return 'Topic 1';
        if (key === 'id') return '1';
        return null;
      },
    });

    (useBreadcrumbContext as jest.Mock).mockReturnValue({
      data: mockData,
      removeItem: mockRemoveItem,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls router.push when dashboard link is clicked', () => {
    const { getByTestId } = render(<LearnScreenBreadCrumb />);
    const dashboardLink = getByTestId('dashboard-link');
    fireEvent.click(dashboardLink.closest('button')!);
    expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
  });

  it('renders breadcrumb items from context', () => {
    const { getByText } = render(<LearnScreenBreadCrumb />);
    expect(getByText('Topic 1')).toBeInTheDocument();
    expect(getByText('Topic 2')).toBeInTheDocument();
  });

  it('calls removeItem and navigates when non-last breadcrumb item is clicked', async () => {
    const { getByTestId } = render(<LearnScreenBreadCrumb />);
    const breadcrumb = getByTestId('breadcrumb-1');
    fireEvent.click(breadcrumb.closest('button')!);
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/learn?name=Topic 1&id=1');
      expect(mockRemoveItem).toHaveBeenCalledWith('1');
    });
  });

  it('renders last breadcrumb as non-clickable page element', () => {
    const { getByText } = render(<LearnScreenBreadCrumb />);
    const lastItem = getByText('Topic 2');
    expect(lastItem.closest('button')).not.toBeInTheDocument();
  });
});
