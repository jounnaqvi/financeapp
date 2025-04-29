import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Please add a date'],
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;