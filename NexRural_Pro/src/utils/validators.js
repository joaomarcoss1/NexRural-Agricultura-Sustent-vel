export function validate(values){
 if(!values.nome || !values.email || values.mensagem.length<10)return false;
 return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
}