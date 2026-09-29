import React, { useState } from 'react';
import { SellerWelcomePage } from './SellerWelcomePage';
import { SellerRegistrationPage } from './SellerRegistrationPage';
import { SellerDashboard } from './SellerDashboard';
import { useAuth } from '../../../context/AuthContext';

export const SellerPortalRoot: React.FC = () => {
  const [view, setView] = useState<'welcome' | 'register' | 'dashboard'>('welcome');
  const { user, openAuthModal } = useAuth();

  const handleSignIn = () => {
    if (user) {
      setView('dashboard');
    } else {
      openAuthModal('Sign in to access your Astronava Seller Portal account');
    }
  };

  if (view === 'register') {
    return <SellerRegistrationPage onBack={() => setView('welcome')} />;
  }

  if (view === 'dashboard' || user) {
    return <SellerDashboard />;
  }

  return (
    <SellerWelcomePage
      onSignIn={handleSignIn}
      onCreateAccount={() => setView('register')}
    />
  );
};
