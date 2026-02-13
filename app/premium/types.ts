
export enum BillingCycle {
    MONTHLY = 'monthly',
    ANNUAL = 'annual'
}

export enum Tier {
    BASIC = 'basic',
    PREMIUM = 'premium',
    PREMIUM_PLUS = 'premium_plus'
}

export interface Feature {
    icon?: React.ReactNode;
    text: string;
    isFilled?: boolean;
    highlight?: boolean;
}

export interface PlanData {
    id: Tier;
    name: string;
    price: number;
    currency: string;
    originalPrice: number | null;
    discount?: string;
    isPopular?: boolean;
    badge?: string;
    features: Feature[];
}
