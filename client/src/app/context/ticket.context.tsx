import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Ticket  from '../models/ticket';
import User  from '../models/user';
import * as api from '../services/api';

interface TicketContextType {
  tickets: Ticket[];
  users: User[];
  loading: boolean;
  error: string | null;
  fetchTickets: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  getTicketById: (id: number) => Promise<Ticket>;
  createTicket: (description: string) => Promise<Ticket>;
  assignTicket: (ticketId: number, userId: number) => Promise<void>;
  unassignTicket: (ticketId: number) => Promise<void>;
  completeTicket: (ticketId: number) => Promise<void>;
  incompleteTicket: (ticketId: number) => Promise<void>;
  filterTicketsByCompletion: (completed: boolean | null) => Ticket[];
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

interface TicketProviderProps {
  children: ReactNode;
}

export const TicketProvider: React.FC<TicketProviderProps> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTickets = await api.getTickets();
      setTickets(fetchedTickets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedUsers = await api.getUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getTicketById = async (id: number): Promise<Ticket> => {
    try {
      return await api.getTicketById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  const createTicket = async (description: string): Promise<Ticket> => {
    try {
      const newTicket = await api.createTicket(description);
      fetchTickets(); 
      return newTicket;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  const assignTicket = async (ticketId: number, userId: number): Promise<void> => {
    try {
      await api.assignUserToTicket(ticketId, userId);
      fetchTickets(); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  const unassignTicket = async (ticketId: number): Promise<void> => {
    try {
      await api.unassignUserFromTicket(ticketId);
      fetchTickets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  const completeTicket = async (ticketId: number): Promise<void> => {
    try {
      await api.completeTicket(ticketId);
      fetchTickets(); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  const incompleteTicket = async (ticketId: number): Promise<void> => {
    try {
      await api.incompleteTicket(ticketId);
      fetchTickets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  const filterTicketsByCompletion = (completed: boolean | null): Ticket[] => {
    if (completed === null) {
      return tickets;
    }
    return tickets.filter(ticket => ticket.completed === completed);
  };

  useEffect(() => {
    fetchTickets();
    fetchUsers();
  }, []);

  const value = {
    tickets,
    users,
    loading,
    error,
    fetchTickets,
    fetchUsers,
    getTicketById,
    createTicket,
    assignTicket,
    unassignTicket,
    completeTicket,
    incompleteTicket,
    filterTicketsByCompletion
  };

  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};