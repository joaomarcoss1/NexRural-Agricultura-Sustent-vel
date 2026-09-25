import { useMemo, useState } from "react";
import { useFinance } from "../../context/FinanceContext";
import { validarConta, formatarMoeda, formatarData } from "../../utils/financeValidators";
import ConfirmDialog from "../../components/finance/ConfirmDialog";

const CATEGORIAS = ["Salário", "Fornecedor", "Aluguel", "Serviços", "Impostos", "Insumos Agrícolas", "Manutenção", "Outros"];
const VAZIO = { descricao: "", categoria: CATEGORIAS[0], valor: "", vencimento: "", observacao: "" };

export default function FinanceContas() {
  const { contas, addConta, removeConta, pagarConta } = useFinance();
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [form, setForm] = useState(null);
  const [erros, setErros] = useState({});
  const [excluir, setExcluir] = useState(null);

  const filtradas = useMemo(() => contas
    .filter(c => {
      const bate = c.descricao.toLowerCase().includes(busca.toLowerCase()) ||
        c.categoria.toLowerCase().includes(busca.toLowerCase());
      const status = filtroStatus === "Todos" || c.status === filtroStatus;
      return bate && status;
    })
    .sort((a, b) => a.vencimento.localeCompare(b.vencimento)), [contas, busca, filtroStatus]);

  function abrirNovo() { setForm({ ...VAZIO }); setErros({}); }
  function abrirEdicao(c) { setForm({ ...c }); setErros({}); }
  function fechar() { setForm(null); setErros({}); }

  function salvar(e) {
    e.preventDefault();
    const validacao = validarConta(form);
    if (Object.keys(validacao).length > 0) { setErros(validacao); return; }
    try {
      addConta({ ...form, valor: Number(form.valor), status: form.status || "Pendente" });
      fechar();
    } catch {
      // erro já reportado via notificação
    }
  }

  return (
    <div className="finance-section">
      <div className="search-header">
        <div>
          <span className="eyebrow">Contas a pagar</span>
          <h2>Contas</h2>
        </div>
        <div className="finance-actions-row">
          <select className="search-field finance-select" value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
            <option value="Todos">Todos os status</option>
            <option value="Pendente">Pendentes</option>
            <option value="Pago">Pagas</option>
          </select>
          <input
            className="search-field"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Pesquisar por descrição ou categoria..."
          />
          <button className="primary-btn" onClick={abrirNovo}>+ Nova conta</button>
        </div>
      </div>

      {filtradas.length === 0 ? (
        <p className="empty-state">Nenhuma conta encontrada.</p>
      ) : (
        <table className="finance-table">
          <thead>
            <tr><th>Descrição</th><th>Categoria</th><th>Valor</th><th>Vencimento</th><th>Status</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {filtradas.map(c => (
              <tr key={c.id}>
                <td>{c.descricao}</td>
                <td>{c.categoria}</td>
                <td>{formatarMoeda(c.valor)}</td>
                <td>{formatarData(c.vencimento)}</td>
                <td><span className={`finance-badge finance-badge-${c.status === "Pago" ? "pago" : "pendente"}`}>{c.status}</span></td>
                <td className="finance-row-actions">
                  {c.status === "Pendente" && <button className="card-action" onClick={() => pagarConta(c.id)}>Marcar como pago</button>}
                  <button className="card-action" onClick={() => abrirEdicao(c)}>Editar</button>
                  <button className="danger-btn" onClick={() => setExcluir(c)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {form && (
        <div className="modal-bg" onClick={fechar}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={fechar}>×</button>
            <div className="modal-header"><h3>{form.id ? "Editar conta" : "Nova conta"}</h3></div>
            <form className="contact-form" onSubmit={salvar}>
              <div className="field-wrap">
                <label>Descrição</label>
                <input value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
                {erros.descricao && <span className="field-error">{erros.descricao}</span>}
              </div>
              <div className="field-wrap">
                <label>Categoria</label>
                <select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
                  {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {erros.categoria && <span className="field-error">{erros.categoria}</span>}
              </div>
              <div className="field-wrap">
                <label>Valor (R$)</label>
                <input type="number" step="0.01" min="0" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} />
                {erros.valor && <span className="field-error">{erros.valor}</span>}
              </div>
              <div className="field-wrap">
                <label>Vencimento</label>
                <input type="date" value={form.vencimento} onChange={e => setForm({ ...form, vencimento: e.target.value })} />
                {erros.vencimento && <span className="field-error">{erros.vencimento}</span>}
              </div>
              <div className="field-wrap">
                <label>Observação (opcional)</label>
                <textarea rows="3" value={form.observacao} onChange={e => setForm({ ...form, observacao: e.target.value })} />
              </div>
              <button className="primary-btn" type="submit">Salvar</button>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!excluir}
        title="Excluir conta"
        message={excluir ? `Tem certeza que deseja excluir "${excluir.descricao}"? Esta ação não pode ser desfeita.` : ""}
        onCancel={() => setExcluir(null)}
        onConfirm={() => { removeConta(excluir.id); setExcluir(null); }}
      />
    </div>
  );
}
