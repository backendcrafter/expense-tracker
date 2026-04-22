import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  const [page, setPage] = useState('login');

  if (page === 'login') return <Login setPage={setPage} />;
  if (page === 'register') return <Register setPage={setPage} />;
  if (page === 'dashboard') return <Dashboard setPage={setPage} />;
}

export default App;