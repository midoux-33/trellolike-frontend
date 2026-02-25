import React from 'react';
import styles from '../styles/taskCard.module.css';

export default function TaskCard({
  task,
  onClick,          // ouvrir une modal de détail par ex.
  onToggleStatus,   // passer de todo -> in-progress -> done
  onDelete,         // supprimer la tâche
}) {
  if (!task) return null;

  const {
    title,
    description,
    status,
    priority,
    dueDate,
    assignedTo = [],
  } = task;

  // format date
  const formattedDueDate = dueDate
    ? new Date(dueDate).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null;

  // priorité en français + couleur
  const priorityLabel =
    priority === 'high'
      ? 'Haute'
      : priority === 'low'
      ? 'Basse'
      : 'Moyenne';

  return (
    <article
      className={styles.card}
      onClick={onClick}
    >
      {/* Ligne titre + menu */}
      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          <span
            className={`${styles.statusDot} ${styles[`status_${status}`]}`}
          />
          <h4 className={styles.title}>{title}</h4>
        </div>

        {/* Petit menu contextuel (placeholder) */}
        <button
          type="button"
          className={styles.menuBtn}
          onClick={(e) => {
            e.stopPropagation();
            // plus tard: ouvrir un vrai menu
          }}
        >
          ⋯
        </button>
      </header>

      {/* Meta : due date + priorité */}
      <div className={styles.metaRow}>
        {formattedDueDate && (
          <span className={styles.metaItem}>
            📅 Échéance : {formattedDueDate}
          </span>
        )}
        <span
          className={`${styles.metaItem} ${styles[`priority_${priority}`]}`}
        >
          ⚡ Priorité : {priorityLabel}
        </span>
      </div>

      {/* Description courte */}
      {description && (
        <p className={styles.description}>
          {description.length > 140
            ? `${description.slice(0, 140)}…`
            : description}
        </p>
      )}

      {/* Ligne bas : avatars + actions */}
      <footer className={styles.footer}>
        {/* Avatars assignés */}
        <div className={styles.avatars}>
          {assignedTo.slice(0, 3).map((user, idx) => {
            const avatar =
              user.avatar ||
              user.defaultAvatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                (user.firstName || '') + ' ' + (user.lastName || '')
              )}&size=64&background=4f46ca&color=fff&rounded=true`;

            return (
              <img
                key={user._id || idx}
                src={avatar}
                alt={user.username || 'Utilisateur'}
                className={styles.avatar}
              />
            );
          })}
          {assignedTo.length > 3 && (
            <span className={styles.more}>
              +{assignedTo.length - 3}
            </span>
          )}
        </div>

        {/* Actions rapides */}
        <div className={styles.actions}>
          {onToggleStatus && (
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(task);
              }}
            >
              Changer statut
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              className={styles.dangerBtn}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task);
              }}
            >
              Supprimer
            </button>
          )}
        </div>
      </footer>
    </article>
  );
}
