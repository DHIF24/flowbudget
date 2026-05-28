import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveSettings } from '../firebase/firestore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleValidation = () => {
    const tempErrors = {};
    if (!name.trim()) {
      tempErrors.name = 'Le nom est obligatoire.';
    }
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
      const userCred = await register(email, password, name.trim());
      const userId = userCred.user.uid;
      
      // Initialize Default Settings in Firestore on new user signup
      await saveSettings(userId, {
        currency: 'DT',
        savingsGoal: 200,
        displayName: name.trim()
      });

      toast.success('Compte créé avec succès !');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Échec de la création du compte. Vérifiez que la méthode e-mail est activée dans Firebase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-zinc-950 px-4 py-8 relative">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/60 dark:border-zinc-800 p-8 shadow-sm">
        
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3 bg-[#534AB7] rounded-2xl text-white mb-3">
            <Sparkles className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Créer un compte
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Rejoignez Taba3 flousek pour أتمتة مصروفاتك
          </p>
        </div>

        {/* Form elements */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom d'affichage"
            id="register-name"
            placeholder="Ex: Amine"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />

          <Input
            label="Adresse E-mail"
            id="register-email"
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="email"
          />

          <Input
            label="Mot de passe"
            id="register-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-2"
          >
            {loading ? 'Création...' : "S'inscrire"}
          </Button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Vous possédez déjà un compte ?{' '}
          <Link 
            to="/login" 
            className="text-[#534AB7] font-semibold hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
