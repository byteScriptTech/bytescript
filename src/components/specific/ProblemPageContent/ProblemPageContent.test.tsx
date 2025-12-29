import { render, screen, waitFor } from '@testing-library/react';

// Mock dependencies
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    warning: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock('@/services/firebase/problemsService', () => ({
  problemsService: {
    getProblemById: jest.fn(),
  },
}));

jest.mock('@/services/firebase/testCasesService', () => ({
  testCasesService: {
    getTestCasesByProblemId: jest.fn(),
  },
}));

// Mock other dependencies
jest.mock('@/components/common/Markdown', () => ({
  __esModule: true,
  default: ({ content }: { content: string }) => (
    <div data-testid="markdown">{content}</div>
  ),
}));

jest.mock('@/components/specific/ProblemEditor', () => ({
  __esModule: true,
  default: () => <div data-testid="problem-editor">Problem Editor</div>,
}));

jest.mock('@/components/specific/ProblemDetail', () => ({
  __esModule: true,
  default: () => <div data-testid="problem-detail">Problem Detail</div>,
}));

const mockUseParams = jest.fn();
const mockUseAuth = jest.fn();

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: () => mockUseParams(),
}));

// Mock auth context
jest.mock('@/hooks/useAuthRedux', () => ({
  useAuthRedux: () => mockUseAuth(),
}));

import ProblemPageContent from '.';

describe('ProblemPageContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseParams.mockReturnValue({ problemId: 'test-problem' });
    mockUseAuth.mockReturnValue({
      currentUser: { uid: 'test-user' },
    });
  });

  it('renders loading state initially', async () => {
    render(<ProblemPageContent />);

    // Check if the loading text is shown
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // Verify the problem fetch was initiated
    expect(
      require('@/services/firebase/problemsService').problemsService
        .getProblemById
    ).toHaveBeenCalledTimes(1);
    expect(
      require('@/services/firebase/problemsService').problemsService
        .getProblemById
    ).toHaveBeenCalledWith('test-problem');

    // Wait for the async effect to finish to avoid act(...) warning
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
  });

  it('fetches and displays problem data', async () => {
    // Mock the problem data
    const mockProblem = {
      id: 'test-problem',
      title: 'Test Problem',
      description: 'Test description',
      difficulty: 'Medium',
      category: 'Array',
      constraints: ['1 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
      examples: [
        {
          input: 'nums = [2,7,11,15], target = 9',
          output: '[0,1]',
          explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1]',
        },
      ],
      starterCode: 'function solve() {}',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Mock the test cases
    const mockTestCases = [
      {
        id: 'test1',
        input: 'nums = [2,7,11,15], target = 9',
        expectedOutput: '[0,1]',
        isPublic: true,
      },
    ];

    // Set up the mocks
    require('@/services/firebase/problemsService').problemsService.getProblemById.mockResolvedValueOnce(
      mockProblem
    );
    require('@/services/firebase/testCasesService').testCasesService.getTestCasesByProblemId.mockResolvedValueOnce(
      mockTestCases
    );

    render(<ProblemPageContent />);

    // Wait for the loading to finish and the component to update
    await waitFor(() => {
      expect(screen.queryByText('Loading problem...')).not.toBeInTheDocument();
    });

    // Check that the main components are rendered
    expect(screen.getByTestId('problem-detail')).toBeInTheDocument();
    expect(screen.getByTestId('problem-editor')).toBeInTheDocument();
  });

  it('shows error when problem is not found', async () => {
    require('@/services/firebase/problemsService').problemsService.getProblemById.mockResolvedValueOnce(
      null
    );

    render(<ProblemPageContent />);

    // Wait for the loading to finish and the error to be shown
    await waitFor(() => {
      expect(screen.queryByText('Loading problem...')).not.toBeInTheDocument();
    });

    // Check that the error was toasted and the message is displayed
    expect(require('sonner').toast.error).toHaveBeenCalledTimes(1);
    expect(require('sonner').toast.error).toHaveBeenCalledWith(
      'Problem not found'
    );
    expect(screen.getByText('Problem not found')).toBeInTheDocument();
  });

  it('handles error when fetching problem data fails', async () => {
    const error = new Error('Network error');
    // Suppress console.error for this test
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    require('@/services/firebase/problemsService').problemsService.getProblemById.mockRejectedValueOnce(
      error
    );

    render(<ProblemPageContent />);

    // Wait for the loading to finish and the error to be shown
    await waitFor(() => {
      expect(screen.queryByText('Loading problem...')).not.toBeInTheDocument();
    });

    // Check that the error was toasted
    expect(require('sonner').toast.error).toHaveBeenCalledTimes(1);
    expect(require('sonner').toast.error).toHaveBeenCalledWith('Network error');

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  it('displays warning when test cases cannot be loaded', async () => {
    // Suppress console.error for this test
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    // Mock successful problem fetch but failed test cases fetch
    require('@/services/firebase/problemsService').problemsService.getProblemById.mockResolvedValueOnce(
      {
        id: 'test-problem',
        title: 'Test Problem',
        description: 'Test description',
        difficulty: 'Medium',
        category: 'Array',
        constraints: [],
        examples: [],
        starterCode: 'function solve() {}',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );

    require('@/services/firebase/testCasesService').testCasesService.getTestCasesByProblemId.mockRejectedValueOnce(
      new Error('Failed to load')
    );

    render(<ProblemPageContent />);

    // Wait for the loading to finish and the warning to be shown
    await waitFor(() => {
      expect(screen.queryByText('Loading problem...')).not.toBeInTheDocument();
    });

    // Check that the warning was toasted
    expect(require('sonner').toast.warning).toHaveBeenCalledTimes(1);
    expect(require('sonner').toast.warning).toHaveBeenCalledWith(
      'Failed to load test cases'
    );

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
