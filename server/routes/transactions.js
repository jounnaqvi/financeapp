import express from 'express';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// @route   GET /api/transactions
// @desc    Get all transactions
// @access  Public
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @route   POST /api/transactions
// @desc    Add a transaction
// @access  Public
router.post('/', async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);
    
    return res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
});

// @route   GET /api/transactions/:id
// @desc    Get single transaction
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @route   PUT /api/transactions/:id
// @desc    Update transaction
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @route   DELETE /api/transactions/:id
// @desc    Delete transaction
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @route   GET /api/transactions/chart/monthly
// @desc    Get monthly expense data for chart
// @access  Public
router.get('/chart/monthly', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    
    // Process transactions for monthly chart
    const monthlyData = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      const key = `${month} ${year}`;
      
      if (!acc[key]) {
        acc[key] = 0;
      }
      
      // Only add expenses (negative amounts)
      if (transaction.amount < 0) {
        acc[key] += Math.abs(transaction.amount);
      }
      
      return acc;
    }, {});
    
    const labels = Object.keys(monthlyData);
    const data = Object.values(monthlyData);
    
    return res.status(200).json({
      success: true,
      data: {
        labels,
        datasets: [{
          label: 'Monthly Expenses',
          data
        }]
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

export default router;