
export const BLOQUEIOS_MANUAIS: string[] = ['2025-11-20T13:00', '2025-11-20T13:30'];
export const HORARIO_INICIO = 13;
export const HORARIO_FIM = 18;
export const DURACAO_REUNIAO = 30;

export const EMAILJS_SERVICE_ID = 'service_tuk62ie';
export const EMAILJS_TEMPLATE_ID = 'template_59t268h';
export const EMAILJS_CLIENT_TEMPLATE_ID = 'template_i07vwop';
export const EMAILJS_PUBLIC_KEY = 'B4Y9trQ0fvuOdWMvV';

export const GOOGLE_SHEETS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxIvNcmLhc1BtAeKnSXsEuudgiAtNLGxL7PoEnR-GoMtF0owMKRr-iC5wV66QIR0xnv8A/exec';

export const DIAS_SEMANA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

export const getBrasiliaDate = (): Date => {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
};
