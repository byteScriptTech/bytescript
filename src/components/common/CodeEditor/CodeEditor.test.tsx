import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';

/**
 * 🔴 CRITICAL: Proper async mock for next/dynamic
 * This avoids:
 * - "Element type is invalid"
 * - act() warnings
 * - LoadableComponent issues
 */
jest.mock('next/dynamic', () => {
  return (importer: any) => {
    let LoadedComponent: any = null;

    importer().then((mod: any) => {
      LoadedComponent = mod.default || mod;
    });

    const DynamicComponent = (props: any) => {
      if (!LoadedComponent) return null;
      return <LoadedComponent {...props} />;
    };
    DynamicComponent.displayName = 'DynamicComponent';
    return DynamicComponent;
  };
});

// Monaco mock
jest.mock('@monaco-editor/react', () => {
  return function MockMonacoEditor({ onMount, defaultValue, ...props }: any) {
    React.useEffect(() => {
      if (onMount) {
        onMount({
          getValue: () => defaultValue || '',
          setValue: jest.fn(),
          focus: jest.fn(),
          getModel: jest.fn(),
        });
      }
    }, [onMount, defaultValue]);

    return (
      <div data-testid="monaco-editor" {...props}>
        Monaco Editor: {defaultValue}
      </div>
    );
  };
});

// ---- IMPORT AFTER MOCKS ----
import { JavaScriptCodeEditor } from './index';

let workerInstance: WorkerMock;
let latestWorkerInstance: WorkerMock | null = null;

class WorkerMock {
  onmessage: ((e: any) => void) | null = null;
  postMessage = jest.fn();
  terminate = jest.fn();

  emit(type: string, payload?: any) {
    this.onmessage?.({ data: { type, payload } });
  }
}

beforeEach(() => {
  jest.clearAllMocks();

  // Mock Worker
  (global as any).Worker = jest.fn(() => {
    workerInstance = new WorkerMock();
    latestWorkerInstance = workerInstance;
    return workerInstance;
  });

  // Mock clipboard
  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn(),
    },
  });
});

describe('JavaScriptCodeEditor', () => {
  test('renders editor and buttons', () => {
    render(<JavaScriptCodeEditor initialCode="console.log('hi')" />);

    expect(screen.getByText('Run')).toBeInTheDocument();
    expect(screen.getByText('Copy')).toBeInTheDocument();
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
  });

  test('runs code and prints output', async () => {
    render(<JavaScriptCodeEditor initialCode="console.log('Hello')" />);

    fireEvent.click(screen.getByText('Run'));

    // Wait a bit for the worker to be set up
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      latestWorkerInstance?.emit('log', ['Hello']);
      latestWorkerInstance?.emit('status', 'done');
    });

    expect(await screen.findByText(/Hello/)).toBeInTheDocument();
    expect(await screen.findByText(/--- done ---/)).toBeInTheDocument();
  });

  test('shows stop button for long running code', async () => {
    jest.useFakeTimers();

    render(<JavaScriptCodeEditor initialCode="setInterval(() => {}, 1000)" />);

    fireEvent.click(screen.getByText('Run'));

    act(() => {
      jest.advanceTimersByTime(600);
    });

    expect(await screen.findByText('Stop')).toBeInTheDocument();

    jest.useRealTimers();
  });

  test('stop button sends STOP message', async () => {
    jest.useFakeTimers();

    render(<JavaScriptCodeEditor initialCode="setInterval(() => {}, 1000)" />);

    fireEvent.click(screen.getByText('Run'));

    act(() => {
      jest.advanceTimersByTime(600);
    });

    fireEvent.click(screen.getByText('Stop'));

    expect(latestWorkerInstance?.postMessage).toHaveBeenCalledWith({
      type: 'STOP',
    });

    jest.useRealTimers();
  });

  test('copy button copies code', async () => {
    render(<JavaScriptCodeEditor initialCode="console.log('copy')" />);

    fireEvent.click(screen.getByText('Copy'));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "console.log('copy')"
    );
  });

  test('clear console clears output', async () => {
    render(<JavaScriptCodeEditor initialCode="console.log('clear')" />);

    fireEvent.click(screen.getByText('Run'));

    // Wait for output to appear
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      latestWorkerInstance?.emit('log', ['clear']);
      latestWorkerInstance?.emit('status', 'done');
    });

    // Wait for the console output to appear
    expect(await screen.findByText(/clear/)).toBeInTheDocument();

    // Wait for Clear button to appear (it only shows when there's output)
    const clearButton = await screen.findByText('Clear');
    fireEvent.click(clearButton);

    // Wait for the console to be cleared
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // The console output should be cleared, but the editor content still remains
    // We need to check specifically in the console area, not the entire document
    const consoleOutputArea = screen
      .getByText('Console')
      .closest('div')?.nextElementSibling;
    expect(consoleOutputArea).not.toHaveTextContent(/clear/);
    expect(screen.getByTestId('monaco-editor')).toHaveTextContent(
      'console.log'
    );
  });
});
