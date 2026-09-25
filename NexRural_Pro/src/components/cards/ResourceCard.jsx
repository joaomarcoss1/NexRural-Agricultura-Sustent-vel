export default function ResourceCard({item,click,isFavorite,onToggleFavorite}){
 return <div className="resource-card" onClick={()=>click(item)}>
  <button
   type="button"
   className={"favorite-btn"+(isFavorite?" is-active":"")}
   aria-pressed={isFavorite}
   aria-label={isFavorite?`Remover ${item.nome} dos favoritos`:`Adicionar ${item.nome} aos favoritos`}
   onClick={e=>{e.stopPropagation();onToggleFavorite(item.nome);}}
  >{isFavorite?"★":"☆"}</button>
  <div className="resource-icon">🌱</div>
  <span className="resource-tag">{item.categoria}</span>
  <h4>{item.nome}</h4>
  <p>{item.descricao}</p>
  <button type="button" className="card-action">Ver detalhes</button>
 </div>
}
