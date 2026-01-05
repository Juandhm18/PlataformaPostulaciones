import React, { useEffect, useState } from 'react';
import api from '../api';
import type { Vacancy, Application } from '../types';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Cpu, Building2, UserCircle2, ArrowRight } from 'lucide-react';

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
            // Refresh applications
            const aRes = await api.get('/applications');
            setApplications(aRes.data.data);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error applying');
        }
    };

    if (loading) return (
        <Layout>
            <div className="flex items-center justify-center min-h-[60vh] font-jp-serif text-stone-400 space-x-2">
                <div className="w-2 h-2 bg-gold-muted rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gold-muted rounded-full animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-2 h-2 bg-gold-muted rounded-full animate-bounce [animation-delay:-.5s]"></div>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-4">
                <div className="space-y-1">
                    <h2 className="font-jp-serif text-4xl text-gold-muted tracking-tight uppercase">Opportunities</h2>
                    <p className="text-silver-mist/40 text-[10px] uppercase tracking-[0.3em] font-light">Explore your next challenge</p>
                </div>
                {(user?.role === 'admin' || user?.role === 'gestor') && (
                    <button
                        onClick={() => navigate('/create-vacancy')}
                        className="btn-zen-secondary flex items-center gap-2 group"
                    >
                        Create Vacancy
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20 fade-in">
                {vacancies.length === 0 ? (
                    <div className="col-span-full py-20 text-center border border-dashed border-white/5 rounded-sm">
                        <p className="text-stone-400 italic font-light tracking-wide">The path is clear. No vacancies found at this moment.</p>
                    </div>
                ) : (
                    vacancies.map((v) => (
                        <div key={v.id} className="card-zen flex flex-col justify-between group h-full relative overflow-hidden backdrop-blur-sm hover:border-gold-muted/30 transition-all duration-500">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-muted/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-gold-muted/10 transition-colors"></div>

                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="space-y-1">
                                        <h3 className="font-jp-serif text-2xl text-gold-muted group-hover:text-gold-light transition-colors">{v.title}</h3>
                                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-silver-mist/40">
                                            <Building2 size={10} />
                                            <span>{v.company}</span>
                                        </div>
                                    </div>
                                    <span className="text-[9px] border border-gold-muted/20 px-2 py-0.5 text-gold-muted/80 rounded-[2px] uppercase tracking-tighter bg-gold-muted/5 font-medium">
                                        {v.modality}
                                    </span>
                                </div>

                                <p className="text-sm leading-relaxed text-silver-mist/70 mb-8 font-light line-clamp-2 italic">
                                    "{v.description}"
                                </p>

                                <div className="grid grid-cols-1 gap-4 mb-6">
                                    <div className="flex flex-wrap gap-2">
                                        {v.technologies?.map((tech) => (
                                            <span key={tech.id} className="text-[10px] px-2 py-0.5 bg-obsidian/60 border border-white/5 text-silver-mist/60 rounded-sm hover:text-gold-muted/80 transition-colors flex items-center gap-1">
                                                <Cpu size={8} className="opacity-40" />
                                                {tech.name}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-[11px] text-silver-mist/50 pt-2">
                                        <div className="flex items-center gap-1.5 bg-white/[0.02] px-3 py-1.5 rounded-sm border border-white/[0.03]">
                                            <MapPin size={12} className="text-gold-muted/40" />
                                            <span>{v.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-white/[0.02] px-3 py-1.5 rounded-sm border border-white/[0.03]">
                                            <Briefcase size={12} className="text-gold-muted/40" />
                                            <span>{v.seniority}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-white/[0.02] px-3 py-1.5 rounded-sm border border-white/[0.03]">
                                            <DollarSign size={12} className="text-gold-muted/40" />
                                            <span>{v.salaryRange}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/5">
                                <span className="text-[9px] font-mono text-silver-mist/20 uppercase">
                                    Capacity: {v.maxApplicants} slots remaining
                                </span>
                                {user?.role === 'coder' ? (
                                    <button
                                        onClick={() => handleApply(v.id)}
                                        className="btn-zen !py-1.5 !px-6 text-[10px] active:scale-95 transition-transform"
                                    >
                                        Apply Now
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-1.5 text-[9px] text-silver-mist/20 uppercase tracking-[0.2em]">
                                        <UserCircle2 size={10} />
                                        <span>Management Only</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-32 mb-20">
                <div className="flex items-center gap-6 mb-12">
                    <h2 className="font-jp-serif text-3xl text-silver-mist/30 tracking-widest uppercase">JOURNEY</h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                </div>

                <div className="space-y-6">
                    {applications.length === 0 ? (
                        <div className="p-8 text-center bg-white/[0.01] border border-white/[0.03] rounded-sm">
                            <p className="text-sm text-silver-mist/20 font-light italic">Your history is silent. The path begins with an application.</p>
                        </div>
                    ) : (
                        applications.map((app) => (
                            <div key={app.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.03] px-6 transition-all duration-300 rounded-sm group">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-jp-serif text-xl text-gold-muted/80 group-hover:text-gold-muted transition-colors">{app.vacancy.title}</h4>
                                        <span className="text-[10px] px-2 py-0.5 border border-white/10 rounded-sm text-silver-mist/30">{app.vacancy.modality}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-silver-mist/30 font-light">
                                        <span className="flex items-center gap-1.5"><Building2 size={10} /> {app.vacancy.company}</span>
                                        <span className="flex items-center gap-1.5"><MapPin size={10} /> {app.vacancy.location}</span>
                                    </div>
                                </div>
                                <div className="mt-4 sm:mt-0 text-left sm:text-right border-l sm:border-l-0 sm:border-r border-white/5 pl-4 sm:pl-0 sm:pr-8">
                                    <span className="block text-[9px] uppercase tracking-[0.3em] text-silver-mist/10 mb-1">Engaged On</span>
                                    <span className="font-jp-sans text-sm text-silver-mist/40">{new Date(app.appliedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Layout>
    );
};
