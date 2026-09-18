import {useEffect,useState} from "react";
export default function useFetch(fn){
 const [data,setData]=useState(null),[loading,setLoading]=useState(false),[error,setError]=useState("");
 useEffect(()=>{setLoading(true);fn().then(setData).catch(e=>setError(e.message)).finally(()=>setLoading(false))},[fn]);
 return {data,loading,error};
}