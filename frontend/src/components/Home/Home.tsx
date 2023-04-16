import { Socket } from "socket.io-client" 
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import './Home.css'
import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

//create an interface for the props that you want to pass to this component
interface HomePageProps {
    socket: Socket<DefaultEventsMap, DefaultEventsMap> //this is the type for sockets 
    //you can always add more functions/objects that you would like as props for this component
}



function HomePage({socket}:HomePageProps){
    //click handler
    const [username, setUsername] = useState('')       
    const navigate = useNavigate();
    

    useEffect(() => {
        socket.on("UsersFull", (playerNames:any) => {
          console.log("USERSS FULLLL", playerNames)
          navigate('/TeenPatti', {state: {playerNames: playerNames}})
        });
        
        socket.on("MaxPlayers", () => {
            console.log("Redict")
            navigate('/tooManyUsers')
        });

    }, [socket]);
      

    const handleClick = (socket: Socket) => {
        console.log('Socket ID:', socket.id);
        socket.emit("newPlayer", { username: username })
        navigate('/waitingScreen')
    };

    const settingUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value)
    }


    return(
        <>
        <div className="sampleHomePage">                
            <h1 className="sampleTitle">Welcome to TeenPatti</h1>
            <div className="sampleMessage">
                <input  placeholder = "enter username" value={username} onChange={settingUsername}></input>
                <button  onClick={() => handleClick(socket)}>Join Game</button>
            </div>        
        </div>
        </>
    )

}
export default HomePage
