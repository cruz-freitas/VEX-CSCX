import { NavLink, Route, Routes } from "react-router-dom";
import Visao from "./pages/Visao";
import Carteira from "./pages/Carteira";
import EmBreve from "./pages/EmBreve";

const nav = [
  ["/", "Visão geral"], ["/carteira", "Carteira de clientes"], ["/cliente", "Cliente 360"], ["/tarefas", "Tarefas de relacionamento"],
  ["/mudancas", "Mudanças de faixa"], ["/playbooks", "Playbooks"], ["/suporte", "Histórico de suporte"], ["/logs", "Logs de alterações"], ["/regras", "Regras e pesos"],
];

export default function App() {
  return (
    <>
      <header className="topbar">
        <div className="brand"><img className="logo logo-light" alt="VEXSOFT" src="/logo.png" /><span className="product">Customer Success</span></div>
        <div className="identity"><div className="who"><p>Marlon Vinicius</p><p className="small muted">Inovaclick · CS</p></div><span className="avatar">MV</span></div>
      </header>
      <div className="shell">
        <nav className="sidebar" aria-label="Navegação">
          {nav.map(([to, label]) => <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `nav${isActive ? " active" : ""}`}>{label}</NavLink>)}
          <div className="side-foot"><b>Fonte dos dados</b>SharePoint · atualizado pelo n8n. Nesta versão, dados de exemplo.</div>
        </nav>
        <main className="main"><div className="wrap">
          <Routes>
            <Route path="/" element={<Visao />} />
            <Route path="/carteira" element={<Carteira />} />
            <Route path="*" element={<EmBreve />} />
          </Routes>
        </div></main>
      </div>
    </>
  );
}
