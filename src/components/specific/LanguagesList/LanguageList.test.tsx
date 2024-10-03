import { render, screen } from '@testing-library/react';
import React from 'react';

import LanguagesList from '.';
import { useLanguages } from '../../../context/LanguagesContext';

jest.mock('../../../context/LanguagesContext', () => ({
  useLanguages: jest.fn(),
}));

describe('LanguagesList', () => {
  const mockDeleteLanguage = jest.fn();
  const mockLanguages = [
    { id: '1', name: 'Javascript' },
    { id: '2', name: 'Python' },
  ];

  beforeEach(() => {
    (useLanguages as jest.Mock).mockReturnValue({
      languages: mockLanguages,
      deleteLanguage: mockDeleteLanguage,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the list of languages', () => {
    render(<LanguagesList />);

    expect(screen.getByText('Languages List')).toBeInTheDocument();
    expect(screen.getByText('Javascript')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
  });
});
