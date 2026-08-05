
import React, { useState } from 'react';
import { getBrasiliaDate, DIAS_SEMANA } from '../constants';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onDateChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  // Fix: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'"
  const days: React.ReactElement[] = [];
  
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-12 w-12"></div>);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = getBrasiliaDate();
    today.setHours(0, 0, 0, 0);
    
    const isSunday = date.getDay() === 0;
    const isPast = date < today;
    const isDisabled = isSunday || isPast;
    const isSelected = date.toDateString() === selectedDate.toDateString();
    
    days.push(
      <button
        key={day}
        onClick={() => !isDisabled && onDateChange(date)}
        disabled={isDisabled}
        className={`h-12 w-12 mx-auto flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-200
          ${isSelected 
            ? 'bg-green-700 text-white shadow-xl scale-110 ring-4 ring-green-100' 
            : isDisabled 
              ? 'text-gray-200 cursor-not-allowed line-through' 
              : 'text-gray-700 hover:bg-green-100 hover:text-green-800 hover:scale-105'
          }
        `}
      >
        {day}
      </button>
    );
  }
  
  const prevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };
  
  const nextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };
  
  return (
    <div className="mb-10">
      <div className="flex items-center mb-6">
        <div className="h-px bg-gray-200 flex-1"></div>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] px-4">1. Escolha uma data</h2>
        <div className="h-px bg-gray-200 flex-1"></div>
      </div>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl max-w-lg mx-auto overflow-hidden">
        <div className="flex items-center justify-between px-8 py-5 bg-gray-50/50 border-b border-gray-100">
          <button onClick={prevMonth} className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-gray-600 active:scale-95">❮</button>
          <span className="text-lg font-bold text-gray-800 capitalize tracking-tight">
            {currentMonth.toLocaleDateString('pt-BR', { month: 'long' })} <span className="text-gray-400 font-normal">de</span> {currentMonth.getFullYear()}
          </span>
          <button onClick={nextMonth} className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-gray-600 active:scale-95">❯</button>
        </div>
        <div className="grid grid-cols-7 gap-1 p-6 text-center">
          {DIAS_SEMANA.map(d => (
            <div key={d} className="text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-widest">{d}</div>
          ))}
          {days}
        </div>
      </div>
    </div>
  );
};
