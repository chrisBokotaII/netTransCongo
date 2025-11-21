import React, { useState } from 'react';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { questions } from './data/questions';
import { Mode, Difficulty, Category, Question } from './types';

function App() {
  const [mode, setMode] = useState<Mode>('home');
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentCategoryFilter, setCurrentCategoryFilter] = useState<Category | 'Mixed'>('Mixed');

  const startQuiz = (selectedMode: 'study' | 'exam', difficulty: Difficulty, category: Category | 'Mixed') => {
    let filtered = questions;
    
    // Filter by Difficulty
    if (difficulty !== 'Mixed') {
      filtered = filtered.filter(q => q.difficulty === difficulty);
    }

    // Filter by Category
    if (category !== 'Mixed') {
      filtered = filtered.filter(q => q.category === category);
    }

    if (filtered.length === 0) {
      alert("Aucune question disponible pour cette combinaison.");
      return;
    }

    // Shuffle questions
    // filtered = [...filtered].sort(() => Math.random() - 0.5); 

    setActiveQuestions(filtered);
    setCurrentCategoryFilter(category);
    setScore(0);
    setUserAnswers({});
    setMode(selectedMode);
    window.scrollTo(0, 0);
  };

  const handleFinish = (finalScore: number, answers: Record<number, string>) => {
    setScore(finalScore);
    setUserAnswers(answers);
    setMode('result');
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    setMode('home');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-10">
      <Header />
      
      <main className="pt-4">
        {mode === 'home' && (
          <Home onStart={startQuiz} />
        )}

        {(mode === 'study' || mode === 'exam') && (
          <QuizScreen 
            questions={activeQuestions} 
            mode={mode} 
            categoryFilter={currentCategoryFilter}
            onFinish={handleFinish} 
            onExit={goHome}
          />
        )}

        {mode === 'result' && (
          <ResultScreen 
            score={score} 
            total={activeQuestions.length} 
            answers={userAnswers}
            questions={activeQuestions}
            onRetry={() => goHome()} 
            onHome={goHome} 
          />
        )}
      </main>
    </div>
  );
}

export default App;