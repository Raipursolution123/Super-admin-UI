import { useState, useEffect, useCallback } from 'react';
import { ticketsAPI } from '../services/ticketsService';
import { message } from 'antd';

export const useTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ticketsAPI.fetchTickets();
      const sortedData = response.data.sort((a, b) => new Date(b.raised_date) - new Date(a.raised_date));
      setTickets(sortedData);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      message.error('Failed to fetch support tickets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const updateStatus = async (ticketId, newStatus) => {
    setLoading(true);
    try {
      await ticketsAPI.updateTicketStatus(ticketId, newStatus);
      // Update local state after successful simulation
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
      message.success('Ticket status updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('Failed to update ticket status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Stats calculation
  const stats = {
    total: tickets.length,
    solved: tickets.filter(t => t.status === 'Solved').length,
    pending: tickets.filter(t => t.status === 'In Progress').length,
  };

  return {
    tickets,
    loading,
    stats,
    updateStatus,
    fetchTickets
  };
};
