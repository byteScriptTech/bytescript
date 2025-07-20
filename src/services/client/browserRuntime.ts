interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime?: number;
}

class BrowserRuntime {
  private outputBuffer: string[] = [];
  private originalConsoleLog = console.log;
  private originalConsoleError = console.error;
  private originalConsoleWarn = console.warn;

  private captureConsole() {
    // Store the original console methods
    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
    };

    // Override console methods to capture output
    console.log = (...args: any[]) => {
      this.outputBuffer.push(args.map((arg) => String(arg)).join(' '));
      originalConsole.log(...args);
    };

    console.error = (...args: any[]) => {
      this.outputBuffer.push(args.map((arg) => String(arg)).join(' '));
      originalConsole.error(...args);
    };

    console.warn = (...args: any[]) => {
      this.outputBuffer.push(args.map((arg) => String(arg)).join(' '));
      originalConsole.warn(...args);
    };

    // Return a function to restore the original console methods
    return () => {
      console.log = originalConsole.log;
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
    };
  }

  async executeCode(code: string, timeoutMs = 5000): Promise<ExecutionResult> {
    // Reset output buffer
    this.outputBuffer = [];

    // Capture console output
    const restoreConsole = this.captureConsole();

    try {
      const startTime = performance.now();

      // Create a function from the code
      const fn = new Function(`
        ${code}
        // If the code doesn't return anything, return the last expression
        return typeof result !== 'undefined' ? result : undefined;
      `);

      // Execute with timeout
      const result = await Promise.race([
        Promise.resolve(fn()),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Execution timed out')), timeoutMs)
        ),
      ]);

      const executionTime = performance.now() - startTime;

      // Get any captured output
      const output = this.outputBuffer.join('\n');

      // Format the result
      let resultOutput = '';
      if (result !== undefined && result !== null) {
        resultOutput = String(result);
      }

      // Combine output and result
      const fullOutput = [output, resultOutput].filter(Boolean).join('\n');

      return {
        success: true,
        output: fullOutput,
        executionTime,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        success: false,
        output: this.outputBuffer.join('\n'),
        error: errorMessage,
      };
    } finally {
      // Restore original console methods
      restoreConsole();
    }
  }
}

export const browserRuntime = new BrowserRuntime();
