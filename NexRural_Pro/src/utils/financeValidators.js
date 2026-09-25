// Validações do módulo financeiro. Mitiga o risco apontado no relatório
// de qualidade: "ausência de validação de campos obrigatórios".

export function isCPFValido(cpfBruto) {
  const cpf = String(cpfBruto || "").replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += Number(cpf[i]) * (10 - i);
  let resto = 11 - (soma % 11);
  if (resto >= 10) resto = 0;
  if (resto !== Number(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += Number(cpf[i]) * (11 - i);
  resto = 11 - (soma % 11);
  if (resto >= 10) resto = 0;
  return resto === Number(cpf[10]);
}

export function validarFuncionario(f) {
  const erros = {};
  if (!f.nome?.trim()) erros.nome = "Nome é obrigatório.";
  if (!isCPFValido(f.cpf)) erros.cpf = "CPF inválido.";
  if (!f.cargo?.trim()) erros.cargo = "Cargo é obrigatório.";
  if (f.salario === "" || f.salario === null || isNaN(f.salario) || Number(f.salario) <= 0) {
    erros.salario = "Salário deve ser maior que zero.";
  }
  if (!f.telefone || f.telefone.replace(/\D/g, "").length < 10) erros.telefone = "Telefone inválido.";
  return erros;
}

export function validarConta(c) {
  const erros = {};
  if (!c.descricao?.trim()) erros.descricao = "Descrição é obrigatória.";
  if (!c.categoria) erros.categoria = "Selecione uma categoria.";
  if (c.valor === "" || c.valor === null || isNaN(c.valor) || Number(c.valor) <= 0) {
    erros.valor = "Valor deve ser maior que zero.";
  }
  if (!c.vencimento) erros.vencimento = "Data de vencimento é obrigatória.";
  return erros;
}

export function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatarData(iso) {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-");
  if (y && m && d) return `${d}/${m}/${y}`;
  const data = new Date(iso);
  return isNaN(data.getTime()) ? "-" : data.toLocaleDateString("pt-BR");
}
