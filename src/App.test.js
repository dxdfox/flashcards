import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  test('renders Flashcards heading', () => {
    render(<App />);
    const headingElement = screen.getByRole('heading', { name: /flashcards/i, level: 1 });
    expect(headingElement).toBeInTheDocument();
  });
});
