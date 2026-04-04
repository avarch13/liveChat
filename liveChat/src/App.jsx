import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import Avatar from '@mui/material/Avatar';
//import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import { Client } from '@stomp/stompjs';
import { TextField, Button, List, ListItem, Typography, ListItemAvatar } from '@mui/material';


export default function App() {
  const [username, setUsername] = useState('');
  const [client, setClient] = useState(null);
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {

    const fetchLast10Messages = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/messages/last10');
        //console.log(await response.text());
        const data = await response.json();
        setMessages(data);
        console.log("Fetched last 10 messages:", data); // Remove or guard with a debug flag in production
      } catch (error) {
        console.log(error);
      }
    };

    fetchLast10Messages();

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

  // const fetchLast10Messages = async () => {
  //   try {
  //     const response = await fetch('http://localhost:8080/api/messages/last10');
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  //     const data = await response.json();
  //     setMessages(data.reverse()); //Reverse to show oldest first
  //   } catch (error) {
  //     console.error('Error fetching messages:', error);
  //   };

  const sendMessage = () => {
    if(client && content.trim() && username.trim()) {
      const chatMessage = {username, content};
      client.publish({destination: '/app/chat', body: JSON.stringify(chatMessage)});
      //saveMessage(chatMessage); //Save to DB
      setContent('');//clear box
    }
  };

  const saveMessage = async (message) => { //didn't work || so I don't need to do this anyway since controller in spring is saving to db
    const response = await fetch('http://localhost:8080/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    if (!response.ok) {
      console.error('Failed to save message:', response.statusText);
    }
    return response.json();
  };

  

  const style = {
  py: 0,
  width: '100%',
  maxWidth: 360,
  maxHeight: '60vh',
  overflow: 'auto',
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  backgroundColor: 'background.paper',
  };

  

  function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
  }

function stringAvatar(name) {
  if (!name || typeof name !== "string") {
    return { children: "?" };
  }

  const parts = name.split(" ");

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`
      : `${parts[0][0]}`,
  };
  }




  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      
      <List sx={style}>
        {messages.map((msg, index) => (
          
          <ListItem key={index}>
           
            <ListItemAvatar>
              <Avatar>
                <Avatar {...stringAvatar(msg.username)} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={msg.username} secondary={msg.content} />
            {/* <Typography variant="body1">
              <strong>{msg.username}:</strong> {msg.content} ({msg.timestamp})
            </Typography> */}
        
          </ListItem>
          

        ))}
      </List>
      <TextField
        label="Username"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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
