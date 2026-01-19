
export interface User {
  id: string;
  email: string;
  subscription: SubscriptionPlan;
  avatarUrl?: string;
  paymentMethod?: {
    brand: string;
    last4: string;
  };
}

export enum SubscriptionPlan {
  FREE = 'Free',
  PRO = 'Pro',
  ENTERPRISE = 'Enterprise',
}

export enum AppStatus {
    ACTIVE = 'Active',
    INACTIVE = 'Inactive',
    BUILDING = 'Building',
}

export interface GeneratedApp {
  id: string;
  userId: string;
  name: string;
  description: string;
  tagline: string;
  status: AppStatus;
  updatedAt: string;
  icon: string; // e.g., 'Rocket', 'ShoppingBag'
  coreFeatures: string[];
  colorPalette: {
    primary: string;
    secondary: string;
    background: string;
  };
  createdAt: string;
  liveUrl: string;
}

export interface AnalyticsData {
  totalUsers: {
    value: number;
    change: number;
  };
  revenue: {
    value: number;
    change: number;
  };
  charts: {
    users: { date: string; count: number }[];
    revenue: { date: string; amount: number }[];
  }
}

export interface PricingTier {
    name: SubscriptionPlan;
    price: string;
    priceDetails: string;
    features: string[];
    cta: string;
    isFeatured: boolean;
}

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'user';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending';
}
