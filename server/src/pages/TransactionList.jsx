import { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import TransactionItem from '../components/transactions/TransactionItem';
import TransactionForm from '../components/transactions/TransactionForm';
import { FiPlus, FiSearch } from 'react-icons/fi';
import './TransactionList.css';

const TransactionList = () => {
  const { transactions, deleteTransaction, isLoading } = useTransactions();
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction => 
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
    return <div className="loading">Loading transactions...</div>;
  }
  
  return (
    <div className="transaction-list-page">
      <div className="page-header">
        <h1>Transactions</h1>
        <button 
          className="btn-primary add-transaction-btn"
          onClick={() => setShowTransactionForm(true)}
        >
          <FiPlus /> Add Transaction
        </button>
      </div>
      
      <div className="transaction-controls">
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="card transactions-container">
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            {searchTerm ? (
              <p>No transactions found matching "{searchTerm}"</p>
            ) : (
              <>
                <p>No transactions yet. Add one to get started!</p>
                <button 
                  className="btn-primary"
                  onClick={() => setShowTransactionForm(true)}
                >
                  Add Your First Transaction
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="transactions-list">
            {filteredTransactions.map(transaction => (
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
  );
};

export default TransactionList;