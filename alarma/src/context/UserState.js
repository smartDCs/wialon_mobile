import { useState } from "react";
import { UserContext } from "./UserContext";
const UserState=({children, ...props})=>{
    const {unidades, sessionId, auth,app,db}=props;
  
return(
    <UserContext.Provider value={{unidades, sessionId, auth,app,db}}>
        {children}
    </UserContext.Provider>
)    
}
export default UserState;