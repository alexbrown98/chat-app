import React, { useState } from 'react';
import './App.css';
import { sendMessage } from './chat';
import { refreshOnlineUsersList } from './chat';

function App() {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [webSocket, setWebSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);


    const connectWebSocket = () => {
        const ws = new WebSocket(`wss://behktal0d3.execute-api.eu-west-2.amazonaws.com/dev/?username=${encodeURIComponent(username)}`);

        ws.onopen = () => setIsConnected(true);
        ws.onclose = () => setIsConnected(false);
        ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
            setIsConnected(false);
        };
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log(event)
          if (data.action === 'userConnected') {
              setOnlineUsers((prevUsers) => [...prevUsers, data.username]);
          } else if (data.action === 'userDisconnected') {
              setOnlineUsers((prevUsers) => prevUsers.filter(user => user !== data.username));
          }
          else if (data.action === 'onlineUsersList') {
            updateOnlineUsersList(data.users); // Implement this function
        }  
          else {
              addMessageToChatbox(data.sender, data.message)
          }
      };
      

        setWebSocket(ws);
    };

    const sendMessage_= () => {
        if (message && webSocket) {
            sendMessage(webSocket, message, username);
            setMessage('');
        }
    };

    const addMessageToChatbox = (sender, message) => {
        const chatbox = document.getElementById('chatbox');
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container';
        if (sender === username) {
            messageContainer.classList.add('own-message');
        }
    
        const senderElement = document.createElement('div');
        senderElement.className = 'sender-name';
        senderElement.textContent = sender;
    
        const messageElement = document.createElement('div');
        messageElement.className = 'message-bubble';
        messageElement.textContent = message;
    
        messageContainer.appendChild(senderElement);
        messageContainer.appendChild(messageElement);
        chatbox.appendChild(messageContainer);
    };
    

    const handleDisconnect = () => {
        if (webSocket) {
            webSocket.close();
        }
        setIsConnected(false);
    };

    function updateOnlineUsersList(users) {
      setOnlineUsers(users)
  } 

  function refresh() {
    if (webSocket) {
      refreshOnlineUsersList(webSocket);
    }
  }

    return (
      <div className="App">
            <div className="chat-section">
                <div className="chat-box" id='chatbox'>
                    {/* Chat messages */}
                </div>
                <div className="messageInput">
                    <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        disabled={!isConnected}
                    />
                    <button onClick={sendMessage_} disabled={!isConnected}>Send</button>
                </div>
                <div className="username-input">
                    <input 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        disabled={isConnected}
                    />
                    <button onClick={connectWebSocket} disabled={isConnected}>Connect</button>
                    <button onClick={handleDisconnect} disabled={!isConnected}>Disconnect</button>
                </div>
            </div>
            <div className="online-users">
              <button onClick={refresh}>Refresh Users</button>
                <h3>Online Users</h3>
                <ul id='online-users-list'>
                    {onlineUsers.map((user, index) => (
                        <li key={index}>{user}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
