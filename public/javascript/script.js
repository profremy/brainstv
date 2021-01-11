console.log('Script started!');
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
      console.log(timeout);
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
      console.log('createBtn clicked');
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

  document.getElementById('switch-list-moreInfo').addEventListener('click', () => {
    var firstNameValue = document.getElementById('firstname').value;
    greeting(firstNameValue);
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
        switchId = targetLink.slice(0, `-${extraChar}`); // "switch-"
        // const switchId = targetLink.slice(0, `-${extraChar}`); // "switch-"
        const remainingId = targetLink.slice(`-${extraChar}`);
        //console.log(remainingId);
      }
    }

    if (switchId === 'switch-') {
      const id = targetLink.slice(7);
      const idString = id + '-list';
      simulateClick(idString);

      // $(document).on('click', '#switch-list-moreInfo', function (event) {
      //   event.preventDefault();
      //   $('#list-moreInfo' + '-list').click();
      // });
    }
  });
}
console.log('end of script');
