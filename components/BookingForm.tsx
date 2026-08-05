
import React, { useState } from 'react';
import { ClientInfo } from '../types';

interface BookingFormProps {
  selectedSlot: Date;
  onBook: (info: ClientInfo) => void;
  onBack: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ selectedSlot, onBook, onBack }) => {
  const [info, setInfo] = useState<ClientInfo>({ name: '', school: '', email: '', whatsapp: '' });
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInfo({ ...info, email: value });
    if (value && !validateEmail(value)) {
      setEmailError('Por favor, insira um e-mail válido');
    } else {
      setEmailError('');
    }
  };
  
  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };
  
  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsApp(e.target.value);
    setInfo({ ...info, whatsapp: formatted });
  };
  
  const handleSubmit = () => {
    if (isSubmitting) return;
    
    if (!info.name || !info.school || !info.email || !info.whatsapp) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    if (!validateEmail(info.email)) {
      alert('Por favor, verifique o formato do seu e-mail.');
      return;
    }
    
    const numbersOnly = info.whatsapp.replace(/\D/g, '');
    if (numbersOnly.length < 11) {
      alert('Por favor, insira um WhatsApp válido com DDD (11 dígitos).');
      return;
    }
    
    setIsSubmitting(true);
    onBook(info);
  };
  
  return (
    <div className="max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Quase lá!</h2>
        <p className="text-gray-500">Finalize os detalhes para garantir sua vaga.</p>
      </div>
      
      <div className="mb-10 bg-green-50 p-8 rounded-3xl border-2 border-green-100 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="bg-green-700 rounded-2xl p-4 flex-shrink-0 shadow-lg shadow-green-700/20">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-green-800/60 font-bold text-xs uppercase tracking-widest mb-1">Agendamento selecionado:</p>
            <p className="text-gray-800 font-bold text-xl capitalize">
              {selectedSlot.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <p className="text-green-700 font-extrabold text-3xl">
              {selectedSlot.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nome Completo</label>
            <input
              required
              placeholder="Ex: João da Silva"
              className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:ring-4 focus:ring-green-100 focus:bg-white focus:border-green-700 transition-all outline-none"
              value={info.name}
              onChange={e => setInfo({ ...info, name: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Escola / Empresa</label>
            <input
              required
              placeholder="Nome da sua instituição"
              className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:ring-4 focus:ring-green-100 focus:bg-white focus:border-green-700 transition-all outline-none"
              value={info.school}
              onChange={e => setInfo({ ...info, school: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Seu melhor E-mail</label>
          <input
            required
            type="email"
            placeholder="contato@empresa.com"
            className={`w-full p-4 bg-gray-50 border-2 rounded-2xl transition-all outline-none ${
              emailError ? 'border-red-500 focus:ring-red-50/50' : 'border-transparent focus:ring-4 focus:ring-green-100 focus:bg-white focus:border-green-700'
            }`}
            value={info.email}
            onChange={handleEmailChange}
            disabled={isSubmitting}
          />
          {emailError && <p className="text-red-500 text-[10px] font-bold uppercase">{emailError}</p>}
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">WhatsApp</label>
          <input
            required
            placeholder="(00) 00000-0000"
            maxLength={15}
            className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:ring-4 focus:ring-green-100 focus:bg-white focus:border-green-700 transition-all outline-none"
            value={info.whatsapp}
            onChange={handleWhatsAppChange}
            disabled={isSubmitting}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="sm:w-1/3 order-2 sm:order-1 bg-gray-100 text-gray-500 p-4 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50"
            disabled={isSubmitting}
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 order-1 sm:order-2 bg-green-700 text-white p-4 rounded-2xl font-bold shadow-xl shadow-green-700/20 hover:bg-green-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </span>
            ) : 'Confirmar Agendamento'}
          </button>
        </div>
      </div>
    </div>
  );
};
