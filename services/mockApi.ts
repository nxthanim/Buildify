
import { User, SubscriptionPlan, GeneratedApp, AppStatus, AnalyticsData, Notification, Invoice } from '../types';

// --- In-memory database simulation ---
let users: User[] = [
    { 
      id: '1', 
      email: 'user@example.com', 
      subscription: SubscriptionPlan.PRO,
      avatarUrl: 'https://i.pravatar.cc/150?u=user@example.com',
      paymentMethod: {
        brand: 'Visa',
        last4: '4242'
      }
    },
    { 
      id: '2', 
      email: 'user@google.com', 
      subscription: SubscriptionPlan.PRO,
      avatarUrl: 'https://i.pravatar.cc/150?u=user@google.com',
      paymentMethod: {
        brand: 'Mastercard',
        last4: '1234'
      }
    }
];
let apps: GeneratedApp[] = [
    {
        id: 'app1',
        userId: '1',
        name: 'Skyline CRM',
        tagline: 'Your personal fitness companion.',
        description: 'An app to track workouts, monitor nutrition, and connect with fitness enthusiasts.',
        coreFeatures: ['Workout Logging', 'Meal Planner', 'Progress Charts', 'Social Feed'],
        colorPalette: { primary: '#EC4899', secondary: '#8B5CF6', background: '#374151' },
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: '2h ago',
        status: AppStatus.ACTIVE,
        icon: 'Rocket',
        liveUrl: '#',
    },
    {
        id: 'app2',
        userId: '1',
        name: 'Storefront v2',
        tagline: 'E-commerce made simple.',
        description: 'A modern e-commerce storefront with a focus on user experience.',
        coreFeatures: ['Product Catalog', 'Shopping Cart', 'Stripe Checkout', 'Order History'],
        colorPalette: { primary: '#F59E0B', secondary: '#10B981', background: '#FFFFFF' },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: '1d ago',
        status: AppStatus.INACTIVE,
        icon: 'ShoppingBag',
        liveUrl: '#',
    },
    {
        id: 'app3',
        userId: '2',
        name: 'Payflow',
        tagline: 'Seamless payment processing.',
        description: 'An API and dashboard for handling subscriptions and one-time payments.',
        coreFeatures: ['Subscription Management', 'Invoice Generation', 'Payment Links', 'Analytics'],
        colorPalette: { primary: '#10B981', secondary: '#3B82F6', background: '#111827' },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: '5h ago',
        status: AppStatus.ACTIVE,
        icon: 'DollarSign',
        liveUrl: '#',
    },
    {
        id: 'app4',
        userId: '2',
        name: 'DataInsights',
        tagline: 'Visualize your data.',
        description: 'A business intelligence tool for creating beautiful and insightful dashboards.',
        coreFeatures: ['Data Connectors', 'Custom Visualizations', 'Report Sharing', 'Real-time Updates'],
        colorPalette: { primary: '#6366F1', secondary: '#F472B6', background: '#F9FAFB' },
        createdAt: new Date().toISOString(),
        updatedAt: '10m ago',
        status: AppStatus.ACTIVE,
        icon: 'BarChart2',
        liveUrl: '#',
    }
];
let notifications: Notification[] = [
    { id: '1', type: 'success', title: 'Report Generated', message: 'Your monthly analytics report for October is ready for download.', timestamp: '2m ago', isRead: false },
    { id: '2', type: 'warning', title: 'API Limit Reached', message: 'Your current plan is at 90% of its monthly request limit.', timestamp: '1h ago', isRead: false },
    { id: '3', type: 'info', title: 'New Login', message: 'A new login was detected from a Chrome browser on macOS.', timestamp: '3h ago', isRead: true },
    { id: '4', type: 'user', title: 'Team Invite Accepted', message: 'Sarah Jenkins joined the Analytics workspace.', timestamp: '1d ago', isRead: true },
    { id: '5', type: 'error', title: 'Export Failed', message: 'The CSV export for \'Traffic Sources\' could not be completed.', timestamp: '1d ago', isRead: true },
];
let invoices: Invoice[] = [
    { id: 'INV-2023-009', date: 'Sep 12, 2023', amount: 49.00, status: 'Paid' },
    { id: 'INV-2023-008', date: 'Aug 12, 2023', amount: 49.00, status: 'Paid' },
    { id: 'INV-2023-007', date: 'Jul 12, 2023', amount: 49.00, status: 'Paid' },
]

let session: User | null = null;

// Utility to simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));


// --- API Methods ---
export const mockApi = {
  async checkSession(): Promise<User | null> {
    await delay(500);
    const storedUser = localStorage.getItem('buildify_user');
    if (storedUser) {
        session = JSON.parse(storedUser);
        return session;
    }
    return null;
  },

  async login(email: string, pass: string): Promise<User | null> {
    await delay(1000);
    const user = users.find(u => u.email === email);
    if (user) { // In a real app, you'd check the password hash
      session = user;
      localStorage.setItem('buildify_user', JSON.stringify(session));
      return user;
    }
    return null;
  },

  async signup(email: string, pass: string): Promise<User | null> {
    await delay(1200);
    if (users.some(u => u.email === email)) {
      return null; // Email already exists
    }
    const newUser: User = {
      id: String(users.length + 1),
      email,
      subscription: SubscriptionPlan.FREE,
    };
    users.push(newUser);
    session = newUser;
    localStorage.setItem('buildify_user', JSON.stringify(session));
    return newUser;
  },

  async logout(): Promise<void> {
    await delay(200);
    session = null;
    localStorage.removeItem('buildify_user');
  },

  async updateSubscription(userId: string, plan: SubscriptionPlan): Promise<User> {
    await delay(1000);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
        users[userIndex].subscription = plan;
        if(session?.id === userId) {
            session = users[userIndex];
            localStorage.setItem('buildify_user', JSON.stringify(session));
        }
        return users[userIndex];
    }
    throw new Error("User not found");
  },

  async getApps(userId: string): Promise<GeneratedApp[]> {
    await delay(800);
    return apps.filter(app => app.userId === userId);
  },

  async createApp(userId: string, appDetails: Omit<GeneratedApp, 'id' | 'userId' | 'createdAt' | 'liveUrl' | 'updatedAt' | 'status' | 'icon'>): Promise<GeneratedApp> {
    await delay(500);
    const newApp: GeneratedApp = {
      ...appDetails,
      id: `app${apps.length + 1}`,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: 'Just now',
      status: AppStatus.BUILDING,
      icon: 'Rocket',
      liveUrl: '#',
    };
    apps.push(newApp);
    // Simulate build time
    setTimeout(() => {
        const appIndex = apps.findIndex(a => a.id === newApp.id);
        if (appIndex !== -1) {
            apps[appIndex].status = AppStatus.ACTIVE;
        }
    }, 5000);
    return newApp;
  },

  async getAnalytics(userId: string): Promise<AnalyticsData> {
    await delay(1500);
    const generateSeries = (factor: number) => {
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          count: Math.floor(Math.random() * 50 * factor) + (10 * factor) * i,
          amount: Math.floor(Math.random() * 100 * factor) + (20 * factor) * i,
        };
      });
    };
    return {
      totalUsers: { value: 12482, change: 12 },
      revenue: { value: 4200, change: 5 },
      charts: {
        users: generateSeries(5),
        revenue: generateSeries(2.5),
      }
    };
  },

  async getNotifications(): Promise<Notification[]> {
      await delay(400);
      return notifications;
  },
  
  async getInvoices(): Promise<Invoice[]> {
      await delay(600);
      return invoices;
  }
};
