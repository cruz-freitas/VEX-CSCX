// @ts-nocheck
import { Link } from "react-router-dom";
import { CURVES, LEVELS, clients, level, tasks, tickets, last90, brl, n } from "../legacy/data.js";
import { Curve, PageHead, Chip, SBar, hvar } from "../ui";

export default function Visao() {
  const a = clients.filter((c) => c.status !== "Cancelado");
  const mrr = a.reduce((s, c) => s + c.mrr, 0);
  const avg = Math.round(a.reduce((s, c) => s + c.score, 0) / a.length);
  const risco = a.filter((c) => c.score < 45);
  const kpis = [
    ["Clientes ativos", n(a.length), `+${a.filter((c) => c.status === "Onboarding").length} em onboarding`],
    ["Receita mensal da carteira", brl(mrr), "MRR dos clientes ativos"],
    ["Health score médio", String(avg), level(avg).k],
    ["Clientes em risco", n(risco.length), `${brl(risco.reduce((s, c) => s + c.mrr, 0))} de MRR exposto`],
    ["Atendimentos de suporte", n(tickets.filter(last90).length), "Últimos 90 dias"],
    ["Tarefas abertas", n(tasks.filter((t) => t.status !== "Concluída").length), "Enviadas ao Runrun.it"],
  ];
  const atencao = [...risco].sort((x, y) => x.score - y.score).slice(0, 6);

  return (
    <>
      <PageHead title="Saúde da carteira" sub="Como estão os clientes do VEX hoje, do onboarding até a saída." />
      <div className="kpis">
        {kpis.map(([l, v, s]) => (
          <div key={l} className="card kpi"><div><p className="kpi-label">{l}</p><p className="kpi-value">{v}</p><p className="kpi-sub">{s}</p></div></div>
        ))}
      </div>
      <div className="grid-2">
        <section className="card">
          <div className="panel-head">Curva ABC × saúde<span className="hint">Clique numa célula para ver os clientes</span></div>
          <div className="panel-body"><div className="matrix"><table>
            <thead><tr><th className="row">Curva</th>{LEVELS.map((l) => <th key={l.k}>{l.k}</th>)}</tr></thead>
            <tbody>{CURVES.map((cv) => (
              <tr key={cv}><th className="row"><Curve c={cv} /></th>
                {LEVELS.map((l) => {
                  const cnt = a.filter((c) => c.curva === cv && level(c.score).k === l.k).length;
                  const st = cnt ? { background: hvar(l.c, "bg"), color: hvar(l.c, "fg") } : undefined;
                  return <td key={l.k}><Link className={`mcell${cnt ? " has" : ""}`} style={st} to={`/carteira?curva=${cv}&saude=${encodeURIComponent(l.k)}`}>{cnt || "·"}</Link></td>;
                })}
              </tr>))}
            </tbody></table></div></div>
        </section>
        <section className="card">
          <div className="panel-head">Precisam de atenção<span className="hint">Score abaixo de 45</span></div>
          <div className="tablebox"><table className="t" style={{ minWidth: 0 }}><tbody>
            {atencao.map((c) => (
              <tr key={c.id}><td><div className="cname">{c.nome}</div><div className="ctok">{c.segmento}</div></td><td><Curve c={c.curva} /></td><td><SBar s={c.score} /></td><td><Chip s={c.score} /></td></tr>
            ))}
          </tbody></table></div>
        </section>
      </div>
    </>
  );
}
