import { useEffect, useState, useMemo, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/Board.css';
import { io } from 'socket.io-client'
import Players from './Players';
import Result from './Result';
import {useNavigate} from 'react-router-dom'

const serverURL = "http://localhost:5500";
const baseURL = "http://localhost:3000"

function Board({roomId, isAdmin, userName, roomValidation}) {

  const socket = useMemo(() => io(serverURL, {query:{ roomId:roomId, userName: userName }}), []);
  
  const [board,setBoard] = useState([0,1,2,3,5,8,13,20,'?'])
  const [allPlayers,setAllPlayers] = useState([])
  const [isVoted, setIsVoted] = useState(false)
  const [finished,setFinished] = useState(false)
  const [mapperDict,setMapperDict] = useState({})
  const [toggle,setToggle] = useState(true)
  const navigate = useNavigate()

  function setData(index) {
    // console.log(index)
    socket.emit("vote",{ socketId: socket.id,index:index,userName:userName,roomId:roomId })
    setIsVoted(true)
  }

  function resetBoard() {
    setIsVoted(false)
    setFinished(false)
    socket.emit("reset",{ userName:userName,roomId:roomId, socketId:socket.id })
  }

  function copyRoomName() {
    navigator.clipboard.writeText(`${baseURL}/${roomId}`);
    toast(`LINK COPIED !!`,{
      position: toast.POSITION.TOP_CENTER
    });
  }

  function exitRoom(){
    socket.close()
    navigate("/")
  }

  function countOccurance(tmpList,ele) {
    let count = 0;
    for(let i in tmpList){
      if(tmpList[i] === ele){
        count++;
      }
    }
    return count;
  }

  useEffect(() => {

    socket.on("new-user",(data)=>{
      toast(`${data.userName} joined!!`,{
        position: toast.POSITION.TOP_CENTER
      });
    })

    socket.on("remove-user",(data)=>{

      toast(`${data.userName} left!!`,{
        position: toast.POSITION.TOP_CENTER
      });
      
    })

    socket.on("reset",()=>{
      setIsVoted(false)
      setFinished(false)
      toast(`Board Cleared`,{
        position: toast.POSITION.TOP_CENTER
      });
    })

    socket.on("all-data",(data)=>{
      // console.log(data.room)
      setAllPlayers([...data.room])
    })

  },[socket])

  useEffect(()=>{
    if(!roomValidation) {
      navigate('/')
    }
  },[])

  useEffect(()=>{
    let newList = []
    let tmpDict = {}

    for(let item in allPlayers){
      newList.push(board[allPlayers[item].index])
    }

    let newSet = [...new Set(newList)]
    for(let i in newSet){
      tmpDict[newSet[i]] = countOccurance(newList,newSet[i])
    }

    setMapperDict({...tmpDict})
    console.log(tmpDict)

    if(!tmpDict[undefined]){
      setFinished(true)
    }else{
      setFinished(false)
    }
  },[allPlayers])

  return(
    <>
        <ToastContainer className='toaster' />
        <div className='header'>
        <div className="logo">Zap Poker</div>
  
        <div className='players'>
            {/* <div className='gap'><i className="fa-solid fa-shield-alt"></i></div> */}
            <div className='player-1'>{userName}</div>
        </div>

        <div className="exit"><button onClick={exitRoom} className="exit-btn btn btn-danger">Exit</button></div>

        </div>
      <div className="main-container">
        <div className="left-pane">
            <div className='board'>
            {board.map((val,index) => (
                <button disabled={isVoted} onClick={()=> setData(index)} key={index} className='box'>
                {val}
                </button>
            ))}
                
            </div>
            {isAdmin && <button onClick={resetBoard} className='btn btn-primary reset-btn'>Reset Board</button>}
        </div>
            
        <div className='right-pane'>
            <div className="btns">
                <button onClick={copyRoomName} className='btn btn-info'>Copy Link</button>

                <button onClick={()=>setToggle(true)} className='btn btn-success'>Players</button>
                {finished && <button onClick={()=>setToggle(false)} className='btn btn-success'>Show Result</button>}
                
            </div>
            <hr />

            {toggle ? (allPlayers.length !== 0 ? <Players allPlayers={allPlayers} board={board} /> : "...")
            :
            <Result mapperDict={mapperDict} />
            }
        </div>
      </div>
    </>
  )
}

export default Board;
