import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';

// Mock react-resizable-panels
jest.mock('react-resizable-panels', () => ({
  Panel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="panel">{children}</div>
  ),
  PanelGroup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="panel-group">{children}</div>
  ),
  PanelResizeHandle: ({ className }: { className?: string }) => (
    <div data-testid="panel-resize-handle" className={className} />
  ),
}));

// Mock Pyodide
const mockPyodide = {
  runPythonAsync: jest.fn().mockResolvedValue(undefined),
  runPython: jest.fn(),
  loadPackagesFromImports: jest.fn().mockResolvedValue(undefined),
};

window.loadPyodide = jest.fn().mockResolvedValue(mockPyodide);

import { PythonCodeEditor } from './PythonCodeEditor';

describe('PythonCodeEditor', () => {
  const defaultProps = {
    initialCode: 'print("Hello, World!")',
    onCodeChange: jest.fn(),
  };

  let renderResult: ReturnType<typeof render>;

  // Helper function to get the code editor textarea
  const getCodeTextarea = (
    container: HTMLElement = document.body
  ): HTMLTextAreaElement => {
    const textareas = Array.from(container.querySelectorAll('textarea'));
    const textarea = textareas.find(
      (ta) => !ta.placeholder?.includes('algorithm')
    );
    if (!textarea) throw new Error('Code textarea not found');
    return textarea as HTMLTextAreaElement;
  };

  // Setup before each test
  beforeEach(() => {
    jest.clearAllMocks();
    renderResult = render(<PythonCodeEditor {...defaultProps} />);
  });

  // Cleanup after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Initial Rendering', () => {
    it('renders without crashing', () => {
      expect(getCodeTextarea()).toBeInTheDocument();
    });

    it('displays initial code', () => {
      expect(getCodeTextarea()).toHaveValue(defaultProps.initialCode);
    });

    it('displays loading state when Pyodide is loading', () => {
      expect(screen.getByText('Loading Python runtime...')).toBeInTheDocument();
    });
  });

  describe('Code Editing', () => {
    it('calls onCodeChange when code is modified', async () => {
      const newCode = 'print("Updated")';
      const textarea = getCodeTextarea();

      await act(async () => {
        fireEvent.change(textarea, { target: { value: newCode } });
      });

      expect(defaultProps.onCodeChange).toHaveBeenCalledWith(newCode);
    });

    it('handles tab key press', async () => {
      const initialCode = "print('Hello, World!')";
      renderResult = render(
        <PythonCodeEditor {...defaultProps} initialCode={initialCode} />
      );
      const textarea = getCodeTextarea(renderResult.container);

      // Set cursor position to the start
      textarea.setSelectionRange(0, 0);

      // Simulate tab key press
      await act(async () => {
        fireEvent.keyDown(textarea, {
          key: 'Tab',
          keyCode: 9,
          which: 9,
          preventDefault: () => {},
        });
      });

      // Verify the code was updated with proper indentation
      expect(defaultProps.onCodeChange).toHaveBeenCalledWith(
        `    ${initialCode}`
      );
    });
  });

  describe('Algorithm Section', () => {
    it('shows algorithm section when showAlgorithm is true', () => {
      const placeholder = 'Write your algorithm or notes here...';

      // Rerender with showAlgorithm true
      renderResult.rerender(
        <PythonCodeEditor {...defaultProps} showAlgorithm={true} />
      );

      expect(
        screen.getByPlaceholderText(`# ${placeholder}`)
      ).toBeInTheDocument();
    });

    it('hides algorithm section when showAlgorithm is false', () => {
      const placeholder = 'Write your algorithm or notes here...';

      // Rerender with showAlgorithm false
      renderResult.rerender(
        <PythonCodeEditor {...defaultProps} showAlgorithm={false} />
      );

      expect(
        screen.queryByPlaceholderText(`# ${placeholder}`)
      ).not.toBeInTheDocument();
    });
  });

  describe('Panel Structure', () => {
    it('renders panel structure correctly', () => {
      const panelGroups = screen.getAllByTestId('panel-group');
      const panels = screen.getAllByTestId('panel');
      const resizeHandles = screen.getAllByTestId('panel-resize-handle');

      expect(panelGroups.length).toBeGreaterThan(0);
      expect(panels.length).toBeGreaterThan(0);
      expect(resizeHandles.length).toBeGreaterThan(0);
    });
  });
});
