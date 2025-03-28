import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { TicketProvider } from './context/ticket.context';
import TicketList from './components/TicketList/ticket.list';
import TicketDetails from './components/TicketDetail/ticket.detail';

const App: React.FC = () => {
  return (
    <TicketProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<TicketList />} />
          <Route path="/ticket/:id" element={<TicketDetails />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </TicketProvider>
  );
};

export default App;
