import { render, screen } from '@testing-library/react';

import CourseIcon from './index';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
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

jest.mock('../../../assets/CourseIcons/TypeScriptIcon', () => {
  const MockedComponent = () => <div data-testid="typescript-icon" />;
  MockedComponent.displayName = 'TypeScriptIcon';
  return MockedComponent;
});

jest.mock('../../../assets/CourseIcons/DataStructuresIcon', () => {
  const MockedComponent = () => <div data-testid="data-structures-icon" />;
  MockedComponent.displayName = 'DataStructuresIcon';
  return MockedComponent;
});

jest.mock('../../../assets/CourseIcons/CompetitiveProgrammingIcon', () => {
  const MockedComponent = () => (
    <div data-testid="competitive-programming-icon" />
  );
  MockedComponent.displayName = 'CompetitiveProgrammingIcon';
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

  test('Should render the DataStructures icon', () => {
    render(<CourseIcon language="data structures & algorithms" id="abc" />);
    const dataStructuresIcon = screen.getByTestId('data-structures-icon');
    expect(dataStructuresIcon).toBeInTheDocument();
  });

  test('Should render the CompetitiveProgramming icon', () => {
    render(<CourseIcon language="competitive programming" id="abc" />);
    const competitiveProgrammingIcon = screen.getByTestId(
      'competitive-programming-icon'
    );
    expect(competitiveProgrammingIcon).toBeInTheDocument();
  });

  test('Should handle non supported icons', () => {
    const { container } = render(<CourseIcon language="unknown" id="abc" />);
    expect(container.firstChild).toBeNull();
  });

  test('Should render the correct link with proper href', () => {
    render(<CourseIcon language="javascript" id="123" />);
    const link = screen.getByRole('button');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute(
      'href',
      '/language?name=javascript&id=123'
    );
  });
});
