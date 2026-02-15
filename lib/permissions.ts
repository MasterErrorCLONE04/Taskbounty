
interface User {
    id: string;
    role?: string;
}

interface Task {
    client_id: string;
    assigned_worker_id?: string;
    status: string;
}

/**
 * Checks if a user has permission to perform a specific action on a task
 * 
 * @param {User} user - The current user object
 * @param {Task} task - The task object
 * @param {string} action - The action to perform (e.g., 'assign_worker', 'submit_delivery')
 * @returns {boolean}
 */
export function hasPermission(user: User | null, task: Task, action: string): boolean {
    if (!user) return false;

    const isOwner = task.client_id === user.id;
    const isAssignedWorker = task.assigned_worker_id === user.id;

    switch (action) {
        case 'assign_worker':
            return isOwner && task.status === 'OPEN';

        case 'submit_delivery':
            return isAssignedWorker && task.status === 'IN_PROGRESS';

        case 'approve_delivery':
        case 'reject_delivery':
            return isOwner && task.status === 'SUBMITTED';

        case 'cancel_task':
            if (task.status === 'DRAFT' || task.status === 'OPEN') {
                return isOwner;
            }
            return false; // Beyond these states, cancellation follows specific rules/penalties

        default:
            return false;
    }
}

/**
 * Checks if a user has a specific role
 * @param {User} user 
 * @param {string} role - 'client', 'worker', 'both'
 * @returns {boolean}
 */
export function hasRole(user: User | null, role: string): boolean {
    if (!user) return false;
    if (user.role === 'both') return true;
    return user.role === role;
}

