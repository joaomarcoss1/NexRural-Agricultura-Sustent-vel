export async function getWeather(){
 const url="https://api.open-meteo.com/v1/forecast?latitude=-4.9&longitude=-43.0&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m";
 const response=await fetch(url);
 if(!response.ok) throw new Error("Falha na API");
 return response.json();
}