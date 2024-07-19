import React from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const LobbyScreen = () => {
  const navigate = useNavigate();

  const createRoom = () => {
    const roomId = uuidv4();
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="LobbyScreen">
      <h1>Welcome to Video Chat App</h1>
      <button onClick={createRoom}>Create Room</button>
    </div>
  );
};

export default LobbyScreen;
