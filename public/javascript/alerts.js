// SET ALERTS TO PROVIDE MEANINGFUL INFORMATION TO USERS
//type is 'success' or 'error'
export const hideUserAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};
export const showUserAlert = (type, msg) => {
  hideUserAlert();
  // const markup = `<div class="alert alert--${type}">${msg}</div>`;
  const markup = `<div class="alert alert--${type} alert-dismissible fade show rounded-0" role="alert">${msg}<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>`;
  document.querySelector('.clientSideAlerts').insertAdjacentHTML('afterbegin', markup);
  // document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideUserAlert, 5000);
};
