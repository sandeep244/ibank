const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const accountSchema = mongoose.Schema({
  type: {type: String, required: true},
  accountNumber: {type: String, required: true, unique: true},
  amount: {type: Number, required: true},
  creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

accountSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Account', accountSchema);
