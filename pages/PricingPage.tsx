
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PricingCard from '../components/PricingCard';
import { SubscriptionPlan, PricingTier } from '../types';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const pricingTiers: PricingTier[] = [
  {
    name: SubscriptionPlan.FREE,
    price: '$0',
    priceDetails: 'For individuals and small projects',
    features: [
      '1 App Generation',
      'Basic Analytics',
      'Community Support',
      'Standard Components',
    ],
    cta: 'Get Started',
    isFeatured: false,
  },
  {
    name: SubscriptionPlan.PRO,
    price: '$49',
    priceDetails: 'For professionals and small teams',
    features: [
      '10 App Generations per month',
      'Advanced Analytics',
      'Email & Chat Support',
      'Premium Components',
      'Stripe Payment Integration',
    ],
    cta: 'Upgrade to Pro',
    isFeatured: true,
  },
  {
    name: SubscriptionPlan.ENTERPRISE,
    price: 'Custom',
    priceDetails: 'For large organizations',
    features: [
      'Unlimited App Generations',
      'Dedicated Account Manager',
      'On-premise Deployment Options',
      'Custom Integrations',
      '24/7 Priority Support',
    ],
    cta: 'Contact Sales',
    isFeatured: false,
  },
];

const PricingPage: React.FC = () => {
  const { user, updateSubscription } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    if (!user) {
      navigate('/signup');
      return;
    }
    
    if (plan === SubscriptionPlan.ENTERPRISE) {
      // Handle contact sales logic
      console.log('Contacting sales...');
      return;
    }

    if (plan === user.subscription) return;
    
    setSelectedPlan(plan);
    setIsLoading(true);

    // Simulate payment processing
    try {
        await updateSubscription(plan);
        navigate('/dashboard');
    } catch (e) {
        console.error("Failed to update subscription", e);
    } finally {
        setIsLoading(false);
        setSelectedPlan(null);
    }
  };

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-text-primary">Find the perfect plan for your project</h1>
        <p className="text-lg text-text-secondary mt-2">Start for free, then upgrade as you grow.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingTiers.map(tier => (
            <PricingCard 
              key={tier.name} 
              tier={tier}
              onSelect={handleSelectPlan}
              currentPlan={user?.subscription}
              isLoading={isLoading && selectedPlan === tier.name}
            />
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
