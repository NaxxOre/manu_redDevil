'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import io from 'socket.io-client';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const socket = io('https://manu-reddevil-2.onrender.com');

export default function ChatPage() {
  const { room } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const messagesEndRef = useRef(null);
  const videoRef = useRef(null);
  const [videoPlayer, setVideoPlayer] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(
    'https://pull.niues.live/live/stream-9912050_lhd.m3u8?auth_key=1738271675-0-0-05a80b3dd2464f3ede9acb0b0355819e";             var stream_link = "https://pull.niues.live/live/stream-9912050_lsd.m3u8?auth_key=1738271675-0-0-e0a8064ab4e84c42fa6508df5bc897b0' // Default to Link 1
  );

  const videoLinks = [
    { id: 1, url: 'https://pull.niues.live/live/stream-9912050_lhd.m3u8?auth_key=1738271675-0-0-05a80b3dd2464f3ede9acb0b0355819e";             var stream_link = "https://pull.niues.live/live/stream-9912050_lsd.m3u8?auth_key=1738271675-0-0-e0a8064ab4e84c42fa6508df5bc897b0', label: 'Link 1' },
    { id: 2, url: 'https://m3u-playlist-proxy-2.vercel.app?url=https%3A%2F%2Fxyzdddd.mizhls.ru%2Flb%2Fpremium474%2Findex.m3u8&data=UmVmZXJlcj1odHRwczovL2Nvb2tpZXdlYnBsYXkueHl6L3xPcmlnaW49aHR0cHM6Ly9jb29raWV3ZWJwbGF5Lnh5enxVc2VyLUFnZW50PU1vemlsbGEvNS4wIChYMTE7IExpbnV4IHg4Nl82NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyOS4wLjAuMCBTYWZhcmkvNTM3LjM2', label: 'Link 2' },
    { id: 3, url: 'https://m3u-playlist-proxy-2.vercel.app?url=https%3A%2F%2Fxyzdddd.mizhls.ru%2Flb%2Fpremium400%2Findex.m3u8&data=UmVmZXJlcj1odHRwczovL2Nvb2tpZXdlYnBsYXkueHl6L3xPcmlnaW49aHR0cHM6Ly9jb29raWV3ZWJwbGF5Lnh5enxVc2VyLUFnZW50PU1vemlsbGEvNS4wIChYMTE7IExpbnV4IHg4Nl82NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyOS4wLjAuMCBTYWZhcmkvNTM3LjM2', label: 'Link 3' },
    { id: 4, url: 'https://m3u-playlist-proxy-2.vercel.app?url=https%3A%2F%2Fxyzdddd.mizhls.ru%2Flb%2Fpremium622%2Findex.m3u8&data=UmVmZXJlcj1odHRwczovL2Nvb2tpZXdlYnBsYXkueHl6L3xPcmlnaW49aHR0cHM6Ly9jb29raWV3ZWJwbGF5Lnh5enxVc2VyLUFnZW50PU1vemlsbGEvNS4wIChYMTE7IExpbnV4IHg4Nl82NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyOS4wLjAuMCBTYWZhcmkvNTM3LjM2', label: 'Link 4' },
    { id: 5, url: 'https://m3u-playlist-proxy-2.vercel.app?url=https%3A%2F%2Fxyzdddd.mizhls.ru%2Flb%2Fpremium122%2Findex.m3u8&data=UmVmZXJlcj1odHRwczovL2Nvb2tpZXdlYnBsYXkueHl6L3xPcmlnaW49aHR0cHM6Ly9jb29raWV3ZWJwbGF5Lnh5enxVc2VyLUFnZW50PU1vemlsbGEvNS4wIChYMTE7IExpbnV4IHg4Nl82NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyOS4wLjAuMCBTYWZhcmkvNTM3LjM2', label: 'Link 5' },
  ];

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

    socket.on('previousMessages', (previousMessages) => {
      setMessages(previousMessages);
    });

    socket.on('chatMessage', (msg) => {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, msg];
        localStorage.setItem(`messages-${room}`, JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    });

    const savedMessages = localStorage.getItem(`messages-${room}`);
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Error parsing saved messages:', error);
      }
    }

    return () => {
      socket.off('chatMessage');
      socket.off('previousMessages');
    };
  }, [room]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (videoRef.current) {
      if (videoPlayer) {
        videoPlayer.src({ src: currentVideo, type: 'application/x-mpegURL' });
      } else {
        const player = videojs(videoRef.current, {
          controls: true,
          autoplay: true, // Ensure autoplay is enabled
          responsive: true,
          fluid: true, // Ensures correct resizing
        });
        setVideoPlayer(player);
      }
    }
  }, [currentVideo]);

  useEffect(() => {
    // Ensures autoplay works on page load with default video URL
    if (videoPlayer && currentVideo) {
      videoPlayer.src({ src: currentVideo, type: 'application/x-mpegURL' });
      videoPlayer.play();
    }
  }, [videoPlayer, currentVideo]);

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
      setMessage('');
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#1f1f1f',
        color: 'white',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px', // Reduced padding for smaller screens
      }}
    >
      {/* Video + Chat Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: '100%',
          maxWidth: '1200px',
          gap: '15px', // Reduced gap for smaller screens
          justifyContent: 'center', // Center the video and chat on mobile
        }}
      >
        {/* Video Player */}
        <div style={{ flex: 1, minWidth: '280px', textAlign: 'center' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '5px' }}>Live Stream</h2>
          <a href='https://t.me/utdzn'>Join our Telegram Channel</a>
          <div style={{ position: 'relative', width: '100%' }}>
            <video ref={videoRef} className="video-js vjs-default-skin" style={{ width: '100%', borderRadius: '8px' }} />
          </div>

          {/* Video Selection Buttons */}
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            {videoLinks.map((video) => (
              <button
                key={video.id}
                onClick={() => setCurrentVideo(video.url)}
                style={{
                  margin: '5px',
                  padding: '8px 12px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: currentVideo === video.url ? '#da291c' : '#a8a8a8', // Set background red
                  color: 'white',
                  fontSize: '12px', // Smaller font size for smaller devices
                  transition: 'background-color 0.3s', // Smooth transition
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#e74c3c')} // Hover effect
                onMouseLeave={(e) => (e.target.style.backgroundColor = currentVideo === video.url ? '#da291c' : '#a8a8a8')} // Reset background color
              >
                {video.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Section */}
        <div style={{ flex: 1, minWidth: '280px', textAlign: 'center' }}>
          <h2 style={{ textAlign: 'center' }}>Live Chat - Room: {room}</h2>
          <div
            style={{
              padding: '8px',
              overflowY: 'auto',
              maxHeight: '300px', // Fixed height for the chat box
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
                    margin: '5px 0',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: msg.user === username ? '#e74c3c' : '#444',
                    color: '#fff',
                    textAlign: 'left',
                    fontSize: '14px',
                    maxWidth: '80%',
                    wordWrap: 'break-word',
                    marginLeft: msg.user === username ? 'auto' : '0',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <strong>{msg.user}</strong>
                  <p>{msg.text}</p>
                  <small style={{ color: '#bbb', fontSize: '12px' }}>{msg.timestamp}</small>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', marginTop: '10px', justifyContent: 'center' }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              style={{
                width: '80%',
                padding: '8px 12px',
                borderRadius: '5px',
                border: '1px solid #444',
                backgroundColor: '#333',
                color: 'white',
                fontSize: '14px',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '8px 12px',
                marginLeft: '10px',
                borderRadius: '5px',
                backgroundColor: '#c0392b',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
