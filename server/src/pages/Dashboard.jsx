import { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import MonthlyChart from '../components/dashboard/MonthlyChart';
import SummaryCard from '../components/dashboard/SummaryCard';
import TransactionItem from '../components/transactions/TransactionItem';
import TransactionForm from '../components/transactions/TransactionForm';
import { FiPlus } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const { transactions, deleteTransaction, isLoading } = useTransactions();
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  // Get recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5);
  
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
  };
  
  const handleDelete = async (id) => {
    await deleteTransaction(id);
  };
  
  const handleFormClose = () => {
    setShowTransactionForm(false);
    setEditingTransaction(null);
  };
  
  if (isLoading) {
    return <div className="loading">Loading dashboard data...</div>;
  }
  
  return (
    <div className="dashboard">
      <div className="dashboard-wrapper">
        <div className="dashboard-header">
          <h1>Financial Dashboard</h1>
          <button 
            className="btn-primary add-transaction-btn"
            onClick={() => setShowTransactionForm(true)}
          >
            <FiPlus /> Add Transaction
          </button>
        </div>
  
        <div className="summary-grid">
          <SummaryCard type="income" />
          <SummaryCard type="expenses" />
          <SummaryCard type="balance" />
        </div>
  
        <div className="dashboard-content">
          <div className="chart-section">
            <div className="section-header">
              <h2>Monthly Expenses</h2>
            </div>
            <div className="card">
              <MonthlyChart />
            </div>
          </div>
  
          <div className="recent-transactions-section">
            <div className="section-header">
              <h2>Recent Transactions</h2>
              {transactions.length > 5 && (
                <a href="/transactions" className="view-all-link">
                  View All
                </a>
              )}
            </div>
  
            <div className="card">
              {recentTransactions.length === 0 ? (
                <div className="empty-state">
                  <p>No transactions yet. Add one to get started!</p>
                  <button 
                    className="btn-primary"
                    onClick={() => setShowTransactionForm(true)}
                  >
                    Add Your First Transaction
                  </button>
                </div>
              ) : (
                <div className="transactions-list">
                  {recentTransactions.map(transaction => (
                    <TransactionItem
                      key={transaction._id}
                      transaction={transaction}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
  
        {showTransactionForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <TransactionForm 
                transaction={editingTransaction} 
                onClose={handleFormClose} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default Dashboard;