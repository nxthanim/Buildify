
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { logoSrc } from '../assets/logo';
import { Eye, EyeOff } from 'lucide-react';

const GoogleIcon = () => (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.82l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
      <path fill="none" d="M0 0h48v48H0z"></path>
    </svg>
);

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
    const handleGoogleLogin = async () => {
    setLoading(true);
    // In a real app, this would trigger the Google OAuth flow.
    // Here, we simulate a successful login with a mock google user.
    await login('user@google.com', 'fakepass');
    navigate('/dashboard');
    setLoading(false);
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <img src={logoSrc} alt="Buildify Logo" className="h-16 w-auto mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-text-primary">Welcome back</h1>
            <p className="text-text-secondary">Enter your credentials to access your dashboard.</p>
        </div>
        
        <div className="bg-surface p-8 rounded-2xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input 
              label="Work Email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
            />
            <div className="relative">
              <Input 
                label="Password"
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-10 text-text-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <div className="text-right">
              <Link to="#" className="text-sm text-primary hover:underline">Forgot?</Link>
            </div>

            {error && <p className="text-danger text-sm text-center">{error}</p>}

            <Button type="submit" variant="primary" className="w-full !py-3" isLoading={loading}>
              Sign In
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-surface px-2 text-text-secondary">OR CONTINUE WITH</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
              <Button onClick={handleGoogleLogin} variant="outline" className="w-full !py-3" isLoading={loading} leftIcon={<GoogleIcon />}>
                  Google
              </Button>
          </div>

          <p className="text-center text-text-secondary mt-8">
            Don't have an account? <Link to="/signup" className="font-semibold text-primary hover:underline">Sign Up</Link>
          </p>
        </div>
        <div className="text-center mt-8 text-xs text-text-secondary">
            <Link to="#" className="hover:underline">Privacy Policy</Link>
            <span className="mx-2">&bull;</span>
            <Link to="#" className="hover:underline">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
