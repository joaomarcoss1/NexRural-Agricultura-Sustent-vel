import { useMemo, useState } from "react";
import { useFinance } from "../../context/FinanceContext";
import { validarFuncionario, formatarMoeda } from "../../utils/financeValidators";
import ConfirmDialog from "../../components/finance/ConfirmDialog";

const VAZIO = { nome: "", cpf: "", cargo: "", salario: "", telefone: "" };

export default function FinanceFuncionarios() {
  const { funcionarios, addFuncionario, removeFuncionario } = useFinance();
  const [busca, setBusca] = useState("");
  const [form, setForm] = useState(null);
  const [erros, setErros] = useState({});
  const [excluir, setExcluir] = useState(null);

  const filtrados = useMemo(() => funcionarios.filter(f =>
    f.nome.toLowerCase().includes(busca.toLowerCase()) ||
    f.cargo.toLowerCase().includes(busca.toLowerCase())
  ), [funcionarios, busca]);

  function abrirNovo() { setForm({ ...VAZIO }); setErros({}); }
  function abrirEdicao(f) { setForm({ ...f }); setErros({}); }
  function fechar() { setForm(null); setErros({}); }

  function salvar(e) {
    e.preventDefault();
    const validacao = validarFuncionario(form);
    if (Object.keys(validacao).length > 0) { setErros(validacao); return; }
    try {
      addFuncionario({ ...form, salario: Number(form.salario) });
      fechar();
    } catch {
      // erro já reportado via notificação
    }
  }

  return (
    <div className="finance-section">
      <div className="search-header">
        <div>
          <span className="eyebrow">Equipe</span>
          <h2>Funcionários</h2>
        </div>
        <div className="finance-actions-row">
          <input
            className="search-field"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Pesquisar por nome ou cargo..."
          />
          <button className="primary-btn" onClick={abrirNovo}>+ Novo funcionário</button>
        </div>
      </div>

      {filtrados.length === 0 ? (
        <p className="empty-state">Nenhum funcionário encontrado.</p>
      ) : (
        <table className="finance-table">
          <thead>
            <tr><th>Nome</th><th>CPF</th><th>Cargo</th><th>Salário</th><th>Telefone</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {filtrados.map(f => (
              <tr key={f.id}>
                <td>{f.nome}</td>
                <td>{f.cpf}</td>
                <td>{f.cargo}</td>
                <td>{formatarMoeda(f.salario)}</td>
                <td>{f.telefone}</td>
                <td className="finance-row-actions">
                  <button className="card-action" onClick={() => abrirEdicao(f)}>Editar</button>
                  <button className="danger-btn" onClick={() => setExcluir(f)}>Excluir</button>
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
            <div className="modal-header"><h3>{form.id ? "Editar funcionário" : "Novo funcionário"}</h3></div>
            <form className="contact-form" onSubmit={salvar}>
              <div className="field-wrap">
                <label>Nome completo</label>
                <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
                {erros.nome && <span className="field-error">{erros.nome}</span>}
              </div>
              <div className="field-wrap">
                <label>CPF</label>
                <input value={form.cpf} onChange={e => setForm({ ...form, cpf: e.target.value })} placeholder="000.000.000-00" />
                {erros.cpf && <span className="field-error">{erros.cpf}</span>}
              </div>
              <div className="field-wrap">
                <label>Cargo</label>
                <input value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })} />
                {erros.cargo && <span className="field-error">{erros.cargo}</span>}
              </div>
              <div className="field-wrap">
                <label>Salário (R$)</label>
                <input type="number" step="0.01" min="0" value={form.salario} onChange={e => setForm({ ...form, salario: e.target.value })} />
                {erros.salario && <span className="field-error">{erros.salario}</span>}
              </div>
              <div className="field-wrap">
                <label>Telefone</label>
                <input value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} placeholder="(00) 00000-0000" />
                {erros.telefone && <span className="field-error">{erros.telefone}</span>}
              </div>
              <button className="primary-btn" type="submit">Salvar</button>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!excluir}
        title="Excluir funcionário"
        message={excluir ? `Tem certeza que deseja excluir ${excluir.nome}? Esta ação não pode ser desfeita.` : ""}
        onCancel={() => setExcluir(null)}
        onConfirm={() => { removeFuncionario(excluir.id); setExcluir(null); }}
      />
    </div>
  );
}
