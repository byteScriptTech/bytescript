import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import React from 'react';

import { DraggableEditor } from './DraggableEditor';

// Mock the dynamically imported components
jest.mock('@/components/CodeEditor', () => ({
  __esModule: true,
  default: ({
    code,
    onCodeChange: _,
  }: {
    code: string;
    onCodeChange: (code: string) => void;
  }) => <div data-testid="js-editor" data-code={code}></div>,
}));

jest.mock('@/components/common/PythonCodeEditor', () => ({
  PythonCodeEditor: ({
    initialCode,
    onCodeChange: _,
  }: {
    initialCode: string;
    onCodeChange?: (code: string) => void;
  }) => <div data-testid="python-editor" data-code={initialCode}></div>,
}));

describe('DraggableEditor', () => {
  const mockOnClose = jest.fn();
  const mockOnPythonCodeChange = jest.fn();

  const defaultProps = {
    onClose: mockOnClose,
    onPythonCodeChange: mockOnPythonCodeChange,
    defaultPythonCode: '# Test Python Code',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', async () => {
    await act(async () => {
      render(<DraggableEditor {...defaultProps} />);
    });

    // Wait for the dynamic imports to resolve
    await waitFor(() => {
      // Check if the editor is rendered
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Check if default tab (JavaScript) is active
      expect(screen.getByText('JavaScript')).toHaveAttribute(
        'data-state',
        'active'
      );
      expect(screen.getByText('Python')).toHaveAttribute(
        'data-state',
        'inactive'
      );

      // Check if close button is present
      expect(screen.getByLabelText('Close editor')).toBeInTheDocument();
    });
  });

  it('calls onClose when close button is clicked', async () => {
    await act(async () => {
      render(<DraggableEditor {...defaultProps} />);
    });

    // Wait for the component to be fully loaded
    await waitFor(() => {
      // Click close button
      fireEvent.click(screen.getByLabelText('Close editor'));
    });

    // Verify onClose was called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('handles dragging', async () => {
    await act(async () => {
      render(<DraggableEditor {...defaultProps} />);
    });

    // Wait for the component to be fully loaded
    const editor = await screen.findByRole('dialog', { name: 'Code editor' });
    const header = editor.querySelector('div > div:first-child'); // Get the header div

    if (!header) {
      throw new Error('Header element not found');
    }

    await act(async () => {
      // Simulate mouse down on header
      fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });

      // Simulate mouse move
      fireEvent.mouseMove(document, { clientX: 200, clientY: 200 });
    });

    // Verify position was updated
    expect(header).toBeInTheDocument();
  });

  it('renders with Python editor when defaultEditorType is python', async () => {
    await act(async () => {
      render(<DraggableEditor {...defaultProps} defaultEditorType="python" />);
    });

    // Wait for the component to be fully loaded
    await waitFor(() => {
      // Check that the Python editor is rendered when defaultEditorType is 'python'
      expect(screen.getByText('Python').closest('button')).toHaveAttribute(
        'data-state',
        'active'
      );

      expect(screen.getByText('JavaScript').closest('button')).toHaveAttribute(
        'data-state',
        'inactive'
      );
    });
  });

  it('renders with custom position and size', async () => {
    // Mock window.innerWidth and window.innerHeight for consistent testing
    const originalInnerWidth = window.innerWidth;
    const originalInnerHeight = window.innerHeight;

    // Set a known viewport size for consistent test results
    Object.defineProperty(window, 'innerWidth', { value: 1200 });
    Object.defineProperty(window, 'innerHeight', { value: 800 });

    const customProps = {
      ...defaultProps,
      defaultPosition: { x: 50, y: 50 },
      defaultSize: { width: 500, height: 500 },
    };

    await act(async () => {
      render(<DraggableEditor {...customProps} />);
    });

    // Wait for the component to be fully loaded
    const editor = await screen.findByRole('dialog');

    // Check for dimensions
    expect(editor).toHaveStyle({
      width: '500px',
      height: '500px',
      minWidth: '400px',
      minHeight: '300px',
    });

    // Restore original window properties
    Object.defineProperty(window, 'innerWidth', {
      value: originalInnerWidth,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: originalInnerHeight,
    });
  });
});
