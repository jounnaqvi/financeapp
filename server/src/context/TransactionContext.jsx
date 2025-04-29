import { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:5000/api/transactions';

// Initial state
const initialState = {
  transactions: [],
  isLoading: true,
  error: null
};

// Create context
const TransactionContext = createContext(initialState);

// Reducer function
const transactionReducer = (state, action) => {
  switch (action.type) {
    case 'GET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
        isLoading: false
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions]
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction._id !== action.payload)
      };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(transaction => 
          transaction._id === action.payload._id ? action.payload : transaction
        )
      };
    case 'TRANSACTION_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: true
      };
    default:
      return state;
  }
};

// Provider component
export const TransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Get all transactions
  const getTransactions = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.get(API_URL);
      
      dispatch({
        type: 'GET_TRANSACTIONS',
        payload: res.data.data
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response?.data.error || 'Something went wrong'
      });
    }
  };

  // Add transaction
  const addTransaction = async (transaction) => {
    try {
      const res = await axios.post(API_URL, transaction);
      
      dispatch({
        type: 'ADD_TRANSACTION',
        payload: res.data.data
      });
      
      return { success: true };
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response?.data.error || 'Something went wrong'
      });
      
      return { 
        success: false, 
        error: err.response?.data.error || 'Something went wrong'
      };
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      
      dispatch({
        type: 'DELETE_TRANSACTION',
        payload: id
      });
      
      return { success: true };
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response?.data.error || 'Something went wrong'
      });
      
      return { 
        success: false, 
        error: err.response?.data.error || 'Something went wrong'
      };
    }
  };

  // Update transaction
  const updateTransaction = async (id, transaction) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, transaction);
      
      dispatch({
        type: 'UPDATE_TRANSACTION',
        payload: res.data.data
      });
      
      return { success: true };
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response?.data.error || 'Something went wrong'
      });
      
      return { 
        success: false, 
        error: err.response?.data.error || 'Something went wrong'
      };
    }
  };

  // Load transactions on mount
  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        transactions: state.transactions,
        isLoading: state.isLoading,
        error: state.error,
        getTransactions,
        addTransaction,
        deleteTransaction,
        updateTransaction
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

// Custom hook
export const useTransactions = () => useContext(TransactionContext);