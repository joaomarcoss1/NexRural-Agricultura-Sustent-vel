import { NavLink } from "react-router-dom";
import { useFinance } from "../../context/FinanceContext";

const LINKS = [
  { to: "/financeiro", label: "Dashboard", end: true },
  { to: "/financeiro/funcionarios", label: "Funcionários" },
  { to: "/financeiro/contas", label: "Contas a Pagar" },
  { to: "/financeiro/seguranca", label: "Backup e Segurança" },
];

export default function FinanceNav() {
  const { user, logout } = useFinance();
  return (
    <div className="finance-subnav">
      <div className="finance-subnav-links">
        {LINKS.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => `finance-tab${isActive ? " active" : ""}`}
          >
            {l.label}
          </NavLink>
        ))}
      </div>
      <div className="finance-user">
        <span>Olá, <strong>{user?.usuario}</strong></span>
        <button className="secondary-btn" onClick={logout}>Sair</button>
      </div>
    </div>
  );
}
