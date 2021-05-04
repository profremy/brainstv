const mongoose = require('mongoose');
const slugify = require('slugify');

const tvScheduleSchema = new mongoose.Schema(
  {
    showingDate: { type: Date, required: true },
    // hourSchedule: {
    //   type: Number,
    //   required: true,
    // },
    // airTime: { type: Date },
    showingTime: { type: String, required: true },
    showingStatus: { type: String, required: true },
    showingName: {
      type: String,
      required: true,
      index: {
        unique: true,
        dropDups: true,
      },
    },
    slug: String,
    showPageLink: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
// tvScheduleSchema.pre('save', function (next) {
//   this.startDateTime = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
//   this.airTime = this.startDateTime.setHours(this.startDateTime.getHours() + this.hourSchedule);
//   next();
// });

tvScheduleSchema.pre('save', function (next) {
  this.slug = slugify(this.showingName, { lower: true });
  next();
});

// tvScheduleSchema.virtual('msToTime').get(function () {
//   let ms = this.airTime;
//   let seconds = (ms / 1000).toFixed(1);
//   let minutes = (ms / (1000 * 60)).toFixed(1);
//   let hours = (ms / (1000 * 60 * 60)).toFixed(1);
//   let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
//   if (seconds < 60) return seconds + ' Sec';
//   else if (minutes < 60) return minutes + ' Min';
//   else if (hours < 24) return hours + ' Hrs';
//   else return days + ' Days';
// });

module.exports = mongoose.model('Tvschedule', tvScheduleSchema);
