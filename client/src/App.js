import { Routes, Route } from "react-router-dom";
import "./App.css";
import LobbyScreen from "./components/LobbyScreen";
import RoomPage from "./components/RoomPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LobbyScreen />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
      </Routes>
    </div>
  );
}

export default App;


// import React, { useEffect, useRef, useState } from 'react';
// import io from 'socket.io-client';
// import Peer from 'peerjs';
// import './App.css';

// const socket = io("/");

// const App = () => {
//   const [myVideoStream, setMyVideoStream] = useState(null);
//   const [peerId, setPeerId] = useState('');
//   const videoGrid = useRef(null);
//   const myVideo = useRef(null);

//   useEffect(() => {
//     const user = prompt("Enter your name");
//     const peer = new Peer({
//       host: '127.0.0.1',
//       port: 3030,
//       path: '/peerjs',
//     });

//     peer.on('open', (id) => {
//       setPeerId(id);
//       socket.emit('join-room', ROOM_ID, id, user);
//     });

//     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         setMyVideoStream(stream);
//         addVideoStream(myVideo.current, stream);

//         peer.on('call', (call) => {
//           call.answer(stream);
//           const video = document.createElement('video');
//           call.on('stream', (userVideoStream) => {
//             addVideoStream(video, userVideoStream);
//           });
//         });

//         socket.on('user-connected', (userId) => {
//           connectToNewUser(userId, stream, peer);
//         });
//       });

//     socket.on('user-disconnected', (userId) => {
//       const video = document.getElementById(userId);
//       if (video) video.remove();
//     });

//     const connectToNewUser = (userId, stream, peer) => {
//       const call = peer.call(userId, stream);
//       const video = document.createElement('video');
//       video.id = userId;
//       call.on('stream', (userVideoStream) => {
//         addVideoStream(video, userVideoStream);
//       });
//     };

//     const addVideoStream = (video, stream) => {
//       video.srcObject = stream;
//       video.addEventListener('loadedmetadata', () => {
//         video.play();
//         videoGrid.current.append(video);
//       });
//     };
//   }, []);

//   const muteUnmute = () => {
//     const enabled = myVideoStream.getAudioTracks()[0].enabled;
//     myVideoStream.getAudioTracks()[0].enabled = !enabled;
//   };

//   const playStop = () => {
//     const enabled = myVideoStream.getVideoTracks()[0].enabled;
//     myVideoStream.getVideoTracks()[0].enabled = !enabled;
//   };

//   return (
//     <div className="App">
//       <div className="header">
//         <div className="logo">
//           <div className="header_back">
//             <i className="fas fa-angle-left"></i>
//           </div>
//           <h3>Video Chat</h3>
//         </div>
//       </div>
//       <div className="main">
//         <div className="main_left">
//           <div className="videos_group" ref={videoGrid}></div>
//           <div className="options">
//             <div className="options_left">
//               <div id="stopVideo" className="options_button" onClick={playStop}>
//                 <i className="fa fa-video-camera"></i>
//               </div>
//               <div id="muteButton" className="options_button" onClick={muteUnmute}>
//                 <i className="fa fa-microphone"></i>
//               </div>
//               <div id="disconnect" className="options_button background_red">
//                 <i className="fa fa-phone"></i>
//               </div>
//             </div>
//             <div className="options_right">
//               <div id="inviteButton" className="options_button">
//                 <i className="fas fa-user-plus"></i>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <video ref={myVideo} muted autoPlay></video>
//     </div>
//   );
// };

// export default App;
