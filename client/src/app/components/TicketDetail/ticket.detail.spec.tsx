import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import TicketDetail from './ticket.detail';
import { TicketProvider } from '../../context/ticket.context';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' })
}));

jest.mock('../../services/ticket.service', () => ({
  getTicketById: jest.fn().mockResolvedValue({
    id: 1,
    description: 'Test ticket',
    completed: false,
    assigneeId: null
  }),
  completeTicket: jest.fn().mockResolvedValue({}),
  incompleteTicket: jest.fn().mockResolvedValue({}),
  assignTicket: jest.fn().mockResolvedValue({}),
  unassignTicket: jest.fn().mockResolvedValue({})
}));

const renderTicketDetail = (id = '1') => {
  return render(
    <MemoryRouter initialEntries={[`/ticket/${id}`]}>
      <TicketProvider>
        <Routes>
          <Route path="/ticket/:id" element={<TicketDetail />} />
        </Routes>
      </TicketProvider>
    </MemoryRouter>
  );
};

describe('TicketDetail Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    renderTicketDetail();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

});