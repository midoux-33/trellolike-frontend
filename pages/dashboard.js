import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { listsApi, taskApi } from '../lib/api';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '../styles/dashboard.module.css';
import BoardModal from '../components/BoardModal';
import TaskCard from '../components/TaskCard';


export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // ÉTATS
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [showNewList, setShowNewList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [newListDesc, setNewListDesc] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
const [selectedBoard, setSelectedBoard] = useState(null);
const [tasksByList, setTasksByList] = useState({});

  const avatarSrc =
    user?.Avatar ||
    user?.defaultAvatar ||
    'https://ui-avatars.com/api/?name=User&size=200&background=4f46ca&color=fff&rounded=true';

  const colors = ['#eb5a46', '#00c2e0', '#7ac555', '#ffa533', '#f47ad5', '#5bc0eb', '#9f8fef'];

  // LOAD listes
  useEffect(() => {
  const loadLists = async () => {
  try {
    setLoading(true);
    const res = await listsApi.getAll();
    const allLists = res.data.lists || [];

    setLists(allLists);

    // Charge les tâches pour chaque liste (limité à 5 pour perf)
    const tasksObj = {};
    for (const list of allLists.slice(0, 5)) {
      try {
        const tasksRes = await taskApi.getTasksByList(list._id);
        tasksObj[list._id] = tasksRes.data.tasks || [];
      } catch (err) {
        tasksObj[list._id] = [];
      }
    }
    setTasksByList(tasksObj);
  } catch (error) {
    console.error('Erreur load lists:', error);
  } finally {
    setLoading(false);
  }
};

    loadLists();
  }, []);

  // CHECK auth
  useEffect(() => {
    if (user !== null) {
      setAuthLoading(false);
    }
  }, [user]);

  // CREATE liste
  const createList = async (e) => {
    e.preventDefault();
    try {
      const res = await listsApi.create({
        title: newListTitle,
        description: newListDesc,
      });

      setLists([res.data.list, ...lists]);
      setNewListTitle('');
      setNewListDesc('');
      setShowNewList(false);
    } catch (error) {
      console.error('Erreur create:', error);
      alert('Erreur création liste');
    }
  };

  const handleDeleteList = async (listId) => {
  if (!window.confirm('Supprimer définitivement cette liste ?')) return;

  try {
    await listsApi.delete(listId);
    // on retire la liste du state
    setLists((prev) => prev.filter((l) => l._id !== listId));
    // on ferme la modal si elle affiche cette liste
    setSelectedBoard((prev) => (prev && prev._id === listId ? null : prev));
  } catch (error) {
    console.error('Erreur suppression liste :', error);
    alert('Erreur lors de la suppression de la liste');
  }
};

  if (authLoading) {
    return <div className={styles.loading}>Chargement...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className={styles.container}>
      {/* AVATAR FLOTTANT QUI OUVRE LA SIDEBAR */}
      <div
        className={styles.floatingAvatar}
        onClick={() => setShowSidebar(true)}
      >
        <Image
          src={avatarSrc}
          alt="Avatar"
          width={48}
          height={48}
          className={styles.avatar}
        />
      </div>

      {/* SIDEBAR MODALE QUI SLIDE DEPUIS LA GAUCHE */}
      {showSidebar && (
        <div className={styles.sidebarModal}>
          <div className={styles.sidebarModalContent}>
            <div className={styles.avatarWrapper}>
              <Image
                src={avatarSrc}
                alt="Avatar"
                width={64}
                height={64}
                className={styles.avatar}
              />
              <span>{user.username || `${user.firstName} ${user.lastName}`}</span>
            </div>

            <button
              className={styles.newListBtn}
              onClick={() => {
                setShowNewList(true);
                setShowSidebar(false);
              }}
            >
              <span>+</span> Nouvelle liste
            </button>

            <button
              className={styles.logoutBtn}
              onClick={logout}
            >
              Déconnexion
            </button>
          </div>

          <button
            className={styles.sidebarClose}
            onClick={() => setShowSidebar(false)}
          >
            ×
          </button>
        </div>
      )}

      {/* CONTENU PRINCIPAL KANBAN */}
      <main className={styles.mainContent}>
        {loading ? (
          <div className={styles.loading}>Chargement des listes...</div>
        ) : lists.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>Aucune liste</h2>
            <p>Crée ta première liste pour commencer !</p>
          </div>
        ) : (
          <section className={styles.kanban}>
            <div className={styles.kanbanHeader}>
              <h1>Mes listes</h1>
              <span className={styles.listsCount}>{lists.length}</span>
            </div>

            <div className={styles.kanbanScroll}>
              {lists.map((list, index) => {
                const color = colors[index % colors.length];

                return (
                  <div key={list._id} className={styles.listColumn}>
                    {/* Bandeau coloré : clic = ouvrir description en modal */}
<div
  className={styles.columnHeaderBar}
  style={{ backgroundColor: color }}
  onClick={() => setSelectedBoard(list)}
>
  <span className={styles.columnTitle}>
    {list.title.toUpperCase()}
  </span>
  <span className={styles.taskCount}>
    {tasksByList[list._id]?.length || 0}
  </span>
</div>


                    {/* Corps de colonne classique (tu peux le garder ou le simplifier) */}
<div className={styles.columnBody}>
  {tasksByList[list._id]?.length > 0 ? (
    <>
      {tasksByList[list._id].slice(0, 3).map((task) => (
        <TaskCard 
          key={task._id} 
          task={task}
        />
      ))}
      {tasksByList[list._id].length > 3 && (
        <div className={styles.moreTasks}>
          +{tasksByList[list._id].length - 3} autres...
        </div>
      )}
    </>
  ) : (
    <div className={styles.noTasks}>Aucune tâche</div>
  )}
</div>

                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* MODAL CRÉATION LISTE */}
      {showNewList && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Nouvelle liste</h3>
            <form onSubmit={createList}>
              <input
                type="text"
                placeholder="Titre de la liste"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                className={styles.input}
                required
              />
              <textarea
                placeholder="Description (optionnel)"
                value={newListDesc}
                onChange={(e) => setNewListDesc(e.target.value)}
                className={styles.textarea}
              />
              <div className={styles.modalButtons}>
                <button type="submit" className={styles.modalSubmit}>
                  Créer
                </button>
                <button
                  type="button"
                  className={styles.modalCancel}
                  onClick={() => setShowNewList(false)}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DESCRIPTION LISTE */}
{selectedBoard && (
  <BoardModal
    board={selectedBoard}
    onClose={() => setSelectedBoard(null)}
    onDelete={handleDeleteList}
  />
)}



    </div>
  );
}
