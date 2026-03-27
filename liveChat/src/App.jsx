import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { TextField, Button, List, ListItem, Typography } from '@mui/material';


export default function App() {
  const [user, setUser] = useState('');
  const [client, setClient] = useState(null);
  const [content, setContent] = useState("");
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
    if(client && content.trim() && user.trim()) {
      const chatMessage = {user, content};
      client.publish({destination: '/app/chat', body: JSON.stringify(chatMessage)});
      setContent('');//clear box
    }
  };


  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Live Chat
      </Typography>
      <List>
        {messages.map((msg, index) => (
          <ListItem key={index}>
            <Typography variant="body1">
              <strong>{msg.user}:</strong> {msg.content} ({msg.timestamp})
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
        value={content}
        onChange={(e) => setContent(e.target.value)}
        margin="normal"
        />
        <Button variant="contained" color="primary" onClick={sendMessage} fullWidth>
          Send
        </Button>
    </div>
  );
};


//debug
//<strong>{msg.user}:</strong> {msg.message} ({msg.timestamp})
//<pre>{JSON.stringify(msg, null, 2)}</pre>