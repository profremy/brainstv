var socket = io();
$(() => {
  $('#send').click((e) => {
    e.preventDefault();
    sendMessage({ name: $('#name').val(), message: $('#message').val() });
  });

  // const discussionForm = document.getElementById('discussionForm');
  // if (discussionForm) {
  //   document.addEventListener('keyup', function (event) {
  //     if (event.keyCode === 13) {
  //       event.preventDefault();
  //       sendMessage({ name: $('#name').val(), message: $('#message').val() });
  //     }
  //   });
  // }

  getMessages();
});

socket.on('message', addMessages);

function addMessages(message) {
  $('#messages').prepend(`
  <li class="media">
     <!-- <img src="/images/blank-profile-picture.png" class="mr-3 rounded-circle" alt="Profile Avatar" style="width:30px; height:30px;"> -->
      <img src="/images/blank-profile-picture.png" class="mr-3 rounded-circle" alt="Profile Avatar" style="width:30px; height:30px;">
      <div class="media-body">
        <h5 class="mt-0 mb-1">${message.name}</h5>
        <p><small>${message.message}</small></p>
      </div>
    </li>
  `);
}

function getMessages() {
  $.get('/messages', (data) => {
    data.forEach(addMessages);
  });
}

function sendMessage(message) {
  $.post('/messages', message);
  document.getElementById('message').value = '';
}

/*
let socket = io();

// Discussion

(() => {
  // Using AXIOS TO SEND DISCUSSION DATA
  const discussionForm = document.getElementById('discussionForm');
  if (discussionForm) {
    discussionForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      document.getElementById('send').textContent = 'Sending...';
      const name = document.getElementById('name').value;
      const message = document.getElementById('message').value;
      // socket.emit('message', { name, message });

      await sendMessage({ name, message });
      document.getElementById('message').value = '';

      document.getElementById('send').textContent = 'Send';
    });
  }

  getMessages();
})();
socket.on('message', addMessages);

socket.on('connection', () => {
  console.log('Connected to server!');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server!');
});

function addMessages(message) {
  let messages = document.getElementById('messages');
  if (messages) {
    let chatMessage = `
    <li class="media">
      <img src="/images/blank-profile-picture.png" class="mr-3 rounded-circle" alt="Profile Avatar" style="width:30px; height:30px;">
      <div class="media-body">
        <h5 class="mt-0 mb-1">${message.name}</h5>
        <p><small>${message.message}</small></p>
      </div>
    </li>`;
    messages.insertAdjacentHTML('beforeend', chatMessage);
  }
}

async function getMessages() {
  console.log('Getting messages');

  const url = '/discussion/messages';
  const res = await axios
    .get(`${url}`)
    .then(function (res) {
      console.log(res);
      const currentMessages = res.data;
      currentMessages.forEach(addMessages);
    })
    .catch(function (error) {
      console.error(error);
    });
  // .then(function () {
  //   showUserAlert('success', 'A new Message Arrived');
  // });
}

// Send Message
async function sendMessage(message) {
  const url = '/discussion/messages';
  const res = await axios
    .post(`${url}`, {
      name: name,
      message: message,
    })
    .then(function (res) {
      console.log(res);
    })
    .catch(function (error) {
      console.log(error);
    });
}
*/

/*
(() => {
  let send = document.getElementById('send');
  if (send) {
    send.addEventListener('click', (e) => {
      e.preventDefault();
      let name = document.getElementById('name');
      let message = document.getElementById('message');
      let msgSlug = window.location.href.split('/')[5];
      console.log(msgSlug);
      sendMessage({
        name: name.value,
        message: message.value,
      });
    });
  }
  getMessages();
  // console.log('Getting messages');
})();

socket.on('message', addMessages);

socket.on('connection', () => {
  console.log('Connected to server!');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server!');
});

function addMessages(message) {
  // console.log('Added message');
  let messages = document.getElementById('messages');
  if (messages) {
    let chatMessage = `
    <li class="media">
      <img src="/images/blank-profile-picture.png" class="mr-3 rounded-circle" alt="Profile Avatar" style="width:30px; height:30px;">
      <div class="media-body">
        <h5 class="mt-0 mb-1">${message.name}</h5>
        <p><small>${message.message}</small></p>
      </div>
    </li>`;
    messages.insertAdjacentHTML('beforeend', chatMessage);
  }
}

function getMessages() {
  $.get('/messages', (data) => {
    data.forEach(addMessages);
    // console.log('Message displayed');
  });
}

function sendMessage(message) {
  $.post('/messages', message);
  document.getElementById('message').value = '';
  // console.log('Message sent and saved');
}
*/
