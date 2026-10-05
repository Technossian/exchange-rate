import mongoose from 'mongoose';

const HistorySchema = new mongoose.Schema({
  fromCurrency: {
    type: String,
    default: 'RUB',
    required: true
  },
  toCurrency: {
    type: String,
    required: true // Например, 'USD', 'EUR'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  }
});

const History = mongoose.model('History', HistorySchema);
export default History;
