import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Layout } from '../components/Layout';

export const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Defaulting to 'coder' role for public registration
            await api.post('/auth/register', { name, email, password, role: 'coder' });
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <Layout>
            <div className="max-w-md mx-auto mt-20 fade-in">
                <div className="card-zen text-center">
                    <h2 className="font-jp-serif text-3xl mb-8 text-gold-muted uppercase tracking-widest">Join</h2>
                    {error && <p className="text-hanko-red text-sm mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-8 text-left">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-silver-mist/30 mb-2">Name</label>
                            <input
                                type="text"
                                className="input-zen"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
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
                        <button type="submit" className="w-full btn-zen mt-4">Begin Journey</button>
                    </form>
                    <p className="mt-8 text-[11px] text-silver-mist/30 cursor-pointer hover:text-gold-muted transition uppercase tracking-widest" onClick={() => navigate('/login')}>
                        Return to entrance.
                    </p>
                </div>
            </div>
        </Layout>
    );
};
