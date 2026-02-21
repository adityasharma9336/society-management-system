import axios from 'axios';

// Configure Axios instance
const api = axios.create({
    baseURL: '/api',
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// User Profile
export const updateUserProfile = async (userData) => {
    const { data } = await api.put('/users/profile', userData);
    return data;
};

// Bills
export const getBills = async () => {
    const { data } = await api.get('/bills');
    return data;
};

export const getMyBills = async () => {
    const { data } = await api.get('/bills/my');
    return data;
};

export const payBill = async (id, paymentData) => {
    const { data } = await api.post(`/bills/${id}/pay`, paymentData);
    return data;
};

// Complaints
export const getComplaints = async () => {
    const { data } = await api.get('/complaints');
    return data;
};

export const getMyComplaints = async () => {
    const { data } = await api.get('/complaints/my');
    return data;
};

export const createComplaint = async (complaintData) => {
    const { data } = await api.post('/complaints', complaintData);
    return data;
};

export const updateComplaintStatus = async (id, statusData) => {
    const { data } = await api.put(`/complaints/${id}/status`, statusData);
    return data;
};

// Visitors
export const getAllVisitors = async () => {
    const { data } = await api.get('/visitors');
    return data;
};

export const getMyVisitors = async () => {
    const { data } = await api.get('/visitors/my');
    return data;
};

export const addVisitor = async (visitorData) => {
    const { data } = await api.post('/visitors', visitorData);
    return data;
};

export const exitVisitor = async (id) => {
    const { data } = await api.put(`/visitors/${id}/exit`);
    return data;
};

// Notices
export const getNotices = async () => {
    const { data } = await api.get('/notices');
    return data.notices || [];
};

// Polls
export const getPolls = async () => {
    const { data } = await api.get('/polls');
    return data;
};

// Analytics (Admin)
export const getBillingStats = async () => {
    try {
        const { data } = await api.get('/bills/stats');
        return data;
    } catch {
        return { totalCollected: 0, outstandingDues: 0, pendingApprovals: 0 };
    }
};

export const getAuditLogs = async () => {
    try {
        const { data } = await api.get('/audit');
        return data;
    } catch {
        return [];
    }
};
