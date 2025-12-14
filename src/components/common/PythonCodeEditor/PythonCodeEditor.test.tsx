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

// Mock Monaco Editor
jest.mock('@monaco-editor/react', () => {
  return function MockMonacoEditor({ defaultValue, onChange, onMount }: any) {
    const [value, setValue] = React.useState(defaultValue);

    React.useEffect(() => {
      // Simulate editor mounting
      if (onMount) {
        const mockEditor = {
          getValue: () => value,
          setValue: (newValue: string) => {
            setValue(newValue);
            onChange?.(newValue);
          },
          onDidChangeModelContent: jest.fn(),
        };
        onMount(mockEditor);
      }
    }, [defaultValue, onChange, onMount, value]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const textarea = e.target as HTMLTextAreaElement;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue =
          value.substring(0, start) + '    ' + value.substring(end);
        setValue(newValue);
        onChange?.(newValue);

        // Set cursor position after the inserted tabs
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 4;
        }, 0);
      }
    };

    return (
      <textarea
        data-testid="monaco-editor"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange?.(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        className="monaco-editor-textarea"
      />
    );
  };
});

// Mock Pyodide
const mockPyodide = {
  runPythonAsync: jest.fn().mockResolvedValue(undefined),
  runPython: jest.fn(),
  loadPackagesFromImports: jest.fn().mockResolvedValue(undefined),
};

window.loadPyodide = jest.fn().mockResolvedValue(mockPyodide);

import { PythonCodeEditor } from '.';

describe('PythonCodeEditor', () => {
  const defaultProps = {
    initialCode: 'print("Hello, World!")',
    onCodeChange: jest.fn(),
  };

  let renderResult: ReturnType<typeof render>;

  // Helper function to get the code editor (Monaco Editor)
  const getCodeEditor = (
    container: HTMLElement = document.body
  ): HTMLTextAreaElement => {
    const editor = container.querySelector(
      '[data-testid="monaco-editor"]'
    ) as HTMLTextAreaElement;
    if (!editor) throw new Error('Code editor not found');
    return editor;
  };

  // Setup before each test
  beforeEach(async () => {
    jest.clearAllMocks();
    // Ensure Pyodide is properly mocked before each test
    window.loadPyodide = jest.fn().mockResolvedValue(mockPyodide);

    // Render the component with act to handle initial effects
    await act(async () => {
      renderResult = render(<PythonCodeEditor {...defaultProps} />);
    });
  });

  // Cleanup after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Initial Rendering', () => {
    it('renders without crashing', () => {
      expect(getCodeEditor()).toBeInTheDocument();
    });

    it('displays initial code', () => {
      expect(getCodeEditor()).toHaveValue(defaultProps.initialCode);
    });

    // Loading state is handled internally by the component
    // and doesn't display a loading message to the user
  });

  describe('Code Editing', () => {
    it('calls onCodeChange when code is modified', async () => {
      const newCode = 'print("Updated")';
      const editor = getCodeEditor();

      await act(async () => {
        fireEvent.change(editor, { target: { value: newCode } });
      });

      expect(defaultProps.onCodeChange).toHaveBeenCalledWith(newCode);
    });

    it('handles tab key press', async () => {
      const initialCode = "print('Hello, World!')";
      renderResult = render(
        <PythonCodeEditor {...defaultProps} initialCode={initialCode} />
      );
      const editor = getCodeEditor(renderResult.container);

      // Set cursor position to the start
      editor.setSelectionRange(0, 0);

      // Simulate tab key press
      await act(async () => {
        fireEvent.keyDown(editor, {
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
