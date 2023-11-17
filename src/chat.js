let webSocket


let userName = ''

function connectWebSocket(username) {
    // const username = document.getElementById('username-input').value;
    if (!username) {
        alert('Please enter a username.');
        return;
    }
    userName = username
    // Construct the WebSocket URL with the username as a query parameter
    const webSocketUrl = `wss://behktal0d3.execute-api.eu-west-2.amazonaws.com/dev/?username=${encodeURIComponent(username)}`;
    webSocket = new WebSocket(webSocketUrl);

    webSocket.onopen = function(event) {
        console.log('Connected to WebSocket');  
        updateConnectButtonState()
        // Additional logic upon successful connection
    };


    webSocket.onmessage = function(event) {
        console.log('Message received: ', event.data);
        const data = JSON.parse(event.data);
    
        const chatbox = document.getElementById('chatbox');
        const messageElement = document.createElement('div');
        messageElement.textContent = ` ${data.sender}: ${data.message}`;
        chatbox.appendChild(messageElement);
    };

    webSocket.onerror = function(event) {
        console.error('WebSocket error: ', event);
        // Handle WebSocket errors
    };

    webSocket.onclose = function(event) {
        console.log('WebSocket connection closed: ', event);
        updateConnectButtonState()
        // Handle WebSocket connection closure
    };
}

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;
    messageInput.value = ''; // Clear the input field

    if (!message) {
        alert("Empty message");
    }
    else if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        const data = JSON.stringify({ action: 'sendMessage', message: message , username:userName});
        webSocket.send(data);
    } else {
        console.error('WebSocket is not connected.');
        if (webSocket) {console.log(webSocket.readyState)}
        document.getElementById('connectButton').disabled = false;
        document.getElementById('connectButton').style.background = 'red';

        alert('Please connect')
    }
}

function updateConnectButtonState() {
    const connectButton = document.getElementById('connectButton');
    if (!connectButton) return
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        connectButton.disabled = true; // Disable the button if WebSocket is open
        connectButton.style.background = 'green'
    } else {
        connectButton.disabled = false; // Enable the button otherwise
        connectButton.style.background = 'red'

    }
}

window.addEventListener('beforeunload', function() {
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        webSocket.close();
    }
});

window.addEventListener('load', function() {
    updateConnectButtonState();
    // Any additional initialization logic for WebSocket connection
});


export {connectWebSocket, sendMessage, updateConnectButtonState};
