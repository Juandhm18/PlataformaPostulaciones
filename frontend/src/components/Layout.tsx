import React from 'react';
import { Navbar } from './Navbar';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col items-center bg-washi">
            <Navbar />
            <main className="w-full max-w-6xl px-8 pb-16 fade-in">
                {children}
            </main>
        </div>
    );
};
