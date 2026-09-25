import { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as financeService from "../services/financeService";

const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [funcionarios, setFuncionarios] = useState([]);
  const [contas, setContas] = useState([]);
  const [toasts, setToasts] = useState([]);

  const notify = useCallback((mensagem, tipo = "sucesso") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(t => [...t, { id, mensagem, tipo }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);

  const refresh = useCallback(() => {
    setFuncionarios(financeService.listarFuncionarios());
    setContas(financeService.listarContas());
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await financeService.ensureSeedAdmin();
        const sessao = financeService.obterSessao();
        if (sessao) setUser(sessao);
        refresh();
      } catch (err) {
        console.error("Erro ao inicializar módulo financeiro:", err);
      } finally {
        setAuthReady(true);
      }
    })();
  }, [refresh]);

  async function login(usuario, senha) {
    const sessao = await financeService.autenticar(usuario, senha);
    setUser(sessao);
    refresh();
    return sessao;
  }

  function logout() {
    financeService.encerrarSessao();
    setUser(null);
    notify("Sessão encerrada.", "info");
  }

  function addFuncionario(dados) {
    try {
      const lista = financeService.salvarFuncionario(dados);
      setFuncionarios(lista);
      notify(dados.id ? "Funcionário atualizado com sucesso." : "Funcionário cadastrado com sucesso.");
    } catch (err) {
      notify(err.message, "erro");
      throw err;
    }
  }

  function removeFuncionario(id) {
    try {
      const lista = financeService.excluirFuncionario(id);
      setFuncionarios(lista);
      notify("Funcionário removido.");
    } catch (err) {
      notify(err.message, "erro");
    }
  }

  function addConta(dados) {
    try {
      const lista = financeService.salvarConta(dados);
      setContas(lista);
      notify(dados.id ? "Conta atualizada com sucesso." : "Conta cadastrada com sucesso.");
    } catch (err) {
      notify(err.message, "erro");
      throw err;
    }
  }

  function removeConta(id) {
    try {
      const lista = financeService.excluirConta(id);
      setContas(lista);
      notify("Conta removida.");
    } catch (err) {
      notify(err.message, "erro");
    }
  }

  function pagarConta(id) {
    try {
      const lista = financeService.marcarComoPago(id);
      setContas(lista);
      notify("Conta marcada como paga.");
    } catch (err) {
      notify(err.message, "erro");
    }
  }

  async function trocarSenha(senhaAtual, novaSenha) {
    try {
      await financeService.alterarSenha(user.id, senhaAtual, novaSenha);
      notify("Senha alterada com sucesso.");
    } catch (err) {
      notify(err.message, "erro");
      throw err;
    }
  }

  function baixarBackup() {
    try {
      const json = financeService.exportarBackup();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nexrural-financeiro-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      notify("Backup exportado com sucesso.");
    } catch (err) {
      notify(err.message, "erro");
    }
  }

  async function restaurarBackup(arquivo) {
    try {
      const texto = await arquivo.text();
      financeService.importarBackup(texto);
      refresh();
      notify("Backup restaurado com sucesso.");
    } catch (err) {
      notify(err.message, "erro");
      throw err;
    }
  }

  const value = {
    user, authReady, login, logout,
    funcionarios, contas,
    addFuncionario, removeFuncionario,
    addConta, removeConta, pagarConta,
    trocarSenha, baixarBackup, restaurarBackup,
    notify, toasts,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  return useContext(FinanceContext);
}
