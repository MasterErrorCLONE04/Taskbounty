'use client';

import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function MyTasksFilters({
    initialSearch,
    initialStatus,
    tab
}: {
    initialSearch: string,
    initialStatus: string,
    tab: string
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get('search') as string;
        const status = formData.get('status') as string;

        const params = new URLSearchParams(searchParams.toString());
        if (search) params.set('search', search);
        else params.delete('search');

        params.set('status', status);
        params.set('tab', tab);

        router.push(`/client/tasks?${params.toString()}`);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const status = e.target.value;
        const params = new URLSearchParams(searchParams.toString());
        params.set('status', status);
        params.set('tab', tab);
        router.push(`/client/tasks?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="flex-1 relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                    type="text"
                    name="search"
                    defaultValue={initialSearch}
                    placeholder="Buscar por título o descripción..."
                    className="w-full h-14 pl-14 pr-6 bg-white border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-sky-500 outline-none transition-all shadow-sm shadow-slate-100"
                />
            </div>
            <div className="flex gap-4">
                <select
                    name="status"
                    defaultValue={initialStatus}
                    onChange={handleStatusChange}
                    className="px-6 h-14 bg-white border border-slate-100 rounded-2xl text-xs font-bold text-slate-500 hover:border-sky-200 transition-all outline-none shadow-sm shadow-slate-100 appearance-none min-w-[180px]"
                >
                    <option value="all">Estado: Todos</option>
                    <option value="DRAFT">Borrador</option>
                    <option value="OPEN">Abierto</option>
                    <option value="IN_PROGRESS">En Progreso</option>
                    <option value="DISPUTED">En Disputa</option>
                    <option value="COMPLETED">Completado</option>
                </select>
            </div>
            <button type="submit" className="hidden">Buscar</button>
        </form>
    );
}
