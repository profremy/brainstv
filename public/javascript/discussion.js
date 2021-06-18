var socket = io();
$(() => {
  $('#send').click((e) => {
    e.preventDefault();
    sendMessage({
      name: $('#name').val(),
      message: $('#message').val(),
    });
  });
  getMessages();
});

socket.on('message', addMessages);

function addMessages(message) {
  $('#messages').append(`
        <li class="list-group-item mb-1">
        <h6> ${message.name} </h6>
        <p>  <small>${message.message}</small> </p>
        </li>
      `);
}

function getMessages() {
  $.get('/discussion/messages', (data) => {
    data.forEach(addMessages);
  });
}

function sendMessage(message) {
  $.post('/discussion/messages', message);
}
