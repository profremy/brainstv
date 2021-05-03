// review / rating / createdAt / ref to tour / ref to user
// Implement Parent Referencing with Show and Clubmember as parents
const mongoose = require('mongoose');
const Show = require('./show');
// const ClubMember = require('./clubmember');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    show: {
      type: mongoose.Schema.ObjectId,
      ref: 'Show',
      required: [true, 'Review must belong to a show.'],
    },
    clubmember: {
      type: mongoose.Schema.ObjectId,
      ref: 'Clubmember',
      required: [true, 'Review must belong to a clubmember'],
    },
  },

  // Allow virtual fields to show in the following outputs
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  // this.populate({ path: 'clubmember', select: 'firstname' }).populate({ path: 'show', select: 'showTitle' });
  this.populate({ path: 'clubmember', select: 'firstname lastname className profileImage profileImageType' });
  // this.populate({ path: 'clubmember', select: 'firstname lastname profileImage profileImageType', model: ClubMember });
  next();
});

reviewSchema.index({ show: 1, clubmember: 1 }, { unique: true });

/*
reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // });

  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});
*/
reviewSchema.statics.calcAverageRatings = async function (showId) {
  // showId is the ID of the show that is being reviewed
  // Using aggregation pipeline. this keyword points to the current Model
  // aggregation returns a promise to needs async await
  const stats = await this.aggregate([
    {
      $match: { show: showId }, // match key - value
    },
    {
      $group: {
        _id: '$show', // group _id with common field '$show'. The field show links reviews to Shows
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }, // calculate the average from the $rating field in reviews
      },
    },
  ]);
  //console.log(stats);

  if (stats.length > 0) {
    await Show.findByIdAndUpdate(showId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Show.findByIdAndUpdate(showId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// Call the calcAverageRatings in a post middleware to persist the calculation in DB
reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.show); // this.show is now the showId
});

// findByIdAndUpdate
// findByIdAndDelete
// Either way, there is access to query middleware and not document middleware
// Basically, findByIdAnd ... is the as findOneAnd but by using current document Id.

reviewSchema.pre(/^findOneAnd/, async function (next) {
  // this keyword is the current query but execution of the query gives access to the review document
  // that is being processed
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.show); // show is the Id of the show reviewed
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
