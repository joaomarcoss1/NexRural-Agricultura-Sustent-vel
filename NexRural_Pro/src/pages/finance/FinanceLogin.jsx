import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFinance } from "../../context/FinanceContext";
import ToastStack from "../../components/finance/ToastStack";

export default function FinanceLogin() {
  const { login, user } = useFinance();
  const navigate = useNavigate();
  const [form, setForm] = useState({ usuario: "", senha: "" });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (user) navigate("/financeiro", { replace: true });
  }, [user, navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      await login(form.usuario, form.senha);
      navigate("/financeiro", { replace: true });
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="page-shell compact-page">
      <div className="container">
        <section className="content-panel finance-login">
          <span className="eyebrow">Acesso restrito</span>
          <h1>Sistema de Controle Financeiro</h1>
          <p>Entre com suas credenciais para gerenciar funcionários e contas a pagar.</p>
          <form className="contact-form finance-login-form" onSubmit={onSubmit}>
            <div className="field-wrap">
              <label>Usuário</label>
              <input value={form.usuario} onChange={e => setForm({ ...form, usuario: e.target.value })} autoFocus />
            </div>
            <div className="field-wrap">
              <label>Senha</label>
              <input type="password" value={form.senha} onChange={e => setForm({ ...form, senha: e.target.value })} />
            </div>
            {erro && <span className="field-error">{erro}</span>}
            <button className="primary-btn" type="submit" disabled={carregando}>
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>
          <p className="finance-hint">
            Primeiro acesso? Usuário padrão: <strong>admin</strong> / senha: <strong>admin123</strong>.
            Altere a senha em "Backup e Segurança" assim que entrar.
          </p>
        </section>
      </div>
      <ToastStack />
    </main>
  );
}
