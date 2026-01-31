export type ComplaintStatus = 'Submitted' | 'Processing' | 'Investigating' | 'Resolved' | 'Closed';

export type Complaint = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ComplaintStatus;
  date: string;
  keywords: string[];
  updates: {
    date: string;
    message: string;
    status: ComplaintStatus;
  }[];
};

const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP-1023',
    title: 'Incorrect Billing Cycle',
    description: 'My monthly bill was generated twice for the period of January 2024.',
    category: 'Billing',
    status: 'Resolved',
    date: '2024-01-15T10:00:00Z',
    keywords: ['billing', 'duplicate', 'payment'],
    updates: [
      { date: '2024-01-15T10:00:00Z', message: 'Complaint submitted.', status: 'Submitted' },
      { date: '2024-01-16T14:30:00Z', message: 'Assigned to billing department.', status: 'Processing' },
      { date: '2024-01-18T09:15:00Z', message: 'Duplicate charge identified and reversed.', status: 'Resolved' }
    ]
  },
  {
    id: 'CMP-1056',
    title: 'Frequent Internet Outages',
    description: 'Internet disconnects every day around 3 PM for approximately 20 minutes.',
    category: 'Technical',
    status: 'Investigating',
    date: '2024-02-20T16:45:00Z',
    keywords: ['internet', 'outage', 'connection'],
    updates: [
      { date: '2024-02-20T16:45:00Z', message: 'Complaint filed.', status: 'Submitted' },
      { date: '2024-02-21T11:00:00Z', message: 'Technician scheduled for remote diagnostics.', status: 'Processing' },
      { date: '2024-02-22T08:00:00Z', message: 'Local line interference detected. Monitoring signal quality.', status: 'Investigating' }
    ]
  }
];

// In-memory "database" simulation for client-side persistence in this session
let complaintsStore: Complaint[] = [...INITIAL_COMPLAINTS];

export const getComplaints = () => complaintsStore;

export const getComplaintById = (id: string) => complaintsStore.find(c => c.id === id);

export const addComplaint = (complaint: Omit<Complaint, 'id' | 'date' | 'updates'>) => {
  const newComplaint: Complaint = {
    ...complaint,
    id: `CMP-${Math.floor(Math.random() * 9000) + 1000}`,
    date: new Date().toISOString(),
    updates: [
      {
        date: new Date().toISOString(),
        message: 'Complaint submitted successfully.',
        status: 'Submitted'
      }
    ]
  };
  complaintsStore = [newComplaint, ...complaintsStore];
  return newComplaint;
};