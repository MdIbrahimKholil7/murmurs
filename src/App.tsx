import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import Timeline from './components/Timeline';
import { User } from './axiosApi/userApi';
import OwnProfile from './components/UserProfile';
import UserFollow from './components/UserFollow';

type Page = 'timeline' | 'profile' | 'user';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('timeline');

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div style={styles.app}>
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <h1 style={styles.logo}>Murmur</h1>
          <div style={styles.navLinks}>
            <button
              onClick={() => setCurrentPage('timeline')}
              style={{
                ...styles.navButton,
                ...(currentPage === 'timeline' ? styles.navButtonActive : {}),
              }}
            >
              Timeline
            </button>
            <button
              onClick={() => setCurrentPage('user')}
              style={{
                ...styles.navButton,
                ...(currentPage === 'user' ? styles.navButtonActive : {}),
              }}
            >
              Connect
            </button>
            <button
              onClick={() => setCurrentPage('profile')}
              style={{
                ...styles.navButton,
                ...(currentPage === 'profile' ? styles.navButtonActive : {}),
              }}
            >
              Profile
            </button>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main style={styles.main}>
        {currentPage === 'timeline' && (
          <Timeline currentUserId={currentUser.id} />
        )}
        {currentPage === 'user' && (
          <UserFollow currentUserId={currentUser.id} />
        )}
        {currentPage === 'profile' && (
          <OwnProfile
            currentUserId={currentUser.id}
            currentUserName={currentUser.name}
            currentUserEmail={currentUser.email}
          />
        )}
      </main>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
  },
  nav: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #ddd',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '12px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1da1f2',
    margin: 0,
  },
  navLinks: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  navButton: {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
    transition: 'background-color 0.2s',
  },
  navButtonActive: {
    backgroundColor: '#e8f5fe',
    color: '#1da1f2',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  main: {
    paddingTop: '20px',
    paddingBottom: '40px',
  },
};

export default App;