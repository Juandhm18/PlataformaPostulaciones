import React, { useState } from 'react';
import api from '../api';
import { Layout } from '../components/Layout';
import { useNavigate } from 'react-router-dom';

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
        softSkills: 'Teamwork',
        maxApplicants: 1
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/vacancies', {
                ...formData,
                maxApplicants: Number(formData.maxApplicants)
            });
            navigate('/');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error creating vacancy');
        }
    };

    return (
        <Layout>
            <div className="card-zen max-w-3xl mx-auto mt-12 fade-in shadow-2xl">
                <h3 className="font-jp-serif text-3xl mb-10 text-center text-gold-muted tracking-widest uppercase">New Position</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-silver-mist/40 block">Job Title</label>
                        <input name="title" placeholder="e.g. Senior Backend Architect" onChange={handleChange} className="input-zen" required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-silver-mist/40 block">Company Name</label>
                        <input name="company" placeholder="e.g. Zen Systems" onChange={handleChange} className="input-zen" required />
                    </div>

                    <div className="col-span-2 space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-silver-mist/40 block">Description</label>
                        <textarea name="description" placeholder="Describe the way of the soul in this role..." onChange={handleChange} className="input-zen h-32 resize-none" required />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-silver-mist/40 block">Stack</label>
                        <input name="technologies" placeholder="e.g. Node.js, TS, PostgreSQL" onChange={handleChange} className="input-zen" required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-silver-mist/40 block">Location</label>
                        <input name="location" placeholder="e.g. Kyoto, Remote" onChange={handleChange} className="input-zen" required />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-silver-mist/40 block">Seniority</label>
                        <input name="seniority" placeholder="e.g. Lead" onChange={handleChange} className="input-zen" required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-silver-mist/40 block">Salary Range</label>
                        <input name="salaryRange" placeholder="e.g. $80k - $120k" onChange={handleChange} className="input-zen" required />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-silver-mist/40 block">Modality</label>
                        <select name="modality" onChange={handleChange} className="input-zen appearance-none cursor-pointer">
                            <option value="remote">Remote</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="onsite">Onsite</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-silver-mist/40 block">Max Callers</label>
                        <input type="number" name="maxApplicants" placeholder="Capacity" onChange={handleChange} className="input-zen" required min="1" />
                    </div>

                    <div className="col-span-2 flex justify-end gap-8 mt-10 pt-8 border-t border-white/5">
                        <button type="button" onClick={() => navigate('/')} className="text-[10px] uppercase tracking-widest text-silver-mist/40 hover:text-hanko-red transition font-bold">Discard</button>
                        <button type="submit" className="btn-zen px-12 py-3">Publish Call</button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};
