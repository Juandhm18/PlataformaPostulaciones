import React, { useEffect, useState } from 'react';
import api from '../api';
import type { Vacancy, Application } from '../types';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vRes, aRes] = await Promise.all([
                    api.get('/vacancies'),
                    api.get('/applications').catch(() => ({ data: { data: [] } }))
                ]);
                setVacancies(vRes.data.data);
                setApplications(aRes.data.data);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleApply = async (id: number) => {
        try {
            await api.post('/applications', { vacancyId: id });
            alert('Application submitted successfully.');
            // Refresh applications
            const aRes = await api.get('/applications');
            setApplications(aRes.data.data);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error applying');
        }
    };

    if (loading) return <Layout><div className="text-center mt-20 font-jp-serif text-stone-400">Loading...</div></Layout>;

    return (
        <Layout>
            <div className="flex justify-between items-center mb-12">
                <h2 className="font-jp-serif text-3xl text-gold-muted border-l-4 border-hanko-red pl-4 tracking-widest uppercase">Opportunities</h2>
                {(user?.role === 'admin' || user?.role === 'gestor') && (
                    <button
                        onClick={() => navigate('/create-vacancy')}
                        className="btn-zen-secondary"
                    >
                        Create Vacancy
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 fade-in">
                {vacancies.length === 0 ? (
                    <p className="col-span-full text-center text-stone-400 italic">No vacancies found at this moment.</p>
                ) : (
                    vacancies.map((v) => (
                        <div key={v.id} className="card-zen flex flex-col justify-between group h-full">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-jp-serif text-xl border-b border-bamboo-dark pb-1 inline-block text-gold-muted">{v.title}</h3>
                                        <p className="text-xs uppercase mt-2 tracking-widest text-silver-mist/50">{v.company}</p>
                                    </div>
                                    <span className="text-[10px] border border-gold-muted/30 px-2 py-1 text-gold-muted rounded-sm uppercase tracking-tighter bg-gold-muted/5">{v.modality}</span>
                                </div>
                                <p className="text-sm leading-relaxed text-silver-mist/80 mb-6 font-light">{v.description.substring(0, 150)}...</p>
                                <div className="text-[11px] text-silver-mist/60 space-y-2 bg-obsidian/40 p-4 rounded-sm border border-white/5">
                                    <p><span className="text-gold-muted/60 mr-2">TECH //</span> {v.technologies}</p>
                                    <p><span className="text-gold-muted/60 mr-2">LOC //</span> {v.location}</p>
                                    <p><span className="text-gold-muted/60 mr-2">PAY //</span> {v.salaryRange}</p>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-between items-center pt-4 border-t border-white/5">
                                <span className="text-[10px] font-mono text-silver-mist/30">ID: {v.id} | {v.maxApplicants} SPOTS</span>
                                {user?.role === 'coder' ? (
                                    <button
                                        onClick={() => handleApply(v.id)}
                                        className="btn-zen py-1 px-4 text-[10px]"
                                    >
                                        Apply
                                    </button>
                                ) : (
                                    <span className="text-[10px] text-silver-mist/30 italic uppercase tracking-widest">Management</span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-24 border-t border-bamboo pt-12">
                <h2 className="font-jp-serif text-2xl text-silver-mist/40 border-l-4 border-white/10 pl-4 mb-10 tracking-widest uppercase">Your Path</h2>
                <div className="space-y-4">
                    {applications.length === 0 ? (
                        <p className="text-sm text-silver-mist/30 font-light italic">No active applications in your history.</p>
                    ) : (
                        applications.map((app) => (
                            <div key={app.id} className="flex justify-between items-center py-5 border-b border-white/5 hover:bg-white/5 px-4 transition rounded-sm">
                                <div>
                                    <h4 className="font-jp-serif text-lg text-gold-muted">{app.vacancy.title}</h4>
                                    <span className="text-[10px] uppercase tracking-tighter text-silver-mist/40">{app.vacancy.company} — {app.vacancy.modality}</span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-[10px] uppercase tracking-widest text-silver-mist/20 mb-1">Applied On</span>
                                    <span className="font-jp-sans text-sm text-silver-mist/50">{new Date(app.appliedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Layout>
    );
};
