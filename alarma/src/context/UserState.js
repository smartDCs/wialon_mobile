import { useState } from "react";
import { UserContext } from "./UserContext";
const UserState=({children, ...props})=>{
    const {unidades, sessionId}=props;
  
return(
    <UserContext.Provider value={{unidades, sessionId}}>
        {children}
    </UserContext.Provider>
)    
}
export default UserState;