
import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Bell, Settings, LogOut, Menu, X, 
  PlusCircle, User as UserIcon 
} from 'lucide-react';
import { logoSrc } from '../assets/logo';
import Button from './Button';

const getPageTitle = (pathname: string) => {
  if (pathname.startsWith('/dashboard')) return 'Dashboard';
  if (pathname.startsWith('/generate')) return 'New App';
  if (pathname.startsWith('/settings')) return 'Settings';
  if (pathname.startsWith('/pricing')) return 'Pricing';
  if (pathname.startsWith('/notifications')) return 'Notifications';
  return 'Buildify';
};

interface MainLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/settings', icon: Settings, label: 'Settings' },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
];

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  const commonLinkClasses = "flex items-center p-3 rounded-lg transition-colors";
  const activeLinkClasses = "bg-primary text-white";
  const inactiveLinkClasses = "text-text-secondary hover:bg-surface-accent hover:text-text-primary";
  
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-surface">
        <div className="p-4 border-b border-border flex justify-between items-center">
            <Link to="/dashboard">
                <img src={logoSrc} alt="Buildify Logo" className="h-10" />
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-text-secondary hover:text-text-primary">
              <X size={24} />
            </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) => `${commonLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon className="mr-3" size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <UserIcon size={20} />
             </div>
             <div>
                <p className="font-semibold text-text-primary text-sm truncate">{user?.email}</p>
                <p className="text-xs text-text-secondary">{user?.subscription} Plan</p>
             </div>
          </div>
          <button onClick={logout} className={`${commonLinkClasses} ${inactiveLinkClasses} w-full bg-surface-accent`}>
            <LogOut className="mr-3" size={20} />
            <span>Logout</span>
          </button>
        </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
        <div className="w-64 h-full">
          <SidebarContent />
        </div>
        <div className="fixed inset-0 bg-black/60" onClick={() => setIsSidebarOpen(false)}></div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="w-64 flex-shrink-0 hidden md:flex">
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-surface sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 border-b border-border">
            {/* Mobile hamburger */}
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary">
              <Menu size={24} />
            </button>
            {/* Desktop Page Title */}
            <div className="hidden md:flex items-center">
              <h1 className="text-xl font-bold text-text-primary">{pageTitle}</h1>
            </div>
            
            <div className="flex-1 flex justify-center md:hidden">
                <Link to="/dashboard">
                  <img src={logoSrc} alt="Buildify Logo" className="h-8" />
                </Link>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link to="/generate">
                <Button variant="primary" className="!p-2 sm:!px-4 sm:!py-2 rounded-full sm:rounded-md">
                    <PlusCircle size={20} />
                    <span className="hidden sm:inline ml-2">New App</span>
                </Button>
              </Link>
              
               <div className="hidden sm:flex items-center space-x-2">
                 <Link to="/notifications">
                  <button className="text-text-secondary hover:text-text-primary p-2 rounded-full relative">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full border-2 border-surface"></span>
                  </button>
                </Link>
                 <Link to="/settings">
                  <button className="text-text-secondary hover:text-text-primary p-2 rounded-full">
                    <Settings size={20} />
                  </button>
                </Link>
               </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-2 flex justify-around md:hidden z-30">
        {navItems.map(item => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) => `flex flex-col items-center justify-center w-1/4 p-1 rounded-md ${isActive ? 'text-primary' : 'text-text-secondary'}`}
            >
              <item.icon size={24} />
              <span className="text-xs mt-1">{item.label}</span>
            </NavLink>
        ))}
         <Link to="/generate" className="flex flex-col items-center justify-center w-1/4 p-1 rounded-md text-text-secondary">
            <PlusCircle size={24} />
            <span className="text-xs mt-1">New App</span>
         </Link>
      </div>
    </div>
  );
};

export default MainLayout;
