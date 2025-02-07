'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import io from 'socket.io-client';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-hls'; // Ensures proper HLS playback

const socket = io('https://manu-reddevil-3.onrender.com', {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

export default function ChatPage() {
  const { room } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const messagesEndRef = useRef(null);
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [videoPlayer, setVideoPlayer] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(
    'https://m3u-playlist-proxy-2.vercel.app?url=https%3A%2F%2Fxyzdddd.mizhls.ru%2Flb%2Fpremium591%2Findex.m3u8&data=UmVmZXJlcj1odHRwczovL2Nvb2tpZXdlYnBsYXkueHl6L3xPcmlnaW49aHR0cHM6Ly9jb29raWV3ZWJwbGF5Lnh5enxVc2VyLUFnZW50PU1vemlsbGEvNS4wIChYMTE7IExpbnV4IHg4Nl82NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyOS4wLjAuMCBTYWZhcmkvNTM3LjM2'
  );

  const videoLinks = [
    { id: 1, url: 'https://m3u-playlist-proxy-2.vercel.app?url=https%3A%2F%2Fxyzdddd.mizhls.ru%2Flb%2Fpremium591%2Findex.m3u8&data=UmVmZXJlcj1odHRwczovL2Nvb2tpZXdlYnBsYXkueHl6L3xPcmlnaW49aHR0cHM6Ly9jb29raWV3ZWJwbGF5Lnh5enxVc2VyLUFnZW50PU1vemlsbGEvNS4wIChYMTE7IExpbnV4IHg4Nl82NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyOS4wLjAuMCBTYWZhcmkvNTM3LjM2', label: 'Link 1' },
    { id: 2, url: 'https://m3u-playlist-proxy-2.vercel.app?url=https%3A%2F%2Fxyzdddd.mizhls.ru%2Flb%2Fpremium81%2Findex.m3u8&data=UmVmZXJlcj1odHRwczovL2Nvb2tpZXdlYnBsYXkueHl6L3xPcmlnaW49aHR0cHM6Ly9jb29raWV3ZWJwbGF5Lnh5enxVc2VyLUFnZW50PU1vemlsbGEvNS4wIChYMTE7IExpbnV4IHg4Nl82NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyOS4wLjAuMCBTYWZhcmkvNTM3LjM2', label: 'Link 2' },
    { id: 3, url: 'https://m3u-playlist-proxy-2.vercel.app?url=https%3A%2F%2Fxyzdddd.mizhls.ru%2Flb%2Fpremium432%2Findex.m3u8&data=UmVmZXJlcj1odHRwczovL2Nvb2tpZXdlYnBsYXkueHl6L3xPcmlnaW49aHR0cHM6Ly9jb29raWV3ZWJwbGF5Lnh5enxVc2VyLUFnZW50PU1vemlsbGEvNS4wIChYMTE7IExpbnV4IHg4Nl82NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyOS4wLjAuMCBTYWZhcmkvNTM3LjM28', label: 'Link 3' },
    { id: 4, url: 'https://m3u-playlist-proxy-2.vercel.app?url=https%3A%2F%2Fxyzdddd.mizhls.ru%2Flb%2Fpremium410%2Findex.m3u8&data=UmVmZXJlcj1odHRwczovL2Nvb2tpZXdlYnBsYXkueHl6L3xPcmlnaW49aHR0cHM6Ly9jb29raWV3ZWJwbGF5Lnh5enxVc2VyLUFnZW50PU1vemlsbGEvNS4wIChYMTE7IExpbnV4IHg4Nl82NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyOS4wLjAuMCBTYWZhcmkvNTM3LjM2', label: 'Link 4' },
    { id: 5, url: 'https://m3u-playlist-proxy-2.vercel.app?url=https%3A%2F%2Fxyzdddd.mizhls.ru%2Flb%2Fpremium414%2Findex.m3u8&data=UmVmZXJlcj1odHRwczovL2Nvb2tpZXdlYnBsYXkueHl6L3xPcmlnaW49aHR0cHM6Ly9jb29raWV3ZWJwbGF5Lnh5enxVc2VyLUFnZW50PU1vemlsbGEvNS4wIChYMTE7IExpbnV4IHg4Nl82NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyOS4wLjAuMCBTYWZhcmkvNTM3LjM2', label: 'Link 5' },
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
  }, []);

  useEffect(() => {
    if (room) {
      socket.emit('joinRoom', room);
    }

    const messageHandler = (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    };

    const previousMessagesHandler = (previousMessages) => {
      setMessages(previousMessages);
    };

    socket.on('previousMessages', previousMessagesHandler);
    socket.on('chatMessage', messageHandler);

    return () => {
      socket.off('chatMessage', messageHandler);
      socket.off('previousMessages', previousMessagesHandler);
    };
  }, [room]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!videoRef.current) return;

    if (playerRef.current) {
      playerRef.current.dispose(); // Destroy previous instance before creating a new one
    }

    playerRef.current = videojs(videoRef.current, {
      controls: true,
      autoplay: 'muted', // Avoid autoplay errors
      responsive: true,
      fluid: true,
      html5: {
        hls: {
          withCredentials: false, // Fix CORS issue
        },
      },
    });

    // Ensure valid video source
    if (currentVideo) {
      playerRef.current.src({ src: currentVideo, type: 'application/x-mpegURL' });

      playerRef.current.ready(() => {
        playerRef.current.play().catch((error) => console.warn('Autoplay prevented:', error));
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [currentVideo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && room) {
      socket.emit('chatMessage', room, { text: message, user: username, timestamp: new Date().toLocaleTimeString() });
      setMessage('');
    }
  };

  return (
    <div style={{ backgroundColor: '#1f1f1f', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', maxWidth: '1200px', gap: '15px', justifyContent: 'center' }}>
        <div style={{ flex: 1, minWidth: '280px', textAlign: 'center' }}>
          <h2>Live Stream</h2>
          <video ref={videoRef} className="video-js vjs-default-skin" style={{ width: '100%', borderRadius: '8px' }} />
          <div>
            <h3>Switch Stream:</h3>
            {videoLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setCurrentVideo(link.url)}
                style={{
                  margin: '5px',
                  padding: '8px 15px',
                  backgroundColor: '#ff5722',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
