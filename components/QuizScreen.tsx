import React, { useState, useEffect } from 'react';
import { Question, Category } from '../types';
import { Button } from './Button';
import { ProgressBar } from './ProgressBar';
import { ArrowRight, Check, BookOpen, BarChart } from 'lucide-react';

interface QuizScreenProps {
  questions: Question[];
  mode: 'study' | 'exam';
  categoryFilter: Category | 'Mixed';
  onFinish: (score: number, answers: Record<number, string>) => void;
  onExit: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ questions, mode, categoryFilter, onFinish, onExit }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timer, setTimer] = useState(60 * 10); // 10 minutes for exam

  const currentQuestion = questions[currentIdx];
  const isLastQuestion = currentIdx === questions.length - 1;

  useEffect(() => {
    if (mode === 'exam') {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            handleFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [mode]);

  const handleOptionSelect = (optionId: string) => {
    if (showFeedback && mode === 'study') return; // Prevent changing after revealing
    setSelectedOption(optionId);
  };

  const handleConfirm = () => {
    if (!selectedOption) return;

    // Record answer
    const newAnswers = { ...answers, [currentQuestion.id]: selectedOption };
    setAnswers(newAnswers);

    if (mode === 'study') {
      setShowFeedback(true);
    } else {
      // Exam mode: Move directly to next or finish
      if (isLastQuestion) {
        calculateAndFinish(newAnswers);
      } else {
        handleNext(newAnswers);
      }
    }
  };

  const handleNext = (currentAnswers: Record<number, string> = answers) => {
    setSelectedOption(null);
    setShowFeedback(false);
    if (isLastQuestion) {
      calculateAndFinish(currentAnswers);
    } else {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const calculateAndFinish = (finalAnswers: Record<number, string>) => {
    let score = 0;
    questions.forEach(q => {
      if (finalAnswers[q.id] === q.correctAnswerId) {
        score++;
      }
    });
    onFinish(score, finalAnswers);
  };

  // For timer expiry
  const handleFinish = () => {
    calculateAndFinish(answers);
  };

  // Helper to determine button styles based on state
  const getOptionStyles = (optionId: string) => {
    const base = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-start gap-3 ";
    
    if (mode === 'study' && showFeedback) {
      if (optionId === currentQuestion.correctAnswerId) {
        return base + "bg-green-50 border-green-500 text-green-800";
      }
      if (optionId === selectedOption && optionId !== currentQuestion.correctAnswerId) {
        return base + "bg-red-50 border-red-500 text-red-800 opacity-75";
      }
      return base + "bg-white border-slate-200 text-slate-400 opacity-50";
    }

    if (selectedOption === optionId) {
      return base + "bg-blue-50 border-blue-600 text-blue-900 shadow-sm ring-1 ring-blue-600";
    }

    return base + "bg-white border-slate-200 hover:border-blue-300 text-slate-700 hover:bg-slate-50";
  };

  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getDifficultyLabel = (diff: string) => {
    switch(diff) {
      case 'Easy': return 'Facile';
      case 'Medium': return 'Moyen';
      case 'Hard': return 'Difficile';
      default: return diff;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 pb-24">
      <ProgressBar 
        current={currentIdx} 
        total={questions.length} 
        mode={mode} 
        timer={mode === 'exam' ? timer : undefined}
      />

      <div className="space-y-6">
        {/* Question Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
          
          {/* Category Progress Indicator (Conditionally rendered) */}
          {categoryFilter !== 'Mixed' && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">
                <span>Progression {categoryFilter}</span>
                <span>{Math.round(((currentIdx + 1) / questions.length) * 100)}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-slate-800 transition-all duration-500"
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold tracking-wide uppercase">
              {currentQuestion.category}
            </span>
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${getDifficultyColor(currentQuestion.difficulty)}`}>
              <BarChart size={12} /> {getDifficultyLabel(currentQuestion.difficulty)}
            </span>
          </div>
          
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug">
            {currentQuestion.text}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map(option => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={getOptionStyles(option.id)}
              disabled={showFeedback}
            >
              <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 
                ${selectedOption === option.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'}
                ${mode === 'study' && showFeedback && option.id === currentQuestion.correctAnswerId ? '!border-green-500 !bg-green-500 !text-white' : ''}
              `}>
                {(mode === 'study' && showFeedback && option.id === currentQuestion.correctAnswerId) ? <Check size={12} strokeWidth={4} /> : 
                 (selectedOption === option.id && <div className="w-2 h-2 bg-white rounded-full" />)}
              </div>
              <span className="font-medium">{option.text}</span>
            </button>
          ))}
        </div>

        {/* Study Mode Explanation */}
        {mode === 'study' && showFeedback && (
          <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-r-xl animate-fade-in">
            <div className="flex items-start gap-3">
              <BookOpen className="text-blue-700 mt-1 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-bold text-blue-900 mb-1">Explication</h4>
                <p className="text-blue-800 text-sm leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-40">
        <div className="max-w-3xl mx-auto flex gap-3">
          <Button variant="outline" onClick={onExit} className="flex-1">
            Quitter
          </Button>
          
          {mode === 'study' ? (
            !showFeedback ? (
              <Button 
                variant="primary" 
                onClick={handleConfirm} 
                disabled={!selectedOption} 
                className="flex-[2]"
              >
                Vérifier
              </Button>
            ) : (
              <Button 
                variant="primary" 
                onClick={() => handleNext()} 
                className="flex-[2]"
              >
                {isLastQuestion ? "Voir les résultats" : "Question suivante"} <ArrowRight size={18} />
              </Button>
            )
          ) : (
            <Button 
              variant="primary" 
              onClick={handleConfirm} 
              disabled={!selectedOption} 
              className="flex-[2]"
            >
              {isLastQuestion ? "Terminer l'examen" : "Suivant"} <ArrowRight size={18} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};