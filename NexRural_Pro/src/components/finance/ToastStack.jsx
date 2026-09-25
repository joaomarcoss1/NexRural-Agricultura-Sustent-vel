import { useFinance } from "../../context/FinanceContext";

export default function ToastStack() {
  const { toasts } = useFinance();
  if (!toasts.length) return null;
  return (
    <div className="toast-stack">
      {toasts.map(t => (
        <div key={t.id} className={`toast-item toast-${t.tipo}`}>{t.mensagem}</div>
      ))}
    </div>
  );
}
