
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query } from "firebase/firestore";
import { Header } from './components/Header';
import { DateSelector } from './components/DateSelector';
import { TimeSlots } from './components/TimeSlots';
import { BookingForm } from './components/BookingForm';
import { Confirmation } from './components/Confirmation';
import { 
  getBrasiliaDate, 
  HORARIO_INICIO, 
  HORARIO_FIM, 
  DURACAO_REUNIAO, 
  BLOQUEIOS_MANUAIS,
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_CLIENT_TEMPLATE_ID,
  GOOGLE_SHEETS_SCRIPT_URL
} from './constants';
import { ClientInfo, BookingEvent, BookedSlotsState } from './types';

// Firebase configuration provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyDrfdBg0jlt5mkT2EE99XvmbMGcoT-DPMw",
  authDomain: "app-agenda-patitour.firebaseapp.com",
  projectId: "app-agenda-patitour",
  storageBucket: "app-agenda-patitour.firebasestorage.app",
  messagingSenderId: "300360676568",
  appId: "1:300360676568:web:5ba2df1b4e0860a34dd3ad",
  measurementId: "G-YQD79SSL2J"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [confirmedEvent, setConfirmedEvent] = useState<BookingEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<BookedSlotsState>({});

  // Real-time synchronization with Firestore
  useEffect(() => {
    const q = query(collection(db, "bookings"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newBookedSlots: BookedSlotsState = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        const dateKey = data.dateKey;
        const sig = data.signature;
        if (dateKey && sig) {
          if (!newBookedSlots[dateKey]) {
            newBookedSlots[dateKey] = [];
          }
          newBookedSlots[dateKey].push(sig);
        }
      });
      setBookedSlots(newBookedSlots);
    });

    return () => unsubscribe();
  }, []);

  // Initialize EmailJS and default date
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.onload = () => {
      if (window.emailjs) {
        window.emailjs.init(EMAILJS_PUBLIC_KEY);
      }
    };
    document.head.appendChild(script);

    const today = getBrasiliaDate();
    if (today.getHours() >= HORARIO_FIM) {
      today.setDate(today.getDate() + 1);
    }
    while (today.getDay() === 0) {
      today.setDate(today.getDate() + 1);
    }
    setSelectedDate(today);
  }, []);

  // Calculate available slots based on selectedDate and real-time bookedSlots
  const availableSlots = useMemo(() => {
    if (!selectedDate) return [];
    
    const slots: Date[] = [];
    let current = new Date(selectedDate);
    current.setHours(HORARIO_INICIO, 0, 0, 0);
    
    const limit = new Date(selectedDate);
    limit.setHours(HORARIO_FIM, 0, 0, 0);
    
    const now = getBrasiliaDate();
    const dateKey = selectedDate.toDateString();
    const bookedForDate = bookedSlots[dateKey] || [];

    while (current < limit) {
      const sig = `${current.getFullYear()}-${current.getMonth()}-${current.getDate()}-${current.getHours()}-${current.getMinutes()}`;
      
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const day = String(current.getDate()).padStart(2, '0');
      const hour = String(current.getHours()).padStart(2, '0');
      const minute = String(current.getMinutes()).padStart(2, '0');
      const iso = `${year}-${month}-${day}T${hour}:${minute}`;
      
      const isBlocked = BLOQUEIOS_MANUAIS.includes(iso) || bookedForDate.includes(sig);
      
      if (current > now && !isBlocked) {
        slots.push(new Date(current));
      }
      
      current = new Date(current.getTime() + DURACAO_REUNIAO * 60000);
    }
    return slots;
  }, [selectedDate, bookedSlots]);

  const handleDateChange = useCallback(async (date: Date) => {
    setIsLoading(true);
    setSelectedDate(date);
    setSelectedSlot(null);
    // Simulate short network delay for visual feedback as before
    await new Promise(resolve => setTimeout(resolve, 400));
    setIsLoading(false);
  }, []);

  const handleBook = async (info: ClientInfo) => {
    if (!selectedSlot) return;
    
    setIsLoading(true);
    
    const sig = `${selectedSlot.getFullYear()}-${selectedSlot.getMonth()}-${selectedSlot.getDate()}-${selectedSlot.getHours()}-${selectedSlot.getMinutes()}`;
    const dateKey = selectedSlot.toDateString();

    // 1. Save to Firebase for real-time sync
    try {
      await addDoc(collection(db, "bookings"), {
        signature: sig,
        dateKey: dateKey,
        dateISO: selectedSlot.toISOString(),
        clientInfo: info,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Firebase Storage Error:", error);
      alert("Erro ao sincronizar agendamento. Tente novamente.");
      setIsLoading(false);
      return;
    }

    // 2. Backup to Google Sheets
    if (GOOGLE_SHEETS_SCRIPT_URL) {
      try {
        await fetch(GOOGLE_SHEETS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: selectedSlot.toLocaleDateString('pt-BR'),
            time: selectedSlot.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            name: info.name,
            school: info.school,
            email: info.email,
            whatsapp: info.whatsapp,
            timestamp: new Date().toISOString()
          })
        });
      } catch (error) {
        console.error("Sheet Sync Error:", error);
      }
    }

    // 3. Send Emails via EmailJS
    if (window.emailjs && EMAILJS_SERVICE_ID) {
      try {
        const formatForEmail = (d: Date) => {
          const y = d.getFullYear();
          const mo = String(d.getMonth() + 1).padStart(2, '0');
          const da = String(d.getDate()).padStart(2, '0');
          const ho = String(d.getHours()).padStart(2, '0');
          const mi = String(d.getMinutes()).padStart(2, '0');
          return `${y}${mo}${da}T${ho}${mi}00`;
        };

        const dateStart = formatForEmail(selectedSlot);
        const endSlot = new Date(selectedSlot.getTime() + DURACAO_REUNIAO * 60000);
        const dateEnd = formatForEmail(endSlot);
        
        const emailParams = {
          name: info.name,
          school: info.school,
          email: info.email,
          whatsapp: info.whatsapp,
          date: selectedSlot.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
          time: selectedSlot.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          date_start: dateStart,
          date_end: dateEnd
        };

        await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, emailParams);
        await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CLIENT_TEMPLATE_ID, emailParams);
      } catch (error) {
        console.error("EmailJS Error:", error);
      }
    }

    setConfirmedEvent({ clientInfo: info, date: selectedSlot });
    setIsLoading(false);
  };

  const resetBooking = () => {
    setConfirmedEvent(null);
    setSelectedSlot(null);
    if (selectedDate) handleDateChange(selectedDate);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden p-8 md:p-16">
          {confirmedEvent ? (
            <Confirmation event={confirmedEvent} onNew={resetBooking} />
          ) : selectedSlot ? (
            <BookingForm selectedSlot={selectedSlot} onBook={handleBook} onBack={() => setSelectedSlot(null)} />
          ) : (
            <div>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                  Agende com a <span className="text-green-700">Patitour</span>
                </h2>
                <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                  Escolha o melhor horário para seu atendimento personalizado com nossa equipe.
                </p>
              </div>
              
              {selectedDate && <DateSelector selectedDate={selectedDate} onDateChange={handleDateChange} />}
              {selectedDate && <TimeSlots slots={availableSlots} onSlotSelect={setSelectedSlot} isLoading={isLoading} />}
            </div>
          )}
        </div>
      </main>
      
      <footer className="flex flex-col items-center py-12 gap-8 border-t border-gray-100 bg-white/50">
        <a 
          href="https://ibb.co/dJpZPDxs" 
          target="_blank" 
          rel="noopener noreferrer"
          className="transition-transform hover:scale-105 active:scale-95"
        >
          <img 
            src="https://i.ibb.co/S7mStBGD/logop.png" 
            alt="logop" 
            className="h-16 md:h-20 w-auto"
          />
        </a>
        <div className="text-center text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]">
          © {new Date().getFullYear()} Patitour • Turismo Pedagógico e Experiências
        </div>
      </footer>
    </div>
  );
}

export default App;
