import { useMemo } from "react";
import { useFinance } from "../../context/FinanceContext";
import { formatarMoeda, formatarData } from "../../utils/financeValidators";

export default function FinanceDashboard() {
  const { contas, funcionarios } = useFinance();

  const indicadores = useMemo(() => {
    const pendentes = contas.filter(c => c.status === "Pendente");
    const pagas = contas.filter(c => c.status === "Pago");
    const totalPendente = pendentes.reduce((s, c) => s + Number(c.valor), 0);
    const totalPago = pagas.reduce((s, c) => s + Number(c.valor), 0);
    const totalGeral = totalPendente + totalPago;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const em7dias = new Date(hoje);
    em7dias.setDate(hoje.getDate() + 7);

    const vencendo = pendentes
      .filter(c => {
        const venc = new Date(`${c.vencimento}T00:00:00`);
        return venc >= hoje && venc <= em7dias;
      })
      .sort((a, b) => a.vencimento.localeCompare(b.vencimento));

    const folhaSalarial = funcionarios.reduce((s, f) => s + Number(f.salario || 0), 0);

    return { pendentes, pagas, totalPendente, totalPago, totalGeral, vencendo, folhaSalarial };
  }, [contas, funcionarios]);

  const percentualPago = indicadores.totalGeral > 0
    ? Math.round((indicadores.totalPago / indicadores.totalGeral) * 100)
    : 0;

  return (
    <div className="finance-dashboard">
      <div className="finance-stats-grid">
        <div className="finance-stat-card">
          <span>Contas pendentes</span>
          <strong>{indicadores.pendentes.length}</strong>
          <small>{formatarMoeda(indicadores.totalPendente)}</small>
        </div>
        <div className="finance-stat-card">
          <span>Contas pagas</span>
          <strong>{indicadores.pagas.length}</strong>
          <small>{formatarMoeda(indicadores.totalPago)}</small>
        </div>
        <div className="finance-stat-card">
          <span>Valor total</span>
          <strong>{formatarMoeda(indicadores.totalGeral)}</strong>
          <small>{contas.length} conta(s) cadastrada(s)</small>
        </div>
        <div className="finance-stat-card">
          <span>Folha salarial</span>
          <strong>{formatarMoeda(indicadores.folhaSalarial)}</strong>
          <small>{funcionarios.length} funcionário(s)</small>
        </div>
      </div>

      <div className="finance-progress-block">
        <div className="finance-progress-label">
          <span>Pago vs. total</span>
          <span>{percentualPago}%</span>
        </div>
        <div className="finance-progress-bar">
          <div className="finance-progress-fill" style={{ width: `${percentualPago}%` }} />
        </div>
      </div>

      <div className="finance-due-block">
        <h3>Vencimentos nos próximos 7 dias</h3>
        {indicadores.vencendo.length === 0 ? (
          <p className="empty-state">Nenhuma conta vencendo nos próximos 7 dias.</p>
        ) : (
          <table className="finance-table">
            <thead>
              <tr><th>Descrição</th><th>Categoria</th><th>Valor</th><th>Vencimento</th></tr>
            </thead>
            <tbody>
              {indicadores.vencendo.map(c => (
                <tr key={c.id}>
                  <td>{c.descricao}</td>
                  <td>{c.categoria}</td>
                  <td>{formatarMoeda(c.valor)}</td>
                  <td>{formatarData(c.vencimento)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
