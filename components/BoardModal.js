// components/BoardModal.jsx
import React, { useState} from 'react';
import styles from '../styles/dashboard.module.css';

export default function BoardModal({ board, onClose, onDelete }) {
  if (!board) return null;

  const [showMembersPanel, setShowMembersPanel] = useState(false);

  // Progression factice pour l'instant
  const progress = board.progress ?? 32;

  // Date de création formatée
  const createdAt = board.createdAt
    ? new Date(board.createdAt).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Date inconnue';

  // Collaborateurs (max 3 avatars affichés)
  const collaborators = board.collaborators || [];
  const firstThree = collaborators.slice(0, 3);
  const extraCount = collaborators.length > 3 ? collaborators.length - 3 : 0;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.descModalCard}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton X */}
        <button
          className={styles.descModalClose}
          type="button"
          onClick={onClose}
        >
          ×
        </button>

        {/* Titre */}
        <h3 className={styles.descModalTitle}>{board.title}</h3>

        {/* Date de création */}
        <div className={styles.descMetaRow}>
          <span className={styles.descMetaIcon}>🏳️</span>
          <span className={styles.descMetaText}>
            Créée le {createdAt}
          </span>
        </div>

        {/* Description */}
        <p className={styles.descModalText}>
          {board.description || 'Aucune description pour cette liste.'}
        </p>

        {/* Progression */}
        <div className={styles.descProgressRow}>
          <span className={styles.descProgressLabel}>Progression du projet</span>
          <span className={styles.descProgressPercent}>{progress}%</span>
        </div>
        <div className={styles.descProgressTrack}>
          <div
            className={styles.descProgressFill}
            style={{ width: `${progress}%` }}
          />
        </div>

{/* Collaborateurs */}
{showMembersPanel ? (
  // Vue "Project Members" (liste détaillée)
  <div className={styles.membersPanel}>
    <div className={styles.membersHeader}>
      <span className={styles.membersTitle}>Membres du projet</span>
      <button
        type="button"
        className={styles.membersMoreBtn}
        onClick={() => setShowMembersPanel(false)}
      >
        ⋯
      </button>
    </div>

    <div className={styles.membersList}>
      {collaborators.length === 0 && (
        <div className={styles.membersEmpty}>
          Aucun collaborateur pour l’instant.
        </div>
      )}

      {collaborators.map((collab, idx) => {
        const u = collab.user || {};
        const avatar =
          u.avatar ||
          u.defaultAvatar 

        const role =
          collab.role ||
          u.role ||
          'Membre du projet';

        return (
          <div key={u._id || idx} className={styles.memberRow}>
            <img
              src={avatar}
              alt={u.username || 'Collaborateur'}
              className={styles.memberAvatar}
            />
            <div className={styles.memberInfo}>
              <span className={styles.memberName}>
                {u.username || `${u.firstName || ''} ${u.lastName || ''}` || 'Sans nom'}
              </span>
              <span className={styles.memberRole}>{role}</span>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        className={styles.addMemberRow}
        onClick={() => alert('Ajout de collaborateur (à implémenter)')}
      >
        <div className={styles.addMemberIcon}>👤</div>
        <span className={styles.addMemberText}>Ajouter un membre</span>
      </button>
    </div>
  </div>
) : (
  // Vue compacte : avatars + bouton +
  <div className={styles.descPeopleRow}>
    <button
      type="button"
      className={styles.descAvatarsButton}
      onClick={() => setShowMembersPanel(true)}
    >
      <div className={styles.descAvatars}>
        {firstThree.map((collab, idx) => {
          const u = collab.user || {};
          const avatar =
            u.avatar ||
            u.defaultAvatar 

          return (
            <img
              key={u._id || idx}
              src={avatar}
              alt={u.username || 'Collaborateur'}
              className={styles.descAvatar}
            />
          );
        })}
        {extraCount > 0 && (
          <div className={styles.descMore}>+ {extraCount}</div>
        )}
      </div>
    </button>

    <button
      type="button"
      className={styles.descAddBtn}
      onClick={() => alert('Ajout de collaborateur (à implémenter)')}
    >
      +
    </button>
  </div>
)}

    {/* Bouton supprimer */}
        <div className={styles.descFooterRow}>
  <button
    type="button"
    className={styles.descDeleteBtn}
    onClick={() => onDelete && onDelete(board._id)}
  >
    Supprimer la liste
  </button>
</div>

      </div>
    </div>
  );
}
