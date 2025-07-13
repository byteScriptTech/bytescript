import { render } from '@testing-library/react';

import { ProgressInfo } from './ProgressInfo';

describe('ProgressInfo', () => {
  it('renders language name correctly', () => {
    const { getByText } = render(
      <ProgressInfo
        language="javascript"
        timeLeft="20 minutes"
        progress={33.33}
      />
    );
    expect(getByText('JAVASCRIPT')).toBeInTheDocument();
  });

  it('displays time left correctly', () => {
    const { getByText } = render(
      <ProgressInfo
        language="javascript"
        timeLeft="20 minutes"
        progress={33.33}
      />
    );
    expect(getByText('⏳ Time left to complete:')).toBeInTheDocument();
    expect(getByText('20 minutes')).toBeInTheDocument();
  });

  it('renders progress bar with correct value', () => {
    const { getByRole } = render(
      <ProgressInfo
        language="javascript"
        timeLeft="20 minutes"
        progress={33.33}
      />
    );
    const progressBar = getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '33.33');
  });
});
