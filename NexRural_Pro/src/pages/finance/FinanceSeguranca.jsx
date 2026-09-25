import { useRef, useState } from "react";
import { useFinance } from "../../context/FinanceContext";

export default function FinanceSeguranca() {
  const { baixarBackup, restaurarBackup, trocarSenha } = useFinance();
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [erro, setErro] = useState("");
  const inputRef = useRef(null);

  async function onTrocarSenha(e) {
    e.preventDefault();
    setErro("");
    if (novaSenha !== confirmaSenha) { setErro("A confirmação de senha não corresponde."); return; }
    try {
      await trocarSenha(senhaAtual, novaSenha);
      setSenhaAtual(""); setNovaSenha(""); setConfirmaSenha("");
    } catch (err) {
      setErro(err.message);
    }
  }

  async function onImportar(e) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    try {
      await restaurarBackup(arquivo);
    } catch {
      // erro já reportado via notificação
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="finance-section finance-security-grid">
      <div className="finance-security-card">
        <h3>Backup dos dados</h3>
        <p>Exporte periodicamente os dados de funcionários e contas para um arquivo local, garantindo que nada se perca.</p>
        <button className="primary-btn" onClick={baixarBackup}>Exportar backup (.json)</button>
        <label className="secondary-btn finance-file-label">
          Importar backup
          <input ref={inputRef} type="file" accept="application/json" onChange={onImportar} hidden />
        </label>
        <p className="finance-hint">Importar um backup substitui os dados atualmente salvos neste navegador.</p>
      </div>

      <div className="finance-security-card">
        <h3>Alterar senha</h3>
        <form className="contact-form" onSubmit={onTrocarSenha}>
          <div className="field-wrap">
            <label>Senha atual</label>
            <input type="password" value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)} />
          </div>
          <div className="field-wrap">
            <label>Nova senha</label>
            <input type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} />
          </div>
          <div className="field-wrap">
            <label>Confirmar nova senha</label>
            <input type="password" value={confirmaSenha} onChange={e => setConfirmaSenha(e.target.value)} />
          </div>
          {erro && <span className="field-error">{erro}</span>}
          <button className="primary-btn" type="submit">Salvar nova senha</button>
        </form>
      </div>
    </div>
  );
}
