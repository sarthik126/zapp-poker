import { useEffect } from "react";
import axios from "axios";
import "../css/Main.css";
import { useParams, useNavigate } from "react-router-dom";

const serverURL = "https://zapp-poker-server.up.railway.app";

const api = axios.create({
  baseURL: serverURL,
});

function Main({userName,roomId,isAdmin,setUserName,setRoomId,setIsAdmin,setRoomValidation}) {

  const { id } = useParams()
  const navigate = useNavigate()

  async function createRoom(e) {
    e.preventDefault();
    let flag = validateFields()

    if(flag) {
        let data = await api.get("/get-room-id");
        let res = data.data
        
        // console.log(res)
        setRoomId(res.roomId)
        setIsAdmin(true)
        setRoomValidation(true)

        navigate('/room')
    } else {
      alert("Enter username please!!")
    }
  }

  async function joinRoom(e) {
    e.preventDefault();
    let flag = validateFields()
    if(flag){
      let data = await api.get("/rooms");
      let rooms = data.data
      // console.log(rooms)
      if(rooms[roomId]) {
        setRoomValidation(true)
        navigate('/room')
      } else {
        alert("Room does not exists...")
      }
    } else {
      alert("Enter username please!!")
    }
  }

  function validateFields() {
    if(userName.length !== 0) {
      return true
    }
    return false
  }

  useEffect(() => {
    if(id){
      setRoomId(id)
      setRoomValidation(true)
    }
  }, [])
  

  return (
    <div className="main-page">
            <div className="main-logo">Zapp Poker</div>
            <div className="join-modal">
              <form className="join-form">
                <div className="input-wrapper">
                  <input
                    placeholder="Enter your name"
                    required
                    id="user-name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div className="join-btns">
                  {id ?
                  <button className="btn btn-primary" onClick={joinRoom}>
                    Join Room
                  </button>:
                  <button className="btn btn-success" onClick={createRoom}>
                    Create Room
                  </button>
                  }
                </div>
              </form>
            </div>
          </div>
  );
}

export default Main;
