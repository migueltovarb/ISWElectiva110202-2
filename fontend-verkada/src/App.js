// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Doors from './pages/Doors';
import Users from './pages/Users';
import Access from './pages/Access';
import Alarms from './pages/Alarms';
import Nav from './components/Nav';

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doors" element={<Doors />} />
        <Route path="/users" element={<Users />} />
        <Route path="/access" element={<Access />} />
        <Route path="/alarms" element={<Alarms />} />
      </Routes>
    </Router>
  );
}

export default App;