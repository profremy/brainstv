const mongoose = require('mongoose');
const path = require('path');

// const profileImageBasePath = 'uploads/profileImages';

const eclassroomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: {
      unique: true,
      dropDups: true,
    },
  },
  streamUrl: {
    type: String,
  },
  className: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'ClassName',
  },
  comments: [
    {
      text: String,
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clubmember',
      },
    },
  ],
});

module.exports = mongoose.model('Eclassroom', eclassroomSchema);
