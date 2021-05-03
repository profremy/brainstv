const mongoose = require('mongoose');
const slugify = require('slugify');

const showSchema = new mongoose.Schema(
  {
    showTitle: {
      type: String,
      required: [true, 'Show title is required'],
      unique: true,
    },
    showType: {
      type: String,
      required: [true, 'Show type is require'],
      enum: ['Video', 'Games', 'Activity', 'Take Part', 'E-Classroom'],
    },
    showId: {
      type: String,
      required: [true, 'Show Id is required'],
      unique: true,
    },
    // showThumbnail: {
    //   type: String,
    // },
    datePosted: {
      type: Date,
      default: Date.now,
    },
    className: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: 'ClassName',
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be 1.0 or above'],
      max: [5, 'Rating must be 5.0 or less'],
      set: (val) => Math.round(val * 10) / 10, //e.g 4.66666 , 47 , 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    slug: String,
  },
  // Allow virtual fields to show in the following outputs
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// showSchema.index({ showType: 1 }); // single index
showSchema.index({ showType: 1, showTitle: -1 }); // compound index
showSchema.index({ slug: 1 }); // single index

showSchema.virtual('showStatus').get(function () {
  let day = 1000 * 60 * 60 * 24;
  let timeStamp;
  if (this.datePosted) {
    timeStamp = parseInt(this.datePosted.getTime());
  }
  const currentTime = Date.now();
  const diff = Math.round((currentTime - timeStamp) / day);
  //console.log(diff);
  if (diff <= 7) {
    return 'NEW ⭐';
  } else {
    return `${diff} days ago`;
  }
});

// Because of parent referencing used in for Reviews (Show/Clubmember)
// Virtual Populate is required to get make reviews available in the Shows
showSchema.virtual('reviews', {
  ref: 'Review', // name of model to reference
  foreignField: 'show', // this is the id in the reviewModel
  localField: '_id', // this is the id in the showModel
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
showSchema.pre('save', function (next) {
  this.slug = slugify(this.showTitle, { lower: true });
  next();
});

showSchema.pre(/^find/, function (next) {
  this.find().sort({ datePosted: -1 });
  this.populate({ path: 'className', select: '-__v' });
  next();
});

const Show = mongoose.model('Show', showSchema);
module.exports = Show;
