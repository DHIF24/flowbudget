import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Sparkles, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleValidation = () => {
    const tempErrors = {};
    if (!email) {
      tempErrors.email = 'L\'adresse e-mail est obligatoire.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Adresse e-mail non valide.';
    }
    if (!password) {
      tempErrors.password = 'Le mot de passe est obligatoire.';
    } else if (password.length < 6) {
      tempErrors.password = 'Le mot de passe doit contenir au moins 6 caractères.';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidation()) return;

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Connexion réussie !');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Échec de la connexion. Veuillez activer ou vérifier l\'adresse e-mail dans Firebase Auth Console.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Connexion réussie via Google !');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Échec de connexion via Google Auth.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-zinc-950 px-4 py-8 relative">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/60 dark:border-zinc-800 p-8 shadow-sm">
        
        {/* Logo/Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3 bg-[#534AB7] rounded-2xl text-white mb-3">
            <Sparkles className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Taba3 flousek
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Gérez vos finances personnelles en temps réel
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Adresse E-mail"
            id="login-email"
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="email"
          />

          <Input
            label="Mot de passe"
            id="login-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="current-password"
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-2"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-zinc-800" />
          </div>
          <span className="relative bg-white dark:bg-zinc-900 px-3 text-xs text-slate-400 font-mono">
            OU CONTINUER AVEC
          </span>
        </div>

        {/* Google Authentication popup */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition focus:outline-none"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
          Google
        </button>

        {/* Footer info text links */}
        <p className="text-center text-xs text-slate-500 mt-6 font-sans">
          Vous n'avez pas de compte ?{' '}
          <Link 
            to="/register" 
            className="text-[#534AB7] font-semibold hover:underline"
          >
            S'inscrire
          </Link>
        </p>

        {/* Administrative Firebase alert note to assist compilation runtimes */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-zinc-800/80 text-[10px] text-slate-400 dark:text-zinc-500 text-center leading-relaxed">
          * Note: Pour utiliser la connexion par e-mail/mot de passe locale, assurez-vous qu'elle est activée dans votre Firebase Authentication console.
        </div>

      </div>
    </div>
  );
}
