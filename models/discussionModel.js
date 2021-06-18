// Discussion/Messaging -  ref to Show / ref to Clubmember
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    show: {
      type: mongoose.Schema.ObjectId,
      ref: 'Show',
      // required: true,
    },
    clubmember: {
      type: mongoose.Schema.ObjectId,
      ref: 'Clubmember',
      // required: true,
    },
  },
  { timestamps: true },
  // Allow virtual fields to show in the following outputs
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

messageSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'clubmember',
    select: 'firstname lastname  profileImage profileImageType',
  });
  // this.populate({
  //   path: 'show',
  //   select: 'showTitle',
  // }).populate({
  //   path: 'clubmember',
  //   select: 'firstname lastname  profileImage profileImageType',
  // });

  next();
});
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
