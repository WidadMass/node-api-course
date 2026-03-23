import { useState, useEffect } from 'react';
import { livres as api } from '../api';

export default function LivresPage({ user, onToast }) {
  const [livresList, setLivres] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ titre: '', auteur: '', annee: '', genre: '' });

  const load = async () => {
    try {
      const data = await api.getAll();
      setLivres(data);
    } catch (err) {
      onToast(err.message, 'error');
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const body = { ...form };
      if (body.annee) body.annee = Number(body.annee);
      else delete body.annee;
      if (!body.genre) delete body.genre;

      await api.create(body);
      setShowModal(false);
      setForm({ titre: '', auteur: '', annee: '', genre: '' });
      onToast('Livre ajouté !', 'success');
      load();
    } catch (err) {
      onToast(err.message, 'error');
    }
  };

  const handleEmprunter = async (id) => {
    try {
      await api.emprunter(id);
      onToast('Livre emprunté !', 'success');
      load();
    } catch (err) {
      onToast(err.message, 'error');
    }
  };

  const handleRetourner = async (id) => {
    try {
      await api.retourner(id);
      onToast('Livre retourné !', 'success');
      load();
    } catch (err) {
      onToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.remove(id);
      onToast('Livre supprimé', 'success');
      load();
    } catch (err) {
      onToast(err.message, 'error');
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <>
      <div className="toolbar">
        <h2>Livres ({livresList.length})</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ Ajouter</button>
      </div>

      <div className="livres-grid">
        {livresList.map((livre) => (
          <div key={livre.id} className="livre-card">
            <h3>{livre.titre}</h3>
            <div className="auteur">{livre.auteur}</div>
            <div className="meta">
              {livre.annee && <span className="tag">{livre.annee}</span>}
              {livre.genre && <span className="tag">{livre.genre}</span>}
              <span className={`tag ${livre.disponible ? 'available' : 'unavailable'}`}>
                {livre.disponible ? 'Disponible' : 'Emprunté'}
              </span>
            </div>
            <div className="actions">
              {livre.disponible ? (
                <button className="btn-success btn-sm" onClick={() => handleEmprunter(livre.id)}>
                  Emprunter
                </button>
              ) : (
                <button className="btn-warning btn-sm" onClick={() => handleRetourner(livre.id)}>
                  Retourner
                </button>
              )}
              {user.role === 'admin' && (
                <button className="btn-danger btn-sm" onClick={() => handleDelete(livre.id)}>
                  Supprimer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Ajouter un livre</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Titre *</label>
                <input value={form.titre} onChange={set('titre')} required />
              </div>
              <div className="form-group">
                <label>Auteur *</label>
                <input value={form.auteur} onChange={set('auteur')} required />
              </div>
              <div className="form-group">
                <label>Année</label>
                <input type="number" value={form.annee} onChange={set('annee')} />
              </div>
              <div className="form-group">
                <label>Genre</label>
                <input value={form.genre} onChange={set('genre')} />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-outline" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn-primary">Ajouter</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
