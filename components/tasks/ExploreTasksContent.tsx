"use client"

import React, { useState, useEffect } from 'react';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Search, Filter, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export function ExploreTasksContent() {
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [bountyFilter, setBountyFilter] = useState('0');

    useEffect(() => {
        async function fetchTasks() {
            setLoading(true);
            let query = supabase
                .from('tasks')
                .select('*, profiles:users!client_id(name, rating)')
                .eq('status', 'OPEN')
                .order('created_at', { ascending: false });

            if (searchTerm) {
                query = query.ilike('title', `%${searchTerm}%`);
            }

            if (parseInt(bountyFilter) > 0) {
                query = query.gte('bounty_amount', parseInt(bountyFilter));
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching tasks:', error);
            } else {
                setTasks(data || []);
            }
            setLoading(false);
        }

        fetchTasks();
    }, [searchTerm, bountyFilter]);

    return (
        <div className="p-6 md:p-12 pb-20">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <ShieldCheck className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight">Explorar Tareas</h1>
                    </div>
                    <p className="text-xl text-muted-foreground">
                        Todas estas tareas tienen sus fondos depositados y protegidos en escrow.
                    </p>
                </header>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar por título..."
                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                        <select
                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-border focus:ring-2 focus:ring-primary outline-none appearance-none transition-all"
                            value={bountyFilter}
                            onChange={(e) => setBountyFilter(e.target.value)}
                        >
                            <option value="0">Bounty Mínimo</option>
                            <option value="50">$50+</option>
                            <option value="100">$100+</option>
                            <option value="250">$250+</option>
                            <option value="500">$500+</option>
                        </select>
                    </div>
                    <button
                        onClick={() => { setSearchTerm(''); setBountyFilter('0'); }}
                        className="bg-muted text-muted-foreground font-bold rounded-2xl h-full hover:bg-muted/80 transition-colors px-4"
                    >
                        Limpiar
                    </button>
                </div>

                {/* Tasks Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <p className="text-muted-foreground font-medium">Buscando oportunidades...</p>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 bg-card border-2 border-dashed border-border rounded-3xl">
                        <AlertCircle className="w-12 h-12 text-muted-foreground opacity-20" />
                        <p className="text-lg font-bold text-muted-foreground">No se encontraron tareas abiertas.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setBountyFilter('0'); }}
                            className="text-primary font-bold hover:underline"
                        >
                            Ver todas las tareas
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {tasks.map((task) => {
                            // Map Supabase data to TaskCard props
                            const mappedTask = {
                                id: task.id,
                                taskId: `#BT-${task.id.slice(0, 4).toUpperCase()}`, // Mock ID format
                                status: 'ESCROW ACTIVE', // All open tasks in explore have escrow
                                title: task.title,
                                personType: 'Client',
                                personName: task.profiles?.name || 'Unknown Client',
                                personAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(task.profiles?.name || 'C')}&background=random`,
                                amount: task.bounty_amount,
                                currency: task.currency || 'USDC',
                                escrowActive: true,
                                actions: ['View Details']
                            };

                            return <TaskCard key={task.id} task={mappedTask as any} />
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
