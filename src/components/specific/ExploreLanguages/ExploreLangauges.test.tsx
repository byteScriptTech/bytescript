import { render, screen } from '@testing-library/react';

import { useLanguages } from '@/context/LanguagesContext';

import ExploreLanguages from '.';

jest.mock('../../../context/LanguagesContext', () => ({
  useLanguages: jest.fn(),
}));

jest.mock('../../common/CardSkeleton', () => {
  const MockedComponent = () => <div data-testid="card-skeleton" />;
  MockedComponent.displayName = 'CardSkeleton';
  return MockedComponent;
});
jest.mock('../LanguagesList', () => {
  const MockedComponent = () => (
    <div data-testid="languages-list">Languages List</div>
  );
  MockedComponent.displayName = 'LanguagesList';
  return MockedComponent;
});

describe('ExploreLanguages Component', () => {
  test('Should render the card skeleton when loading is true', () => {
    (useLanguages as jest.Mock).mockReturnValue({ loading: true });

    render(<ExploreLanguages />);

    expect(screen.getByTestId('card-skeleton')).toBeInTheDocument();
  });

  test('Should render the content when loading is false', () => {
    (useLanguages as jest.Mock).mockReturnValue({ loading: false });

    render(<ExploreLanguages />);

    expect(screen.getByText('Explore Available Languages')).toBeInTheDocument();

    expect(
      screen.getByText('Choose a language to continue your learning journey')
    ).toBeInTheDocument();
  });
});
