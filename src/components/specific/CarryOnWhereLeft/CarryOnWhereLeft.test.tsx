import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';

import { useLanguages } from '@/context/LanguagesContext';
import { useLocalStorage } from '@/context/LocalhostContext';

import CarryOnWhereLeft from './index';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/context/LocalhostContext', () => ({
  useLocalStorage: jest.fn(() => ({
    getItem: jest.fn(),
  })),
}));

jest.mock('@/context/LanguagesContext', () => ({
  useLanguages: jest.fn(() => ({
    learningProgress: null,
    getUserLearningProgress: jest.fn(),
  })),
}));

describe('CarryOnWhereLeft', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockLocalStorage = {
    getItem: jest.fn(),
  };

  const mockLearningProgress = {
    topics: [
      { id: '1', isCompleted: false },
      { id: '2', isCompleted: true },
      { id: '3', isCompleted: false },
    ],
    progress: 33.33,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useLocalStorage as jest.Mock).mockReturnValue({
      getItem: mockLocalStorage.getItem,
    });
    (useLanguages as jest.Mock).mockReturnValue({
      learningProgress: mockLearningProgress,
      getUserLearningProgress: jest.fn(),
    });
  });

  describe('when no language is selected', () => {
    it('should render empty state with inbox icon', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'lvl_name') return null;
        return null;
      });

      render(<CarryOnWhereLeft />);

      expect(screen.getByText('Select a topic')).toBeInTheDocument();
      const icon = screen.getByRole('img');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('when language is selected', () => {
    beforeEach(() => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'lvl_name') return 'javascript';
        if (key === 'lvt_name') return 'basics';
        if (key === 'lvt') return 'basics';
        if (key === 'lvt_sub') return 'variables';
        return null;
      });
    });

    it('should display language name', () => {
      render(<CarryOnWhereLeft />);
      expect(screen.getByText('JAVASCRIPT')).toBeInTheDocument();
    });

    it('should display time left correctly', () => {
      render(<CarryOnWhereLeft />);
      expect(screen.getByText('⏳ Time left to complete:')).toBeInTheDocument();
      expect(screen.getByText('20 minutes')).toBeInTheDocument();
    });

    it('should display progress bar with correct value', () => {
      render(<CarryOnWhereLeft />);
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveAttribute('aria-valuenow', '33.33');
    });

    it('should handle resume learning click', () => {
      render(<CarryOnWhereLeft />);

      const resumeButton = screen.getByRole('button', {
        name: /resume learning/i,
      });
      fireEvent.click(resumeButton);

      expect(mockRouter.push).toHaveBeenCalledWith('basics&lvt_sub=variables');
    });

    it('should show last visited topic', () => {
      render(<CarryOnWhereLeft />);

      expect(
        screen.getByText('Continue with your last topic: basics')
      ).toBeInTheDocument();
    });
  });
});
