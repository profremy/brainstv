const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    unique: true,
  },
  answer: {
    type: String,
    required: true,
    unique: true,
  },
});

const Faq = mongoose.model('Faq', faqSchema);
module.exports = Faq;
