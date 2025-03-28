import Ticket  from "../models/ticket";
import User  from "../models/user";

const API_URL = 'http://localhost:4200/api';

export const getTickets = async (): Promise<Ticket[]> => {
  const response = await fetch(`${API_URL}/tickets`);
  if (!response.ok) {
    throw new Error('Failed to fetch tickets');
  }
  return response.json();
};

export const getTicketById = async (id: number): Promise<Ticket> => {
  const response = await fetch(`${API_URL}/tickets/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ticket with id ${id}`);
  }
  return response.json();
};

export const createTicket = async (description: string): Promise<Ticket> => {
  const response = await fetch(`${API_URL}/tickets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create ticket');
  }
  return response.json();
};

export const assignUserToTicket = async (ticketId: number, userId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/tickets/${ticketId}/assign/${userId}`, {
    method: 'PUT',
  });
  
  if (!response.ok) {
    throw new Error('Failed to assign user to ticket');
  }
};

export const unassignUserFromTicket = async (ticketId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/tickets/${ticketId}/unassign`, {
    method: 'PUT',
  });
  
  if (!response.ok) {
    throw new Error('Failed to unassign user from ticket');
  }
};

export const completeTicket = async (ticketId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/tickets/${ticketId}/complete`, {
    method: 'PUT',
  });
  
  if (!response.ok) {
    throw new Error('Failed to mark ticket as complete');
  }
};

export const incompleteTicket = async (ticketId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/tickets/${ticketId}/complete`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to mark ticket as incomplete');
  }
};

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await fetch(`${API_URL}/users/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user with id ${id}`);
  }
  return response.json();
};