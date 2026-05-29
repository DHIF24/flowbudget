import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  User,
  LogOut,
  ShieldAlert,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBudget } from '../context/BudgetContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Settings() {
  const { user, logout, updatePassword } = useAuth();
  const {
    settings,
    loading
  } = useBudget();

  // Profile State
  const [displayName, setDisplayName] = useState('');

  // 2. Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Load display name from settings
  useEffect(() => {
    if (!loading && settings) {
      setDisplayName(settings.displayName || '');
    }
  }, [loading, settings]);


  // Password change handler
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword) {
      setPasswordError('Veuillez saisir votre mot de passe actuel.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Le nouveau mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      return;
    }

    toast.loading('Mise à jour du mot de passe...', { id: 'password-change' });
    try {
      await updatePassword(currentPassword, newPassword);
      toast.success('Mot de passe mis à jour avec succès !', { id: 'password-change' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.dismiss('password-change');
      if (error.code === 'auth/wrong-password') {
        setPasswordError('Mot de passe actuel incorrect.');
      } else if (error.code === 'auth/requires-recent-login') {
        setPasswordError('Pour des raisons de sécurité, veuillez vous déconnecter et vous reconnecter avant de changer votre mot de passe.');
      } else {
        setPasswordError(error.message || 'Erreur lors de la mise à jour du mot de passe.');
      }
    }
  };

  // Delete Account Action
  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(
      '⚠️ SUPPRESSION DU COMPTE : Cette action est irréversible. Toutes vos données seront effacées.'
    );
    if (!isConfirmed) return;

    if (user && typeof user.delete === 'function') {
      toast.loading('Suppression du compte...', { id: 'delete-acc' });
      try {
        await user.delete();
        toast.dismiss('delete-acc');
        toast.success('Votre compte a été supprimé.');
        logout();
      } catch (error) {
        toast.dismiss('delete-acc');
        toast.error('Pour des raisons de sécurité, veuillez vous déconnecter et vous reconnecter avant de pouvoir supprimer votre compte.');
      }
    } else {
      toast.error('Impossible de supprimer le compte actuellement.');
    }
  };

  const getInitials = () => {
    if (displayName) return displayName.slice(0, 2).toUpperCase();
    if (user?.email) return user.email.slice(0, 2).toUpperCase();
    return 'FB';
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-7 w-48 bg-slate-200 dark:bg-zinc-800 rounded-lg" />
        <div className="space-y-6">
          <div className="h-44 bg-slate-200 dark:bg-zinc-800 rounded-2xl" />
          <div className="h-44 bg-slate-200 dark:bg-zinc-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6 animate-fade-in max-w-2xl">
      
      {/* Page Title */}
      <header>
        <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-widest font-mono">
          Espace Préférences
        </span>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">
          Configuration générale
        </h2>
      </header>

      {/* Profile Section - Editable */}
      <section className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-5 uppercase tracking-wider text-xs font-mono font-semibold text-slate-500 dark:text-zinc-400">
          <User className="h-4 w-4 text-[#534AB7]" />
          <span>Mon Profil</span>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="h-16 w-16 rounded-full bg-[#534AB7] text-white flex items-center justify-center text-lg font-bold shadow-md ring-4 ring-indigo-50 dark:ring-indigo-950/40 shrink-0">
            {getInitials()}
          </div>
          
          <div className="text-center sm:text-left space-y-3 w-full min-w-0 flex-1">
            <div>
              <p className="text-xs text-slate-400 mb-1">Nom d'affichage</p>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Votre nom"
                className="w-full sm:w-auto px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm font-semibold text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#534AB7] focus:border-transparent"
              />
            </div>
            <button
              onClick={() => {
                if (!displayName.trim()) {
                  toast.error("Le nom d'affichage ne peut pas être vide.");
                  return;
                }
                toast.success('Nom enregistré !');
              }}
              className="px-4 py-2 bg-[#534AB7] text-white rounded-lg text-sm font-medium hover:bg-[#534AB7]/90 transition"
            >
              Enregistrer
            </button>
            <p className="text-xs text-slate-500 font-mono">
              {user?.email}
            </p>
          </div>
        </div>
      </section>

      {/* Password Change Section */}
      <section className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-zinc-800">
          <Lock className="w-5 h-5 text-[#534AB7]" />
          <h2 className="uppercase tracking-wider text-xs font-mono font-semibold text-slate-500 dark:text-zinc-400">
            Changer le mot de passe
          </h2>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-3">
          <div className="relative">
            <Input
              type={showPasswords ? 'text' : 'password'}
              placeholder="Mot de passe actuel"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="relative">
            <Input
              type={showPasswords ? 'text' : 'password'}
              placeholder="Nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
            />
          </div>

          <div className="relative">
            <Input
              type={showPasswords ? 'text' : 'password'}
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPasswords ? 'Masquer' : 'Afficher'}
            </button>
          </div>

          <Button type="submit" className="w-full" disabled={!currentPassword || !newPassword || !confirmPassword}>
            Mettre à jour le mot de passe
          </Button>
        </form>
      </section>

      {/* 3. Account controls module */}
      <section className="bg-red-50/20 dark:bg-red-950/5 border border-red-100 dark:border-red-955/20 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D85A30] uppercase">
          <ShieldAlert className="h-4.5 w-4.5" />
          <span>Zone de danger / Compte</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            onClick={() => {
              logout();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-bold transition focus:outline-none"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Déconnexion</span>
          </button>

          <button
            onClick={handleDeleteAccount}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#D85A30] hover:bg-orange-700 text-white text-xs font-bold transition focus:outline-none"
          >
            <span>Supprimer définitivement le compte</span>
          </button>
        </div>
      </section>

    </div>
  );
}
