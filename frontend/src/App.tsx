import React from 'react';
import logo from './logo.svg';
import HomePage from './components/Home/Home';
import TeenPatti from './components/teenpatti';
import TooManyUsers from './components/ExtraPages/tooManyUsers';
import WaitingScreen from './components/ExtraPages/waitingScreen';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import {io} from "socket.io-client"

const socket = io('http://localhost:3001',{ transports: ["websocket"] });
socket.connect()

function App() {
  
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage socket={socket} />} />
          <Route path="/TeenPatti" element={<TeenPatti socket={socket}/>} />
          <Route path="/tooManyUsers" element={<TooManyUsers/>} />
          <Route path="/waitingScreen" element={<WaitingScreen/>} />

        </Routes>
      </Router>

    </div>
  );
}

export default App;
