import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';

import { PatternPageClient } from './PatternPageClient';

// Mock Firebase config
jest.mock('@/firebase/config', () => ({
  auth: {
    currentUser: null,
  },
  db: {},
}));

// Mock Redux hooks
jest.mock('@/store/slices/problemsSlice', () => ({
  useGetAllProblemsQuery: () => ({
    data: [],
    isLoading: false,
  }),
  problemsApi: {
    reducerPath: 'problemsApi',
    reducer: (state = {}) => state,
    middleware: () => (next: any) => (action: any) => next(action),
  },
}));

// Create a test store
const testStore = configureStore({
  reducer: {
    problemsApi: (state = {}) => state,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// Mock child components to isolate the PatternPageClient component
jest.mock('@/components/ui/DraggableCircle', () => ({
  DraggableCircle: ({ onClick }: { onClick: () => void }) => (
    <button data-testid="draggable-circle" onClick={onClick}>
      Toggle Editor
    </button>
  ),
}));

jest.mock('@/components/editor/DraggableEditor', () => ({
  DraggableEditor: ({ onClose }: { onClose?: () => void }) => (
    <div data-testid="draggable-editor">
      <span>Draggable Editor</span>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

// Mock next/dynamic to handle the dynamically imported editor
jest.mock('next/dynamic', () => () => {
  const { DraggableEditor } = require('@/components/editor/DraggableEditor');
  return DraggableEditor;
});

describe('PatternPageClient', () => {
  const mockPattern = {
    slug: 'two-pointers',
    title: 'Two Pointers',
    description: 'Two pointers pattern',
  };

  it('should render children and the draggable circle', () => {
    render(
      <Provider store={testStore}>
        <PatternPageClient pattern={mockPattern}>
          <div>Child Content</div>
        </PatternPageClient>
      </Provider>
    );

    // Check that the child content is rendered
    expect(screen.getByText('Child Content')).toBeInTheDocument();

    // Check that the draggable circle is rendered
    expect(screen.getByTestId('draggable-circle')).toBeInTheDocument();

    // The editor should not be visible initially
    expect(screen.queryByTestId('draggable-editor')).not.toBeInTheDocument();
  });

  it('should toggle the editor visibility when the circle is clicked', () => {
    render(
      <Provider store={testStore}>
        <PatternPageClient pattern={mockPattern}>
          <div>Child Content</div>
        </PatternPageClient>
      </Provider>
    );

    const circleButton = screen.getByTestId('draggable-circle');

    // Editor should not be visible initially
    expect(screen.queryByTestId('draggable-editor')).not.toBeInTheDocument();

    // Click the circle to show the editor
    fireEvent.click(circleButton);
    expect(screen.getByTestId('draggable-editor')).toBeInTheDocument();

    // Click the circle again to hide the editor
    fireEvent.click(circleButton);
    expect(screen.queryByTestId('draggable-editor')).not.toBeInTheDocument();
  });
});
