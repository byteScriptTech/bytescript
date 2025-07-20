# Code Editor Component

This component provides a browser-based JavaScript code editor with execution capabilities.

## Features

- **Browser-based Execution**: All code runs directly in the user's browser
- **Safe Sandboxing**: Code runs in a controlled environment
- **Console Output**: Captures and displays `console.log` and other console methods
- **Error Handling**: Displays syntax and runtime errors clearly
- **Execution Time**: Measures and displays how long code takes to execute
- **Responsive Design**: Adapts to different screen sizes

## Usage

1. Import the component:

   ```tsx
   import dynamic from 'next/dynamic';

   const CodeEditor = dynamic(() => import('@/components/CodeEditor'), {
     ssr: false,
   });
   ```

2. Use it in your component:
   ```tsx
   function MyPage() {
     return (
       <div className="container mx-auto p-4">
         <CodeEditor />
       </div>
     );
   }
   ```

## How It Works

1. **Code Execution**:

   - Uses `new Function()` to execute code in the browser
   - Implements a timeout mechanism to prevent infinite loops
   - Captures console output by temporarily overriding console methods

2. **Safety Considerations**:
   - No server-side code execution
   - Timeout prevents long-running scripts
   - Runs in the browser's native security sandbox

## Example Code

Try these examples in the editor:

```javascript
// Basic arithmetic
console.log(2 + 2 * 2); // 6

// Working with arrays
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((n) => n * 2);
console.log('Doubled:', doubled);

// Async/await example
async function fetchData() {
  const response = await fetch('https://api.github.com/users/octocat');
  const data = await response.json();
  console.log('GitHub User:', data.login);
}
fetchData().catch(console.error);
```

## Limitations

- No file system access
- No network access (except to public APIs that allow CORS)
- Limited by browser security restrictions
- No persistent storage between page reloads

## Future Improvements

- Add syntax highlighting
- Support for multiple files
- Save/load code snippets
- Add more language support
