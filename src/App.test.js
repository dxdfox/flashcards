import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  test('renders Flashcards heading', () => {
    render(<App />);
    const headingElement = screen.getByText(/Flashcards/i);
    expect(headingElement).toBeInTheDocument();
  });
});
