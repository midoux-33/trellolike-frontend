// pages/dashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { listsApi } from '../lib/api';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  // ÉTATS
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewList, setShowNewList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [newListDesc, setNewListDesc] = useState('');

  // 1. LOAD listes
  useEffect(() => {
    const loadLists = async () => {
      try {
        setLoading(true);
        const res = await listsApi.getAll();
        setLists(res.data.lists || []);
      } catch (error) {
        console.error('Erreur load lists:', error);
      } finally {
        setLoading(false);
      }
    };
    loadLists();
  }, []);

  // 2. CREATE liste
  const createList = async (e) => {
    e.preventDefault();
    try {
      const res = await listsApi.create({
        title: newListTitle,
        description: newListDesc
      });
      
      // Refresh auto
      setLists([res.data.list, ...lists]);
      setNewListTitle('');
      setNewListDesc('');
      setShowNewList(false);
    } catch (error) {
      console.error('Erreur create:', error);
      alert('Erreur création liste');
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* HEADER */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>
            Bonjour {user.username} !
          </h1>
          <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
            {lists.length} liste(s)
          </p>
        </div>
        <button 
          onClick={logout}
          style={{ 
            padding: '0.75rem 1.5rem', 
            background: '#ef4444', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Déconnexion
        </button>
      </div>

      {/* CREATE BUTTON */}
      <button 
        onClick={() => setShowNewList(true)}
        style={{ 
          padding: '1rem 2rem', 
          background: '#10b981', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px',
          fontSize: '1.1rem',
          cursor: 'pointer'
        }}
      >
        + Nouvelle liste
      </button>

      {/* LOADING */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          Chargement des listes...
        </div>
      )}

      {/* LISTES */}
      {!loading && lists.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
          Aucune liste. Crée la première !
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '1.5rem', 
        marginTop: '2rem' 
      }}>
        {lists.map((list) => (
          <div key={list._id} style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            background: 'white',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              margin: '0 0 0.5rem 0',
              color: '#111827'
            }}>
              {list.title}
            </h3>
            <p style={{ color: '#6b7280', margin: '0 0 1rem 0' }}>
              {list.description || 'Aucune description'}
            </p>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              <strong>Propriétaire :</strong> {list.owner?.username || 'Inconnu'}
            </div>
            {list.collaborators?.length > 0 && (
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                <strong>Collaborateurs :</strong> {list.collaborators.length}
              </div>
            )}
            <button 
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
              onClick={() => router.push(`/list/${list._id}`)}
            >
              Voir les tâches
            </button>
          </div>
        ))}
      </div>

      {/* MODAL CREATE */}
      {showNewList && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            minWidth: '400px',
            maxWidth: '90vw'
          }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              Nouvelle liste
            </h3>
            <form onSubmit={createList} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Titre de la liste"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px'
                }}
                required
              />
              <textarea
                placeholder="Description (optionnel)"
                value={newListDesc}
                onChange={(e) => setNewListDesc(e.target.value)}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  minHeight: '80px',
                  resize: 'vertical'
                }}
              />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px'
                  }}
                >
                  Créer
                </button>
                <button 
                  type="button"
                  onClick={() => setShowNewList(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px'
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
