
import React from 'react';
import { BookingEvent } from '../types';

interface ConfirmationProps {
  event: BookingEvent;
  onNew: () => void;
}

export const Confirmation: React.FC<ConfirmationProps> = ({ event, onNew }) => {
  return (
    <div className="text-center p-4 max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4 duration-1000">
      <div className="relative w-40 h-40 mx-auto mb-10">
        <div className="absolute inset-0 bg-green-100 rounded-full opacity-50 animate-ping"></div>
        <div className="relative w-40 h-40 bg-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-600/30">
          <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      
      <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4 tracking-tight">Sucesso!</h2>
      <p className="text-xl text-green-700 font-semibold mb-10">
        Tudo certo, {event.clientInfo.name.split(' ')[0]}!
      </p>
      
      <div className="bg-white p-8 rounded-[2rem] border-2 border-gray-50 shadow-sm text-left space-y-5 mb-10 ring-1 ring-gray-100">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Data Escolhida</span>
          <span className="text-gray-800 font-extrabold text-lg">
            {event.date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </span>
        </div>
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Horário Confirmado</span>
          <span className="text-green-700 font-black text-2xl">
            {event.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Local / Empresa</span>
          <span className="text-gray-800 font-bold truncate ml-4">{event.clientInfo.school}</span>
        </div>
      </div>
      
      <div className="bg-blue-50 border-2 border-blue-100/50 p-6 rounded-3xl mb-12">
        <p className="text-blue-800 leading-relaxed text-sm md:text-base font-medium">
          Enviamos uma confirmação para o seu e-mail <strong>{event.clientInfo.email}</strong>. 
          Aguarde nosso contato pelo WhatsApp em instantes!
        </p>
      </div>
      
      <button 
        onClick={onNew} 
        className="inline-flex items-center gap-3 bg-gray-800 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all active:scale-95 group shadow-xl"
      >
        Novo Agendamento
        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  );
};
