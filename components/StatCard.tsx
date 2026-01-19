
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  isCurrency?: boolean;
  children: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, children }) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-surface p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-start">
        <p className="text-text-secondary">{title}</p>
        <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-secondary' : 'text-danger'}`}>
          {isPositive ? <ArrowUp size={16} className="mr-1" /> : <ArrowDown size={16} className="mr-1" />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <p className="text-4xl font-bold mt-2 mb-4 text-text-primary">{value}</p>
      <div className="h-20 -mx-6 -mb-6">
        {children}
      </div>
    </div>
  );
};

export default StatCard;
