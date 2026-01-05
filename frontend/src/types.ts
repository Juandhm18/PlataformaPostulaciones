export interface User {
    id: number;
    email: string;
    name: string;
    role: 'admin' | 'gestor' | 'coder';
}

export interface Technology {
    id: number;
    name: string;
}

export interface Vacancy {
    id: number;
    title: string;
    description: string;
    technologies: Technology[];
    seniority: string;
    softSkills: string;
    location: string;
    modality: 'remote' | 'hybrid' | 'onsite';
    salaryRange: string;
    company: string;
    maxApplicants: number;
    isActive: boolean;
}

export interface Application {
    id: number;
    appliedAt: string;
    vacancy: Vacancy;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}
