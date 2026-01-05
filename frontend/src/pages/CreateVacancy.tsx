import React, { useState } from 'react';
import api from '../api';
import { Layout } from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { Send, X, PlusCircle, Info } from 'lucide-react';

export const CreateVacancy: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        technologies: '',
        company: '',
        location: '',
        seniority: '',
        salaryRange: '',
        modality: 'remote',
        softSkills: '',
        maxApplicants: '1' // Keep as string for input handling
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Split technologies by comma and trim
            const techArray = formData.technologies
                .split(',')
                .map(t => t.trim())
                .filter(t => t !== '');

            await api.post('/vacancies', {
                ...formData,
                technologies: techArray,
                maxApplicants: Number(formData.maxApplicants),
                softSkills: formData.softSkills || 'Teamwork'
            });
            navigate('/');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error creating vacancy. Please verify all fields.');
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto mt-12 mb-20 fade-in">
                <div className="flex items-center gap-4 mb-12">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold-muted/20 to-gold-muted/40"></div>
                    <h3 className="font-jp-serif text-4xl text-gold-muted tracking-tight text-center uppercase">New Position</h3>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent via-gold-muted/20 to-gold-muted/40"></div>
                </div>

                <div className="card-zen p-10 relative overflow-hidden backdrop-blur-md">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-muted/0 via-gold-muted/40 to-gold-muted/0"></div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.3em] text-silver-mist/40 font-medium block ml-1">Title of the Call</label>
                            <input
                                name="title"
                                placeholder="e.g. Senior Backend Architect"
                                onChange={handleChange}
                                className="input-zen w-full"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.3em] text-silver-mist/40 font-medium block ml-1">Company Entity</label>
                            <input
                                name="company"
                                placeholder="e.g. Zen Systems"
                                onChange={handleChange}
                                className="input-zen w-full"
                                required
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.3em] text-silver-mist/40 font-medium block ml-1">Mission Description</label>
                            <textarea
                                name="description"
                                placeholder="Describe the way and the purpose of this role..."
                                onChange={handleChange}
                                className="input-zen w-full h-32 resize-none"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] uppercase tracking-[0.3em] text-silver-mist/40 font-medium block">Technology Stack</label>
                                <span className="text-[9px] text-silver-mist/20 italic">Separate with commas</span>
                            </div>
                            <div className="relative">
                                <input
                                    name="technologies"
                                    placeholder="e.g. Node.js, TS, PostgreSQL"
                                    onChange={handleChange}
                                    className="input-zen w-full pr-10"
                                    required
                                />
                                <PlusCircle size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-muted/30" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.3em] text-silver-mist/40 font-medium block ml-1">Sanctuary Location</label>
                            <input
                                name="location"
                                placeholder="e.g. Kyoto, Remote"
                                onChange={handleChange}
                                className="input-zen w-full"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.3em] text-silver-mist/40 font-medium block ml-1">Seniority Level</label>
                            <input
                                name="seniority"
                                placeholder="e.g. Master / Lead"
                                onChange={handleChange}
                                className="input-zen w-full"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.3em] text-silver-mist/40 font-medium block ml-1">Reward Range</label>
                            <input
                                name="salaryRange"
                                placeholder="e.g. $80k - $120k"
                                onChange={handleChange}
                                className="input-zen w-full"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.3em] text-silver-mist/40 font-medium block ml-1">Presence Modality</label>
                            <div className="relative">
                                <select
                                    name="modality"
                                    onChange={handleChange}
                                    className="input-zen w-full appearance-none cursor-pointer bg-transparent"
                                >
                                    <option value="remote" className="bg-obsidian">Remote</option>
                                    <option value="hybrid" className="bg-obsidian">Hybrid</option>
                                    <option value="onsite" className="bg-obsidian">On-site</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gold-muted/40">
                                    <PlusCircle size={14} className="rotate-45" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.3em] text-silver-mist/40 font-medium block ml-1">Max Callers Capacity</label>
                            <input
                                type="number"
                                name="maxApplicants"
                                placeholder="Capacity"
                                value={formData.maxApplicants}
                                onChange={handleChange}
                                className="input-zen w-full"
                                required
                                min="1"
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row justify-between items-center gap-8 mt-12 pt-10 border-t border-white/5">
                            <div className="flex items-center gap-2 text-[10px] text-silver-mist/20 uppercase tracking-widest italic font-light">
                                <Info size={12} />
                                <span>All changes are permanent once published</span>
                            </div>
                            <div className="flex items-center gap-10">
                                <button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    className="text-[10px] uppercase tracking-[0.3em] text-silver-mist/40 hover:text-hanko-red transition-all font-bold flex items-center gap-2 group"
                                >
                                    <X size={14} className="group-hover:rotate-90 transition-transform" />
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    className="btn-zen !px-16 !py-3.5 flex items-center gap-3 active:scale-95 transition-transform"
                                >
                                    Launch Call
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};
