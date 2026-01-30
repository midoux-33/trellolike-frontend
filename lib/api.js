import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3000/api'
});



// Intercepteu - ajoute token automatiquement a chaque requete 
api.interceptors.request.use((config) => {
    
    // recupere le token depuis localstorage

    const token = typeof window !== 'undefined'
    ? localStorage.getItem('token')
    : null;

    // su tokken existe -> ajoute a toute les requetes

    if (token) {
        config.headers = config.headers || {} ;
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// intercepteur - gére erreur 401 

api.interceptors.response.use(
    (response) => response ,
    (error) => {

        if (error.response?.status === 401) {

            // token expiré ou invalide -> logout
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)


///// FONCTIONS MÉTIER BACK /////  

// User search

export const usersApi = {
    search: (query) => api.get(`/users/search?q=${encodeURIComponent(query)}`),
}

// Auth

export const authApi = {
    login: (email, password) => api.post('/auth/login', {email, password}),
    register: (data) => api.post('/auth/register', data),
    me: () => api.get('/auth/me'),
}

// List

export const listsApi = {
    getAll: () => api.get('/lists'),
    create: (data) => api.post('/lists', data),
    getById: (listId) => api.get(`/lists/${listId}`),
    update: (listId, data) => api.put(`/lists/${listId}`, data),
    delete: (listId) => api.delete(`/lists/${listId}`),
    addCollaborator: (listId, data) => api.post(`/lists/${listId}/collaborators`, data),
    updateCollaboratorRole: (listId, collabId, data) => api.post(`/lists/${listId}/collaborator/${collabId}`, data),
    deleteCollaborator: (listId, collabId) => api.delete(`lists/${listId}/collaborators/${collabId}`),
}

// Task

export const taskApi = {
    getTasksByList: (listId) => api.get(`/tasks/list/${listId}`),
    create: (listId, data) => api.post(`/tasks/${listId}`, data),
    getTaskById : (taskId) => api.get(`/tasks/${taskId}`),
    update: (taskId, data) => api.put(`/tasks/${taskId}`, data),
    delete: (taskId) => api.delete(`/tasks/${taskId}`),
}


export default api;