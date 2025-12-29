import { render, screen } from '@testing-library/react';

import { useAuthRedux } from '@/hooks/useAuthRedux';

import Greetings from '.';

jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('Greetings Component', () => {
  let originalDate: DateConstructor;

  beforeAll(() => {
    originalDate = global.Date;
  });

  afterEach(() => {
    global.Date = originalDate;
  });

  test('Should render the Greetings message without user', () => {
    (useAuthRedux as jest.Mock).mockReturnValue({
      currentUser: null,
    });
    render(<Greetings />);
    const greetingMessage = screen.getByText('👋 Hi there!');
    expect(greetingMessage).toBeInTheDocument();
  });
  test('Should render greeting message with user', () => {
    (useAuthRedux as jest.Mock).mockReturnValue({
      currentUser: {
        displayName: 'Hemant Nirmalkar',
      },
    });
    render(<Greetings />);
    const greetingMessage = screen.getByText('👋 Hi Hemant!');
    expect(greetingMessage).toBeInTheDocument();
  });

  test('Should display good morning in morning', () => {
    const mockDate = new Date(2024, 10, 15, 9, 30, 0);
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

    (useAuthRedux as jest.Mock).mockReturnValue({
      currentUser: {
        displayName: 'Hemant Nirmalkar',
      },
    });
    render(<Greetings />);
    expect(screen.getByText(/Good Morning/i)).toBeInTheDocument();
  });

  test('Should display good afternoon in noon', () => {
    const mockDate = new Date(2024, 10, 12, 13, 30, 0);
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
    render(<Greetings />);
    expect(screen.getByText(/Good Afternoon/i)).toBeInTheDocument();
  });

  test('Should display Good Evening if current time is after 6pm', () => {
    const mockDate = new Date(2024, 10, 15, 20, 30, 0);
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

    (useAuthRedux as jest.Mock).mockReturnValue({
      currentUser: { displayName: 'John Doe' },
    });

    render(<Greetings />);

    expect(screen.getByText(/Good Evening/i)).toBeInTheDocument();
  });
});
