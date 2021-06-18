// review / rating / createdAt / ref to tour / ref to user
// Implement Parent Referencing with Show and Clubmember as parents
const mongoose = require('mongoose');

const schoolDaySchema = new mongoose.Schema(
  {
    partOfSchoolDay: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Schoolday = mongoose.model('Schoolday', schoolDaySchema);

module.exports = Schoolday;
