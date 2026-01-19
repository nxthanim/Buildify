
import React from 'react';
import { Check } from 'lucide-react';
import { PricingTier } from '../types';
import Button from './Button';

interface PricingCardProps {
  tier: PricingTier;
  onSelect: (plan: PricingTier['name']) => void;
  currentPlan?: PricingTier['name'];
  isLoading?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ tier, onSelect, currentPlan, isLoading }) => {
  const isCurrent = tier.name === currentPlan;
  
  return (
    <div className={`bg-surface rounded-xl p-8 border ${tier.isFeatured ? 'border-primary shadow-lg shadow-primary/20' : 'border-border'} flex flex-col relative`}>
      {tier.isFeatured && (
        <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full absolute -top-4 self-center">
          MOST POPULAR
        </div>
      )}
      <h3 className="text-xl font-bold text-center text-text-primary">{tier.name}</h3>
      <p className="text-sm text-text-secondary text-center mb-6 h-10">{tier.priceDetails}</p>
      
      <p className="text-5xl font-extrabold text-center my-2 text-text-primary">{tier.price}</p>
      
      <ul className="space-y-4 my-8 flex-grow">
        {tier.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-secondary mr-3 flex-shrink-0 mt-1" />
            <span className="text-text-secondary">{feature}</span>
          </li>
        ))}
      </ul>
      <Button 
        onClick={() => onSelect(tier.name)}
        variant={tier.isFeatured ? 'primary' : 'outline'}
        className="w-full"
        isLoading={isLoading}
        disabled={isCurrent || isLoading}
      >
        {isCurrent ? 'Current Plan' : tier.cta}
      </Button>
    </div>
  );
};

export default PricingCard;
