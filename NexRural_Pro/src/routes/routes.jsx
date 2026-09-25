import { Routes, Route, Outlet } from "react-router-dom";
import Home from "../pages/Home";
import Sobre from "../pages/Sobre";
import Recursos from "../pages/Recursos";
import Consulta from "../pages/Consulta";
import Contato from "../pages/Contato";
import { FinanceProvider } from "../context/FinanceContext";
import ProtectedFinanceRoute from "../components/finance/ProtectedFinanceRoute";
import FinanceLogin from "../pages/finance/FinanceLogin";
import FinanceLayout from "../pages/finance/FinanceLayout";
import FinanceDashboard from "../pages/finance/FinanceDashboard";
import FinanceFuncionarios from "../pages/finance/FinanceFuncionarios";
import FinanceContas from "../pages/finance/FinanceContas";
import FinanceSeguranca from "../pages/finance/FinanceSeguranca";

export default function RoutesConfig() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/recursos" element={<Recursos />} />
      <Route path="/consulta" element={<Consulta />} />
      <Route path="/contato" element={<Contato />} />

      <Route element={<FinanceProvider><Outlet /></FinanceProvider>}>
        <Route path="/financeiro/login" element={<FinanceLogin />} />
        <Route path="/financeiro" element={<ProtectedFinanceRoute><FinanceLayout /></ProtectedFinanceRoute>}>
          <Route index element={<FinanceDashboard />} />
          <Route path="funcionarios" element={<FinanceFuncionarios />} />
          <Route path="contas" element={<FinanceContas />} />
          <Route path="seguranca" element={<FinanceSeguranca />} />
        </Route>
      </Route>
    </Routes>
  );
}
