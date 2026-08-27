import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ScreenType } from '../types';
import { screenToPath } from '../lib/navigation';
import { useAppContext } from '../context/AppContext';
import { AuthLoginView } from '../views/AuthLoginView';

export const AuthLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshSession } = useAppContext();

  const onNavigate = (screen: ScreenType) => navigate(screenToPath[screen]);

  return (
    <AuthLoginView
      onLoginSuccess={async role => {
        await refreshSession();
        navigate(role === 'admin' ? '/admin' : '/');
      }}
      onNavigate={onNavigate}
    />
  );
};
