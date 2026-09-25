import {createContext,useEffect,useState} from "react";
export const AppContext=createContext();

function loadFavorites(){
 try{
  const raw=window.localStorage.getItem("nexrural:favoritos");
  return raw?JSON.parse(raw):[];
 }catch{
  return [];
 }
}

export function AppProvider({children}){
 const [dark,setDark]=useState(false);
 const [favorites,setFavorites]=useState(loadFavorites);

 useEffect(()=>{
  try{
   window.localStorage.setItem("nexrural:favoritos",JSON.stringify(favorites));
  }catch{
   /* localStorage indisponível (modo privado); favoritos seguem apenas em memória */
  }
 },[favorites]);

 function toggleFavorite(nome){
  setFavorites(prev=>prev.includes(nome)?prev.filter(f=>f!==nome):[...prev,nome]);
 }

 return <AppContext.Provider value={{dark,setDark,favorites,toggleFavorite}}>
 <div className={dark?"dark":""}>{children}</div>
 </AppContext.Provider>
}
