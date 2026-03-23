import { useState, useEffect } from 'react';
import AuthPage from './components/AuthPage';
import LivresPage from './components/LivresPage';
import { auth } from './api';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      auth.me()
        .then(setUser)
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) return null;

  if (!user) return <AuthPage onLogin={setUser} />;

  return (
    <div className="app">
      <header className="header">
        <h1>Bibliothèque</h1>
        <div className="user-info">
          <span>{user.nom}</span>
          <span className={`badge ${user.role}`}>{user.role}</span>
          <button className="btn-outline btn-sm" onClick={logout}>Déconnexion</button>
        </div>
      </header>

      <LivresPage user={user} onToast={showToast} />

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  );
}
