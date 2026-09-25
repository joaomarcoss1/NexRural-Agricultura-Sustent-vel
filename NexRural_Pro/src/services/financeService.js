// Camada de persistência (DAO) do módulo financeiro.
// Isola o acesso ao localStorage do restante da aplicação e concentra
// o tratamento de exceções recomendado no relatório de qualidade
// (try/catch em todas as operações de acesso a dados, com log de erros).

const KEY_USUARIOS = "nexrural_fin_usuarios";
const KEY_FUNCIONARIOS = "nexrural_fin_funcionarios";
const KEY_CONTAS = "nexrural_fin_contas";
const KEY_SESSION = "nexrural_fin_session";

function readCollection(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error(`Erro ao ler dados de "${key}":`, err);
    return [];
  }
}

function writeCollection(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Erro ao salvar dados de "${key}":`, err);
    throw new Error("Não foi possível salvar os dados. Verifique o espaço de armazenamento do navegador.");
  }
}

function nextId(list) {
  return list.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

// --- Hash de senha (SHA-256 + salt via Web Crypto API) ---
// Aplicado conforme recomendação do relatório de nunca armazenar senha em
// texto simples. Como a aplicação é uma SPA estática sem backend, este é
// um reforço no nível do cliente; um ambiente de produção real deveria
// autenticar contra um servidor.

async function sha256Hex(texto) {
  const dados = new TextEncoder().encode(texto);
  const buffer = await crypto.subtle.digest("SHA-256", dados);
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function gerarSaltHex(tamanho = 16) {
  const arr = new Uint8Array(tamanho);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function hashSenha(senha, salt) {
  return sha256Hex(`${salt}:${senha}`);
}

// --- Autenticação ---

export async function ensureSeedAdmin() {
  const usuarios = readCollection(KEY_USUARIOS);
  if (usuarios.length === 0) {
    const salt = gerarSaltHex();
    const senhaHash = await hashSenha("admin123", salt);
    usuarios.push({
      id: 1,
      usuario: "admin",
      salt,
      senhaHash,
      perfil: "admin",
      criadoEm: new Date().toISOString(),
    });
    writeCollection(KEY_USUARIOS, usuarios);
  }
}

export async function autenticar(usuario, senha) {
  if (!usuario?.trim() || !senha) throw new Error("Informe usuário e senha.");
  const usuarios = readCollection(KEY_USUARIOS);
  const encontrado = usuarios.find(u => u.usuario.toLowerCase() === usuario.trim().toLowerCase());
  if (!encontrado) throw new Error("Usuário ou senha inválidos.");
  const hash = await hashSenha(senha, encontrado.salt);
  if (hash !== encontrado.senhaHash) throw new Error("Usuário ou senha inválidos.");
  const sessao = { id: encontrado.id, usuario: encontrado.usuario, perfil: encontrado.perfil };
  try {
    localStorage.setItem(KEY_SESSION, JSON.stringify(sessao));
  } catch (err) {
    console.error("Erro ao salvar sessão:", err);
  }
  return sessao;
}

export function obterSessao() {
  try {
    const raw = localStorage.getItem(KEY_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error("Erro ao ler sessão:", err);
    return null;
  }
}

export function encerrarSessao() {
  try {
    localStorage.removeItem(KEY_SESSION);
  } catch (err) {
    console.error("Erro ao encerrar sessão:", err);
  }
}

export async function alterarSenha(usuarioId, senhaAtual, novaSenha) {
  const usuarios = readCollection(KEY_USUARIOS);
  const idx = usuarios.findIndex(u => u.id === usuarioId);
  if (idx === -1) throw new Error("Usuário não encontrado.");
  const hashAtual = await hashSenha(senhaAtual, usuarios[idx].salt);
  if (hashAtual !== usuarios[idx].senhaHash) throw new Error("Senha atual incorreta.");
  if (!novaSenha || novaSenha.length < 6) throw new Error("A nova senha deve ter ao menos 6 caracteres.");
  const salt = gerarSaltHex();
  usuarios[idx] = { ...usuarios[idx], salt, senhaHash: await hashSenha(novaSenha, salt) };
  writeCollection(KEY_USUARIOS, usuarios);
}

// --- Funcionários ---

export function listarFuncionarios() {
  return readCollection(KEY_FUNCIONARIOS).sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

export function salvarFuncionario(dados) {
  const funcionarios = readCollection(KEY_FUNCIONARIOS);
  if (dados.id) {
    const idx = funcionarios.findIndex(f => f.id === dados.id);
    if (idx === -1) throw new Error("Funcionário não encontrado.");
    funcionarios[idx] = { ...funcionarios[idx], ...dados };
  } else {
    funcionarios.push({ ...dados, id: nextId(funcionarios), dataCadastro: new Date().toISOString() });
  }
  writeCollection(KEY_FUNCIONARIOS, funcionarios);
  return listarFuncionarios();
}

export function excluirFuncionario(id) {
  const funcionarios = readCollection(KEY_FUNCIONARIOS).filter(f => f.id !== id);
  writeCollection(KEY_FUNCIONARIOS, funcionarios);
  return listarFuncionarios();
}

// --- Contas a pagar ---

export function listarContas() {
  return readCollection(KEY_CONTAS);
}

export function salvarConta(dados) {
  const contas = readCollection(KEY_CONTAS);
  if (dados.id) {
    const idx = contas.findIndex(c => c.id === dados.id);
    if (idx === -1) throw new Error("Conta não encontrada.");
    contas[idx] = { ...contas[idx], ...dados };
  } else {
    contas.push({
      ...dados,
      id: nextId(contas),
      status: dados.status || "Pendente",
      dataCadastro: new Date().toISOString(),
    });
  }
  writeCollection(KEY_CONTAS, contas);
  return listarContas();
}

export function excluirConta(id) {
  const contas = readCollection(KEY_CONTAS).filter(c => c.id !== id);
  writeCollection(KEY_CONTAS, contas);
  return listarContas();
}

export function marcarComoPago(id) {
  const contas = readCollection(KEY_CONTAS);
  const idx = contas.findIndex(c => c.id === id);
  if (idx === -1) throw new Error("Conta não encontrada.");
  contas[idx] = { ...contas[idx], status: "Pago", dataPagamento: new Date().toISOString() };
  writeCollection(KEY_CONTAS, contas);
  return listarContas();
}

// --- Backup (mitiga o risco de ausência de backup automático) ---

export function exportarBackup() {
  const conteudo = {
    versao: 1,
    exportadoEm: new Date().toISOString(),
    usuarios: readCollection(KEY_USUARIOS),
    funcionarios: readCollection(KEY_FUNCIONARIOS),
    contas: readCollection(KEY_CONTAS),
  };
  return JSON.stringify(conteudo, null, 2);
}

export function importarBackup(jsonTexto) {
  let dados;
  try {
    dados = JSON.parse(jsonTexto);
  } catch (err) {
    console.error("Erro ao interpretar arquivo de backup:", err);
    throw new Error("Arquivo inválido: não é um JSON válido.");
  }
  if (!dados || typeof dados !== "object") throw new Error("Arquivo de backup inválido.");
  if (!Array.isArray(dados.usuarios) || !Array.isArray(dados.funcionarios) || !Array.isArray(dados.contas)) {
    throw new Error("Arquivo de backup incompleto ou corrompido.");
  }
  writeCollection(KEY_USUARIOS, dados.usuarios);
  writeCollection(KEY_FUNCIONARIOS, dados.funcionarios);
  writeCollection(KEY_CONTAS, dados.contas);
}
