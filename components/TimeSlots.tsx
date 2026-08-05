
import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface TimeSlotsProps {
  slots: Date[];
  onSlotSelect: (date: Date) => void;
  isLoading: boolean;
}

export const TimeSlots: React.FC<TimeSlotsProps> = ({ slots, onSlotSelect, isLoading }) => {
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center mb-8">
        <div className="h-px bg-gray-200 flex-1"></div>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] px-4">2. Escolha um horário</h2>
        <div className="h-px bg-gray-200 flex-1"></div>
      </div>
      
      {slots.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {slots.map((slot, index) => (
            <button
              key={slot.toISOString()}
              onClick={() => onSlotSelect(slot)}
              className="group relative bg-white border-2 border-green-700/10 text-green-700 font-bold py-5 rounded-2xl hover:border-green-700 hover:bg-green-700 hover:text-white transition-all transform hover:scale-[1.03] active:scale-95 shadow-sm hover:shadow-lg"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="text-lg">
                {slot.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center bg-gray-50 border-2 border-dashed border-gray-200 p-12 rounded-3xl max-w-md mx-auto">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 font-medium">
            Nenhum horário disponível para esta data.
          </p>
        </div>
      )}
    </div>
  );
};
