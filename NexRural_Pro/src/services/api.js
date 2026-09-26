export async function getWeather(){
 const url="https://api.open-meteo.com/v1/forecast?latitude=-4.9&longitude=-43.0&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m";
 const response=await fetch(url);
 if(!response.ok) throw new Error("Falha na API");
 return response.json();
}

export async function getNews(){
 const feed=encodeURIComponent("https://g1.globo.com/rss/g1/economia/agronegocios/");
 const url=`https://api.rss2json.com/v1/api.json?rss_url=${feed}`;
 const response=await fetch(url);
 if(!response.ok) throw new Error("Falha na API de notícias");
 const data=await response.json();
 if(data.status!=="ok"||!Array.isArray(data.items)) throw new Error("Falha ao processar o feed de notícias");
 return data.items.slice(0,9);
}