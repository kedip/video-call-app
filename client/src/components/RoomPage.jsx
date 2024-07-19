import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'peerjs';

const socket = io("/");

const RoomPage = () => {
  const { roomId } = useParams();
  const [myVideoStream, setMyVideoStream] = useState(null);
  const videoGrid = useRef(null);
  const myVideo = useRef(null);
  const peerInstance = useRef(null);

  useEffect(() => {
    const user = prompt("Enter your name");

    const peer = new Peer({
      host: '127.0.0.1',
      port: 3030,
      path: '/peerjs',
    });

    peerInstance.current = peer;

    peer.on('open', (id) => {
      socket.emit('join-room', roomId, id, user);
    });

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setMyVideoStream(stream);
        addVideoStream(myVideo.current, stream);

        peer.on('call', (call) => {
          call.answer(stream);
          const video = document.createElement('video');
          call.on('stream', (userVideoStream) => {
            addVideoStream(video, userVideoStream);
          });
        });

        socket.on('user-connected', (userId) => {
          connectToNewUser(userId, stream);
        });
      });

    socket.on('user-disconnected', (userId) => {
      const video = document.getElementById(userId);
      if (video) video.remove();
    });

    return () => {
      socket.off('user-connected');
      socket.off('user-disconnected');
      if (peerInstance.current) {
        peerInstance.current.destroy();
      }
    };
  }, [roomId]);

  const connectToNewUser = (userId, stream) => {
    const call = peerInstance.current.call(userId, stream);
    const video = document.createElement('video');
    video.id = userId;
    call.on('stream', (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
  };

  const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
      videoGrid.current.append(video);
    });
  };

  const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    myVideoStream.getAudioTracks()[0].enabled = !enabled;
  };

  const playStop = () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    myVideoStream.getVideoTracks()[0].enabled = !enabled;
  };

  const inviteUser = () => {
    prompt("Copy this link and send it to people you want to have a video call with", window.location.href);
  };

  return (
    <div className="RoomPage">
      <div className="header">
        <div className="logo">
          <div className="header_back">
            <i className="fas fa-angle-left"></i>
          </div>
          <h3>Video Chat</h3>
        </div>
      </div>
      <div className="main">
        <div className="main_left">
          <div className="videos_group" ref={videoGrid}></div>
          <div className="options">
            <div className="options_left">
              <div id="stopVideo" className="options_button" onClick={playStop}>
                <i className="fa fa-video-camera"></i>
              </div>
              <div id="muteButton" className="options_button" onClick={muteUnmute}>
                <i className="fa fa-microphone"></i>
              </div>
              <div id="disconnect" className="options_button background_red">
                <i className="fa fa-phone"></i>
              </div>
            </div>
            <div className="options_right">
              <div id="inviteButton" className="options_button" onClick={inviteUser}>
                <i className="fas fa-user-plus"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <video ref={myVideo} muted autoPlay></video>
    </div>
  );
};

export default RoomPage;
