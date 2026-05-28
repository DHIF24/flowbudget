import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  User, 
  Settings as SettingsIcon, 
  Download, 
  Trash2, 
  LogOut, 
  ShieldAlert,
  Moon,
  Sun,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBudget } from '../context/BudgetContext';
import { exportCSV } from '../utils/exportCSV';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Settings() {
  const { user, logout } = useAuth();
  const { 
    settings, 
    updateUserSettings, 
    clearMonthData, 
    transactions,
    loading 
  } = useBudget();

  // 1. Profile & Preferences State
  const [displayName, setDisplayName] = useState('');
  const [currency, setCurrency] = useState('DT');
  const [savingsGoal, setSavingsGoal] = useState('');

  // 2. Dark Mode Toggle State with direct DocumentElement bindings
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || document.documentElement.classList.contains('dark');
  });

  // Load Firestore settings values into form fields
  useEffect(() => {
    if (!loading && settings) {
      setDisplayName(settings.displayName || '');
      setCurrency(settings.currency || 'DT');
      setSavingsGoal(settings.savingsGoal || '');
    }
  }, [loading, settings]);

  // Handle Dark mode transformations on DOM
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      toast.error("Le nom d'affichage ne peut pas être vide.");
      return;
    }
    if (savingsGoal !== '' && (isNaN(savingsGoal) || Number(savingsGoal) < 0)) {
      toast.error('Le montant d\'épargne cible doit être supérieur ou égal à 0.');
      return;
    }

    try {
      await updateUserSettings({
        displayName: displayName.trim(),
        currency,
        savingsGoal: Number(savingsGoal) || 0
      });
    } catch (error) {
      toast.error('Erreur lors de la mise à jour.');
    }
  };

  // CSV Exporter Action
  const handleCSVExport = () => {
    if (transactions.length === 0) {
      toast.error('Aucune donnée à exporter.');
      return;
    }
    toast.success('Génération du CSV...');
    exportCSV(transactions, settings.currency);
  };

  // Month data clearing Action
  const handleClearMonthData = async () => {
    const isConfirmed = window.confirm(
      '🚨 ÊTES-VOUS SÛR ? Cette action supprimera définitivement toutes les transactions et les budgets configurés pour le mois en cours.'
    );
    if (!isConfirmed) return;

    toast.loading('Suppression en cours...', { id: 'clearing-data' });
    try {
      await clearMonthData();
      toast.dismiss('clearing-data');
    } catch (error) {
      toast.dismiss('clearing-data');
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

      {/* 1. Profile info section */}
      <section className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="h-16 w-16 rounded-full bg-[#534AB7] text-white flex items-center justify-center text-lg font-bold shadow-md ring-4 ring-indigo-50 dark:ring-indigo-950/40 shrink-0">
            {getInitials()}
          </div>
          
          <div className="text-center sm:text-left space-y-1 w-full min-w-0">
            <h3 className="font-bold text-base text-slate-905 dark:text-zinc-100">
              {settings.displayName || user?.displayName || 'Utilisateur'}
            </h3>
            <p className="text-xs text-slate-500 font-mono select-all">
              ID: {user?.uid}
            </p>
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-slate-50 dark:bg-zinc-950 border border-slate-150 dark:border-zinc-805 text-[10px] font-medium rounded-full text-slate-500 font-sans mt-2 select-all">
              <span>E-mail:</span>
              <span className="font-semibold text-slate-700 dark:text-zinc-350">{user?.email} (Lecture seule)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Preferences & Display Setting Form */}
      <section className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-5 uppercase tracking-wider text-xs font-mono font-semibold text-slate-500 dark:text-zinc-400">
          <SettingsIcon className="h-4.5 w-4.5 text-[#534AB7]" />
          <span>Préférences de l'application</span>
        </div>

        <form onSubmit={handleSavePreferences} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nom de profil"
              id="sett-name"
              placeholder="Amine"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />

            <Input
              label="Objectif d'épargne mensuel"
              id="sett-savings"
              type="number"
              placeholder="200"
              suffix={currency}
              value={savingsGoal}
              onChange={(e) => setSavingsGoal(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-705 dark:text-zinc-300 block mb-1.5">
              Sélection de la devise d'affichage
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['DT', 'EUR', 'USD', 'GBP'].map((curCode) => (
                <button
                  key={curCode}
                  type="button"
                  onClick={() => setCurrency(curCode)}
                  className={`
                    py-2 rounded-lg border text-xs font-bold font-mono transition-all duration-155
                    ${currency === curCode
                      ? 'bg-[#534AB7]/10 text-[#534AB7] border-[#534AB7]'
                      : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800'
                    }
                  `}
                >
                  {curCode}
                </button>
              ))}
            </div>
          </div>

          {/* Dark Mode state triggers */}
          <div className="flex items-center justify-between py-3 border-t border-b border-slate-50 dark:border-zinc-800/60 my-2">
            <div>
              <span className="text-sm font-semibold text-slate-800 dark:text-zinc-200 block">
                Thème Sombre
              </span>
              <span className="text-[11px] text-slate-450 dark:text-zinc-500">
                Basculer l'affichage pour reposer vos yeux
              </span>
            </div>
            
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition shadow-sm"
              title="Changer de thème"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-amber-550" />
              ) : (
                <Moon className="h-5 w-5 text-[#534AB7]" />
              )}
            </button>
          </div>

          <Button type="submit" className="w-full">
            Enregistrer les préférences
          </Button>
        </form>
      </section>

      {/* 3. Data management module */}
      <section className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="uppercase tracking-wider text-xs font-mono font-semibold text-slate-500 dark:text-zinc-400">
          Gestion des données
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* CSV Download */}
          <button
            onClick={handleCSVExport}
            className="flex items-center gap-3 p-4 border border-slate-200 dark:border-zinc-855 rounded-xl text-left bg-slate-50/50 dark:bg-zinc-950/20 hover:bg-slate-100/60 dark:hover:bg-zinc-850/50 transition group"
          >
            <div className="p-2.5 bg-[#1D9E75]/10 text-[#1D9E75] dark:bg-[#1D9E75]/20 rounded-lg group-hover:scale-105 transition-transform duration-100 shrink-0">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-zinc-250 block">
                Exporter au format CSV
              </span>
              <span className="text-[10px] text-slate-450 dark:text-zinc-500 block leading-tight mt-0.5">
                Sauvegardez vos transactions sur votre appareil
              </span>
            </div>
          </button>

          {/* Month Data Clear */}
          <button
            onClick={handleClearMonthData}
            className="flex items-center gap-3 p-4 border border-slate-200 dark:border-zinc-855 rounded-xl text-left bg-slate-50/50 dark:bg-zinc-950/20 hover:bg-red-50/30 dark:hover:bg-red-950/10 transition group"
          >
            <div className="p-2.5 bg-orange-100 text-[#D85A30] dark:bg-orange-950/20 rounded-lg group-hover:scale-105 transition-transform duration-100 shrink-0">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-zinc-250 block">
                Vider les données du mois
              </span>
              <span className="text-[10px] text-slate-450 dark:text-zinc-500 block leading-tight mt-0.5 animate-pulse">
                Supprime tout pour le mois actif
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* 4. Account controls module */}
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
