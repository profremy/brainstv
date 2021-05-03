// LOGIN BLOCK
import axios from 'axios';
import { showUserAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:5000/clubmembers/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showUserAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showUserAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:5000/clubmembers/logout',
    });
    // if ((res.data.status = 'success')) location.reload(true);
    if ((res.data.status = 'success')) location.assign('/');
  } catch (err) {
    console.log(err.response);
    showUserAlert('error', 'Error logging out! Try again.');
  }
};
