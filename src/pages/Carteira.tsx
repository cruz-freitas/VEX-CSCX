// @ts-nocheck
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CSM, CURVES, LEVELS, clients, level, trend, brl, fmtD } from "../legacy/data.js";
import { Chip, Curve, Delta, PageHead, SBar, Status } from "../ui";

const sorters: any = { score: (c) => c.score, nome: (c) => c.nome, mrr: (c) => c.mrr, curva: (c) => c.curva, tend: (c) => trend(c), entrada: (c) => +c.entrada };

function Sel({ label, v, set, opts, all }: any) {
  return (
    <div className="field"><label>{label}</label>
      <select className="input" value={v} onChange={(e) => set(e.target.value)}><option value="">{all}</option>{opts.map((o: string) => <option key={o}>{o}</option>)}</select>
    </div>
  );
}

export default function Carteira() {
  const [sp] = useSearchParams();
  const [f, setF] = useState({ q: "", curva: sp.get("curva") ?? "", saude: sp.get("saude") ?? "", status: "", csm: "" });
  const [sort, setSort] = useState({ k: "score", d: 1 });
  const up = (p: any) => setF((x) => ({ ...x, ...p }));

  const list = useMemo(() => {
    const l = clients.filter((c) =>
      (!f.q || (c.nome + " " + c.token).toLowerCase().includes(f.q.toLowerCase())) &&
      (!f.curva || c.curva === f.curva) && (!f.saude || level(c.score).k === f.saude) &&
      (!f.status || c.status === f.status) && (!f.csm || c.csm === f.csm));
    const key = sorters[sort.k];
    return l.sort((a, b) => (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0) * sort.d);
  }, [f, sort]);

  const Th = ({ k, children }: any) => (
    <th className="sortable" onClick={() => setSort((s) => ({ k, d: s.k === k ? -s.d : 1 }))}>{children}{sort.k === k ? (sort.d > 0 ? " ↑" : " ↓") : ""}</th>
  );

  return (
    <>
      <PageHead title="Carteira de clientes" sub={`${list.length} de ${clients.length} clientes.`} />
      <section className="card"><div className="filters">
        <div className="field f-search"><label>Buscar</label><input className="input" placeholder="Digite o nome ou o token da empresa" value={f.q} onChange={(e) => up({ q: e.target.value })} /></div>
        <Sel label="Curva" v={f.curva} set={(v: string) => up({ curva: v })} opts={CURVES} all="Todas" />
        <Sel label="Saúde" v={f.saude} set={(v: string) => up({ saude: v })} opts={LEVELS.map((l) => l.k)} all="Todas" />
        <Sel label="Status" v={f.status} set={(v: string) => up({ status: v })} opts={["Onboarding", "Ativo", "Em risco", "Cancelado"]} all="Todos" />
        <Sel label="CS responsável" v={f.csm} set={(v: string) => up({ csm: v })} opts={CSM} all="Todos" />
      </div></section>
      <section className="card"><div className="tablebox"><table className="t">
        <thead><tr><Th k="nome">Cliente</Th><Th k="curva">Curva</Th><Th k="score">Health score</Th><th>Faixa</th><Th k="tend">Tendência</Th><Th k="mrr">MRR</Th><th>Status</th><Th k="entrada">Cliente desde</Th><th>CS</th></tr></thead>
        <tbody>
          {list.map((c) => (
            <tr key={c.id}>
              <td><div className="cname">{c.nome}</div><div className="ctok">Token {c.token} · {c.segmento}</div></td>
              <td><Curve c={c.curva} /></td><td><SBar s={c.score} /></td><td><Chip s={c.score} /></td><td><Delta c={c} /></td>
              <td>{brl(c.mrr)}</td><td><Status s={c.status} /></td><td>{fmtD(c.entrada)}</td><td>{c.csm}</td>
            </tr>
          ))}
          {!list.length && <tr><td colSpan={9} className="empty">Nenhum cliente com esses filtros.</td></tr>}
        </tbody></table></div></section>
    </>
  );
}
