

const { createContext, useState } = require("react");

export const userContext=createContext();

const UserProvider=({children})=>{
     
     const [userData, setuserData] = useState();
     const [chatList,setChatList]=useState([]);
     const [selectedChat,setSelectedChat]=useState();
    return (
        <userContext.Provider value={{userData,setuserData,chatList,setChatList,selectedChat,setSelectedChat}}>
         {children}
        </userContext.Provider>
    )
}

export default UserProvider