import { useState, useEffect } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { FiX } from 'react-icons/fi';
import './TransactionForm.css';

const TransactionForm = ({ transaction = null, onClose }) => {
  const { addTransaction, updateTransaction } = useTransactions();
  
  // Form state
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().substr(0, 10)
  });
  
  // Error state
  const [errors, setErrors] = useState({});
  
  // Is this an edit operation?
  const isEditing = transaction !== null;
  
  // If transaction is provided, populate form
  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount,
        description: transaction.description,
        date: new Date(transaction.date).toISOString().substr(0, 10)
      });
    }
  }, [transaction]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount)) {
      newErrors.amount = 'Amount must be a number';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };
    
    let result;
    
    if (isEditing) {
      result = await updateTransaction(transaction._id, transactionData);
    } else {
      result = await addTransaction(transactionData);
    }
    
    if (result.success) {
      onClose();
    } else {
      // Show API error
      setErrors({
        api: Array.isArray(result.error) ? result.error[0] : result.error
      });
    }
  };
  
  return (
    <div className="transaction-form-container">
      <div className="form-header">
        <h2>{isEditing ? 'Edit Transaction' : 'Add Transaction'}</h2>
        <button className="close-button" onClick={onClose}>
          <FiX />
        </button>
      </div>
      
      {errors.api && (
        <div className="error-alert">{errors.api}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">
            Amount (use negative for expenses)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount (e.g. -50 for expense, 100 for income)"
            step="0.01"
          />
          {errors.amount && <p className="error-message">{errors.amount}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What was this transaction for?"
          />
          {errors.description && <p className="error-message">{errors.description}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
          {errors.date && <p className="error-message">{errors.date}</p>}
        </div>
        
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {isEditing ? 'Update' : 'Add'} Transaction
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;