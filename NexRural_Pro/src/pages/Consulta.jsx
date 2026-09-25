import {useCallback} from "react";
import {getWeather} from "../services/api";
import WeatherCard from "../components/cards/WeatherCard";
import Loading from "../components/common/Loading";
import useFetch from "../hooks/useFetch";

export default function Consulta(){
 const fetchWeather=useCallback(()=>getWeather(),[]);
 const {data,loading,error}=useFetch(fetchWeather);

 return <main className="page-shell compact-page"><div className="container"><section className="content-panel">
  <span className="eyebrow">Monitoramento climático</span>
  <h1>Painel rural inteligente</h1>
  {loading && <Loading/>}
  {!loading && data && <div className="weather-grid">
   <WeatherCard title="Temperatura" value={data.current.temperature_2m+"°C"}/>
   <WeatherCard title="Umidade" value={data.current.relative_humidity_2m+"%"}/>
   <WeatherCard title="Chuva" value={data.current.precipitation+" mm"}/>
   <WeatherCard title="Vento" value={data.current.wind_speed_10m+" km/h"}/>
  </div>}
  {!loading && (error || !data) && <p className="empty-state">Não foi possível carregar os dados climáticos no momento. Tente novamente em instantes.</p>}
 </section></div></main>
}
