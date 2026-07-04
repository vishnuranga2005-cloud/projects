import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { signUpWithPassword, signInWithPassword, sendPasswordResetEmail } from '../lib/auth';
import { SignInPage, type Testimonial } from '@/components/ui/sign-in';

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess: _onLoginSuccess }: LoginProps) {
  const { t } = useLanguage();
  const { setUser } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const testimonials: Testimonial[] = [
    {
      avatarSrc: 'https://randomuser.me/api/portraits/women/65.jpg',
      name: 'Dr. Ananya Sharma',
      handle: '@mediflowcare',
      text: 'MediFlow keeps appointments, patient records, and care coordination in one place.',
    },
    {
      avatarSrc: 'https://randomuser.me/api/portraits/men/75.jpg',
      name: 'Rahul Mehta',
      handle: '@mediflowpatient',
      text: 'Booking appointments and tracking medical history feels simple and reliable.',
    },
  ];

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!password.trim() || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    if (isSignUp) {
      const result = await signUpWithPassword(email, password);
      setIsLoading(false);
      
      if (result.success) {
        if (result.needsConfirmation) {
          // Email confirmation is required - give instructions
          setSuccess('Account created! Email confirmation is enabled on your Supabase. Either:\n1. Check your email and click the confirmation link, OR\n2. Go to Supabase Dashboard → Authentication → Providers → Email → Turn OFF "Confirm email"');
          setIsSignUp(false);
        } else if (result.user) {
          setUser(result.user);
        }
      } else {
        setError(result.error || 'Signup failed');
      }
    } else {
      const result = await signInWithPassword(email, password);
      setIsLoading(false);
      
      if (result.success && result.user) {
        setUser(result.user);
      } else {
        setError(result.error || 'Login failed');
      }
    }
  };

  if (!isSignUp) {
    return (
      <SignInPage
        title={<span className="font-light tracking-tighter text-slate-900">Welcome to MediFlow</span>}
        description="Sign in to book appointments, manage your care, and stay connected with your providers."
        heroImageSrc="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=2160&q=80"
        testimonials={testimonials}
        onSignIn={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const emailValue = String(formData.get('email') || '').trim();
          const passwordValue = String(formData.get('password') || '').trim();

          if (!emailValue) {
            setError('Please enter your email');
            return;
          }
          if (!passwordValue || passwordValue.length < 6) {
            setError('Password must be at least 6 characters');
            return;
          }

          setError('');
          setSuccess('');
          setIsLoading(true);

          signInWithPassword(emailValue, passwordValue).then((result) => {
            setIsLoading(false);
            if (result.success && result.user) {
              setUser(result.user);
            } else {
              setError(result.error || 'Login failed');
            }
          });
        }}
        onGoogleSignIn={() => setError('Google sign-in is not configured in this Mediflow build yet.')}
        onResetPassword={async () => {
          const targetEmail = email.trim() || resetEmail.trim();

          if (!targetEmail) {
            setError('Enter your email first, then choose Reset password.');
            return;
          }

          setIsLoading(true);
          setError('');
          setSuccess('');

          const result = await sendPasswordResetEmail(targetEmail);
          setIsLoading(false);

          if (result.success) {
            setSuccess('Password reset email sent. Check your inbox for the next step.');
            setResetEmail(targetEmail);
          } else {
            setError(result.error || 'Unable to send password reset email');
          }
        }}
        onCreateAccount={() => {
          setIsSignUp(true);
          setError('');
          setSuccess('');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-white flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-full mb-6 shadow-xl">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {t('login.welcome') || 'Create your MediFlow account'}
          </h1>
          <p className="text-gray-600">
            {isSignUp ? 'Create your account to get started' : 'Sign in to continue'}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          {/* Email Input Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Password Input Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Enter your password (min 6 characters)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>

          {/* Toggle Sign Up / Sign In */}
          <div className="mt-4 text-center">
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess(''); }}
              className="text-teal-600 hover:text-teal-800 font-medium text-sm"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
