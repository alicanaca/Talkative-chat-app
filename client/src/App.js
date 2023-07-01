import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import ChatPages from './Pages/ChatPages';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='chats' element={<ChatPages />} />
      </Routes>
    </div>
  );
}

export default App;
