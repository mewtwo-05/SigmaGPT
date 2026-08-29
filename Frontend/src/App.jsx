import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { v1 as uuidv1 } from 'uuid';

import Sidebar from './Sidebar.jsx';
import ChatWindow from './ChatWindow.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import { MyContext } from './MyContext.jsx';

function ChatApp() {
  const [prompt, setPrompt]           = useState("");
  const [reply, setReply]             = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats]     = useState([]);
  const [newChat, setNewChat]         = useState(true);
  const [allThreads, setAllThreads]   = useState([]);

  const providerValue = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads
  };

  return (
    <div className='app'>
      <MyContext.Provider value={providerValue}>
        <Sidebar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected chat app */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ChatApp />
          </ProtectedRoute>
        }
      />

      {/* Catch-all: redirect unknown paths to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
