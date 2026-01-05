import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="flex justify-between items-end mb-12 border-b border-white/5 pb-6 px-8 pt-8 max-w-6xl mx-auto w-full">
            <div className="cursor-pointer group" onClick={() => navigate('/')}>
                <h1 className="text-4xl font-jp-serif text-gold-muted tracking-widest group-hover:text-silver-mist transition duration-500">KODO</h1>
                <p className="text-[10px] text-silver-mist/30 mt-2 tracking-widest uppercase">The Way of Employment</p>
            </div>

            <div className="flex items-center gap-8">
                {user ? (
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <span className="block font-jp-serif text-lg text-gold-muted">{user.name}</span>
                            <span className="text-[10px] text-silver-mist/30 uppercase tracking-widest">{user.role}</span>
                        </div>
                        <button onClick={handleLogout} className="text-[10px] border-l border-white/10 pl-6 text-silver-mist/40 hover:text-hanko-red transition uppercase tracking-widest font-bold">
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-8 text-[11px] uppercase tracking-widest font-bold">
                        <button onClick={() => navigate('/login')} className="text-silver-mist/40 hover:text-gold-muted transition">Sign In</button>
                        <button onClick={() => navigate('/register')} className="text-silver-mist/40 hover:text-gold-muted transition">Register</button>
                    </div>
                )}
            </div>
        </header>
    );
};
