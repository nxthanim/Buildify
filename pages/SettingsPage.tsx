
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockApi } from '../services/mockApi';
import { Invoice, SubscriptionPlan } from '../types';
import Button from '../components/Button';
import { CheckCircle, Download, MoreHorizontal } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Billing');
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    mockApi.getInvoices().then(setInvoices);
  }, []);

  if (!user) {
    return null;
  }

  const tabs = ['Profile', 'Security', 'Billing', 'Team', 'API'];
  const planDetails = {
    [SubscriptionPlan.PRO]: {
        events: "7.5k / 10k"
    },
    [SubscriptionPlan.FREE]: {
        events: "0.5k / 1k"
    },
    [SubscriptionPlan.ENTERPRISE]: {
        events: "Unlimited"
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <div className="border-b border-border mt-4">
          <nav className="-mb-px flex space-x-6">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {activeTab === 'Billing' && (
        <div className="space-y-8">
          {/* Current Plan Section */}
          <div className="bg-surface p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Current Plan</h3>
            <div className="bg-primary/10 p-6 rounded-lg border border-primary/30">
                <div className="flex justify-between items-start">
                    <h4 className="text-xl font-bold text-text-primary">{user.subscription} Plan</h4>
                    <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">ACTIVE</span>
                </div>
                <p className="text-text-secondary mt-1">Advanced analytics for scaling teams.</p>
                <p className="text-4xl font-bold text-text-primary my-4">$49.00 <span className="text-base font-normal text-text-secondary">/month</span></p>
                
                {/* Progress Bar */}
                <div>
                    <div className="flex justify-between text-sm text-text-secondary mb-1">
                        <span>Monthly Data Events</span>
                        <span>{planDetails[user.subscription].events}</span>
                    </div>
                    <div className="w-full bg-surface-accent rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{width: '75%'}}></div>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">Next renewal: Oct 12, 2024</p>
                </div>

                <div className="flex space-x-4 mt-6">
                    <Button variant="primary" onClick={() => navigate('/pricing')}>Change Plan</Button>
                    <Button variant="outline" className="!p-3"><MoreHorizontal /></Button>
                </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-surface p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Payment Method</h3>
            {user.paymentMethod ? (
                <div className="flex justify-between items-center bg-surface-accent p-4 rounded-lg">
                    <div className="flex items-center">
                        <div className="bg-gray-600 rounded-md w-12 h-8 mr-4 flex items-center justify-center">
                           <span className="text-xs font-mono text-white">{user.paymentMethod.brand}</span>
                        </div>
                        <div>
                            <p className="text-text-primary font-medium">{user.paymentMethod.brand} ending in {user.paymentMethod.last4}</p>
                            <p className="text-sm text-text-secondary">Expires 12/26</p>
                        </div>
                    </div>
                    <Button variant="outline">Update</Button>
                </div>
            ) : (
                <p className="text-text-secondary">No payment method on file.</p>
            )}
          </div>
          
          {/* Recent Invoices Section */}
          <div className="bg-surface p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Recent Invoices</h3>
              <Link to="#" className="text-sm text-primary hover:underline">See all</Link>
            </div>
            <div className="divide-y divide-border">
              {invoices.map(invoice => (
                <div key={invoice.id} className="py-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <CheckCircle className="text-secondary mr-3" />
                    <div>
                      <p className="text-text-primary font-medium">{invoice.id}</p>
                      <p className="text-sm text-text-secondary">{invoice.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="text-text-primary font-semibold">${invoice.amount.toFixed(2)}</p>
                    <Button variant="ghost" className="!p-2"><Download size={18}/></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
