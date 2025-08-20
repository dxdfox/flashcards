import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Flashcard from './Flashcard';

const sampleCard = {
  id: 999,
  title: 'Test Card',
  description: 'This is a test description for the flashcard.',
  category: 'Test',
  exampleProblemUrl: 'https://example.com'
};

test('renders front and back content and toggles flip state', () => {
  const { container } = render(<Flashcard card={sampleCard} />);

  // Title appears in both front (h2) and back (h3) - accept multiple matches
  const titleNodes = screen.getAllByText(/Test Card/);
  expect(titleNodes.length).toBeGreaterThanOrEqual(1);

  // Category and description present (allow multiple matches)
  expect(screen.getAllByText(/Test/).length).toBeGreaterThanOrEqual(1);
  expect(screen.getByText(/This is a test description/)).toBeInTheDocument();

  // Select the transform wrapper by its transition class
  const transformWrapper = container.querySelector('.transition-transform');
  expect(transformWrapper).toBeTruthy();

  // Initially not flipped (no rotateY transform token)
  expect(transformWrapper.className).not.toMatch(/rotateY|rotateY\(/);

  // Click the card container to flip
  fireEvent.click(container.firstChild);

  // After flip, the wrapper should include the rotateY token used in styles
  expect(transformWrapper.className).toMatch(/rotateY|rotateY\(/);
});
