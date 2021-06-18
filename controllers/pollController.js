const catchAsync = require('./../utils/catchAsync');

const mongoose = require('mongoose');
const Schoolday = require('../models/schoolDayModel');
const MostAdmired = require('../models/mumAndDadModel');

const Pusher = require('pusher');

const pusher = new Pusher({
  appId: '1206574',
  key: 'a22577bf8709837c8fb4',
  secret: '05c22e82f7a31531ee55',
  cluster: 'eu',
  useTLS: true,
});

exports.getSchoolDayPoll = catchAsync(async (req, res, next) => {
  Schoolday.find().then((schoolday) =>
    res.json({
      success: true,
      schoolday: schoolday,
    })
  );
});

exports.getMostAdmiredPoll = catchAsync(async (req, res, next) => {
  MostAdmired.find().then((mostAdmired) =>
    res.json({
      success: true,
      mostAdmired: mostAdmired,
    })
  );
});

exports.postSchoolDayPoll = catchAsync(async (req, res, next) => {
  const newSchoolday = {
    partOfSchoolDay: req.body.partOfSchoolDay,
    points: 1,
  };

  new Schoolday(newSchoolday).save().then((schoolday) => {
    //  pusher.trigger 'my-channel', 'my-event'
    pusher.trigger('schoolDay-Poll', 'schoolDay-Vote', {
      partOfSchoolDay: schoolday.partOfSchoolDay,
      points: schoolday.points,
    });
  });

  return; //res.json({ success: true, message: 'Thank you for voting' });
});

exports.postMumAndDadPoll = catchAsync(async (req, res, next) => {
  const newMumAndDad = {
    points: 1,
    mostAdmired: req.body.mostAdmired,
  };

  new MostAdmired(newMumAndDad).save().then((mostAdmired) => {
    //  pusher.trigger 'my-channel', 'my-event'
    pusher.trigger('mostAdmired-Poll', 'mostAdmired-Vote', {
      mostAdmired: mostAdmired.mostAdmired,
      points: mostAdmired.points,
    });
  });

  return; //res.json({ success: true, message: 'Thank you for voting' });
});
