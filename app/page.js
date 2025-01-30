'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // For programmatic navigation

export default function HomePage() {
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Retrieve username from localStorage when the component mounts (client-side)
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []); // Empty dependency array ensures this only runs once when the component mounts

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (username.trim() && roomName.trim()) {
      localStorage.setItem('username', username); // Save the username to localStorage
      const formattedRoomName = roomName.trim().replace(/\s+/g, '-'); // Replace spaces with hyphens
      router.push(`/${formattedRoomName}`);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Enter any room</h1>
      
      {/* Username input field */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Enter your username"
          style={{
            padding: '10px',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '300px',
            marginRight: '10px',
          }}
        />
      </div>

      {/* Room creation form */}
      <form onSubmit={handleCreateRoom} style={{ marginTop: '20px' }}>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter room name"
          style={{
            padding: '10px',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '300px',
            marginRight: '10px',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Create Room
        </button>
      </form>
    </div>
  );
}
