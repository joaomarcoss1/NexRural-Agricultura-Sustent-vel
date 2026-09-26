import MindMap from "./MindMap";

export default function Modal({ item, close }) {
  if (!item) return null;
  const branches = [item.categoria, ...(item.conceitosRelacionados ?? [])];

  return (
    <div className="modal-bg" onClick={close}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={close} aria-label="Fechar">×</button>
        <div className="modal-header">
          <span className="resource-tag">{item.categoria}</span>
          <h3>{item.nome}</h3>
        </div>

        <p>{item.descricaoCompleta ?? item.descricao}</p>

        {item.comoImplementar && (
          <>
            <h4>Como implementar</h4>
            <ol className="modal-steps">
              {item.comoImplementar.map((passo, index) => (
                <li key={`${item.nome}-passo-${index}`}>{passo}</li>
              ))}
            </ol>
          </>
        )}

        <h4>Benefícios</h4>
        <ul>
          {item.beneficios.map((b, index) => (
            <li key={`${item.nome}-${index}`}>{b}</li>
          ))}
        </ul>

        {item.conceitosRelacionados && (
          <>
            <h4>Mapa mental</h4>
            <MindMap center={item.nome} branches={branches} />
          </>
        )}
      </div>
    </div>
  );
}
