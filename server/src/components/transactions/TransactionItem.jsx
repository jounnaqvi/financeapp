import { format } from 'date-fns';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import './TransactionItem.css';

const TransactionItem = ({ transaction, onEdit, onDelete }) => {
  const { _id, amount, description, date } = transaction;
  
  // Format date
  const formattedDate = format(new Date(date), 'MMM dd, yyyy');
  
  // Determine if this is income or expense
  const isExpense = amount < 0;
  const amountClass = isExpense ? 'expense' : 'income';
  
  // Format amount
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(Math.abs(amount));
  
  const handleEdit = () => {
    onEdit(transaction);
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      onDelete(_id);
    }
  };
  
  return (
    <div className="transaction-item fade-in">
      <div className="transaction-info">
        <div className="transaction-date">{formattedDate}</div>
        <div className="transaction-description">{description}</div>
      </div>
      
      <div className="transaction-amount-container">
        <div className={`transaction-amount ${amountClass}`}>
          {isExpense ? '-' : '+'}{formattedAmount}
        </div>
        
        <div className="transaction-actions">
          <button className="action-button edit" onClick={handleEdit}>
            <FiEdit2 />
          </button>
          <button className="action-button delete" onClick={handleDelete}>
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;