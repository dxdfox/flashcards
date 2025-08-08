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
  }, [filteredCards, currentCardIndex]);

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

  const nextCard = () => {
    if (filteredCards.length > 0) {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % filteredCards.length);
    }
  };

  const prevCard = () => {
    if (filteredCards.length > 0) {
      setCurrentCardIndex((prevIndex) => 
        prevIndex === 0 ? filteredCards.length - 1 : prevIndex - 1
      );
    }
  };

  const totalCards = cards.length;
  const knownCount = knownCards.length;
  const reviewCount = reviewCards.length;
  const progressPercentage = totalCards > 0 ? Math.round((knownCount / totalCards) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 min-h-screen bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Algorithm Flashcards
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
                  Master coding patterns
                </p>
              </div>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>

            {/* Statistics Dashboard */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Progress Overview</h2>
              <div className="space-y-4">
                {/* Main Stats Row */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-blue-600">{totalCards}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-green-600">{knownCount}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Known</div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-yellow-600">{reviewCount}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Review</div>
                  </div>
                </div>
                
                {/* Progress Row */}
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">{progressPercentage}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Progress</div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-2">Category</label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  >
                    <option value="All">All Categories</option>
                    {[...new Set(flashcards.map((card) => card.category))].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="filter" className="block text-sm font-medium mb-2">Status</label>
                  <select
                    id="filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  >
                    <option value="All">All Status</option>
                    <option value="Known">Known</option>
                    <option value="Need Review">Need Review</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Current Card Info */}
            {filteredCards.length > 0 && filteredCards[currentCardIndex] && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Current Card</h3>
                <div className="text-sm">
                  <div className="font-medium">{filteredCards[currentCardIndex].title}</div>
                  <div className="text-gray-500 dark:text-gray-400 mt-1">
                    {currentCardIndex + 1} of {filteredCards.length}
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${((currentCardIndex + 1) / filteredCards.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            {filteredCards.length > 0 && filteredCards[currentCardIndex] ? (
              <>
                {/* Flashcard */}
                <div className="mb-8">
                  <Flashcard card={filteredCards[currentCardIndex]} />
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-center gap-6 mb-8">
                  <button
                    onClick={prevCard}
                    disabled={filteredCards.length <= 1}
                    className="flex items-center gap-2 p-4 rounded-xl bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                  >
                    ⬅️ <span className="text-sm">Previous</span>
                  </button>
                  <div className="text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Click card to flip
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      Use buttons to navigate
                    </div>
                  </div>
                  <button
                    onClick={nextCard}
                    disabled={filteredCards.length <= 1}
                    className="flex items-center gap-2 p-4 rounded-xl bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                  >
                    <span className="text-sm">Next</span> ➡️
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleKnown}
                    disabled={filteredCards.length === 0}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                  >
                    ✅ I Know This
                  </button>
                  <button
                    onClick={handleReview}
                    disabled={filteredCards.length === 0}
                    className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                  >
                    📝 Need Review
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-8xl mb-6">🔍</div>
                <p className="text-2xl text-gray-600 dark:text-gray-400 mb-2">No cards match the current filter</p>
                <p className="text-gray-500 dark:text-gray-500">Try adjusting your category or status filters in the sidebar</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
