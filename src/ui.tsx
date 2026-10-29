// @ts-nocheck
import { LEVELS, level, trend } from "./legacy/data.js";

export const hvar = (c: string, p: string) => `var(--${c}-${p})`;
export const Chip = ({ s }: { s: number }) => { const l = level(s); return <span className={`chip ${l.c}`}><span className="dot" />{l.k}</span>; };
export const Curve = ({ c }: { c: string }) => <span className={`curve ${c}`} title={`Curva ${c}`}>{c}</span>;
export const SBar = ({ s }: { s: number }) => { const l = level(s); return (
  <div className="sbar"><span className="score">{s}</span><span className="track"><span className="fill" style={{ display: "block", width: `${s}%`, background: hvar(l.c, "bar") }} /></span></div>); };
export const Delta = ({ c }: { c: any }) => { const t = trend(c); return <span className={`delta ${t > 0 ? "up" : t < 0 ? "down" : "flat"}`}>{t > 0 ? "▲ +" : t < 0 ? "▼ " : "● "}{t}</span>; };
export const Status = ({ s }: { s: string }) => { const m: any = { Ativo: "ativo", "Em risco": "risco", Cancelado: "cancelado", Onboarding: "onb" }; return <span className={`status ${m[s]}`}>{s}</span>; };
export const Demo = () => <span className="demo">Dados de exemplo</span>;
export const PageHead = ({ title, sub }: { title: string; sub: string }) => <div className="page-head"><div><h1>{title}</h1><p>{sub}</p></div><Demo /></div>;
export { LEVELS };
