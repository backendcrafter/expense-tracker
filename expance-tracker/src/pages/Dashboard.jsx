import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArcElement, Tooltip, Legend, Chart } from 'chart.js';
import { Pie } from 'react-chartjs-2';

Chart.register(ArcElement, Tooltip, Legend);

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0f0f13',
    color: '#e8e6f0',
    fontFamily: "'DM Sans', sans-serif",
    padding: '0',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 32px',
    borderBottom: '1px solid #1e1e2e',
    background: '#0f0f13',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  logo: {
    fontSize: '18px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
    color: '#fff',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #2e2e3e',
    color: '#888',
    padding: '7px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.2s',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '32px',
  },
  card: {
    background: '#16161f',
    border: '1px solid #1e1e2e',
    borderRadius: '16px',
    padding: '24px',
  },
  cardTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    background: '#0f0f13',
    border: '1px solid #1e1e2e',
    borderRadius: '10px',
    padding: '10px 14px',
    color: '#e8e6f0',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  addBtn: {
    background: '#6c63ff',
    border: 'none',
    borderRadius: '10px',
    padding: '11px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    marginTop: '4px',
    transition: 'background 0.2s',
  },
  expenseList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '320px',
    overflowY: 'auto',
  },
  expenseItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 14px',
    background: '#0f0f13',
    borderRadius: '10px',
    border: '1px solid #1e1e2e',
  },
  expenseLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  expenseTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#e8e6f0',
  },
  expenseMeta: {
    fontSize: '12px',
    color: '#555',
  },
  expenseAmount: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#6c63ff',
  },
  deleteBtn: {
    background: 'transparent',
    border: '1px solid #2e2e2e',
    color: '#555',
    padding: '5px 10px',
    borderRadius: '7px',
    cursor: 'pointer',
    fontSize: '12px',
    marginLeft: '12px',
    transition: 'all 0.2s',
  },
  chartCard: {
    background: '#16161f',
    border: '1px solid #1e1e2e',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  emptyState: {
    color: '#333',
    fontSize: '13px',
    textAlign: 'center',
    padding: '40px 0',
  }
};

function Dashboard({ setPage }) {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [salary, setSalary] = useState('');
  const [budget, setBudget] = useState(null);
  const [insights, setInsights] = useState('');
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setPage('login'); return; }
    fetchExpenses();
  }, []);

  async function fetchExpenses() {
    const token = localStorage.getItem('token');
    const res = await axios.get('https://expense-tracker-gbsp.onrender.com/expenses', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setExpenses(res.data.expenses);
  }

  async function addExpense() {
    if (!title || !amount || !category || !date) return;
    const token = localStorage.getItem('token');
    await axios.post('https://expense-tracker-gbsp.onrender.com/expenses',
      { title, amount, category, date },
      { headers: { Authorization: `Bearer ${token}` }}
    );
    setTitle(''); setAmount(''); setCategory(''); setDate(new Date().toISOString().split('T')[0]);
    fetchExpenses();
  }

  async function deleteExpense(id) {
    const token = localStorage.getItem('token');
    await axios.delete(`https://expense-tracker-gbsp.onrender.com/expenses/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchExpenses();
  }

  function getChartData() {
    const grouped = {};
    expenses.forEach(exp => {
      grouped[exp.category] = (grouped[exp.category] || 0) + parseFloat(exp.amount);
    });
    return {
      labels: Object.keys(grouped),
      datasets: [{
        data: Object.values(grouped),
        backgroundColor: ['#6c63ff','#00c49f','#ffbb28','#ff6384','#36a2eb'],
        borderWidth: 0,
      }]
    };
  }

  function logout() {
    localStorage.removeItem('token');
    setPage('login');
  }

  async function fetchBudget() {
    const token = localStorage.getItem('token');
    const res = await axios.get('https://expense-tracker-gbsp.onrender.com/budget', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.data.budget.length > 0) setBudget(res.data.budget[0]);
  }

  async function saveSalary() {
    const token = localStorage.getItem('token');
    const month = new Date().toISOString().slice(0, 7) + '-01';
    await axios.post('https://expense-tracker-gbsp.onrender.com/budget',
      { monthly_salary: salary, month },
      { headers: { Authorization: `Bearer ${token}` }}
    );
    fetchBudget();
  }

  async function getInsights() {
    setLoadingInsights(true);
    const token = localStorage.getItem('token');
    const res = await axios.post('https://expense-tracker-gbsp.onrender.com/insights',
      { expenses, budget: budget?.monthly_salary },
      { headers: { Authorization: `Bearer ${token}` }}
    );
    setInsights(res.data.insights);
    setLoadingInsights(false);
  }

  const totalSpent = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      
      <nav style={styles.navbar}>
        <span style={styles.logo}>💸 ExpenseTracker</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '13px', color: '#555' }}>
            Total: <span style={{ color: '#6c63ff', fontWeight: '700' }}>₹{totalSpent.toFixed(2)}</span>
          </span>
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </nav>

      <div style={{ background: '#16161f', border: '1px solid #1e1e2e', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {budget ? (
          <>
            <div>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '4px' }}>MONTHLY BUDGET</div>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#fff' }}>₹{parseFloat(budget.monthly_salary).toFixed(2)}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '4px' }}>REMAINING</div>
              <div style={{ fontSize: '22px', fontWeight: '700', color: totalSpent > budget.monthly_salary ? '#ff6384' : '#00c49f' }}>
                ₹{(parseFloat(budget.monthly_salary) - totalSpent).toFixed(2)}
              </div>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%' }}>
            <input
              style={{ ...styles.input, marginBottom: 0, flex: 1 }}
              placeholder="Set your monthly salary (₹)"
              value={salary}
              onChange={e => setSalary(e.target.value)}
              type="number"
            />
            <button style={{ ...styles.addBtn, width: 'auto', padding: '11px 20px', marginTop: 0 }} onClick={saveSalary}>
              Set Budget
            </button>
          </div>
        )}
      </div>

      <div style={styles.container}>
        <div style={styles.grid}>
          {/* Add Expense */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>Add Expense</div>
            <div style={styles.inputGroup}>
              <input style={styles.input} placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
              <input style={styles.input} placeholder="Amount (₹)" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
              <select value={category} onChange={e => setCategory(e.target.value)} style={{...styles.input, color: category ? '#e8e6f0' : '#555'}}>
                <option value="">Select Category</option>
                <option value="Food">🍔 Food</option>
                <option value="Transport">🚗 Transport</option>
                <option value="Shopping">🛍️ Shopping</option>
                <option value="Entertainment">🎬 Entertainment</option>
                <option value="Health">💊 Health</option>
                <option value="Education">📚 Education</option>
                <option value="Bills">💡 Bills</option>
                <option value="Other">📦 Other</option>
              </select>
              <input style={styles.input} type="date" value={date} onChange={e => setDate(e.target.value)} />
              <button style={styles.addBtn} onClick={addExpense}>+ Add Expense</button>
            </div>
          </div>

          {/* Chart */}
          <div style={styles.chartCard}>
            <div style={styles.cardTitle}>Spending by Category</div>
            {expenses.length > 0 ? (
              <div style={{ width: '220px', height: '220px' }}>
                <Pie data={getChartData()} options={{ plugins: { legend: { labels: { color: '#888', font: { size: 12 } } } } }} />
              </div>
            ) : (
              <div style={styles.emptyState}>No expenses yet</div>
            )}
          </div>
        </div>

        {/* Expense List */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>All Expenses ({expenses.length})</div>
          <div style={styles.expenseList}>
            {expenses.length === 0 && <div style={styles.emptyState}>No expenses yet. Add one above.</div>}
            {expenses.map(exp => (
              <div key={exp.id} style={styles.expenseItem}>
                <div style={styles.expenseLeft}>
                  <span style={styles.expenseTitle}>{exp.title}</span>
                  <span style={styles.expenseMeta}>{exp.category} · {exp.date?.slice(0,10)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={styles.expenseAmount}>₹{parseFloat(exp.amount).toFixed(2)}</span>
                  <button style={styles.deleteBtn} onClick={() => deleteExpense(exp.id)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div style={{ background: '#16161f', border: '1px solid #1e1e2e', borderRadius: '16px', padding: '24px', marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI Insights</div>
            <button style={{ background: '#6c63ff', border: 'none', borderRadius: '10px', padding: '8px 16px', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }} onClick={getInsights}>
              {loadingInsights ? 'Analyzing...' : '✨ Get Insights'}
            </button>
          </div>
          {insights && (
            <div style={{ fontSize: '14px', color: '#b0aec0', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
              {insights}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;