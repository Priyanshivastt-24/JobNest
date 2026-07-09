import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Axios base URL: in production the frontend is served by the same server,
// so relative /api/... paths work. In development Vite's proxy handles it.
// If you deploy frontend and backend to different origins, set VITE_API_URL.
if (import.meta.env.VITE_API_URL) {
    axios.defaults.baseURL = import.meta.env.VITE_API_URL;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios
                .get('/api/auth/me')
                .then((res) => setUser(res.data))
                .catch((err) => {
                    // Token expired or invalid — clear auth state
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                    delete axios.defaults.headers.common['Authorization'];
                    if (err.response && err.response.status !== 401) {
                        // Unexpected error — log but don't crash
                        console.error('Auth check failed:', err.message);
                    }
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const _storeAuth = (newToken, userData) => {
        localStorage.setItem('token', newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        setToken(newToken);
        setUser(userData);
    };

    const login = async (email, password) => {
        const res = await axios.post('/api/auth/login', { email, password });
        _storeAuth(res.data.token, res.data.user);
        return res.data.user;
    };

    const register = async (name, email, password, role) => {
        const res = await axios.post('/api/auth/register', { name, email, password, role });
        _storeAuth(res.data.token, res.data.user);
        return res.data.user;
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
