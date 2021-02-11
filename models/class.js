const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  class: {
    type: String,
    required: true,
    index: {
      unique: true,
      dropDups: true,
    },
 
});

module.exports = mongoose.model('Class', classSchema);
