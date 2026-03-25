import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { TextField, Button, List, ListItem, Typography } from '@mui/material';


export default function App() {
  const [user, setUser] = useState('');
  const [client, setClient] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws'); //Connect
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe('/topic/messages', (message) => {
          try {
          setMessages((prevMessages) => [...prevMessages, JSON.parse(message.body)]);
          } catch (e) {
            console.error("Error parsing message:", message.body);
          }
        });
      },
    });

    stompClient.activate(); //Activate
    setClient(stompClient);

    return () => {
      stompClient.deactivate(); //Cleanup
    }
  }, []);

  const sendMessage = () => {
    if(client && message.trim() && user.trim()) {
      const chatMessage = {user, message};
      client.publish({destination: '/app/chat', body: JSON.stringify(chatMessage)});
      setMessage('');//clear box
    }
  };


  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            <strong>{msg.user}:</strong> {msg.message}
          </li>
        ))}
      </ul>

      <input value={user} onChange={(e) => setUser(e.target.value)} />
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { TextField, Button, List, ListItem, Typography } from '@mui/material';


export default function App() {
  const [user, setUser] = useState('');
  const [client, setClient] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws'); //Connect
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe('/topic/messages', (message) => {
          try {
          setMessages((prevMessages) => [...prevMessages, JSON.parse(message.body)]);
          } catch (e) {
            console.error("Error parsing message:", message.body);
          }
        });
      },
    });

    stompClient.activate(); //Activate
    setClient(stompClient);

    return () => {
      stompClient.deactivate(); //Cleanup
    }
  }, []);

  const sendMessage = () => {
    if(client && message.trim() && user.trim()) {
      const chatMessage = {user, message};
      client.publish({destination: '/app/chat', body: JSON.stringify(chatMessage)});
      setMessage('');//clear box
    }
  };


  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Live Chat
      </Typography>
      <List>
        {messages.map((message, index) => (
          <ListItem key={index}>
            <Typography variant="body1">
              <strong>{message.user}:</strong> {message.message} ({message.timestamp})
            </Typography>
          </ListItem>
        ))}
      </List>
      <TextField
        label="Username"
        fullWidth
        value={user}
        onChange={(e) => setUser(e.target.value)}
        margin="normal"
        />
        <TextField
        label="Message"
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        margin="normal"
        />
        <Button variant="contained" color="primary" onClick={sendMessage} fullWidth>
          Send
        </Button>
    </div>
  );
};

