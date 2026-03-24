import { useState } from 'react';
import { auth, setToken } from '../api';

export default function AuthPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ nom: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await auth.register(form);
        // après inscription, on connecte direct
        const data = await auth.login({ email: form.email, password: form.password });
        setToken(data.accessToken);
        onLogin(data.user);
      } else {
        const data = await auth.login({ email: form.email, password: form.password });
        setToken(data.accessToken);
        onLogin(data.user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isRegister ? 'Créer un compte' : 'Connexion'}</h2>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label>Nom</label>
              <input value={form.nom} onChange={set('nom')} placeholder="Votre nom" />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="email@exemple.fr" />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Chargement...' : isRegister ? "S'inscrire" : 'Se connecter'}
          </button>
        </form>
        <div className="auth-toggle">
          {isRegister ? 'Déjà un compte ? ' : 'Pas encore de compte ? '}
          <span onClick={() => { setIsRegister(!isRegister); setError(''); }}>
            {isRegister ? 'Se connecter' : "S'inscrire"}
          </span>
        </div>
      </div>
    </div>
  );
}
