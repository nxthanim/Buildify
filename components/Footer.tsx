
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface mt-auto py-6">
      <div className="container mx-auto px-4 text-center text-text-secondary">
        <p>&copy; {new Date().getFullYear()} Buildify. All rights reserved.</p>
        <p className="text-sm mt-1">Turning your ideas into reality, powered by AI.</p>
      </div>
    </footer>
  );
};

export default Footer;
