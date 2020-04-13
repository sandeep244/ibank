const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  type: {type: String, required: true},
  desc: {type: String, required: true},
  accountId: {type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true},
  amount: {type: Number, required: true},
  date: {type: Date, require: true}
});

module.exports = mongoose.model('Transaction', transactionSchema);
