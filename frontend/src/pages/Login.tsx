import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Layout } from '../components/Layout';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            const { access_token, user } = res.data.data;
            login(access_token, user);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <Layout>
            <div className="max-w-md mx-auto mt-20 fade-in">
                <div className="card-zen text-center">
                    <h2 className="font-jp-serif text-3xl mb-8 text-gold-muted uppercase tracking-widest">Entrance</h2>
                    {error && <p className="text-hanko-red text-sm mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-8 text-left">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-silver-mist/30 mb-2">Email</label>
                            <input
                                type="email"
                                className="input-zen"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-silver-mist/30 mb-2">Secret</label>
                            <input
                                type="password"
                                className="input-zen"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="w-full btn-zen mt-4">Proceed</button>
                    </form>
                    <p className="mt-8 text-[11px] text-silver-mist/30 cursor-pointer hover:text-gold-muted transition uppercase tracking-widest" onClick={() => navigate('/register')}>
                        Begin a new journey.
                    </p>
                </div>
            </div>
        </Layout>
    );
};
