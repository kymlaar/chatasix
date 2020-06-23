const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');







var RTCPeerConnection = /*window.RTCPeerConnection ||*/ window.webkitRTCPeerConnection || window.mozRTCPeerConnection;  
if (RTCPeerConnection)(function() {  
    var rtc = new RTCPeerConnection({  
        iceServers: []  
    });  
    if (1 || window.mozRTCPeerConnection) {  
        rtc.createDataChannel('', {  
            reliable: false  
        });  
    };  
    rtc.onicecandidate = function(evt) {  
        if (evt.candidate) grepSDP("a=" + evt.candidate.candidate);  
    };  
    rtc.createOffer(function(offerDesc) {  
        grepSDP(offerDesc.sdp);  
        rtc.setLocalDescription(offerDesc);  
    }, function(e) {  
        console.warn("offer failed", e);  
    });  
    var addrs = Object.create(null);  
    addrs["0.0.0.0"] = false;  
  
    function updateDisplay(newAddr) {  
        if (newAddr in addrs) return;  
        else addrs[newAddr] = true;  
        var displayAddrs = Object.keys(addrs).filter(function(k) {  
            return addrs[k];  
        });  
        document.getElementById('list').textContent = displayAddrs.join(" or perhaps ") || "n/a";  
    }  
  
    function grepSDP(sdp) {  
        var hosts = [];  
        sdp.split('\r\n').forEach(function(line) {  
            if (~line.indexOf("a=candidate")) {  
                var parts = line.split(' '),  
                    addr = parts[4],  
                    type = parts[7];  
                if (type === 'host') updateDisplay(addr);  
            } else if (~line.indexOf("c=")) {  
                var parts = line.split(' '),  
                    addr = parts[2];  
                updateDisplay(addr);  
            }  
        });  
    }  
})();  
else {  
    document.getElementById('list').innerHTML = "<code>ifconfig| grep inet | grep -v inet6 | cut -d\" \" -f2 | tail -n1</code>";  
    document.getElementById('list').nextSibling.textContent = "In Chrome and Firefox your IP should display automatically, by the power of WebRTCskull.";  
}













// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;
  
  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span>  <span>${message.bondia}</span></p>
  <p class="text">
    ${message.text} 
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}







