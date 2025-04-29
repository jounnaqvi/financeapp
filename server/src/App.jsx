import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TransactionProvider } from './context/TransactionContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import TransactionList from './pages/TransactionList';
import TransactionForm from './components/transactions/TransactionForm';
import NotFound from './pages/NotFound';
import './styles/App.css';

function App() {
  const [editingTransaction, setEditingTransaction] = useState(null);

  return (
    <Router>
      <ThemeProvider>
        <TransactionProvider>
          <div className="app-container">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route 
                  path="/transactions" 
                  element={
                    <TransactionList 
                      setEditingTransaction={setEditingTransaction} 
                    />
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
              {editingTransaction && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <TransactionForm 
                      transaction={editingTransaction} 
                      onClose={() => setEditingTransaction(null)} 
                    />
                  </div>
                </div>
              )}
            </main>
          </div>
        </TransactionProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;