import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null); // row from public.users (has .role)
  const [profileError, setProfileError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId, retryCount = 0) => {
    if (!userId) {
      setProfile(null);
      setProfileError(null);
      return null;
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && retryCount < 2) {
      await new Promise((resolve) => window.setTimeout(resolve, 350));
      return loadProfile(userId, retryCount + 1);
    }

    if (error) {
      setProfile(null);
      setProfileError(error);
      return null;
    }

    setProfileError(null);
    setProfile(data);
    return data;
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        setSession(null);
        setProfile(null);
        setProfileError(error);
        setLoading(false);
        return;
      }

      setSession(session);
      await loadProfile(session?.user?.id);
      if (mounted) setLoading(false);
    };

    initializeAuth();

    // Keep session in sync on login/logout/token refresh
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setSession(session);
      setLoading(true);

      window.setTimeout(async () => {
        await loadProfile(session?.user?.id);
        if (mounted) setLoading(false);
      }, 0);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // role, name, and any role-specific fields (institution, department, etc.)
  // are sent as metadata and picked up by the DB trigger — see
  // supabase/users_table_and_trigger.sql
  const signUp = async ({ email, password, name, role, profileData }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role, profile_data: profileData },
      },
    });

    if (!error && data.session?.user) {
      const loadedProfile = await loadProfile(data.session.user.id);
      setLoading(false);
      return { data, error, profile: loadedProfile };
    }

    return { data, error };
  };

  // const signIn = async ({ email, password }) => {
  //   const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  //   if (!error && data.session?.user) {
  //     setSession(data.session);
  //     const loadedProfile = await loadProfile(data.session.user.id);
  //     setLoading(false);
  //     return { data, error, profile: loadedProfile };
  //   }

    
  //   return { data, error };
  //   console.log("access token:", data.session?.access_token);
  // };

  
const signIn = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (!error && data.session?.user) {
    setSession(data.session);

    //console.log("ACCESS TOKEN:", data.session.access_token);

    const loadedProfile = await loadProfile(data.session.user.id);

    setLoading(false);

    return { data, error, profile: loadedProfile };
  }

  return { data, error };
};


  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setSession(null);
      setProfile(null);
    }
    return { error };
  };

  const value = {
    session,
    user: session?.user ?? null,
    profile,           // profile.role is what you check for routing/permissions
    profileError,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}