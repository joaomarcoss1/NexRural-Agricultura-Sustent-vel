import {Link} from "react-router-dom";
import {useContext} from "react"; import {AppContext} from "../../context/AppContext";
export default function Navbar(){const {dark,setDark}=useContext(AppContext);return <nav className="navbar navbar-expand bg-success navbar-dark p-3">
<b>NexRural</b><div className="ms-auto">{["/","/sobre","/recursos","/consulta","/contato"].map(x=><Link className="mx-2 text-white" to={x}>{x.replace("/","")||"Home"}</Link>)}<button onClick={()=>setDark(!dark)} className="btn btn-light">Tema</button></div></nav>}