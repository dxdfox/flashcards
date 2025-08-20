import flashcards from './flashcards.json';

test('flashcards.json is a non-empty array with id/title', () => {
  expect(Array.isArray(flashcards)).toBe(true);
  expect(flashcards.length).toBeGreaterThan(0);
  const sample = flashcards[0];
  expect(sample).toHaveProperty('id');
  expect(sample).toHaveProperty('title');
});
