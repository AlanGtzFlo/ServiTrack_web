// src/app/clients/clients-data.ts

// Interfaz para el contacto del cliente
export interface Contact {
  email: string;
  phone: string;
}

// Interfaz principal para el Cliente
export interface Client {
  id: number;
  name: string;
  rfc: string;
  address: string;
  contact: Contact; // Usamos la interfaz Contact aquí
  status: 'Activo' | 'Inactivo' | 'Potencial'; // Añadimos 'Potencial' si lo estás usando
  registrationDate: Date; // Usamos Date para la fecha
}

// Datos simulados de clientes
// Usamos 'export let' para que puedan ser modificados por las funciones de crear/editar/eliminar
export let CLIENTS_DATA: Client[] = [
  {
    id: 1,
    name: 'Innovatech Solutions',
    rfc: 'ISOL870512ABC',
    address: 'Av. Siempre Viva 742, Springfield, Anytown',
    contact: { email: 'contacto@innovatech.com', phone: '55-1234-5678' },
    status: 'Activo',
    registrationDate: new Date('2023-01-15T10:00:00Z')
  },
  {
    id: 2,
    name: 'Global Logistics Corp',
    rfc: 'GLC901123DEF',
    address: 'Calle Falsa 123, Ciudad de México',
    contact: { email: 'info@globallog.com', phone: '55-8765-4321' },
    status: 'Inactivo',
    registrationDate: new Date('2022-07-20T14:30:00Z')
  },
  {
    id: 3,
    name: 'Creative Minds Agency',
    rfc: 'CMA950301GHI',
    address: 'Blvd. de los Sueños 45, Guadalajara',
    contact: { email: 'hello@creativeminds.net', phone: '33-2233-4455' },
    status: 'Activo',
    registrationDate: new Date('2024-02-28T09:15:00Z')
  },
  {
    id: 4,
    name: 'Tech Solutions Inc.',
    rfc: 'TSI980701JKL',
    address: '123 Main St, Anytown, CA',
    contact: { email: 'sales@techsolutions.com', phone: '11-2222-3333' },
    status: 'Potencial',
    registrationDate: new Date('2023-05-10T11:45:00Z')
  },
  {
    id: 5,
    name: 'Green Energy Co.',
    rfc: 'GEC010915MNO',
    address: '456 Oak Ave, Greendale, TX',
    contact: { email: 'support@greenenergy.co', phone: '44-5555-6666' },
    status: 'Inactivo',
    registrationDate: new Date('2022-11-01T16:00:00Z')
  }
];