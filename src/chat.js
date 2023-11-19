let webSocket

function sendMessage(webSocket, message, username) {
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        const data = JSON.stringify({ action: 'sendMessage', message, username });
        webSocket.send(data);
    } else {
        console.error('WebSocket is not connected.');
    }
}

function refreshOnlineUsersList(webSocket) {
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        webSocket.send(JSON.stringify({ action: 'getOnlineUsers' }));
    }
}



export {sendMessage, refreshOnlineUsersList};
