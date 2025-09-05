import { render, screen, fireEvent } from '@testing-library/react';

import { PatternPageClient } from './PatternPageClient';

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
  it('should render children and the draggable circle', () => {
    render(
      <PatternPageClient>
        <div>Child Content</div>
      </PatternPageClient>
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
      <PatternPageClient>
        <div>Child Content</div>
      </PatternPageClient>
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
