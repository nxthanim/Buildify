
import React, { useState, useEffect } from 'react';
import { mockApi } from '../services/mockApi';
import { Notification } from '../types';
import { CheckCircle, AlertTriangle, Info, User, XCircle, ArrowRight } from 'lucide-react';

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
  const iconProps = { size: 20, className: 'flex-shrink-0' };
  switch (type) {
    case 'success':
      return <div className="bg-green-500/20 p-2 rounded-full text-green-400"><CheckCircle {...iconProps} /></div>;
    case 'warning':
      return <div className="bg-yellow-500/20 p-2 rounded-full text-yellow-400"><AlertTriangle {...iconProps} /></div>;
    case 'error':
      return <div className="bg-red-500/20 p-2 rounded-full text-red-400"><XCircle {...iconProps} /></div>;
    case 'info':
      return <div className="bg-blue-500/20 p-2 rounded-full text-blue-400"><Info {...iconProps} /></div>;
    case 'user':
        return <div className="bg-purple-500/20 p-2 rounded-full text-purple-400"><User {...iconProps} /></div>;
    default:
      return null;
  }
};

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const data = await mockApi.getNotifications();
      setNotifications(data);
      setLoading(false);
    };
    fetchNotifications();
  }, []);
  
  const filteredNotifications = notifications.filter(n => {
      if (activeTab === 'Unread') return !n.isRead;
      if (activeTab === 'Archived') return false; // Assuming no archive state yet
      return true;
  });

  const groupedNotifications = filteredNotifications.reduce((acc, notif) => {
    const group = notif.timestamp.includes('ago') ? 'Today' : 'Yesterday';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(notif);
    return acc;
  }, {} as Record<string, Notification[]>);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Notifications</h1>
        <button className="text-sm text-primary hover:underline">Mark all as read</button>
      </div>
      
      <div className="border-b border-border mb-4">
        <nav className="-mb-px flex space-x-6">
            {['All', 'Unread', 'Archived'].map(tab => (
                 <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                   activeTab === tab
                     ? 'border-primary text-primary'
                     : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-500'
                 }`}
               >
                 {tab}
                 {tab === 'Unread' && notifications.some(n => !n.isRead) && (
                     <span className="absolute top-3 right-[-8px] w-2 h-2 bg-primary rounded-full"></span>
                 )}
               </button>
            ))}
        </nav>
      </div>

      {loading ? (
        <p className="text-center text-text-secondary">Loading notifications...</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedNotifications).map(([group, notifs]) => (
            <div key={group}>
              <h2 className="text-sm font-semibold text-text-secondary uppercase mb-2">{group}</h2>
              <div className="bg-surface rounded-lg">
                {notifs.map((notification, index) => (
                  <div key={notification.id} className={`flex items-start p-4 space-x-4 ${index < notifs.length - 1 ? 'border-b border-border' : ''}`}>
                    <NotificationIcon type={notification.type} />
                    <div className="flex-1">
                      <p className="text-text-primary font-semibold">{notification.title}</p>
                      <p className="text-sm text-text-secondary">{notification.message}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-text-secondary mb-2">{notification.timestamp}</p>
                      {!notification.isRead && <span className="w-2 h-2 bg-primary rounded-full inline-block"></span>}
                      {['info', 'user', 'error'].includes(notification.type) && <ArrowRight size={16} className="text-text-secondary mt-2" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
