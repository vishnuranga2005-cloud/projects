import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
  role?: 'patient' | 'hospital';
}

// Sign up with email and password
export const signUpWithPassword = async (email: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string; needsConfirmation?: boolean }> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Don't require email confirmation for development
        emailRedirectTo: window.location.origin,
      }
    });
    
    if (error) {
      console.error('Supabase signup error:', error);
      if (error.message.includes('already registered')) {
        throw new Error('This email is already registered. Please sign in instead.');
      }
      throw new Error(error.message);
    }
    
    // If we got a user but no session, email confirmation is required on server
    // Try to sign in anyway (works if email confirmation is disabled in Supabase dashboard)
    if (data.user && !data.session) {
      // Try signing in immediately
      const signInResult = await signInWithPassword(email, password);
      if (signInResult.success) {
        return signInResult;
      }
      // If sign in failed, confirmation is required
      return { success: true, needsConfirmation: true };
    }
    
    if (data.user && data.session) {
      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      };
    }
    
    return { success: false, error: 'Signup failed' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Sign in with email and password
export const signInWithPassword = async (email: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Supabase signin error:', error);
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password. Please try again.');
      }
      if (error.message.includes('Email not confirmed')) {
        throw new Error('Please confirm your email before signing in.');
      }
      throw new Error(error.message);
    }
    
    if (data.user) {
      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      };
    }
    
    return { success: false, error: 'Login failed' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Send Magic Link to email (kept as alternative)
export const sendEmailOTP = async (email: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get the current origin for redirect
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: redirectUrl,
      },
    });
    
    if (error) {
      console.error('Supabase auth error:', error);
      
      // Handle specific errors
      if (error.message.includes('rate limit') || error.message.includes('Rate limit')) {
        throw new Error('Too many attempts. Please wait a few minutes and try again.');
      }
      if (error.message.includes('Email not confirmed') || error.message.includes('confirmation')) {
        throw new Error('Please check your email and click the confirmation link.');
      }
      if (error.message.includes('Invalid email')) {
        throw new Error('Please enter a valid email address.');
      }
      if (error.message.includes('Signups not allowed')) {
        throw new Error('New signups are currently disabled. Please contact support.');
      }
      throw new Error(error.message || 'Failed to send magic link');
    }
    return { success: true };
  } catch (error: any) {
    console.error('Auth error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
};

// Handle auth callback (when user clicks magic link)
export const handleAuthCallback = async (): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    if (data.session?.user) {
      return {
        success: true,
        user: {
          id: data.session.user.id,
          email: data.session.user.email,
          phone: data.session.user.phone,
        },
      };
    }
    
    return { success: false };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Send OTP to phone
export const sendPhoneOTP = async (phone: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Ensure phone has country code
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    
    const { error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
      options: {
        shouldCreateUser: true,
      },
    });
    
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Verify Email OTP
export const verifyEmailOTP = async (email: string, token: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    
    if (error) throw error;
    
    if (data.user) {
      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          phone: data.user.phone,
        },
      };
    }
    
    return { success: false, error: 'Verification failed' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Verify Phone OTP
export const verifyPhoneOTP = async (phone: string, token: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
  try {
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    
    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token,
      type: 'sms',
    });
    
    if (error) throw error;
    
    if (data.user) {
      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          phone: data.user.phone,
        },
      };
    }
    
    return { success: false, error: 'Verification failed' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get current session
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      return {
        id: user.id,
        email: user.email,
        phone: user.phone,
      };
    }
    
    return null;
  } catch {
    return null;
  }
};

// Sign out
export const signOut = async (): Promise<void> => {
  await supabase.auth.signOut();
};

// Listen to auth changes
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  return supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email,
        phone: session.user.phone,
      });
    } else {
      callback(null);
    }
  });
};
