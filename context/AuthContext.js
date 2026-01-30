import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../lib/api';
import { useRouter } from 'next/router'

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();


// check token au démarrage
useEffect(() => {
    if (typeof window === 'undefined' || window.location.pathname === '/login') {
        setLoading(false);
        return;
    }

    const checkAuth = async () => {
        try {
        const res = await authApi.me()
        console.log('res : ',res)
        setUser(res.data.user)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            console.log('token invalide')
        } finally {
            setLoading(false);
        }
    };
    checkAuth()
}, []);

// register

const register = async (email, username, password, firstName, lastName) => {
    try  {
        const res = await authApi.register(email, username, password, firstName, lastName)
        setUser(res.data.user)
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        router.push('/dashboard')
    } catch (error) {
        throw error;
    }
}

//lgin

const login = async (email, password) => {
    try {
        const res = await authApi.login(email, password)
        console.log('reponse login :', res)

        setUser(res.data.user)
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        router.push('/dashboard')
    } catch (error) {

        throw error;
    }
};

// logout
const logout = () => {

        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setUser(null);
        router.push('/login')
}

const value = {
    user,
    register,
    login,
    logout,
    loading,
    isAuthenticated: !!user
};

if (loading) return <div>chargement...</div>;

return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
)
}

export const useAuth = () => useContext(AuthContext);