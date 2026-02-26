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

// Users (Admin)
export const getUsers = async () => {
    const { data } = await api.get('/users');
    return data;
};

export const deleteUser = async (id) => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
};

export const updateUserRole = async (id, roleData) => {
    const { data } = await api.put(`/users/${id}`, roleData);
    return data;
};

export const createUser = async (userData) => {
    const { data } = await api.post('/users', userData);
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

export const createBill = async (billData) => {
    const { data } = await api.post('/bills', billData);
    return data;
};

export const generateBulkBills = async (bulkData) => {
    const { data } = await api.post('/bills/bulk', bulkData);
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

export const addComplaintMessage = async (id, messageData) => {
    const { data } = await api.post(`/complaints/${id}/message`, messageData);
    return data;
};

export const getComplaintById = async (id) => {
    const { data } = await api.get(`/complaints/${id}`);
    return data;
};

export const getComplaintStats = async () => {
    const { data } = await api.get('/complaints/stats');
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

export const updateVisitorStatus = async (id, statusData) => {
    const { data } = await api.put(`/visitors/${id}/status`, statusData);
    return data;
};

// Events
export const getEvents = async () => {
    const { data } = await api.get('/events');
    return data || [];
};

// Notices
export const getNotices = async (params = {}) => {
    // Convert params object to query string
    const query = new URLSearchParams(params).toString();
    const { data } = await api.get(`/notices?${query}`);
    return data.notices || [];
};

export const createNotice = async (noticeData) => {
    const { data } = await api.post('/notices', noticeData);
    return data;
};

export const deleteNotice = async (id) => {
    const { data } = await api.delete(`/notices/${id}`);
    return data;
};

// Polls
export const getPolls = async () => {
    const { data } = await api.get('/polls');
    return data;
};

export const votePoll = async (id, optionIndex) => {
    const { data } = await api.put(`/polls/${id}/vote`, { optionIndex });
    return data;
};

// Analytics (Admin)
export const getBillingStats = async () => {
    const { data } = await api.get('/bills/stats');
    return data;
};

export const getAuditLogs = async () => {
    try {
        const { data } = await api.get('/audit');
        return data;
    } catch {
        return [];
    }
};

export const getAdminDashboardStats = async () => {
    const { data } = await api.get('/admin/dashboard-stats');
    return data;
};
