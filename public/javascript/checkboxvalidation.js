window.addEventListener('load', function () {
  // Enable or Disable form submit button
  var formSubmitButton = document.querySelector('.btncheck');
  var checkbox = document.getElementById('check');
  formSubmitButton.disabled = true;
  checkbox.addEventListener('change', function () {
    var checkboxCheck = this.checked;
    if (checkboxCheck) {
      formSubmitButton.disabled = false;
      //console.log('checked');
    } else {
      formSubmitButton.disabled = true;
      //console.log('unchecked');
    }
  });
});
