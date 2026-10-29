import { useLocation } from "react-router-dom";
import { PageHead } from "../ui";

export default function EmBreve() {
  const { pathname } = useLocation();
  return (
    <>
      <PageHead title="Em construção" sub={`A tela ${pathname} ainda será portada do protótipo original.`} />
      <section className="card"><div className="panel-body">
        <p>Referência visual e de regras: <code>legacy/VEX_Customer_Success.html</code>. Os dados e regras já estão em <code>src/legacy/data.js</code>.</p>
      </div></section>
    </>
  );
}
