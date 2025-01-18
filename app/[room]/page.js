'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

export default function ChatPage() {
  const { room } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const userName = localStorage.getItem('username');
    if (!userName) {
      const newUserName = `User${Math.floor(Math.random() * 1000)}`;
      localStorage.setItem('username', newUserName);
      setUsername(newUserName);
    } else {
      setUsername(userName);
    }

    if (room) {
      socket.emit('joinRoom', room);
    }

    const savedMessages = localStorage.getItem(`messages-${room}`);
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Error parsing saved messages:', error);
      }
    }

    socket.on('chatMessage', (msg) => {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, msg];
        localStorage.setItem(`messages-${room}`, JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    });

    return () => {
      socket.off('chatMessage');
    };
  }, [room]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && room) {
      const userMessage = {
        text: message,
        user: username,
        timestamp: new Date().toLocaleTimeString(),
      };

      socket.emit('chatMessage', room, userMessage);
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, userMessage];
        localStorage.setItem(`messages-${room}`, JSON.stringify(updatedMessages));
        return updatedMessages;
      });
      setMessage('');
    }
  };

  return (
    <div style={{ backgroundColor: '#1f1f1f', color: 'white', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#fff' }}>Live Chat - Room: {room}</h1>
      <div
        style={{
          padding: '10px',
          maxWidth: '800px',
          margin: 'auto',
          overflowY: 'auto',
          maxHeight: '600px',
          border: '1px solid #333',
          borderRadius: '8px',
          backgroundColor: '#292929',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
        }}
      >
        {messages.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#bbb' }}>No messages yet. Be the first to send one!</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              style={{
                margin: '10px 0',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: msg.user === username ? '#007bff' : '#444',
                color: '#fff',
                alignSelf: msg.user === username ? 'flex-end' : 'flex-start',
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '60%',
                wordWrap: 'break-word',
                marginLeft: msg.user === username ? 'auto' : '0',
                marginRight: msg.user === username ? '0' : 'auto',
                textAlign: msg.user === username ? 'right' : 'left',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }}
            >
              <strong style={{ fontSize: '14px' }}>{msg.user}</strong>
              <p style={{ fontSize: '16px' }}>{msg.text}</p>
              <small style={{ fontSize: '12px', color: '#bbb' }}>{msg.timestamp}</small>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', marginTop: '10px', justifyContent: 'center' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flexGrow: 1,
            padding: '10px',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #444',
            marginRight: '10px',
            backgroundColor: '#333',
            color: '#fff',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 15px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
