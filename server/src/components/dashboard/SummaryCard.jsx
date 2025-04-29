import { useTransactions } from '../../context/TransactionContext';
import './SummaryCard.css';

const SummaryCard = ({ type }) => {
  const { transactions } = useTransactions();
  
  // Calculate metrics
  const calculateMetrics = () => {
    if (!transactions.length) {
      return {
        title: 'No data',
        value: '$0.00',
        icon: '💰',
        color: 'neutral'
      };
    }
    
    let metrics = {
      title: '',
      value: 0,
      icon: '',
      color: ''
    };
    
    switch (type) {
      case 'income':
        metrics.title = 'Total Income';
        metrics.value = transactions
          .filter(t => t.amount > 0)
          .reduce((sum, t) => sum + t.amount, 0);
        metrics.icon = '💸';
        metrics.color = 'income';
        break;
      
      case 'expenses':
        metrics.title = 'Total Expenses';
        metrics.value = transactions
          .filter(t => t.amount < 0)
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        metrics.icon = '💳';
        metrics.color = 'expense';
        break;
      
      case 'balance':
        metrics.title = 'Current Balance';
        metrics.value = transactions.reduce((sum, t) => sum + t.amount, 0);
        metrics.icon = '⚖️';
        metrics.color = metrics.value >= 0 ? 'income' : 'expense';
        break;
      
      default:
        metrics.title = 'Unknown';
        metrics.value = 0;
        metrics.icon = '❓';
        metrics.color = 'neutral';
    }
    
    return {
      ...metrics,
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(metrics.value)
    };
  };
  
  const { title, value, icon, color } = calculateMetrics();
  
  return (
    <div className={`summary-card ${color}`}>
      <div className="summary-icon">{icon}</div>
      <div className="summary-content">
        <h3 className="summary-title">{title}</h3>
        <p className="summary-value">{value}</p>
      </div>
    </div>
  );
};

export default SummaryCard;