import React from 'react';
import Link from 'next/link';
import { DollarSign, Clock, ArrowUpRight, ShieldCheck, Star } from 'lucide-react';

interface Task {
    id: string;
    title: string;
    description: string;
    bounty_amount: number;
    deadline: string;
    status: string;
    client_id: string;
    profiles?: {
        name: string;
        rating: number | null;
    }
}

export default function TaskCard({ task }: { task: Task }) {
    // Calculate remaining days
    const deadlineDate = new Date(task.deadline);
    const now = new Date();
    const diffTime = Math.abs(deadlineDate.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return (
        <div className="group relative bg-card border border-border rounded-3xl p-6 hover:shadow-xl hover:border-primary/50 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-500 text-xs font-bold uppercase tracking-wider">
                    <DollarSign className="w-3 h-3" />
                    Escrow Activo
                </div>
                <div className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {diffDays}d restantes
                </div>
            </div>

            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-1">
                {task.title}
            </h3>

            <p className="text-muted-foreground text-sm line-clamp-2 mb-6 leading-relaxed">
                {task.description}
            </p>

            {task.profiles && (
                <Link
                    href={`/profiles/${task.client_id}`}
                    className="flex items-center gap-2 mb-6 p-2 rounded-xl hover:bg-slate-50 transition-colors group/profile"
                >
                    <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400">
                        {task.profiles.name.slice(0, 1)}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-900 group-hover/profile:text-sky-500 transition-colors">
                            {task.profiles.name}
                        </span>
                        <div className="flex items-center gap-1 text-[8px] font-bold text-sky-500">
                            <Star className="w-2 h-2 fill-sky-500" />
                            {task.profiles.rating || 'New'}
                        </div>
                    </div>
                </Link>
            )}

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/50">
                <div>
                    <span className="text-xs text-muted-foreground block mb-0.5 uppercase font-bold tracking-widest">Bounty</span>
                    <span className="text-2xl font-black text-foreground">
                        ${task.bounty_amount.toLocaleString()}
                    </span>
                </div>

                <Link
                    href={`/tasks/${task.id}`}
                    className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full hover:scale-110 transition-transform shadow-lg shadow-primary/20 group-hover:rotate-12"
                >
                    <ArrowUpRight className="w-6 h-6" />
                </Link>
            </div>

            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
        </div>
    );
}
