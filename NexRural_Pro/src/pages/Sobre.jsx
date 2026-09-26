import { Link } from "react-router-dom";
import MindMap from "../components/common/MindMap";

const ods2Branches = ["Produtividade e renda (2.3)", "Sistemas resilientes (2.4)", "Biodiversidade (2.5)", "Saberes tradicionais", "Segurança alimentar"];

const secoes = [
  { to: "/recursos", titulo: "Biblioteca de Recursos", texto: "Dez práticas sustentáveis explicadas em detalhe, com passo a passo de implementação e mapa mental dos conceitos relacionados." },
  { to: "/consulta", titulo: "Consulta Climática", texto: "Temperatura, umidade, chuva e vento em tempo real, para apoiar decisões diárias no campo." },
  { to: "/noticias", titulo: "Notícias", texto: "Atualizações do agronegócio e da sustentabilidade, direto de fontes jornalísticas públicas." },
  { to: "/contato", titulo: "Contato", texto: "Canal direto para dúvidas, parcerias e colaboração com o projeto." },
];

export default function Sobre() {
  return (
    <main className="page-shell compact-page">
      <div className="container">
        <section className="content-panel">
          <span className="eyebrow">Nossa missão</span>
          <h1>ODS 2: erradicar a fome e fortalecer a produção sustentável.</h1>
          <p>
            O NexRural nasce para apoiar agricultores e comunidades rurais com uma experiência simples,
            clara e tecnológica, conectando conhecimento, resiliência climática e produtividade de forma consciente.
          </p>
          <p>
            A agricultura familiar enfrenta, no dia a dia, desafios como o acesso limitado a informação técnica
            atualizada, a dificuldade de prever condições climáticas para o planejamento de plantio e colheita, e
            a falta de canais simples para trocar conhecimento com técnicos e outras comunidades rurais. O
            Objetivo de Desenvolvimento Sustentável 2 (ODS 2) da Agenda 2030 da ONU propõe justamente enfrentar
            essas dificuldades, promovendo sistemas alimentares mais justos, produtivos e resilientes.
          </p>

          <div className="info-grid">
            <div>
              <h3>2.3</h3>
              <p>Até 2030, dobrar a produtividade agrícola e a renda de pequenos produtores de alimentos, em especial agricultores familiares.</p>
            </div>
            <div>
              <h3>2.4</h3>
              <p>Garantir sistemas sustentáveis de produção de alimentos, com práticas agrícolas resilientes que ajudem a manter os ecossistemas.</p>
            </div>
            <div>
              <h3>2.5</h3>
              <p>Manter a diversidade genética de sementes e plantas cultivadas, além de valorizar o conhecimento tradicional das comunidades locais.</p>
            </div>
          </div>

          <h4 className="mindmap-title">Mapa mental do ODS 2</h4>
          <MindMap center="ODS 2 — Fome Zero" branches={ods2Branches} />
        </section>

        <section className="content-panel sitemap-panel">
          <span className="eyebrow">O que você encontra aqui</span>
          <h2>Um único lugar, quatro frentes de apoio</h2>
          <div className="sitemap-grid">
            {secoes.map(s => (
              <Link key={s.to} to={s.to} className="sitemap-card">
                <h3>{s.titulo}</h3>
                <p>{s.texto}</p>
                <span className="card-action-link">Acessar →</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
