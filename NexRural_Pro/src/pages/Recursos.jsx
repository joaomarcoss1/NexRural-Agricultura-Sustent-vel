import dados from "../data/dados.json";
import {useContext,useMemo,useState} from "react";
import {AppContext} from "../context/AppContext";
import ResourceCard from "../components/cards/ResourceCard";
import Modal from "../components/common/Modal";

export default function Recursos(){
 const [q,setQ]=useState("");
 const [sel,setSel]=useState(null);
 const [onlyFavorites,setOnlyFavorites]=useState(false);
 const {favorites,toggleFavorite}=useContext(AppContext);

 const normalize=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();

 const filtered=useMemo(()=>{
  const term=normalize(q);
  return dados.filter(d=>{
   const matches=normalize(d.nome).includes(term)||normalize(d.categoria).includes(term);
   const favOk=!onlyFavorites||favorites.includes(d.nome);
   return matches&&favOk;
  });
 },[q,onlyFavorites,favorites]);

 return <main className="page-shell compact-page"><div className="container"><section className="content-panel">
  <div className="search-header">
   <div><span className="eyebrow">Biblioteca temática</span><h1>Recursos sustentáveis</h1></div>
   <input className="search-field" value={q} onChange={e=>setQ(e.target.value)} placeholder="Pesquisar por recurso ou categoria..."/>
  </div>
  <label className="favorites-filter">
   <input type="checkbox" checked={onlyFavorites} onChange={e=>setOnlyFavorites(e.target.checked)}/>
   Mostrar somente favoritos ({favorites.length})
  </label>
  {filtered.length===0
   ? <p className="empty-state">Nenhum recurso encontrado para essa busca.</p>
   : <div className="resource-grid">{filtered.map(d=>
      <ResourceCard key={d.nome} item={d} click={setSel} isFavorite={favorites.includes(d.nome)} onToggleFavorite={toggleFavorite}/>
     )}</div>
  }
 </section></div>
 <Modal item={sel} close={()=>setSel(null)}/>
 </main>
}
