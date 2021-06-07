console.log('Script started!');
import '@babel/polyfill';
import { login, logout } from './login';
import { updateSettings, createUserRecord, sendPasswordResetLink, clubmemberPasswordReset } from './userAccountSettings';
import { showUserAlert } from './alerts';

// window.onerror = function (msg, url, lineNo, columnNo, error) {
//   var message = ['Message: ' + msg, 'URL: ' + url, 'Line: ' + lineNo, 'Column: ' + columnNo, 'Error object: ' + JSON.stringify(error)].join(' - ');

//   alert(message);
//   return false;
// };

// DOM ELEMENTS
const elements = {
  app: document.querySelector('.app'),
  popUpMessage: document.getElementById('popUpMessage'),
  popUpTextInfo: document.querySelector('.popUpTextInfo'),
  informationFlash: document.querySelector('.informationFlash h3'),
  logInLink: document.querySelector('.login'),
  logOutLink: document.querySelector('.logout'),
  pageHeader: document.querySelector('header'),
  userOptionsId: document.getElementById('userOptions'),
  userOptions: document.querySelector('.userOptions'),
  jumbotron: document.querySelector('.jumbotron'),
  loadingSpinner: document.getElementById('loadingSpinner'),
  loaderTrigger: document.getElementById('loader'),
  app: document.getElementById('app'),
  btnCheck: document.querySelector('.btncheck'),
  userCaretDown: document.querySelector('.userCaretDown'),
  checkBox: document.getElementById('check'),
  email: document.getElementById('email'),
  password: document.getElementById('password'),
  loginForm: document.getElementById('loginForm'),
  logOutBtn: document.querySelector('.logout'),
  userDataForm: document.querySelector('.form-user-data'),
  userPasswordForm: document.querySelector('.form-user-password'),
  joinbrainsclub: document.getElementById('joinbrainsclub'),
  registeradmin: document.getElementById('registeradmin'),
  classYear: document.getElementById('selectedClassYear'),
  homeworkForm: document.querySelector('.revealSendHomeworkForm'),
  classWork: document.querySelector('.classWork'),
  cancelOp: document.querySelector('.cancelOp'),
  // updateReviewForm: document.querySelectorAll('.update-review-form'),
  // reviewModal: document.querySelectorAll('.reviewModal'),
  // editMyReviewBtn: document.querySelector('.editMyReview'),
  // reviewInput: document.querySelector('.reviewInput'),
  // reviewRating: document.querySelector('.reviewRating'),
};

{
  // Switch E-classrooms
  if (elements.classYear) {
    elements.classYear.addEventListener('change', (event) => {
      location.assign(`/brainstv/${event.target.value}`);
    });
  }
}

{
  // USER OPTIONS
  // Execute this block only if user is logged in
  if (elements.userOptionsId) {
    elements.userOptionsId.addEventListener('click', (e) => {
      const userOptionsId = e.target.closest('#userOptions');
      if (userOptionsId) {
        elements.userOptions.classList.add('showUserOptions');
        elements.userCaretDown.classList.add('hideElement');
      }
    });

    window.addEventListener('mouseup', (e) => {
      const userOptionsId = e.target.closest('#userOptions');
      if (!userOptionsId) {
        elements.userOptions.classList.remove('showUserOptions');
        elements.userCaretDown.classList.remove('hideElement');
      }
    });
  }
}

{
  // LOGIN AND LOGOUT DELEGATION
  if (elements.email && elements.password && elements.loginForm) {
    elements.loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = elements.email.value;
      const password = elements.password.value;
      login(email, password);
    });
  }

  if (elements.logOutBtn) elements.logOutBtn.addEventListener('click', logout);
}

{
  // Using AXIOS TO SUBMIT AND UPDATE DATA
  /*
  // CHANGE USER DATA
  
  if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateSettings({ name, email }, 'data');
  });

  OR

  if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);
   
    updateSettings(form, 'data');
  });

  */

  // CHANGE USER PASSWORD
  if (elements.userPasswordForm)
    elements.userPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      document.querySelector('.btn--save-password').textContent = 'Updating...';

      const currentPassword = document.getElementById('password-current').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('password-confirm').value;
      await updateSettings({ currentPassword, password, confirmPassword }, 'password');

      document.querySelector('.btn--save-password').textContent = 'Save password';
      document.getElementById('password-current').value = '';
      document.getElementById('password').value = '';
      document.getElementById('password-confirm').value = '';
    });
}

{
  // PROCESS AND SEND PASSWORD RESET LINK
  const resetPassWord = document.querySelector('.forgottenpassword');
  if (resetPassWord) {
    resetPassWord.addEventListener('submit', async (e) => {
      e.preventDefault();
      document.querySelector('.btn--save-password').textContent = 'Sending please wait...';

      const email = document.getElementById('email').value;
      await sendPasswordResetLink({ email }, 'reset');

      document.getElementById('email').value = '';
      document.querySelector('.btn--save-password').textContent = 'Send password reset email';
    });
  }
}

{
  // IF PASSWORD RESET FORM IS OPEN WITH A RESET TOKEN, PROCESS PASSWORD RESET
  const processPasswordReset = document.getElementById('formPasswordReset');
  if (processPasswordReset) {
    processPasswordReset.addEventListener('submit', async (e) => {
      e.preventDefault();
      document.querySelector('.btn--save-password').textContent = 'Submitting please wait...';

      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      await clubmemberPasswordReset({ password, confirmPassword }, 'passwordReset');

      document.getElementById('password').value = '';
      document.getElementById('confirmPassword').value = '';
      document.querySelector('.btn--save-password').textContent = 'Submit';
    });
  }
}

{
  // Using AXIOS TO SUBMIT NEW REGISTRATION DATA
  if (elements.joinbrainsclub) {
    elements.joinbrainsclub.addEventListener('submit', async (e) => {
      e.preventDefault();
      document.querySelector('.msf-submit-cta').textContent = 'Submitting...';

      setTimeout(() => {
        document.querySelector('.msf-submit-cta').textContent = 'Submit';
      }, 3000);

      const memberCategory = document.getElementById('category').value;
      const className = document.getElementById('className').value;
      const firstname = document.getElementById('firstname').value;
      const lastname = document.getElementById('lastname').value;
      const email = document.getElementById('email').value;
      const dob = document.getElementById('dob').value;
      const phone = document.getElementById('phone').value;
      const city = document.getElementById('city').value;
      const gender = document.querySelector('.gender').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const signedConsent = document.getElementById('check').value;

      if (password != confirmPassword) {
        document.getElementById('passwordError').classList.remove('hideElement');
        return (document.getElementById('passwordError').textContent = 'Passwords do not match');
      }

      await createUserRecord({ memberCategory, className, firstname, lastname, email, dob, gender, phone, city, password, confirmPassword, signedConsent }, 'clubmember');

      document.getElementById('category').value = '';
      document.getElementById('className').value = '';
      document.getElementById('firstname').value = '';
      document.getElementById('lastname').value = '';
      document.getElementById('email').value = '';
      document.getElementById('dob').value = '';
      document.getElementById('phone').value = '';
      document.getElementById('city').value = '';
      document.querySelector('.gender').value = '';
      document.getElementById('password').value = '';
      document.getElementById('confirmPassword').value = '';
      document.getElementById('check').value = '';
    });
  }
}

{
  // Using AXIOS TO SUBMIT NEW ADMIN REGISTRATION DATA
  if (elements.registeradmin) {
    elements.registeradmin.addEventListener('submit', async (e) => {
      e.preventDefault();
      document.querySelector('.registeradmin__cta').textContent = 'Executing request...';

      setTimeout(() => {
        document.querySelector('.registeradmin__cta').textContent = 'Create';
      }, 3000);

      const firstname = document.getElementById('firstname').value;
      const lastname = document.getElementById('lastname').value;
      const email = document.getElementById('email').value;
      const role = document.getElementById('role').value;
      const dob = document.getElementById('dob').value;
      const phone = document.getElementById('phone').value;
      const city = document.getElementById('city').value;
      const gender = document.querySelector('.gender').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const signedConsent = document.getElementById('check').value;

      await createUserRecord({ firstname, lastname, email, role, dob, gender, phone, city, password, confirmPassword, signedConsent }, 'adminuser');

      document.getElementById('firstname').value = '';
      document.getElementById('lastname').value = '';
      document.getElementById('email').value = '';
      document.getElementById('role').value = '';
      document.getElementById('dob').value = '';
      document.getElementById('phone').value = '';
      document.getElementById('city').value = '';
      document.querySelector('.gender').value = '';
      document.getElementById('password').value = '';
      document.getElementById('confirmPassword').value = '';
      document.getElementById('check').value = '';
    });
  }
}

{
  // UPDATE REVIEW
  /*

  elements.editMyReviewBtn.addEventListener('click', (event) => {
    if (event) {
      let reviewID = document.querySelector('.reviewID').innerHTML;
      let showSlug = document.querySelector('.showSlug').innerHTML;
      let reviewerId = document.querySelector('.reviewerId').innerHTML;
      let currentUserId = document.querySelector('.currentUserId').innerHTML;
      let currentUserRole = document.querySelector('.currentUserRole').innerHTML;

      let dataArr = [];
      dataArr.push(reviewerId.trim(), currentUserId.trim(), currentUserRole.trim(), reviewID.trim());
      console.log(dataArr);

      reviewerId = dataArr[0];
      currentUserId = dataArr[1];
      currentUserRole = dataArr[2];
      reviewID = dataArr[3];

      console.log(`ReviewerID: ${reviewerId}, CurrentUserID: ${currentUserId}, currentUserRole: ${currentUserRole}, ReviewID: ${reviewID}`);
      console.log(reviewerId, currentUserId, currentUserRole, reviewID);
      let message = 'You do not have permission to perform this action!';
      showUserAlert('error', message);
      console.log('Done');
    }
  });
  */
}

{
  // Check if Admin attached App file for upload.
  const uploadForm = document.getElementById('uploadForm');
  const appFile = document.getElementById('appfile');
  if (uploadForm) {
    uploadForm.addEventListener('submit', (e) => {
      if (appFile.value === '' || elements.homeWorkFile.value === '') {
        let message = 'This is unusual, there is no file to Upload!';
        showUserAlert('error', message);
        e.preventDefault();
      }
    });
  }
}
{
  // Check if user attached homework file for upload.
  const homeWorkUploadForm = document.getElementById('homeWorkUploadForm');
  const homeWorkUploadFile = document.getElementById('homeWorkUploadFile');
  if (homeWorkUploadForm) {
    homeWorkUploadForm.addEventListener('submit', async (e) => {
      if (homeWorkUploadFile.value === '') {
        let message = 'This is unusual, there is no file to Upload!';
        showUserAlert('error', message);
        e.preventDefault();
      }
    });
  }
}
{
  // Check if user attached homework file for upload.
  // const contactBrainsTV = document.getElementById('contact_brainstv');
  // var subjectDetails = document.getElementById('subject_details');
  // if (contactBrainsTV) {
  //   contactBrainsTV.addEventListener('submit', async (e) => {
  //     e.preventDefault();
  //     var str = subjectDetails.value;
  //     if (new RegExp('([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?').test(str)) {
  //       let message = 'Url is not allowed details field';
  //       showUserAlert('error', message);
  //       return false;
  //     }
  //   });
  // }
}

{
  // Activity and TakePart Submission if any
  // Check if user is on activity page
  if (elements.homeworkForm) {
    elements.homeworkForm.addEventListener('click', (e) => {
      if (e) {
        elements.classWork.classList.remove('hideElement');
        elements.homeworkForm.classList.add('hideElement');
      }
    });
  }

  if (elements.cancelOp) {
    elements.cancelOp.addEventListener('click', (e) => {
      if (e) {
        elements.classWork.classList.add('hideElement');
        elements.homeworkForm.classList.remove('hideElement');
      }
    });
  }
}

{
  // Disable form submit button
  // DELEGATION
  if (elements.btnCheck && elements.checkBox) {
    window.addEventListener('load', function () {
      // Enable or Disable form submit button
      elements.btnCheck.disabled = true;
      elements.checkBox.addEventListener('change', function () {
        var checkboxCheck = this.checked;
        if (checkboxCheck) {
          elements.btnCheck.disabled = false;
          //console.log('checked');
        } else {
          elements.btnCheck.disabled = true;
          //console.log('unchecked');
        }
      });
    });
  }
}

$(function () {
  $('[data-toggle="popover"]').popover();
});

/*
// Start: sticky header functionality with window scroll event throttle
const scrollThrottle = _.throttle(() => {
  stickyHeader();
  console.log('stickyHeader');
}, 500);

const stickyHeader = () => {
  let headerPosition = 193;
  let scrollY = window.scrollY;
  if (window.scrollY > headerPosition) {
    elements.pageHeader.classList.add('sticky');
    elements.jumbotron.style.paddingTop = 450 + 'px';
  } else {
    elements.pageHeader.classList.remove('sticky');
    elements.jumbotron.style.paddingTop = 10 + 'px';
  }
};
window.addEventListener('scroll', scrollThrottle);
// End: sticky search box functionality
*/

{
  // Popup Message handler
  const popUpTimeout = [6, 12, 24];
  const popUP = () => {
    if (elements.popUpTextInfo.textContent !== '') {
      $(elements.popUpMessage).modal('show');
    }
  };

  setTimeout(() => {
    let timeDifference;
    const timeUserClosedMsg = localStorage.getItem('timeUserClosedMsg');
    if (!timeUserClosedMsg) {
      popUP();
    } else if (timeUserClosedMsg) {
      const currentTime = new Date().getTime();
      timeDifference = currentTime - timeUserClosedMsg;
      const timeout = timeDifference / 1000 / 60 / 60;
      //console.log(timeout);
      if (timeout >= popUpTimeout[2]) {
        localStorage.removeItem('timeUserClosedMsg');
        popUp();
      }
    }
  }, 5000);

  const popupMsgCloseBtnArr = document.querySelectorAll('.popupMsgClose');
  const popupMsgCloseBtn = Array.from(popupMsgCloseBtnArr);
  elements.app.addEventListener('click', (e) => {
    let closeBtn = e.target.closest('.popupMsgClose');
    if (closeBtn) {
      for (const cur of popupMsgCloseBtn) {
        const timeMsgClosed = new Date().getTime();
        localStorage.setItem('timeUserClosedMsg', timeMsgClosed);
      }
    }
  });
}

{
  // Clear Error or success alert after 4 seconds

  const removeAlert = () => {
    setTimeout(() => {
      $('.alert').alert('close'); //using bootstrap jquery alert method
    }, 4000);
  };

  window.onload = () => {
    removeAlert();
  };
}

{
  //Display more or less most popular questions
  const updateButtonIcon = (btnIcon) => {
    let moreBtn = 'add-circle';
    let lessBtn = 'remove-circle';
    let viewMoreText = document.querySelector('.viewMoreText');
    if (viewMoreText.textContent === 'View More') {
      viewMoreText.textContent = 'View Less';
      btnIcon.setAttribute('name', lessBtn);
    } else {
      viewMoreText.textContent = 'View More';
      btnIcon.setAttribute('name', moreBtn);
    }
  };

  const mpqListHidden = document.querySelectorAll('.js__hide');
  const mpqListHiddenArr = Array.from(mpqListHidden);
  const viewMoreButtonIcon = document.querySelector('.viewMore__btn__icon');
  elements.app.addEventListener('click', (e) => {
    const moreBtn = e.target.closest('.viewMore__btn__icon');
    if (moreBtn) {
      for (el of mpqListHiddenArr) {
        el.classList.toggle('js__view');
        el.classList.toggle('js__hide');
        updateButtonIcon(viewMoreButtonIcon);
      }
    }
  });
}

{
  // Display or Hide answer to a most popular question
  const updateIconBtn = (btn, attr) => {
    let moreBtn = 'fa fa-plus-circle icon__btn';
    // let moreBtn = 'add-circle-outline';
    let lessBtn = 'fa fa-minus-circle icon__btn';
    // let lessBtn = 'remove-circle-outline';
    if (attr === moreBtn) {
      btn.setAttribute('class', lessBtn);
      // btn.setAttribute('name', lessBtn);
    } else {
      btn.setAttribute('class', moreBtn);
      // btn.setAttribute('name', moreBtn);
    }
  };

  const mpq = document.querySelector('.mpq');

  elements.app.addEventListener('click', (e) => {
    // console.log(e.target);
    // console.log(e.target.parentNode.parentNode.childNodes[3]);
    const targetBtn = e.target.closest('.icon__btn');
    if (targetBtn) {
      const attribute = targetBtn.getAttribute('class');
      //console.log(attribute);
      // const attribute = targetBtn.getAttribute('name');
      const answer = targetBtn.parentNode.parentNode.childNodes[3];
      answer.classList.toggle('js__view');
      answer.classList.toggle('answer');
      updateIconBtn(targetBtn, attribute);
    }
  });
}

{
  // Show Loading Spinner when a submit button with id=loader is clicked
  // for creating or Opening Data

  const showLoadingSpinner = () => {
    elements.loadingSpinner.classList.toggle('show');
  };

  elements.app.addEventListener('click', (e) => {
    const createBtn = e.target.closest('#loader');
    if (createBtn) {
      setTimeout(() => {
        showLoadingSpinner();
      }, 1000);
      showLoadingSpinner();
    }
  });
}

{
  // Multi step form handler
  // Click simulation
  var fname = document.querySelector('.clubmember_firstname');
  const greeting = (firstname) => {
    var date = new Date();
    var hours = date.getHours();
    var message = hours < 12 ? 'Good Morning' : hours < 18 ? 'Good Afternoon' : 'Good Evening';

    if (firstname !== '') {
      fname.textContent = `${message} ${firstname},`;
    } else {
      fname.textContent = `${message},`;
    }
  };

  elements.app.addEventListener('click', (e) => {
    const targetBtn = e.target.closest('#switch-list-moreInfo');
    if (targetBtn) {
      var firstNameValue = document.getElementById('firstname').value;
      greeting(firstNameValue);
    }
  });

  const simulateClick = (idString) => {
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    const switchSection = document.getElementById(`${idString}`);
    switchSection.dispatchEvent(event);
  };

  elements.app.addEventListener('click', (e) => {
    var switchId, targetLink;
    if (e.target.hasAttribute('id')) {
      targetLink = e.target.getAttribute('id');
      // const targetLink = e.target.getAttribute('id');

      if (targetLink.hasOwnProperty('length')) {
        const extraChar = targetLink.length - 7;
        //switchId = targetLink.slice(0, `-${extraChar}`); // "switch-"
        //const remainingId = targetLink.slice(`-${extraChar}`);
        var remainingId = targetLink.slice(`-${extraChar}`);
        //console.log(remainingId);

        // console.log(remainingId);
        var remainderzero = remainingId[0];
        // console.log(remainderzero);

        if (remainingId[0] === '2') {
          //console.log(remainingId.slice(1));
          var id = remainingId.slice(1);
          var idString = id + '-list';
          //console.log(idString);
          if (idString[0] === 'l') {
            simulateClick(idString);
          }
        } else {
          var id = targetLink.slice(7);
          var idString = id + '-list';
          //console.log(idString);
          if (idString[0] === 'l') {
            simulateClick(idString);
          }
        }
      }
    }
    /*
    if (switchId === 'switch-') {
      var id = targetLink.slice(7);
      var idString = id + '-list';
      simulateClick(idString);

      // $(document).on('click', '#switch-list-moreInfo', function (event) {
      //   event.preventDefault();
      //   $('#list-moreInfo' + '-list').click();
      // });
    } else if (remainderzero === 2) {
      id = targetLink.slice(8);
      idString = id + '-list';
      simulateClick(idString);
    }
    */
  });
}

{
  // Go back to top
  const top = document.querySelector('.app');
  const backToTopBtn = document.getElementById('backToTop');
  backToTopBtn.addEventListener('click', () => {
    top.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  });

  const backToTop = () => {
    var scrollY = window.scrollY;
    var navTop = 116;
    window.scrollY > navTop ? backToTopBtn.classList.add('show') : backToTopBtn.classList.remove('show');
  };
  window.addEventListener('scroll', backToTop);
}

{
  //Using Mutation observer to watch dynamically inserted elements
  var observer = new MutationObserver(function (mutations) {
    if ($('.new').length) {
      console.log($('.new').length);
      console.log('Exist, lets do something');
      $('.new').css('color', 'red');
      observer.disconnect(); // this.disconnect
      //We can disconnect observer once the element exist if we dont want observe more changes in the DOM
    }
  });

  // Start observing
  observer.observe(document.body, {
    //document.body is node target to observe
    childList: true, //This is a must have for the observer with subtree
    subtree: true, //Set to true if changes must also be observed in descendants.
  });

  $(document).ready(function () {
    $('button').on('click', function () {
      // $('div').remove();
      setTimeout(function () {
        $('#newContent').append('<div class="new">New div element</div>');
      }, 2000);
    });
  });
}

{
  var DOMStrings = {
    appContainer: '.app',
    searchBox: '.searchBox',
    showNumber: '.showNumber',
    jsServiceNumber: '.js__serviceNumber',
    revealNumber: 'revealNumber',
    serviceNumber: 'serviceNumber',
    jsCloseGdpr: '#js__close__gdpr',
    jsGdpr: '#js__gdpr',
    gdpr: 'gdpr',
    gdprRemove: 'gdprRemove',
    siteFooter: '.siteFooter',
  };
}

{
  // Prevent display of Cookie and Privacy notice banner once user acknowledges it
  if (localStorage.gdprAccepted) {
    document.querySelector(DOMStrings.jsGdpr).classList.add('gdprRemove');
    document.getElementById('jsCover').classList.add('gdprRemove');
  }

  var gdprNotice = 'User Closed Notification';
  document.querySelector(DOMStrings.jsCloseGdpr).addEventListener('click', () => {
    // Reverse Animate GDPR
    const gdpr = document.querySelector('.gdpr');
    var position = -2;
    var callBackInterval = setInterval(animate, 10);

    function animate() {
      if (position === -235) {
        clearInterval(callBackInterval);
      } else {
        position = position - 1; //position++;
        gdpr.style.bottom = position + 'px';
      }
    }

    setTimeout(() => {
      document.querySelector(DOMStrings.jsGdpr).classList.remove('gdpr');
      document.querySelector(DOMStrings.jsGdpr).classList.add('gdprRemove');
      document.getElementById('jsCover').classList.add('gdprRemove');
      localStorage.setItem('gdprAccepted', gdprNotice);
    }, 1000);
  });

  // Animate GDPR
  const gdpr = document.querySelector('.gdpr');
  var position = -180;
  var callBackInterval = setInterval(animate, 10);

  function animate() {
    if (position === -2) {
      clearInterval(callBackInterval);
    } else {
      position = position + 1; //position++;
      gdpr.style.bottom = position + 'px';
    }
  }
}

// new birthday slider
var swiper = new Swiper('.btvbirthday-slider', {
  spaceBetween: 30,
  effect: 'fade',
  loop: true,
  mousewheel: {
    invert: false,
  },
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  // autoHeight: true,
  pagination: {
    el: '.btvbirthday-slider__pagination',
    clickable: true,
  },
});

// scheduled eclassroom thumbnail slider

console.log('end of script');
