import { useCallback } from "react";
import { getNews } from "../services/api";
import Loading from "../components/common/Loading";
import useFetch from "../hooks/useFetch";

function stripHtml(html) {
  return (html ?? "").replace(/<[^>]+>/g, "").trim();
}

export default function Noticias() {
  const fetchNews = useCallback(() => getNews(), []);
  const { data, loading, error } = useFetch(fetchNews);

  return (
    <main className="page-shell compact-page">
      <div className="container">
        <section className="content-panel">
          <span className="eyebrow">Fique por dentro</span>
          <h1>Notícias do agronegócio e da sustentabilidade</h1>
          <p className="panel-lead">
            Feed atualizado automaticamente a partir de fontes públicas de jornalismo, trazendo
            contexto sobre agricultura, clima e políticas rurais relevantes para o público-alvo do NexRural.
          </p>

          {loading && <Loading />}

          {!loading && data && data.length > 0 && (
            <div className="news-grid">
              {data.map(n => (
                <a key={n.link} href={n.link} target="_blank" rel="noopener noreferrer" className="news-card">
                  {(n.thumbnail || n.enclosure?.link) && (
                    <img src={n.thumbnail || n.enclosure?.link} alt="" className="news-thumb" />
                  )}
                  <div className="news-body">
                    {n.pubDate && (
                      <span className="news-date">
                        {new Date(n.pubDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    )}
                    <h3>{n.title}</h3>
                    <p>{stripHtml(n.description).slice(0, 150)}{stripHtml(n.description).length > 150 ? "…" : ""}</p>
                  </div>
                </a>
              ))}
            </div>
          )}

          {!loading && (error || !data || data.length === 0) && (
            <p className="empty-state">
              Não foi possível carregar as notícias no momento. Verifique sua conexão e tente novamente mais tarde.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
