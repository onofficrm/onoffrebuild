import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  fetchSession,
  isAdmin as sessionIsAdmin,
  isAuthenticated as sessionIsAuthenticated,
  type AuthStatus,
  type PortalUser,
  type SessionPayload,
} from '../services/authService';

type AuthContextValue = {
  status: AuthStatus;
  loading: boolean;
  authenticated: boolean;
  isAdmin: boolean;
  user: PortalUser | null;
  session: SessionPayload | null;
  launchMode: SessionPayload['launchMode'];
  launchAllowed: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [session, setSession] = useState<SessionPayload | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchSession()
      .then((payload) => {
        if (cancelled) return;
        setSession(payload);
        setStatus(sessionIsAuthenticated(payload) ? 'authenticated' : 'unauthenticated');
      })
      .catch(() => {
        if (cancelled) return;
        setSession(null);
        setStatus('unauthenticated');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const authenticated = status === 'authenticated' && Boolean(session && sessionIsAuthenticated(session));
    return {
      status,
      loading: status === 'loading',
      authenticated,
      isAdmin: authenticated && session ? sessionIsAdmin(session) : false,
      user: authenticated && session ? session.user : null,
      session,
      launchMode: session?.launchMode || 'off',
      launchAllowed: session ? session.launchAllowed : false,
    };
  }, [status, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
