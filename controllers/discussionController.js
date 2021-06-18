/*
const Message = require('../models/discussionModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllMessages = catchAsync(async (req, res, next) => {
  const discussions = await Message.find({}, (err, messages) => {
    //console.log('From getAllMessages', +' ' + messages);
    res.send(messages);

    // res.status(200).json({
    //   status: 'success',
    //   results: discussions.length,
    //   data: {
    //     discussions
    //   }
    // });
  });
  //.sort({ createdAt: -1 });
});

exports.createMessage = catchAsync(async (req, res, next) => {
  //console.log(req.body);
  const noURLName = req.body.name;
  const noURLMessage = req.body.message;
  if (new RegExp('([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?').test(noURLName) || new RegExp('([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?').test(noURLMessage)) {
    return res.render('brainstv/shows', {
      pageTitle: 'All Shows',
      errorMessage: 'URL is not accepted on this discussion!',
    });
  }

  try {
    let message = new Message({
      name: req.body.name,
      message: req.body.message,
    });

    await message.save((err) => {
      if (err) sendStatus(500);
      console.log(req.body);
      // io.emit('message', req.body);
      res.sendStatus(200);
    });
  } catch (error) {
    res.sendStatus(500);
    return console.log('error', error);
  }
});

// exports.getAllReviews = catchAsync(async (req, res, next) => {
//   // Get only the reviews where the show matches the ID
//   let filter;
//   if (req.params.showId) filter = { show: req.params.showId };
//   // The above filter is for Nested review Get Endpoint
//   const reviews = await Review.find(filter);

//   res.status(200).json({
//     status: 'success',
//     results: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

*/

/*
exports.getAllReviews = factory.getAll(Review);

// This function is called in the POST review route
exports.setShowAndUserIds = async (req, res, next) => {
  // Allow nested routes
  //showId is the name in route parameter (show nested route in brainstv route)
  if (!req.body.show) req.body.show = req.params.showId;
  if (!req.body.clubmember) req.body.clubmember = req.clubmember.id;
  next();
};

// exports.createReview = factory.createOne(Review);
exports.createReview = async (req, res, next) => {
  let review;

  try {
    review = await Review.create(req.body);
    res.redirect('/brainstv/shows');
  } catch (err) {
    return next(new AppError('You have an existing review on this show. You may edit it!', 404));
    //res.redirect('/brainstv/shows');
  }

  // res.status(201).json({
  //   status: 'success',
  //   data: {
  //     data: doc,
  //   },
  // });
};

// Delete to be executed from handlerFactory deleteOne function
// handlerFactory is imported above as factory with require

exports.getReview = factory.getOne(Review);

// exports.updateReview = factory.updateOne(Review);

exports.updateReview = catchAsync(async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
  } catch (err) {
    console.log(err);
  }
});

exports.editUserReview = catchAsync(async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    res.status(200).render('reviews/edit', { pageTitle: 'Edit Review', review: review });
  } catch (error) {
    res.redirect('/brainstv/shows');
  }
});

exports.updateUserReview = catchAsync(async (req, res, next) => {
  let review;
  try {
    review = await Review.findById(req.params.id);
    let user = req.clubmember.id;
    let reviewer = review.clubmember.id;

    if (user != reviewer && req.clubmember.role != 'superAdmin') {
      return res.status(200).render('reviews/edit', { pageTitle: 'Edit Review', review: review, errorMessage: 'You did not write this review. Please edit your own review!' });
    } else {
      review.review = req.body.review;
      review.rating = req.body.rating;
      await review.save();
      //res.status(200).render('brainstv/shows', { pageTitle: 'All Shows', review: review, successMessage: 'Review updated successfully!' });
      res.redirect('/brainstv/shows');
    }
  } catch (error) {
    res.redirect('/brainstv/shows');
  }
});

// exports.deleteReview = factory.deleteOne(Review);
exports.deleteReview = catchAsync(async (req, res, next) => {
  let review;
  review = await Review.findById(req.params.id);
  let user = req.clubmember.id;
  let reviewer = review.clubmember.id;

  if (user != reviewer && req.clubmember.role != 'superAdmin') {
    return next(new AppError('You did not write this review. You are not permited to delete it!', 404));
  } else {
    await review.remove();
    res.redirect('/brainstv/shows');
  }
});

*/
