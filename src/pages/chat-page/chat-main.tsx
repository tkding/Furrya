import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../config/firebase";
import React, { useState, useContext } from "react";
import { Auth } from "../../components/Auth";
import { Chat } from "./Chat";
import { AppContext } from "../../App";
import { useNavigate } from "react-router-dom";

import "./ChatMain.css";

export interface ChatProps {
  room: number | null;
}

// import Cookies from 'universal-cookie';
// const cookies = new Cookies(); // outside function
// const [isAuth, setIsAuth] = React.useState(cookies.get("auth-token")); // in function
export const ChatMain = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  // const [room, setRoom] = useState<number | null>(null);
  const { room, setRoom } = useContext(AppContext);

  const [newRoom, setNewRoom] = useState<number>(1);
  const regex = /^[1-9]{1}$/;

  // const roomInputRef = useRef<HTMLInputElement>(null);
  const handleRoomChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (regex.test(event.target.value)) {
      setNewRoom(parseInt(event.target.value));
    }
  };

  const handleRoomClick = () => {
    if (regex.test(newRoom.toString())) {
      setRoom(newRoom);
    } else {
      alert("Please enter a number between 1 and 9");
    }
  };

  if (!user) {
    navigate("/login");
  }
  return (
    <div className="chat-room-container">
      {room ? (
        <div className="in-chat-room-container">
          <div className="container d-flex justify-content-center align-items-center">
            <h1 className="room-title me-2" title="room-title">
              Room: {room}
            </h1>
            <button className="chat-btn" onClick={() => setRoom(null)}>
              Leave Room
            </button>
          </div>
          <Chat ChatProps={{ room }} />
        </div>
      ) : (
        <div className="select-room-container">
          <label className="h5 mb-3 ms-3 me-1" htmlFor="room-input">
            Select Room:
          </label>
          <select
            id="room-input"
            name="room"
            value={newRoom}
            onChange={handleRoomChange}
          >
            <option value="1" selected>
              Room 1 🐾
            </option>
            <option value="2">Room 2 🐦</option>
            <option value="3">Room 3 🐠</option>
            <option value="4">Room 4 🐱</option>
            <option value="5">Room 5 🐶</option>
            <option value="6">Room 6 🦎</option>
            <option value="7">Room 7 🐢</option>
            <option value="8">Room 8 🦉</option>
            <option value="9">Room 9 🐹</option>
          </select>
          <button className="chat-btn mx-3" onClick={handleRoomClick}>
            Enter Room
          </button>
          <div className="container mb-sm-4">
            <div className="row g-3">
              <div className="col-lg-4 col-md-6">
                <div
                  className="card room-card"
                  onClick={() => {
                    setRoom(1);
                  }}
                >
                  <div className="card-body ">
                    <h5 className="card-title">Room 1</h5>
                    <p className="card-text">
                      Paws & Claws <p className="emoji">🐾</p>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div
                  className="card room-card"
                  onClick={() => {
                    setRoom(2);
                  }}
                >
                  <div className="card-body">
                    <h5 className="card-title">Room 2</h5>
                    <p className="card-text d-flex flex-column justify-content-center">
                      Feathered Friends
                      <p className="emoji">🐦</p>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div
                  className="card room-card"
                  onClick={() => {
                    setRoom(3);
                  }}
                >
                  <div className="card-body">
                    <h5 className="card-title">Room 3</h5>
                    <p className="card-text">
                      Aquatic Companions <p className="emoji">🐠</p>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div
                  className="card room-card"
                  onClick={() => {
                    setRoom(4);
                  }}
                >
                  <div className="card-body">
                    <h5 className="card-title">Room 4</h5>
                    <p className="card-text">
                      Furry Felines <p className="emoji">🐱</p>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div
                  className="card room-card"
                  onClick={() => {
                    setRoom(5);
                  }}
                >
                  <div className="card-body">
                    <h5 className="card-title">Room 5</h5>
                    <p className="card-text">
                      Barking Buddies <p className="emoji">🐶</p>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div
                  className="card room-card"
                  onClick={() => {
                    setRoom(6);
                  }}
                >
                  <div className="card-body">
                    <h5 className="card-title">Room 6</h5>
                    <p className="card-text">
                      Exotic Encounters <p className="emoji">🦎</p>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div
                  className="card room-card"
                  onClick={() => {
                    setRoom(7);
                  }}
                >
                  <div className="card-body">
                    <h5 className="card-title">Room 7</h5>
                    <p className="card-text">
                      Small & Scaly <p className="emoji">🐢</p>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div
                  className="card room-card"
                  onClick={() => {
                    setRoom(8);
                  }}
                >
                  <div className="card-body">
                    <h5 className="card-title">Room 8</h5>
                    <p className="card-text">
                      Winged Whispers <p className="emoji">🦉</p>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div
                  className="card room-card"
                  onClick={() => {
                    setRoom(9);
                  }}
                >
                  <div className="card-body">
                    <h5 className="card-title">Room 9</h5>
                    <p className="card-text">
                      Critter Corner <p className="emoji">🐹</p>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
