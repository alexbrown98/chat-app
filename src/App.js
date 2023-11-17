import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';
import { connectWebSocket, sendMessage, updateConnectButtonState } from './chat';
function App() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  updateConnectButtonState();

  return (
    <div className="App">
    <div className="chat-box" id='chatbox'>
    </div>
    <div className="messageInput">
      <textarea 
        value={message}
        id={'message-input'}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
    <div className="username-input">
      <input 
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
      />
      <button id= 'connectButton'onClick={() => connectWebSocket(username)}>Connect</button>

    </div>
  </div>
  );
}

export default App;
