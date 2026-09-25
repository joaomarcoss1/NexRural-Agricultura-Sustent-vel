import {useState} from "react";
import {validate} from "../utils/validators";

const fields=[
 {name:"nome",label:"Nome",type:"input"},
 {name:"email",label:"E-mail",type:"input"},
 {name:"mensagem",label:"Mensagem",type:"textarea"},
];

export default function Contato(){
 const [v,setV]=useState({nome:"",email:"",mensagem:""});
 const [m,setM]=useState("");

 function handleSubmit(e){
  e.preventDefault();
  if(validate(v)){
   setM("Mensagem enviada com sucesso.");
   setV({nome:"",email:"",mensagem:""});
  }else{
   setM("Verifique os campos preenchidos: nome, e-mail válido e mensagem com pelo menos 10 caracteres.");
  }
 }

 return <main className="page-shell compact-page"><div className="container"><section className="contact-shell">
  <div className="contact-copy">
   <span className="eyebrow">Fale com a gente</span>
   <h1>Conecte ideias, pessoas e práticas sustentáveis.</h1>
   <p>Quer apoiar projetos rurais, trocar conhecimento ou colaborar com o NexRural? Escreva para a gente.</p>
  </div>
  <form className="contact-form" onSubmit={handleSubmit} noValidate>
   {fields.map(f=><div key={f.name} className="field-wrap">
    <label htmlFor={`campo-${f.name}`}>{f.label}</label>
    {f.type==="textarea"
     ? <textarea id={`campo-${f.name}`} rows="5" value={v[f.name]} onChange={e=>setV({...v,[f.name]:e.target.value})}/>
     : <input id={`campo-${f.name}`} value={v[f.name]} onChange={e=>setV({...v,[f.name]:e.target.value})}/>
    }
   </div>)}
   <button className="primary-btn" type="submit">Enviar mensagem</button>
  </form>
 </section>
 {m && <p className="status-message" role="status">{m}</p>}
 </div></main>
}
