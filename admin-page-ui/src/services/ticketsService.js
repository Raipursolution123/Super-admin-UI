import API from './api';

// Demo data for initial implementation
const demoTickets = [
  {
    id: 1,
    name: 'Arka',
    email: 'arka@example.com',
    raised_date: '2025-12-20',
    problem_title: 'Login Issue',
    problem_description: 'Unable to login to the dashboard.',
    problem_query: 'I keep getting a "Wrong Credentials" error even though they are correct.',
    attachments: [],
    status: 'In Progress',
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'john@example.com',
    raised_date: '2025-12-22',
    problem_title: 'App Slowdown',
    problem_description: 'The app is very slow during peak hours.',
    problem_query: 'Does the application have any performance issues recently?',
    attachments: [],
    status: 'Solved',
  }
];

export const ticketsAPI = {
  fetchTickets: async () => {
    // Simulating API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: demoTickets });
      }, 500);
    });
    // Final implementation would be:
    // return API.get('/support-tickets/');
  },

  updateTicketStatus: async (ticketId, status) => {
    // Simulating API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { message: 'Status updated successfully' } });
      }, 500);
    });
    // Final implementation would be:
    // return API.patch(`/support-tickets/${ticketId}/`, { status });
  }
};
