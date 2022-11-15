import React, {useState,useMemo, useEffect} from 'react'
import { io } from 'socket.io-client'

const serverURL = "https://zapp-poker-server.up.railway.app";

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
