import { Navigate } from "react-router-dom";
import { useFinance } from "../../context/FinanceContext";

export default function ProtectedFinanceRoute({ children }) {
  const { user, authReady } = useFinance();

  if (!authReady) {
    return (
      <main className="page-shell compact-page">
        <div className="container">
          <p className="empty-state">Carregando...</p>
        </div>
      </main>
    );
  }

  if (!user) return <Navigate to="/financeiro/login" replace />;

  return children;
}
