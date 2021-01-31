console.log('Script started!');

// window.onerror = function (msg, url, lineNo, columnNo, error) {
//   var message = ['Message: ' + msg, 'URL: ' + url, 'Line: ' + lineNo, 'Column: ' + columnNo, 'Error object: ' + JSON.stringify(error)].join(' - ');

//   alert(message);
//   return false;
// };

const elements = {
  app: document.querySelector('.app'),
  popUpMessage: document.getElementById('popUpMessage'),
  popUpTextInfo: document.querySelector('.popUpTextInfo'),
  informationFlash: document.querySelector('.informationFlash h3'),
  logInLink: document.querySelector('.login'),
  logOutLink: document.querySelector('.logout'),
  pageHeader: document.querySelector('header'),
  jumbotron: document.querySelector('.jumbotron'),
  loadingSpinner: document.getElementById('loadingSpinner'),
  loaderTrigger: document.getElementById('loader'),
  app: document.getElementById('app'),
};

/*
(function () {
  'use strict';
  var submitSuccess = document.querySelector('.submit-success');
  var submitError = document.querySelector('.submit-error');

  window.addEventListener(
    'load',
    function () {
      // var submitSuccess = document.querySelector('.submit-success');
      // var submitError = document.querySelector('.submit-error');
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener(
          'submit',
          function (event) {
            // if (form.checkValidity() === true) {
            //   console.log('submitSuccess');
            //   submitSuccess.classList.add('alert');
            //   submitSuccess.classList.add('show');
            // } else {
            //   console.log('an error occurred');
            //   submitError.classList.add('alert');
            //   submitError.classList.add('show');
            //   event.preventDefault();
            //   event.stopPropagation();
            // }
            // form.classList.add('was-validated');

            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.classList.add('was-validated');
          },
          false
        );
      });
    },
    false
  );
})();
*/

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
  popUP = () => {
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
  app.addEventListener('click', (e) => {
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
  updateButtonIcon = (btnIcon) => {
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
  updateIconBtn = (btn, attr) => {
    let moreBtn = 'add-circle-outline';
    let lessBtn = 'remove-circle-outline';
    if (attr === moreBtn) {
      btn.setAttribute('name', lessBtn);
    } else {
      btn.setAttribute('name', moreBtn);
    }
  };

  const mpq = document.querySelector('.mpq');

  elements.app.addEventListener('click', (e) => {
    // console.log(e.target);
    // console.log(e.target.parentNode.parentNode.childNodes[3]);
    const targetBtn = e.target.closest('.icon__btn');
    if (targetBtn) {
      const attribute = targetBtn.getAttribute('name');
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
  greeting = (firstname) => {
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

  simulateClick = (idString) => {
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

  backToTop = () => {
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
console.log('end of script');
