
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GeneratedApp, AnalyticsData, SubscriptionPlan } from '../types';
import { mockApi } from '../services/mockApi';
import AnalyticsChart from '../components/AnalyticsChart';
import AppCard from '../components/AppCard';
import Button from '../components/Button';
import { PlusCircle, AlertTriangle, Search, Filter, ArrowDownUp } from 'lucide-react';
import Input from '../components/Input';
import StatCard from '../components/StatCard';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState<GeneratedApp[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setLoading(true);
        const [userApps, userAnalytics] = await Promise.all([
          mockApi.getApps(user.id),
          mockApi.getAnalytics(user.id)
        ]);
        setApps(userApps);
        setAnalytics(userAnalytics);
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading || !analytics) {
    return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
  }

  const canCreateApp = user?.subscription === SubscriptionPlan.FREE && apps.length >= 1;

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 p-4 sm:p-0">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-text-primary">Overview</h1>
            <p className="text-text-secondary">Real-time performance and application status.</p>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="Total Users" value={analytics.totalUsers.value.toLocaleString()} change={analytics.totalUsers.change}>
            <AnalyticsChart data={analytics.charts.users} dataKey="count" strokeColor="#4F46E5" />
        </StatCard>
        <StatCard title="Revenue" value={`$${analytics.revenue.value.toLocaleString()}`} change={analytics.revenue.change}>
            <AnalyticsChart data={analytics.charts.revenue} dataKey="amount" strokeColor="#10B981" />
        </StatCard>
      </div>
      
      {canCreateApp && (
        <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-300 px-4 py-3 rounded-lg flex items-center space-x-3">
          <AlertTriangle />
          <span>
            You've reached the limit for the Free plan. 
            <Link to="/pricing" className="font-bold underline hover:text-yellow-200 ml-1">Upgrade to Pro</Link> to generate more apps.
          </span>
        </div>
      )}

      {/* Your Apps Section */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-xl font-bold text-text-primary">Your Apps</h2>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Input 
                placeholder="Search apps..." 
                icon={<Search size={16} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                wrapperClassName="flex-grow"
            />
            <Button variant="outline" className="!p-3"><Filter size={16} /></Button>
            <Button variant="outline" className="!p-3"><ArrowDownUp size={16} /></Button>
          </div>
        </div>
        
        {filteredApps.length > 0 ? (
          <div className="space-y-3">
            {filteredApps.map(app => <AppCard key={app.id} app={app} />)}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface rounded-lg">
            <h3 className="text-xl text-text-primary font-semibold">No applications found.</h3>
            <p className="text-text-secondary mt-2 mb-4">It's time to bring your first idea to life.</p>
            <Link to="/generate">
              <Button variant="primary" leftIcon={<PlusCircle size={18} />}>Create New App</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
