import React, { useState } from 'react';
import { createUser, loginByEmail, User } from '../axiosApi/userApi';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      alert('Please enter an email');
      return;
    }

    if (isSignup && !name.trim()) {
      alert('Please enter a name');
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        const newUser = await createUser({ name, email });
        onLogin(newUser);
      } else {
        const user = await loginByEmail(email);
        onLogin(user);
      }
    } catch (error: any) {
      console.error('Error:', error);
      if (error.response?.status === 409) {
        alert('User with this email already exists. Try logging in instead.');
        setIsSignup(false);
      } else {
        alert(error?.response?.data?.message || 'Failed to authenticate. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Murmur</h1>
        <p style={styles.subtitle}>
          {isSignup ? 'Create your account' : 'Sign in to your account'}
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {isSignup && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                placeholder="Enter your name"
                required={isSignup}
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div style={styles.toggle}>
          {isSignup ? (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setIsSignup(false)}
                style={styles.toggleButton}
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => setIsSignup(true)}
                style={styles.toggleButton}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1da1f2',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    textAlign: 'center',
    color: '#666',
    marginBottom: '32px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    outline: 'none',
  },
  button: {
    backgroundColor: '#1da1f2',
    color: '#fff',
    border: 'none',
    padding: '12px',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '8px',
  },
  toggle: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '14px',
    color: '#666',
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    color: '#1da1f2',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'underline',
  },
};

export default Login;