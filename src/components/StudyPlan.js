import React, { useState, useEffect } from 'react';
import studyPlans from '../studyPlans.json';

function StudyPlan({ onProblemClick }) {
  const [completedProblems, setCompletedProblems] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const blind75 = studyPlans.blind75;

  useEffect(() => {
    const stored = localStorage.getItem('completedProblems');
    if (stored) {
      setCompletedProblems(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('completedProblems', JSON.stringify(completedProblems));
    
    // Update completion timestamp
    if (completedProblems.length > 0) {
      const stats = JSON.parse(localStorage.getItem('studyStats') || '{}');
      completedProblems.forEach(id => {
        if (!stats[id]) {
          stats[id] = {
            completedAt: new Date().toISOString(),
            attempts: 1
          };
        }
      });
      localStorage.setItem('studyStats', JSON.stringify(stats));
    }
  }, [completedProblems]);

  const toggleProblemCompletion = (problemId) => {
    setCompletedProblems(prev => {
      const newCompleted = prev.includes(problemId)
        ? prev.filter(id => id !== problemId)
        : [...prev, problemId];
      return newCompleted;
    });
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const calculateCategoryProgress = (problems) => {
    const completed = problems.filter(p => completedProblems.includes(p.id)).length;
    return {
      completed,
      total: problems.length,
      percentage: Math.round((completed / problems.length) * 100)
    };
  };

  const calculateOverallProgress = () => {
    let totalCompleted = 0;
    let totalProblems = 0;

    Object.values(blind75.categories).forEach(problems => {
      totalCompleted += problems.filter(p => completedProblems.includes(p.id)).length;
      totalProblems += problems.length;
    });

    return {
      completed: totalCompleted,
      total: totalProblems,
      percentage: Math.round((totalCompleted / totalProblems) * 100)
    };
  };

  const getRecommendedProblems = () => {
    const allProblems = Object.values(blind75.categories).flat();
    const notCompletedProblems = allProblems.filter(p => !completedProblems.includes(p.id));
    
    // Prioritize problems based on:
    // 1. Start with Easy problems
    // 2. Related to completed problems (same pattern)
    // 3. From categories with some progress
    const prioritizedProblems = notCompletedProblems.sort((a, b) => {
      // Prioritize Easy problems
      if (a.difficulty !== b.difficulty) {
        return a.difficulty === 'Easy' ? -1 : 1;
      }

      // Prioritize problems with patterns from completed problems
      const aPatternMatch = completedProblems.some(id => {
        const completedProblem = allProblems.find(p => p.id === id);
        return completedProblem?.pattern === a.pattern;
      });
      const bPatternMatch = completedProblems.some(id => {
        const completedProblem = allProblems.find(p => p.id === id);
        return completedProblem?.pattern === b.pattern;
      });
      
      if (aPatternMatch !== bPatternMatch) {
        return aPatternMatch ? -1 : 1;
      }

      return 0;
    });

    return prioritizedProblems.slice(0, 3);
  };

  const calculateStreak = () => {
    const stats = JSON.parse(localStorage.getItem('studyStats') || '{}');
    const dates = Object.values(stats)
      .map(stat => new Date(stat.completedAt).toLocaleDateString());
    
    // Get unique dates sorted in descending order
    const uniqueDates = [...new Set(dates)].sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );

    let streak = 0;
    const today = new Date().toLocaleDateString();
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString();

    // Check if studied today or yesterday to continue streak
    if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
      streak = 1;
      let prevDate = new Date(uniqueDates[0]);

      // Count consecutive days
      for (let i = 1; i < uniqueDates.length; i++) {
        const currentDate = new Date(uniqueDates[i]);
        const diffDays = Math.floor(
          (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (diffDays === 1) {
          streak++;
          prevDate = currentDate;
        } else {
          break;
        }
      }
    }

    return streak;
  };

  const getCompletedToday = () => {
    const stats = JSON.parse(localStorage.getItem('studyStats') || '{}');
    const today = new Date().toLocaleDateString();
    
    return Object.values(stats).filter(stat => 
      new Date(stat.completedAt).toLocaleDateString() === today
    ).length;
  };

  const progress = calculateOverallProgress();

  const filterProblems = (problems) => {
    return problems.filter(problem => {
      const matchesSearch = problem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.pattern?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = filterDifficulty === 'All' || problem.difficulty === filterDifficulty;
      return matchesSearch && matchesDifficulty;
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{blind75.name}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{blind75.description}</p>
        
        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search problems by name or pattern..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        
        {/* Overall Progress and Streak */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 dark:text-gray-300 font-medium">Overall Progress</span>
              <span className="text-gray-700 dark:text-gray-300">
                {progress.completed}/{progress.total} ({progress.percentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 dark:text-gray-300 font-medium">Study Streak</span>
              <span className="flex items-center gap-1">
                <span className="text-yellow-500">🔥</span>
                <span className="text-gray-700 dark:text-gray-300 font-bold">
                  {calculateStreak()} days
                </span>
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Complete at least one problem daily to maintain your streak!
            </div>
          </div>
        </div>

        {/* Daily Goal */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Today's Progress</span>
            <span className="text-gray-700 dark:text-gray-300">
              {getCompletedToday()} solved today
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
            <div
              className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        {/* Recommended Problems */}
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Recommended Next Problems</h3>
          <div className="space-y-2">
            {getRecommendedProblems().map(problem => (
              <div
                key={problem.id}
                className="flex items-center gap-3 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg"
              >
                <span className="text-gray-500">📝</span>
                <a
                  href={problem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-sm hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {problem.name}
                </a>
                <span className={`px-2 py-1 text-xs rounded ${
                  problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                  problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {problem.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {Object.entries(blind75.categories).map(([category, problems]) => {
          const categoryProgress = calculateCategoryProgress(problems);
          return (
            <div key={category} className="border dark:border-gray-700 rounded-lg">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-t-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="font-medium text-gray-900 dark:text-white">{category}</span>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {categoryProgress.completed}/{categoryProgress.total}
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                    <div
                      className="h-2 bg-green-600 rounded-full transition-all duration-300"
                      style={{ width: `${categoryProgress.percentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-gray-500 dark:text-gray-400">
                  {expandedCategories[category] ? '▼' : '▶'}
                </span>
              </button>
              
              {expandedCategories[category] && (
                <div className="p-4 space-y-2">
                  {filterProblems(problems).map(problem => (
                    <div
                      key={problem.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={completedProblems.includes(problem.id)}
                        onChange={() => toggleProblemCompletion(problem.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <a
                        href={problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {problem.name}
                      </a>
                      <span className={`px-2 py-1 text-xs rounded ${
                        problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                        problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {problem.difficulty}
                      </span>
                      {problem.pattern && (
                        <button
                          onClick={() => onProblemClick(problem.pattern)}
                          className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          title={`View the ${problem.pattern} pattern in flashcards`}
                        >
                          <span>🔍</span>
                          <span>{problem.pattern}</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StudyPlan;
