// Valid transitions for task states
export const VALID_TRANSITIONS = {
    'DRAFT': ['OPEN', 'CANCELLED'],
    'OPEN': ['ASSIGNED', 'CANCELLED'],
    'ASSIGNED': ['IN_PROGRESS', 'CANCELLED'],
    'IN_PROGRESS': ['SUBMITTED', 'DISPUTED', 'CANCELLED'],
    'SUBMITTED': ['APPROVED', 'DISPUTED'],
    'APPROVED': ['COMPLETED'],
    'DISPUTED': ['APPROVED', 'CANCELLED'],
    'COMPLETED': [],
    'CANCELLED': []
};

// Task validation rules
export const TASK_VALIDATIONS = {
    title: { required: true, minLength: 10, maxLength: 255 },
    description: { required: true, minLength: 50, maxLength: 5000 },
    requirements: { required: true, minLength: 20, maxLength: 2000 },
    bounty_amount: { required: true, min: 5.00, max: 10000.00 },
    deadline: { required: true, minDaysFromNow: 1, maxDaysFromNow: 90 }
};

// Application validation rules
export const APPLICATION_VALIDATIONS = {
    proposal_text: { required: true, minLength: 50, maxLength: 1000 },
    estimated_time: { required: true, maxLength: 100 }
};

/**
 * Validates if a state transition is allowed
 * @param {string} currentStatus 
 * @param {string} nextStatus 
 * @returns {boolean}
 */
export function isValidTransition(currentStatus, nextStatus) {
    if (!VALID_TRANSITIONS[currentStatus]) return false;
    return VALID_TRANSITIONS[currentStatus].includes(nextStatus);
}
