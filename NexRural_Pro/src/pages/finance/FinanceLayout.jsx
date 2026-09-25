import { Outlet } from "react-router-dom";
import FinanceNav from "../../components/finance/FinanceNav";
import ToastStack from "../../components/finance/ToastStack";

export default function FinanceLayout() {
  return (
    <main className="page-shell compact-page">
      <div className="container">
        <section className="content-panel finance-shell">
          <div className="finance-header">
            <span className="eyebrow">Gestão financeira</span>
            <h1>Sistema de Controle Financeiro</h1>
            <p>Gerencie funcionários, contas a pagar e acompanhe os indicadores financeiros da sua organização.</p>
          </div>
          <FinanceNav />
          <div className="finance-content">
            <Outlet />
          </div>
        </section>
      </div>
      <ToastStack />
    </main>
  );
}
