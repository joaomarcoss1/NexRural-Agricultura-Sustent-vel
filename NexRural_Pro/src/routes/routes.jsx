import {Routes,Route} from "react-router-dom";
import Home from "../pages/Home";
import Sobre from "../pages/Sobre";
import Recursos from "../pages/Recursos";
import Consulta from "../pages/Consulta";
import Contato from "../pages/Contato";
export default function RoutesConfig(){return <Routes>
<Route path="/" element={<Home/>}/><Route path="/sobre" element={<Sobre/>}/>
<Route path="/recursos" element={<Recursos/>}/><Route path="/consulta" element={<Consulta/>}/>
<Route path="/contato" element={<Contato/>}/>
</Routes>}