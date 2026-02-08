import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import MessagesClient from '@/app/(dashboard)/client/messages/MessagesClient';

export default async function MessagesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    const resolvedParams = await searchParams;

    // Fetch all tasks where the user is a client or assigned worker
    // and have messages or are in progress/assigned
    const { data: tasks, error } = await supabase
        .from('tasks')
        .select(`
            id,
            title,
            status,
            client_id,
            assigned_worker_id,
            client:users!client_id(id, name, avatar_url),
            worker:users!assigned_worker_id(id, name, avatar_url)
        `)
        .or(`client_id.eq.${user.id},assigned_worker_id.eq.${user.id}`)
        .not('assigned_worker_id', 'is', null) // Only tasks with an assigned worker have a "chat" context
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('Error fetching conversations:', error);
    }

    const selectedTaskId = resolvedParams.task || (tasks && tasks.length > 0 ? tasks[0].id : null);

    return (
        <div className="h-[calc(100vh-64px)] overflow-hidden">
            <MessagesClient
                user={user}
                initialTasks={tasks || []}
                selectedTaskId={selectedTaskId}
            />
        </div>
    );
}
