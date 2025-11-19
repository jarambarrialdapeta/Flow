import React, { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIAdvisorProps {
  loading: boolean;
  advice: string;
  onGenerate: () => void;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ loading, advice, onGenerate }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl p-6 shadow-lg text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-300" />
          <h3 className="font-semibold text-lg">Asistente Financiero Gemini</h3>
        </div>
        <button 
          onClick={onGenerate}
          disabled={loading}
          className="bg-white/20 hover:bg-white/30 transition-colors p-2 rounded-full disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm min-h-[100px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-2 py-4">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <p className="text-sm text-indigo-100">Analizando tus finanzas...</p>
          </div>
        ) : advice ? (
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{advice}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-indigo-100 text-sm">
            Pulsa el botón para recibir un análisis de tus inversiones y gastos potenciado por IA.
          </p>
        )}
      </div>
    </div>
  );
};
