import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Sparkles, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Login() {
  const { login } = useAuth();
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
