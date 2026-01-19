
import React from 'react';
import { GeneratedApp, AppStatus } from '../types';
import { Rocket, ShoppingBag, BarChart2, DollarSign, MoreHorizontal } from 'lucide-react';

interface AppCardProps {
  app: GeneratedApp;
}

const getIcon = (iconName: string) => {
    switch (iconName) {
        case 'Rocket': return <Rocket className="w-6 h-6 text-primary" />;
        case 'ShoppingBag': return <ShoppingBag className="w-6 h-6 text-yellow-400" />;
        case 'BarChart2': return <BarChart2 className="w-6 h-6 text-red-400" />;
        case 'DollarSign': return <DollarSign className="w-6 h-6 text-green-400" />;
        default: return <Rocket className="w-6 h-6 text-primary" />;
    }
}

const statusClasses = {
    [AppStatus.ACTIVE]: 'bg-green-500/10 text-green-400',
    [AppStatus.INACTIVE]: 'bg-gray-500/10 text-gray-400',
    [AppStatus.BUILDING]: 'bg-blue-500/10 text-blue-400',
};

const AppCard: React.FC<AppCardProps> = ({ app }) => {
  return (
    <div className="bg-surface rounded-lg p-4 flex items-center justify-between hover:bg-surface-accent transition-colors duration-200">
        <div className="flex items-center space-x-4">
            <div className="bg-surface-accent p-3 rounded-lg">
                {getIcon(app.icon)}
            </div>
            <div>
                <p className="font-semibold text-text-primary">{app.name}</p>
                <p className="text-sm text-text-secondary">Updated {app.updatedAt}</p>
            </div>
        </div>
        <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusClasses[app.status]}`}>
                {app.status}
            </span>
            <button className="text-text-secondary hover:text-text-primary">
                <MoreHorizontal size={20} />
            </button>
        </div>
    </div>
  );
};

export default AppCard;
