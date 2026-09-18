import {BrowserRouter} from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import RoutesConfig from "./routes/routes";
export default function App(){
 return <BrowserRouter><Navbar/><RoutesConfig/><Footer/></BrowserRouter>
}