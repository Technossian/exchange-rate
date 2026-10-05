import mongoose from 'mongoose';

const RateSchema = new mongoose.Schema({

  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  nominal: {
    type: Number,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
}, {timestamps: true});

const Rate = mongoose.model('Rate', RateSchema);

export default Rate;
