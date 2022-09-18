import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import Board from './components/Board'
import Dummy from './components/Dummy'

export default function App() {
    const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [roomValidation,setRoomValidation] = useState(false);

  return (
    <>
        <Router>
            <Routes>
                <Route path='/' element={<Main setRoomValidation={setRoomValidation} userName={userName} roomId={roomId} isAdmin={isAdmin} setUserName={setUserName} setRoomId={setRoomId} setIsAdmin={setIsAdmin} />} />
                <Route path='/:id' element={<Main setRoomValidation={setRoomValidation} userName={userName} roomId={roomId} isAdmin={isAdmin} setUserName={setUserName} setRoomId={setRoomId} setIsAdmin={setIsAdmin} />} />
                <Route path='/room' element={<Board roomValidation={roomValidation} userName={userName} roomId={roomId} isAdmin={isAdmin} setUserName={setUserName} setRoomId={setRoomId} setIsAdmin={setIsAdmin} />} />
                {/* <Route path='/room' element={<Dummy roomValidation={roomValidation} userName={userName} roomId={roomId} isAdmin={isAdmin} setUserName={setUserName} setRoomId={setRoomId} setIsAdmin={setIsAdmin} />} /> */}
            </Routes>
        </Router>
    </>
  )
}
