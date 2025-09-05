import { render, screen } from '@testing-library/react';

import { PatternHeader } from './PatternHeader';

describe('PatternHeader', () => {
  it('renders title and description', () => {
    const testTitle = 'Test Pattern';
    const testDescription = 'This is a test pattern description';

    render(<PatternHeader title={testTitle} description={testDescription} />);

    const title = screen.getByTestId('pattern-title');
    const description = screen.getByTestId('pattern-description');

    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(testTitle);
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent(testDescription);
  });

  it('renders the Cpu icon', () => {
    render(<PatternHeader title="Test" description="Test description" />);
    expect(screen.getByTestId('cpu-icon')).toBeInTheDocument();
  });

  it('renders the pattern icon container', () => {
    render(<PatternHeader title="Test" description="Test description" />);
    expect(screen.getByTestId('pattern-icon')).toBeInTheDocument();
  });
});
