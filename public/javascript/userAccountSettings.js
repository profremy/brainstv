/* eslint-disable */
import axios from 'axios';
import { showUserAlert } from './alerts';

// type is either 'password', 'regisration', 'userprofile' or 'review'
// 'http://localhost:5000/clubmembers/updateMe'
export const updateSettings = async (data, type, id) => {
  //console.log(`${data}, updateSettings called,  ${type}`);
  try {
    const url = type === 'password' ? '/clubmembers/updateMyPassword' : `/reviews/${id}`;
    // const url = type === 'password' ? 'http://localhost:5000/clubmembers/updateMyPassword' : `http://localhost:5000/reviews/${id}`;

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showUserAlert('success', `${type.toUpperCase()} updated successfully!`);
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showUserAlert('error', err.response.data.message);
  }
};

// type is either 'clubmember', or 'adminuser'
export const createUserRecord = async (data, type) => {
  try {
    const url = type === 'clubmember' ? '/clubmembers/join' : `/brainstvadmins/createNewAdminUser`;
    // const url = type === 'registration' ? 'http://localhost:5000/clubmembers/join' : `http://localhost:5000/brainstv/shows/${review.id}/reviews`;

    const res = await axios({
      method: 'POST',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showUserAlert('success', `${type.toUpperCase()} created successfully!`);
      if (type === 'clubmember') {
        window.setTimeout(() => {
          location.assign('/clubmembers/registered');
        }, 1500);
      } else {
        window.setTimeout(() => {
          location.assign('/brainstvadmins/viewAdmin');
        }, 1500);
      }
    }
  } catch (err) {
    showUserAlert('error', err.response.data.message);
  }
};

export const sendPasswordResetLink = async (data, type) => {
  try {
    const url = type === 'reset' ? '/clubmembers/forgotPassword' : '';

    const res = await axios({
      method: 'POST',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showUserAlert('success', `${type.toUpperCase()} password link sent successfully!`);
      if (type === 'reset') {
        window.setTimeout(() => {
          location.assign('/');
        }, 1500);
      } else {
        window.setTimeout(() => {
          location.assign('/');
        }, 1500);
      }
    }
  } catch (err) {
    console.log(err);
    showUserAlert('error', 'An error occurred. Email not sent!');
  }
};

export const clubmemberPasswordReset = async (data, type) => {
  try {
    const token = window.location.href.split('/')[5];
    const url = type === 'passwordReset' ? `/clubmembers/clubmemberPasswordReset/${token}` : '';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showUserAlert('success', `${type.toUpperCase()} was successfully! Please log in again.`);
      if (type === 'passwordReset') {
        window.setTimeout(() => {
          location.assign('/clubmembers/login');
        }, 1500);
      } else {
        window.setTimeout(() => {
          location.assign('/');
        }, 1500);
      }
    }
  } catch (err) {
    showUserAlert('error', 'Token is invalid or has expired');
  }
};
