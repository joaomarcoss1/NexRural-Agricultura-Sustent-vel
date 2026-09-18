import {createContext,useState} from "react";
export const AppContext=createContext();
export function AppProvider({children}){
 const [dark,setDark]=useState(false);
 return <AppContext.Provider value={{dark,setDark}}>
 <div className={dark?"dark":""}>{children}</div>
 </AppContext.Provider>
}