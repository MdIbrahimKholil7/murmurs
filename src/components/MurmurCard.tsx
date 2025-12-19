import React, { useState } from 'react';
import { Murmur, likeMurmur, unlikeMurmur, deleteMurmur } from '../axiosApi/murmurApi';

interface MurmurCardProps {
  murmur: Murmur;
  currentUserId: number;
  onDelete?: () => void;
  onLikeToggle?: () => void;

}

const MurmurCard: React.FC<MurmurCardProps> = ({ murmur, currentUserId, onDelete, onLikeToggle }) => {
  const [isLiked, setIsLiked] = useState(
    murmur.likes ? murmur.likes?.some(like => like.user.id === currentUserId) : false
  );
  const [likeCount, setLikeCount] = useState(murmur.likes ? murmur.likes.length : 0);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlikeMurmur(currentUserId, murmur.id);
        setLikeCount(prev => prev - 1);
        setIsLiked(false);
      } else {
        await likeMurmur(currentUserId, murmur.id);
        setLikeCount(prev => prev + 1);
        setIsLiked(true);
      }
      if (onLikeToggle) onLikeToggle();
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Failed to toggle like');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this murmur?')) return;

    setIsDeleting(true);
    try {
      await deleteMurmur(currentUserId, murmur.id);
      if (onDelete) onDelete();
    } catch (error) {
      console.error('Error deleting murmur:', error);
      alert('Failed to delete murmur');
      setIsDeleting(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const isOwnMurmur = murmur.user.id === currentUserId;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <strong style={styles.userName}>{murmur.user.name}</strong>
          <span style={styles.date}>
            {new Date(murmur.createdAt).toLocaleString()}
          </span>
        </div>
        {isOwnMurmur && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            style={styles.deleteButton}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>
      <p style={styles.text}>{murmur.text}</p>
      <div style={styles.footer}>
        <button
          onClick={handleLike}
          style={{
            ...styles.likeButton,
            ...(isLiked ? styles.likeButtonActive : {}),
          }}
        >
          {isLiked ? '❤️' : '🤍'} {likeCount}
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px',
    backgroundColor: '#fff',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  userName: {
    fontSize: '16px',
    color: '#333',
    marginRight: '8px',
  },
  date: {
    fontSize: '12px',
    color: '#888',
  },
  text: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#333',
    marginBottom: '12px',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
  },
  likeButton: {
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  },
  likeButtonActive: {
    color: '#e0245e',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
};

export default MurmurCard;