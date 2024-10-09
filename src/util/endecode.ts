import prettier from 'prettier';

export function decodeEntities(encodedStr: string): string {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = encodedStr;
  return textArea.value;
}

export async function formatCode(code: string): Promise<string> {
  return await prettier.format(code, {
    parser: 'babel', // Use 'babel' for JavaScript or TypeScript
    singleQuote: false, // Use double quotes
    semi: true, // Add semicolons
  });
}
