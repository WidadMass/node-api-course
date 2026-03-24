import { useState, useEffect } from 'react';
import AuthPage from './components/AuthPage';
import LivresPage from './components/LivresPage';
import { auth, setToken, clearToken } from './api';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // restaurer la session via le refresh token cookie
  useEffect(() => {
    auth.refresh()
      .then((data) => {
        setToken(data.accessToken);
        return auth.me();
      })
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  // écouter déco forcée (refresh expiré)
  useEffect(() => {
    const handleForceLogout = () => {
      clearToken();
      setUser(null);
    };
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = async () => {
    try {
      await auth.logout();
    } catch {
      // on déconnecte quand même
    }
    clearToken();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) return <AuthPage onLogin={setUser} />;

  return (
    <div className="app">
      <header className="header">
        <h1>Bibliothèque</h1>
        <div className="user-info">
          <span>{user.nom}</span>
          <span className={`badge ${user.role}`}>{user.role}</span>
          <button className="btn-outline btn-sm" onClick={handleLogout}>Déconnexion</button>
        </div>
      </header>

      <LivresPage user={user} onToast={showToast} />

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  );
}
