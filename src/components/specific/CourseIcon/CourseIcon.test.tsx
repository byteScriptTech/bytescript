import { render, screen } from '@testing-library/react';

import CourseIcon from '.';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../../assets/CourseIcons/Javascript', () => {
  const MockedComponent = () => <div data-testid="javascript-icon" />;
  MockedComponent.displayName = 'JavascriptIcon';
  return MockedComponent;
});

jest.mock('../../../assets/CourseIcons/Python', () => {
  const MockedComponent = () => <div data-testid="python-icon" />;
  MockedComponent.displayName = 'PythonIcon';
  return MockedComponent;
});

jest.mock('../../../assets/CourseIcons/TypescriptIcon', () => {
  const MockedComponent = () => <div data-testid="typescript-icon" />;
  MockedComponent.displayName = 'TypescriptIcon';
  return MockedComponent;
});

describe('CourseIcon Component Test', () => {
  test('Should render the Javascript icon', () => {
    render(<CourseIcon language="javascript" id="123" />);

    const javascriptIcon = screen.getByTestId('javascript-icon');
    expect(javascriptIcon).toBeInTheDocument();
  });
  test('Should render the Python icon', () => {
    render(<CourseIcon language="python" id="123" />);
    const pythonIcon = screen.getByTestId('python-icon');
    expect(pythonIcon).toBeInTheDocument();
  });
  test('Should render the Typescript icon', () => {
    render(<CourseIcon language="typescript" id="abc" />);
    const typescriptIcon = screen.getByTestId('typescript-icon');
    expect(typescriptIcon).toBeInTheDocument();
  });
  test('Should handle non supported icons', () => {
    const { container } = render(<CourseIcon language="unknown" id="abc" />);
    expect(container.firstChild).toBeNull();
  });

  test('Should render the correct link', () => {
    render(<CourseIcon language="javascript" id="123" />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/language?name=javascript&id=123');
  });
});
