import API from './api';

// Map backend status values to frontend display format
const mapStatusToFrontend = (backendStatus) => {
  const statusMap = {
    'PENDING': 'Pending',
    'IN_PROGRESS': 'In Progress',
    'SOLVED': 'Solved',
    'CLOSED': 'Closed'
  };
  return statusMap[backendStatus] || backendStatus;
};

// Map frontend status values to backend format
const mapStatusToBackend = (frontendStatus) => {
  const statusMap = {
    'Pending': 'PENDING',
    'In Progress': 'IN_PROGRESS',
    'Solved': 'SOLVED',
    'Closed': 'CLOSED'
  };
  return statusMap[frontendStatus] || frontendStatus;
};

// Format date from backend to frontend format
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  } catch (error) {
    return dateString;
  }
};

export const ticketsAPI = {
  fetchTickets: async () => {
    try {
      const response = await API.get('/superadmin/support-tickets/');
      
      // Backend returns: { results: [...], stats: {...}, count, page, etc. }
      // Frontend expects: { data: [...] }
      const tickets = response.data.results || [];
      
      // Map backend data to frontend format
      const mappedTickets = tickets.map(ticket => ({
        id: ticket.id,
        name: ticket.name,
        email: ticket.email,
        raised_date: formatDate(ticket.raised_date),
        problem_title: ticket.problem_title,
        problem_description: ticket.problem_description,
        problem_query: ticket.problem_query,
        attachments: ticket.attachments || [],
        status: mapStatusToFrontend(ticket.status),
        // Include additional fields if needed
        updated_date: formatDate(ticket.updated_date),
        solved_date: formatDate(ticket.solved_date),
        admin_response: ticket.admin_response,
        responded_by_name: ticket.responded_by_name,
        user_email: ticket.user_email
      }));
      
      return { data: mappedTickets };
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  },

  updateTicketStatus: async (ticketId, status) => {
    try {
      // Map frontend status to backend format
      const backendStatus = mapStatusToBackend(status);
      
      const response = await API.patch(`/superadmin/support-tickets/${ticketId}/`, {
        status: backendStatus
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating ticket status:', error);
      throw error;
    }
  }
};
