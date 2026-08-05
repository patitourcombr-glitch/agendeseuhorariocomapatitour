
export interface ClientInfo {
  name: string;
  school: string;
  email: string;
  whatsapp: string;
}

export interface BookingEvent {
  clientInfo: ClientInfo;
  date: Date;
}

export interface BookedSlotsState {
  [dateKey: string]: string[];
}

// Global window extension for EmailJS
declare global {
  interface Window {
    emailjs: any;
  }
}
