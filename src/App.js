import React, { useState, useEffect, useMemo } from 'react';
import Flashcard from './components/Flashcard';
import flashcards from './flashcards.json';
import Footer from './components/Footer';

function App() {
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [knownCards, setKnownCards] = useState([]);
  const [reviewCards, setReviewCards] = useState([]);
  const [filter, setFilter] = useState('All');
  const [category, setCategory] = useState('All');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedKnownCards = JSON.parse(localStorage.getItem('knownCards')) || [];
    const storedReviewCards = JSON.parse(localStorage.getItem('reviewCards')) || [];
    setKnownCards(storedKnownCards);
    setReviewCards(storedReviewCards);
    setCards(flashcards);

    if (localStorage.getItem('theme') === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('knownCards', JSON.stringify(knownCards));
  }, [knownCards]);

  useEffect(() => {
    localStorage.setItem('reviewCards', JSON.stringify(reviewCards));
  }, [reviewCards]);

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const categoryMatch = category === 'All' || card.category === category;
      const statusMatch = (() => {
        if (filter === 'All') return true;
        if (filter === 'Known') return knownCards.includes(card.id);
        if (filter === 'Need Review') return reviewCards.includes(card.id);
        return false;
      })();
      return categoryMatch && statusMatch;
    });
  }, [cards, category, filter, knownCards, reviewCards]);

  useEffect(() => {
    setCurrentCardIndex(0);
  }, [filter, category]);

  useEffect(() => {
    if (filteredCards.length === 0) {
      setCurrentCardIndex(0);
    } else if (currentCardIndex >= filteredCards.length) {
      setCurrentCardIndex(0);
    }
  }, [filteredCards]);

  const handleKnown = () => {
    if (filteredCards.length === 0) return;
    const cardId = filteredCards[currentCardIndex].id;

    setKnownCards((prev) => [...new Set([...prev, cardId])]);
    setReviewCards((prev) => prev.filter((id) => id !== cardId));

    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % filteredCards.length);
  };

  const handleReview = () => {
    if (filteredCards.length === 0) return;
    const cardId = filteredCards[currentCardIndex].id;

    setReviewCards((prev) => [...new Set([...prev, cardId])]);
    setKnownCards((prev) => prev.filter((id) => id !== cardId));

    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % filteredCards.length);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-md px-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Flashcards</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
        <div className="flex justify-between mb-4">
          <div>
            <label htmlFor="category" className="mr-2">Category:</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded p-1 bg-white dark:bg-gray-800"
            >
              <option value="All">All</option>
              {[...new Set(flashcards.map((card) => card.category))].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="filter" className="mr-2">Status:</label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded p-1 bg-white dark:bg-gray-800"
            >
              <option value="All">All</option>
              <option value="Known">Known</option>
              <option value="Need Review">Need Review</option>
            </select>
          </div>
        </div>
        {filteredCards.length > 0 && filteredCards[currentCardIndex] ? (
          <Flashcard card={filteredCards[currentCardIndex]} />
        ) : (
          <p>No cards match the current filter.</p>
        )}
        <div className="flex justify-around mt-4">
          <button
            onClick={handleKnown}
            disabled={filteredCards.length === 0}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            Known
          </button>
          <button
            onClick={handleReview}
            disabled={filteredCards.length === 0}
            className="bg-yellow-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            Need Review
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
