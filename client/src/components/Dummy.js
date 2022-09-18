import React, {useState,useMemo, useEffect} from 'react'
import { io } from 'socket.io-client'

const serverURL = "http://localhost:5500";

export default function Dummy({userName,roomId}) {
  const socket = useMemo(() => io(serverURL, {query:{ roomId:roomId, userName: userName }}), [userName,roomId]);

  useEffect(()=>{
    console.log(socket.id)
    return ()=>{
      socket.close()
    }
  },[])

  return (
    <div>Dummy</div>
  )
}
