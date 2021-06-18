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
      enum: ['Show', 'Video', 'Games', 'Activity', 'TakePart', 'E-Class', 'News'],
    },
    takePartType: {
      type: String,
      // required: [true, 'Take part type is require'],
      enum: ['Poll', 'Cause', 'Competition', 'Discussion', 'Others', 'Puzzle', 'Colouring', 'Quiz', 'NA'],
      default: 'NA',
    },
    showId: {
      type: String,
      // required: [true, 'Show Id is required'],
      unique: true,
    },
    showThumbnail: {
      type: String,
      // required: [true, 'Resource thumbnail is required'],
    },
    downloadableDocument: {
      type: String,
    },
    // downloadableDocument: {
    //   type: [String], // Array for attaching multiple documents with multer
    // },
    introParagraph: {
      type: String,
      required: [true, 'You must add introductory paragraph required'],
    },
    bodyParagraph1: {
      type: String,
    },
    bodyParagraph2: {
      type: String,
    },
    bodyParagraph3: {
      type: String,
    },
    bodyParagraph4: {
      type: String,
    },
    bodyParagraph5: {
      type: String,
    },
    bodyParagraph6: {
      type: String,
    },
    bodyParagraph7: {
      type: String,
    },
    bodyParagraph8: {
      type: String,
    },
    bodyParagraph9: {
      type: String,
    },
    bodyParagraph10: {
      type: String,
    },
    activityList1: {
      type: String,
    },
    activityList2: {
      type: String,
    },
    activityList3: {
      type: String,
    },
    activityList4: {
      type: String,
    },
    activityList5: {
      type: String,
    },
    activityList6: {
      type: String,
    },
    activityList7: {
      type: String,
    },
    activityList8: {
      type: String,
    },
    activityList9: {
      type: String,
    },
    activityList10: {
      type: String,
    },
    activityList11: {
      type: String,
    },
    activityList12: {
      type: String,
    },
    ageGroup: {
      type: String,
    },
    footNote: {
      type: String,
    },
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

// Because of parent referencing used in for Reviews (Show/Clubmember as parents)
// Virtual Populate is required to make reviews available in the Shows
showSchema.virtual('reviews', {
  ref: 'Review', // name of model to reference
  foreignField: 'show', // this is the id in the reviewModel
  localField: '_id', // this is the id in the showModel
});

// Because of parent referencing used in for Discussion (Show/Clubmember as parents)
// Virtual Populate is required to make Discussion message available in the Shows
showSchema.virtual('discussions', {
  ref: 'Message', // name of model to reference
  foreignField: 'show', // this is the id in the discussionModel
  localField: '_id', // this is the id in the showModel
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
showSchema.pre('save', function (next) {
  this.slug = slugify(this.showTitle, { lower: true });
  next();
});
showSchema.pre('save', function (next) {
  if (this.showId === '') {
    this.showId = slugify(this.showTitle + '-' + Date.now(), { lower: true });
  } else {
    this.showId === this.showId;
  }
  next();
});

showSchema.pre(/^find/, function (next) {
  this.find().sort({ datePosted: -1 });
  this.populate({ path: 'className', select: '-__v' });
  next();
});

const Show = mongoose.model('Show', showSchema);
module.exports = Show;
