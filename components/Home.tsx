import React, { useState } from 'react';
import { Button } from './Button';
import { BookOpen, Clock, ShieldCheck, Monitor, Wifi, BarChart2, Check, Wrench, Layers } from 'lucide-react';
import { Difficulty, Category } from '../types';

interface HomeProps {
  onStart: (mode: 'study' | 'exam', difficulty: Difficulty, category: Category | 'Mixed') => void;
}

export const Home: React.FC<HomeProps> = ({ onStart }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('Mixed');
  const [category, setCategory] = useState<Category | 'Mixed'>('Mixed');

  const difficulties: { id: Difficulty; label: string; color: string }[] = [
    { id: 'Easy', label: 'Facile', color: 'bg-green-100 text-green-700 border-green-200' },
    { id: 'Medium', label: 'Moyen', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { id: 'Hard', label: 'Difficile', color: 'bg-red-100 text-red-700 border-red-200' },
    { id: 'Mixed', label: 'Mixte (Tous)', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  ];

  const categories: { id: Category | 'Mixed'; label: string; icon: React.ReactNode }[] = [
    { id: 'Mixed', label: 'Tout', icon: <Layers size={18} /> },
    { id: 'Hardware', label: 'Hardware', icon: <Monitor size={18} /> },
    { id: 'Network', label: 'Réseau', icon: <Wifi size={18} /> },
    { id: 'Security', label: 'Sécurité', icon: <ShieldCheck size={18} /> },
    { id: 'Troubleshooting', label: 'Dépannage', icon: <Wrench size={18} /> },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 animate-fade-in">
      
      <div className="text-center space-y-4 mt-4">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          Maîtrisez l'IT à la congolaise
        </h2>
        <p className="text-lg text-slate-600">
          Préparez vos certifications CompTIA A+ et Network+ avec des scénarios adaptés à la réalité technologique de la RDC.
        </p>
      </div>

      {/* Difficulty Selection */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="text-slate-400" size={20} />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            1. Niveau de difficulté
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {difficulties.map((d) => (
            <button
              key={d.id}
              onClick={() => setDifficulty(d.id)}
              className={`
                relative p-3 rounded-xl border-2 text-sm font-bold transition-all duration-200 flex flex-col items-center justify-center gap-2
                ${difficulty === d.id 
                  ? `${d.color} border-current ring-1 ring-offset-1 ring-slate-200` 
                  : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50'}
              `}
            >
              {difficulty === d.id && (
                <div className="absolute top-1 right-1">
                  <Check size={14} />
                </div>
              )}
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Selection */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="text-slate-400" size={20} />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            2. Catégorie (Optionnel)
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`
                px-4 py-2 rounded-full border text-sm font-medium transition-all flex items-center gap-2
                ${category === c.id
                  ? 'bg-slate-800 text-white border-slate-800 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
              `}
            >
              {c.icon}
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Selection */}
      <div>
        <div className="flex items-center gap-2 mb-4 px-1">
          <Clock className="text-slate-400" size={20} />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            3. Mode d'examen
          </h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 transition-all group relative overflow-hidden">
            <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center text-blue-700 mb-4 group-hover:scale-110 transition-transform relative z-10">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 relative z-10">Mode Étude</h3>
            <p className="text-slate-500 mb-6 text-sm leading-relaxed relative z-10">
              Apprenez à votre rythme. Feedback immédiat et explications détaillées.
            </p>
            <Button onClick={() => onStart('study', difficulty, category)} fullWidth variant="primary" className="relative z-10">
              Commencer la Révision
            </Button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-yellow-400 transition-all group">
            <div className="bg-yellow-100 w-12 h-12 rounded-xl flex items-center justify-center text-yellow-700 mb-4 group-hover:scale-110 transition-transform">
              <Clock size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Mode Examen</h3>
            <p className="text-slate-500 mb-6 text-sm leading-relaxed">
              Conditions réelles. Chronomètre actif, score à la fin.
            </p>
            <Button onClick={() => onStart('exam', difficulty, category)} fullWidth variant="secondary">
              Lancer un Examen Blanc
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};