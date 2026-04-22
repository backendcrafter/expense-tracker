// import { useState } from 'react';
// import axios from 'axios';

// function Login({ setPage }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   async function handleLogin() {
//     try {
//       const res = await axios.post('https://expense-tracker-gbsp.onrender.com/login', { email, password });
//       localStorage.setItem('token', res.data.token);
//       setPage('dashboard');
//     } catch (err) {
//       setError('Invalid email or password');
//     }
//   }

//   return (
//     <div>
//       <h2>Login</h2>
//       <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
//       <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
//       <button onClick={handleLogin}>Login</button>
//       {error && <p>{error}</p>}
//       <p>No account? <button onClick={() => setPage('register')}>Register</button></p>
//     </div>
//   );
// }

// export default Login;




import { useState } from "react";
import axios from "axios";

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0f0f13',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    background: '#16161f',
    border: '1px solid #1e1e2e',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
  },
  logo: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#555',
    marginBottom: '32px',
  },
  input: {
    background: '#0f0f13',
    border: '1px solid #1e1e2e',
    borderRadius: '10px',
    padding: '12px 14px',
    color: '#e8e6f0',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    marginBottom: '12px',
    display: 'block',
  },
  btn: {
    background: '#6c63ff',
    border: 'none',
    borderRadius: '10px',
    padding: '13px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    marginTop: '8px',
  },
  error: {
    color: '#ff6384',
    fontSize: '13px',
    marginTop: '8px',
  },
  link: {
    background: 'transparent',
    border: 'none',
    color: '#6c63ff',
    cursor: 'pointer',
    fontSize: '13px',
    padding: '0',
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '13px',
    color: '#555',
  }
};

function Login({ setPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin() {
    try {
      const res = await axios.post('https://expense-tracker-gbsp.onrender.com/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setPage('dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  }

  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={styles.card}>
        <div style={styles.logo}>💸 ExpenseTracker</div>
        <div style={styles.subtitle}>Sign in to your account</div>
        <input style={styles.input} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={styles.input} placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button style={styles.btn} onClick={handleLogin}>Sign In</button>
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.footer}>
          No account? <button style={styles.link} onClick={() => setPage('register')}>Register here</button>
        </div>
      </div>
    </div>
  );
}

export default Login;