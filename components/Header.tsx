import React from 'react';
import { Wifi, Globe } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-700">
          <div className="bg-blue-700 text-white p-2 rounded-lg">
            <Wifi size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight leading-none">NetTransCongo</h1>
            <p className="text-xs text-slate-500 font-medium">CompTIA Training DRC</p>
          </div>
        </div>
        <Globe className="text-slate-300" size={24} />
      </div>
    </header>
  );
};