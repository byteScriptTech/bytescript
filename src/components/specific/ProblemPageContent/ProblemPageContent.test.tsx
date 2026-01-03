import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';

// Mock dependencies
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    warning: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock('@/services/firebase/testCasesService', () => ({
  testCasesService: {
    getTestCasesByProblemId: jest.fn(),
  },
}));

jest.mock('@/firebase/config', () => ({
  db: {},
  auth: {
    currentUser: null,
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

// Mock Redux hooks
jest.mock('@/hooks/useProblemsRedux', () => ({
  useProblemsRedux: () => ({
    getProblemByIdWithFallback: (id: string, queryResult: any) => {
      // Handle undefined queryResult
      if (!queryResult) {
        return {
          isLoading: false,
          data: undefined,
          isError: true,
        };
      }
      // If problem not found, return a fallback
      if (queryResult.isError && !queryResult.data) {
        return {
          ...queryResult,
          data: {
            id: 'fallback',
            title: 'Problem Not Found',
            description:
              'This problem could not be found. It may have been moved or deleted.',
            difficulty: 'Easy' as const,
            category: 'General',
            constraints: [],
            examples: [],
            starterCode: '',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          isError: false,
        };
      }
      return queryResult;
    },
  }),
}));

const mockUseGetProblemByIdQuery = jest.fn();

jest.mock('@/store/slices/problemsSlice', () => ({
  useGetProblemByIdQuery: () => mockUseGetProblemByIdQuery(),
  problemsApi: {
    reducerPath: 'problemsApi',
    reducer: (state = {}) => state,
    middleware: () => (next: any) => (action: any) => next(action),
  },
}));

// Mock all other API slices
jest.mock('@/store/slices/authSlice', () => ({
  authSlice: {
    reducer: (state = {}) => state,
  },
}));

jest.mock('@/store/slices/timerSlice', () => ({
  __esModule: true,
  default: (state = {}) => state,
}));

jest.mock('@/store/slices/notesSlice', () => ({
  notesApi: {
    reducerPath: 'notesApi',
    reducer: (state = {}) => state,
    middleware: () => (next: any) => (action: any) => next(action),
  },
}));

jest.mock('@/store/slices/contentSlice', () => ({
  contentApi: {
    reducerPath: 'contentApi',
    reducer: (state = {}) => state,
    middleware: () => (next: any) => (action: any) => next(action),
  },
}));

jest.mock('@/store/slices/languagesSlice', () => ({
  languagesApi: {
    reducerPath: 'languagesApi',
    reducer: (state = {}) => state,
    middleware: () => (next: any) => (action: any) => next(action),
  },
}));

jest.mock('@/store/slices/dsaTopicsSlice', () => ({
  dsaTopicsApi: {
    reducerPath: 'dsaTopicsApi',
    reducer: (state = {}) => state,
    middleware: () => (next: any) => (action: any) => next(action),
  },
}));

jest.mock('@/store/slices/javascriptSlice', () => ({
  javascriptApi: {
    reducerPath: 'javascriptApi',
    reducer: (state = {}) => state,
    middleware: () => (next: any) => (action: any) => next(action),
  },
}));

jest.mock('@/store/slices/practiceQuestionsSlice', () => ({
  practiceQuestionsApi: {
    reducerPath: 'practiceQuestionsApi',
    reducer: (state = {}) => state,
    middleware: () => (next: any) => (action: any) => next(action),
  },
}));

jest.mock('@/store/slices/practiceTopicsSlice', () => ({
  practiceTopicsApi: {
    reducerPath: 'practiceTopicsApi',
    reducer: (state = {}) => state,
    middleware: () => (next: any) => (action: any) => next(action),
  },
}));

jest.mock('@/store/slices/customTestsSlice', () => ({
  customTestsApi: {
    reducerPath: 'customTestsApi',
    reducer: (state = {}) => state,
    middleware: () => (next: any) => (action: any) => next(action),
  },
}));

import ProblemPageContent from '.';

// Create a test store
const testStore = configureStore({
  reducer: {
    auth: (state = {}) => state,
    timer: (state = {}) => state,
    notesApi: (state = {}) => state,
    contentApi: (state = {}) => state,
    languagesApi: (state = {}) => state,
    dsaTopicsApi: (state = {}) => state,
    javascriptApi: (state = {}) => state,
    practiceQuestionsApi: (state = {}) => state,
    practiceTopicsApi: (state = {}) => state,
    problemsApi: (state = {}) => state,
    customTestsApi: (state = {}) => state,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

describe('ProblemPageContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseParams.mockReturnValue({ problemId: 'test-problem' });
    mockUseAuth.mockReturnValue({
      currentUser: { uid: 'test-user' },
    });

    mockUseGetProblemByIdQuery.mockReturnValue({
      isLoading: false,
      data: {
        id: 'test-problem',
        title: 'Test Problem',
        description: 'Test Description',
        difficulty: 'Easy',
        category: 'test',
        constraints: [],
        examples: [],
        starterCode: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      isError: false,
    });
  });

  it('renders problem detail when data is loaded', async () => {
    render(
      <Provider store={testStore}>
        <ProblemPageContent />
      </Provider>
    );

    // Wait for the component to render
    await waitFor(() => {
      expect(screen.getByTestId('problem-detail')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    render(
      <Provider store={testStore}>
        <ProblemPageContent />
      </Provider>
    );

    // Check if the loading text is shown initially
    expect(screen.getByTestId('loading')).toBeInTheDocument();
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
    mockUseGetProblemByIdQuery.mockReturnValue({
      isLoading: false,
      data: mockProblem,
      isError: false,
    });
    require('@/services/firebase/testCasesService').testCasesService.getTestCasesByProblemId.mockResolvedValueOnce(
      mockTestCases
    );

    render(
      <Provider store={testStore}>
        <ProblemPageContent />
      </Provider>
    );

    // Wait for the loading to finish and the component to update
    await waitFor(() => {
      expect(screen.queryByText('Loading problem...')).not.toBeInTheDocument();
    });

    // Check that the main components are rendered
    expect(screen.getByTestId('problem-detail')).toBeInTheDocument();
    expect(screen.getByTestId('problem-editor')).toBeInTheDocument();
  });

  it('shows error when problem is not found', async () => {
    mockUseGetProblemByIdQuery.mockReturnValue({
      isLoading: false,
      data: undefined,
      isError: true,
    });

    render(
      <Provider store={testStore}>
        <ProblemPageContent />
      </Provider>
    );

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
    // Suppress console.error for this test
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockUseGetProblemByIdQuery.mockReturnValue({
      isLoading: false,
      data: undefined,
      isError: true,
    });

    render(<ProblemPageContent />);

    // Wait for the loading to finish and the error to be shown
    await waitFor(() => {
      expect(screen.queryByText('Loading problem...')).not.toBeInTheDocument();
    });

    // Check that the error was toasted
    expect(require('sonner').toast.error).toHaveBeenCalledTimes(1);
    expect(require('sonner').toast.error).toHaveBeenCalledWith(
      'Problem not found'
    );

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  it('displays warning when test cases cannot be loaded', async () => {
    // Suppress console.error for this test
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    // Mock successful problem fetch but failed test cases fetch
    mockUseGetProblemByIdQuery.mockReturnValue({
      isLoading: false,
      data: {
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
      },
      isError: false,
    });

    require('@/services/firebase/testCasesService').testCasesService.getTestCasesByProblemId.mockRejectedValueOnce(
      new Error('Failed to load')
    );

    render(
      <Provider store={testStore}>
        <ProblemPageContent />
      </Provider>
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
