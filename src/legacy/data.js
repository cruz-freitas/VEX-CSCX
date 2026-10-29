// @ts-nocheck
// Dados de exemplo e regras extraídos do protótipo original (legacy/VEX_Customer_Success.html).
// Substituir por Supabase/n8n quando os dados reais chegarem.
/* ---------- Regras (provisórias até receber a planilha) ---------- */
var LEVELS=[
  {k:"Espetacular",min:90,c:"h1"},{k:"Ótimo",min:75,c:"h2"},{k:"Bom",min:60,c:"h3"},
  {k:"Regular",min:45,c:"h4"},{k:"Ruim",min:30,c:"h5"},{k:"Péssimo",min:0,c:"h6"}];
var PILLARS=[
  {k:"uso",n:"Uso do sistema",d:"Vistorias/mês vs. contratado",w:30},
  {k:"adocao",n:"Adoção",d:"Usuários ativos e módulos",w:20},
  {k:"suporte",n:"Suporte",d:"Volume e gravidade de tickets",w:20},
  {k:"financeiro",n:"Financeiro",d:"Pagamentos em dia",w:15},
  {k:"relac",n:"Relacionamento",d:"Contatos e NPS",w:15}];
var CURVES=["A","B","C","D"];
function level(s){for(var i=0;i<LEVELS.length;i++)if(s>=LEVELS[i].min)return LEVELS[i];return LEVELS[5]}
function hvar(c,p){return "var(--"+c+"-"+p+")"}

/* ---------- Dados de exemplo ---------- */
var seed=20261029;function rnd(){seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296}
function pick(a){return a[Math.floor(rnd()*a.length)]}
var NAMES=["Locadora Rota Sul","Transportes Ipê Amarelo","Auto Vistoria Norte","Frota Viva Logística","Concessionária Pioneira","Rent Car Paraná","Guincho Expresso 24h","Vistoria Prime","TransCargas Sarandi","Frotas Horizonte","Mobility Locações","Cooperativa Rodar","LogNorte Distribuição","Seminovos Avenida","Agro Frota Campo","Locaminas Veículos","Expressa Cargas","Vistoriadora Central","Frotista Solar","Leasing Atlântico","TransMaringá","Carga Leve Entregas","Autoescola Direção Certa","Proteção Veicular União"];
var SEG=["Locadora","Transportadora","Vistoriadora","Concessionária","Proteção veicular","Logística"];
var PLANOS=["Essencial","Profissional","Enterprise"];
var CSM=["Marlon","Ana","Rafael"];
var TODAY=new Date(2026,9,29);
function addM(d,m){var x=new Date(d);x.setMonth(x.getMonth()+m);return x}
function fmtD(d){return d.toLocaleDateString("pt-BR")}
function fmtDT(d){return d.toLocaleDateString("pt-BR")+" "+d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}
function brl(v){return v.toLocaleString("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0})}
function n(v){return v.toLocaleString("pt-BR")}
function clamp(v){return Math.max(3,Math.min(99,Math.round(v)))}

var clients=NAMES.map(function(name,i){
  var plano=pick(PLANOS);
  var base={Essencial:690,Profissional:1890,Enterprise:5200}[plano];
  var mrr=Math.round(base*(0.7+rnd()*1.2)/10)*10;
  var monthsIn=4+Math.floor(rnd()*44);
  var entrada=addM(TODAY,-monthsIn);entrada.setDate(1+Math.floor(rnd()*27));
  var target=20+rnd()*78;
  if(i===3||i===9)target=24+rnd()*8;
  if(i===0||i===7)target=91+rnd()*6;
  var hist=[],v=target+(rnd()-.5)*30;
  for(var m=11;m>=0;m--){v=v+(target-v)*0.35+(rnd()-.5)*9;hist.push(clamp(v))}
  var score=hist[11];
  var p={};PILLARS.forEach(function(pl){p[pl.k]=clamp(score+(rnd()-.5)*36)});
  var vistContr={Essencial:300,Profissional:1200,Enterprise:5000}[plano];
  var c={id:"c"+(i+1),nome:name,token:"VX"+(10400+i*37),segmento:pick(SEG),plano:plano,mrr:mrr,
    entrada:entrada,csm:CSM[i%3],hist:hist,score:score,pillars:p,
    vistMes:Math.round(vistContr*(0.25+p.uso/110)),vistContr:vistContr,
    usuarios:Math.round(3+rnd()*({Essencial:8,Profissional:30,Enterprise:120}[plano])),
    tickets90:Math.round((100-p.suporte)/7+rnd()*3),nps:Math.round(p.relac/10),
    ultimoContato:new Date(TODAY.getTime()-Math.round(rnd()*70)*864e5),
    status:"Ativo",saida:null,motivo:null};
  if(monthsIn<=4)c.status="Onboarding";
  if(score<45&&c.status==="Ativo")c.status="Em risco";
  return c;
});
// alguns clientes caem de faixa no último mês (exemplo)
[3,9,14,18,21].forEach(function(i){var c=clients[i];var L=lvIdx(c.score);if(L>0){var up=LEVELS[L-1].min;c.hist[10]=Math.min(99,up+2+Math.floor(rnd()*5));c.hist[9]=Math.min(99,c.hist[10]+Math.floor(rnd()*4))}});
// dois clientes que já saíram (histórico completo até a saída)
[["Translog Oeste","Cancelado",addM(TODAY,-2),"Migrou para concorrente após falhas de sincronização"],["Vistorias Rápidas MT","Cancelado",addM(TODAY,-5),"Encerrou operação"]].forEach(function(x,j){
  var entrada=addM(TODAY,-(20+j*9));var hist=[];var v=70;for(var m=0;m<12;m++){v-=4+rnd()*3;hist.push(clamp(v))}
  var sc=hist[11];var p={};PILLARS.forEach(function(pl){p[pl.k]=clamp(sc+(rnd()-.5)*20)});
  clients.push({id:"c"+(clients.length+1),nome:x[0],token:"VX"+(9800+j*11),segmento:"Transportadora",plano:"Profissional",mrr:1650+j*300,entrada:entrada,csm:CSM[j],hist:hist,score:sc,pillars:p,vistMes:0,vistContr:1200,usuarios:0,tickets90:2,nps:3,ultimoContato:x[2],status:x[1],saida:x[2],motivo:x[3]});
});
// Curva ABC por MRR acumulado (clientes ativos)
(function(){
  var act=clients.filter(function(c){return c.status!=="Cancelado"}).sort(function(a,b){return b.mrr-a.mrr});
  var tot=act.reduce(function(s,c){return s+c.mrr},0),acc=0;
  act.forEach(function(c){acc+=c.mrr;var r=acc/tot;c.curva=r<=.5?"A":r<=.8?"B":r<=.95?"C":"D"});
  clients.forEach(function(c){if(!c.curva)c.curva="D"});
})();
function months(d){return Math.max(0,Math.round((TODAY-d)/(30.4*864e5)))}
function trend(c){return c.hist[11]-c.hist[8]}
function byId(id){for(var i=0;i<clients.length;i++)if(clients[i].id===id)return clients[i]}

/* análise IA de exemplo, montada a partir dos pilares */
function analysis(c){
  var lv=level(c.score),t=trend(c),sig=[],rec=[];
  var worst=PILLARS.slice().sort(function(a,b){return c.pillars[a.k]-c.pillars[b.k]});
  var usoPct=Math.round(c.vistMes/c.vistContr*100);
  if(c.status==="Cancelado"){return{sum:"Cliente encerrou o contrato em "+fmtD(c.saida)+". Motivo registrado: "+c.motivo+". O histórico fica disponível para análise de churn.",sig:[{t:"neg",x:"Queda contínua do score nos 12 meses anteriores à saída"}],rec:[]}}
  if(usoPct<60)sig.push({t:"neg",x:"Uso em "+usoPct+"% do volume contratado ("+n(c.vistMes)+" de "+n(c.vistContr)+" vistorias/mês)"});
  else sig.push({t:"pos",x:"Uso em "+usoPct+"% do volume contratado"});
  if(c.tickets90>=8)sig.push({t:"neg",x:c.tickets90+" tickets de suporte nos últimos 90 dias"});
  if(t<=-6)sig.push({t:"neg",x:"Score caiu "+Math.abs(t)+" pontos em 3 meses"});
  if(t>=6)sig.push({t:"pos",x:"Score subiu "+t+" pontos em 3 meses"});
  var dias=Math.round((TODAY-c.ultimoContato)/864e5);
  if(dias>45)sig.push({t:"neg",x:"Sem contato do CS há "+dias+" dias"});else sig.push({t:"neu",x:"Último contato do CS há "+dias+" dias"});
  if(c.nps<=6)sig.push({t:"neg",x:"NPS "+c.nps+" (detrator)"});else if(c.nps>=9)sig.push({t:"pos",x:"NPS "+c.nps+" (promotor)"});
  var pr=c.score<30?"critica":c.score<45?"alta":c.score<60?"media":"baixa";
  if(c.score<60){
    rec.push({p:pr,t:"Ligação de diagnóstico com o gestor da conta",d:"Entender o motivo da queda em "+worst[0].n.toLowerCase()+". Prazo sugerido: "+(c.score<45?"2":"5")+" dias úteis"});
    if(usoPct<60)rec.push({p:pr==="critica"?"alta":pr,t:"Treinamento de reciclagem para vistoriadores",d:"Volume abaixo do contratado. Oferecer sessão de 30 min no app"});
    if(c.tickets90>=8)rec.push({p:"media",t:"Revisar os tickets abertos com o suporte",d:"Agrupar por causa e levar resposta única ao cliente"});
  }else if(c.score>=90){
    rec.push({p:"baixa",t:"Convidar para case de sucesso / indicação",d:"Cliente promotor com uso alto"});
    if(c.curva!=="A")rec.push({p:"baixa",t:"Apresentar plano superior",d:"Uso consistente pode justificar upgrade"});
  }else{
    rec.push({p:"baixa",t:"Check-in mensal de relacionamento",d:"Manter cadência; validar satisfação com "+worst[0].n.toLowerCase()});
  }
  var sum=c.nome.split(" ")[0]+" "+c.nome.split(" ").slice(1).join(" ")+" está na faixa "+lv.k+" ("+c.score+" pontos), curva "+c.curva+". ";
  sum+=t<=-6?"A tendência é de queda e o pilar mais fraco é "+worst[0].n.toLowerCase()+". ":t>=6?"A tendência é de alta, puxada por "+worst[4].n.toLowerCase()+". ":"O score está estável; o pilar mais fraco é "+worst[0].n.toLowerCase()+". ";
  if(c.curva==="A"&&c.score<60)sum+="Por ser curva A, o risco financeiro de perda é alto.";
  return{sum:sum,sig:sig,rec:rec};
}

/* tarefas e logs de exemplo */
var TIPOS=["Ligação de diagnóstico","Check-in mensal","Treinamento de reciclagem","Reunião de alinhamento","Apresentar plano superior","Pesquisa NPS","Onboarding: kickoff"];
var tasks=[],tid=0;
clients.filter(function(c){return c.status!=="Cancelado"}).forEach(function(c){
  var k=c.score<45?2:c.score<75?1:(rnd()<.4?1:0);
  for(var j=0;j<k;j++){
    var st=pick(["A fazer","A fazer","Em andamento","Concluída"]);
    var tipo=c.status==="Onboarding"&&j===0?"Onboarding: kickoff":c.score<45?pick(TIPOS.slice(0,3)):pick(TIPOS.slice(1,6));
    tasks.push({id:++tid,cli:c.id,titulo:tipo+" · "+c.nome,tipo:tipo,
      pri:c.score<30?"critica":c.score<45?"alta":c.score<60?"media":"baixa",
      prazo:new Date(TODAY.getTime()+Math.round((rnd()*14-3))*864e5),
      resp:c.csm,origem:rnd()<.7?"IA":"Manual",rr:st==="A fazer"&&rnd()<.3?null:(8812000+Math.floor(rnd()*90000)),status:st});
  }
});
var FIELDS=[["Plano","Essencial","Profissional"],["Usuários contratados","10","25"],["Vistorias contratadas/mês","300","1.200"],["CS responsável","Ana","Marlon"],["Health score","68","54"],["Faixa de saúde","Bom","Regular"],["Curva","B","A"],["Status","Ativo","Em risco"],["Módulo Checklist de entrega","Desativado","Ativado"],["E-mail do gestor","joao@…","joao.lima@…"],["Mensalidade","R$ 1.890","R$ 2.150"]];
var logs=[];
clients.forEach(function(c){
  var k=2+Math.floor(rnd()*4);
  for(var j=0;j<k;j++){
    var f=pick(FIELDS);var src=f[0]==="Health score"||f[0]==="Faixa de saúde"||f[0]==="Curva"?"n8n":f[0]==="Status"?pick(["n8n","IA"]):"Manual";
    logs.push({cli:c.id,quando:new Date(TODAY.getTime()-Math.round(rnd()*120*24)*36e5),campo:f[0],de:f[1],para:f[2],origem:src,por:src==="Manual"?c.csm:src==="IA"?"Agente CS":"Workflow HealthScore"});
  }
  logs.push({cli:c.id,quando:c.entrada,campo:"Cliente cadastrado",de:"",para:c.plano,origem:"Manual",por:c.csm});
  if(c.saida)logs.push({cli:c.id,quando:c.saida,campo:"Status",de:"Em risco",para:"Cancelado",origem:"Manual",por:c.csm});
});
logs.sort(function(a,b){return b.quando-a.quando});

/* histórico de suporte (exemplo; virá da planilha de atendimentos) */
var ASSUNTOS=[
  ["Dúvida","Redefinir senha de acesso"],["Dúvida","Reenvio de comprovante/PDF da vistoria"],["Dúvida","Como cadastrar operação"],
  ["Dúvida","Como adicionar usuário vistoriador"],["Dúvida","Uso do questionário no app"],["Erro","Vistoria não sincroniza ao finalizar"],
  ["Erro","App fecha ao tirar foto"],["Erro","Relatório com dados divergentes"],["Solicitação","Alterar dados cadastrais da empresa"],
  ["Solicitação","Ativar módulo / funcionalidade"],["Configuração","Configurar campos personalizados"],["Configuração","Ajustar questionário da operação"],
  ["Financeiro","Segunda via de boleto"],["Financeiro","Dúvida sobre fatura"]];
var CATCLS={"Dúvida":"duvida","Erro":"erro","Solicitação":"solic","Configuração":"config","Financeiro":"fin"};
var CANAIS=["WhatsApp","WhatsApp","WhatsApp","E-mail","Telefone"];
var ATEND=["Teo (IA)","Bruna","Carlos","Juliana"];
var tickets=[],proto=26100;
clients.forEach(function(c){
  var recent=c.status==="Cancelado"?0:c.tickets90,old=Math.round(months(c.entrada)*(0.6+rnd()*1.4));
  function mk(daysAgo){
    var a=c.score<45&&rnd()<.35?ASSUNTOS[5+Math.floor(rnd()*3)]:pick(ASSUNTOS);
    var ab=new Date(TODAY.getTime()-daysAgo*864e5-Math.round(rnd()*10)*36e5);
    var crit=a[0]==="Erro"?pick(["Moderada","Alta","Alta","Crítica"]):a[0]==="Dúvida"?pick(["Baixa","Baixa","Moderada"]):pick(["Baixa","Moderada"]);
    var horas=a[0]==="Dúvida"?1+rnd()*8:4+rnd()*60;
    var st=daysAgo<3?pick(["Aberto","Em andamento","Resolvido"]):daysAgo<10&&a[0]==="Erro"&&rnd()<.4?"Em andamento":"Resolvido";
    tickets.push({proto:"#"+(++proto),cli:c.id,abertura:ab,fechamento:st==="Resolvido"?new Date(ab.getTime()+horas*36e5):null,
      canal:a[1].indexOf("senha")>=0?"WhatsApp":pick(CANAIS),categoria:a[0],assunto:a[1],criticidade:crit,
      atendente:a[0]==="Dúvida"&&rnd()<.45?"Teo (IA)":pick(ATEND.slice(1)),status:st,horas:st==="Resolvido"?horas:null});
  }
  for(var j=0;j<recent;j++)mk(Math.floor(rnd()*90));
  var span=Math.max(91,Math.round((TODAY-c.entrada)/864e5)-(c.saida?Math.round((TODAY-c.saida)/864e5):0));
  for(var k=0;k<Math.min(old,30);k++)mk((c.saida?Math.round((TODAY-c.saida)/864e5):91)+Math.floor(rnd()*(span-91)));
});
tickets.sort(function(a,b){return b.abertura-a.abertura});
function last90(t){return (TODAY-t.abertura)<=90*864e5}
function hrs(h){return h<24?(h<1?"<1 h":Math.round(h)+" h"):(h/24).toFixed(1).replace(".",",")+" dias"}
/* atividades registradas pelo CS (exemplo) */
var ATIPOS={"Ligação":'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
 "Reunião":'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
 "Visita":'<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
 "E-mail":'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
 "WhatsApp":'<path d="M21 11.5a8.4 8.4 0 0 1-12.6 7.3L3 21l2.2-5.4A8.4 8.4 0 1 1 21 11.5z"/>'};
var ACOR={"Ligação":"green","Reunião":"blue","Visita":"purple","E-mail":"amber","WhatsApp":"green"};
var RESUMOS={pos:["Gestor elogiou a agilidade do app; pediu material para novos vistoriadores","Reunião de resultados: volume de vistorias acima do esperado","Cliente confirmou renovação e quer conhecer o módulo de entrega"],
 neu:["Check-in mensal sem pontos críticos","Alinhamento de novos usuários e operações","Enviado resumo do uso do trimestre"],
 neg:["Gestor reclamou de vistorias que não sincronizam no fim do dia","Cliente questionou o valor da mensalidade frente ao uso","Troca de gestor na empresa; novo responsável ainda não conhece o VEX"]};
var activities=[];
clients.forEach(function(c){
  var k=2+Math.floor(rnd()*4),span=Math.max(30,Math.round(((c.saida||TODAY)-c.entrada)/864e5));
  for(var j=0;j<k;j++){
    var tipo=pick(["Ligação","Ligação","Reunião","WhatsApp","E-mail","Visita"]);
    var s=c.score>=70?pick(["pos","pos","neu"]):c.score<45?pick(["neg","neg","neu"]):pick(["pos","neu","neg"]);
    var d=j===0?c.ultimoContato:new Date((c.saida||TODAY).getTime()-Math.round(rnd()*span)*864e5);
    activities.push({cli:c.id,tipo:tipo,data:d,sent:s,resumo:pick(RESUMOS[s]),por:c.csm});
  }
});
activities.sort(function(a,b){return b.data-a.data});
var SENTL={pos:"Positivo",neu:"Neutro",neg:"Negativo"};

/* mudanças de faixa no último mês */
function lvIdx(s){for(var i=0;i<LEVELS.length;i++)if(s>=LEVELS[i].min)return i;return 5}
function changes(){return active().filter(function(c){return lvIdx(c.hist[10])!==lvIdx(c.hist[11])}).map(function(c){return{c:c,de:c.hist[10],para:c.hist[11],caiu:lvIdx(c.hist[11])>lvIdx(c.hist[10])}}).sort(function(a,b){return (b.caiu-a.caiu)||((a.para-a.de)-(b.para-b.de))})}
function motivos(c){
  var m=[];var w=PILLARS.slice().sort(function(a,b){return c.pillars[a.k]-c.pillars[b.k]});
  var t90=tickets.filter(function(t){return t.cli===c.id&&last90(t)}).length;
  var dias=Math.round((TODAY-c.ultimoContato)/864e5);
  var usoPct=Math.round(c.vistMes/c.vistContr*100);
  if(c.hist[11]<c.hist[10]){
    m.push(w[0].n+" é o pilar mais fraco ("+c.pillars[w[0].k]+")");
    if(usoPct<60)m.push("uso em "+usoPct+"% do contratado");
    if(t90>=8)m.push(t90+" atendimentos em 90 dias");
    if(dias>45)m.push("sem contato há "+dias+" dias");
  }else{
    m.push(w[4].n+" puxou a alta ("+c.pillars[w[4].k]+")");
    if(usoPct>=80)m.push("uso em "+usoPct+"% do contratado");
  }
  return m.slice(0,3).join(" · ");
}

/* playbooks: gatilho + sequência de tarefas */
var PLAYBOOKS=[
 {id:"risco-a",nome:"Resgate de conta estratégica",gatilho:"Faixa Ruim ou Péssimo em cliente curva A ou B",pri:"critica",
  when:function(c){return c.score<45&&(c.curva==="A"||c.curva==="B")},
  passos:[[0,"Ligação de diagnóstico com o gestor"],[2,"Reunião de plano de ação"],[7,"Follow-up do plano de ação"],[30,"Reavaliar health score"]]},
 {id:"queda",nome:"Queda de faixa",gatilho:"Cliente desceu de faixa no último mês",pri:"alta",
  when:function(c){return lvIdx(c.hist[11])>lvIdx(c.hist[10])},
  passos:[[0,"Check-in para entender a mudança"],[5,"Revisar chamados de suporte do período"],[15,"Reavaliar health score"]]},
 {id:"suporte",nome:"Excesso de chamados",gatilho:"8 ou mais atendimentos de suporte em 90 dias",pri:"alta",
  when:function(c){return tickets.filter(function(t){return t.cli===c.id&&last90(t)}).length>=8},
  passos:[[0,"Revisar chamados com o time de suporte"],[3,"Ligação com resposta consolidada"],[14,"Treinamento de reciclagem dos vistoriadores"]]},
 {id:"onb",nome:"Onboarding",gatilho:"Cliente em onboarding (até 4 meses de casa)",pri:"media",
  when:function(c){return c.status==="Onboarding"},
  passos:[[0,"Kickoff com o gestor"],[7,"Treinamento dos vistoriadores"],[30,"Checar marco de 100 vistorias"],[60,"Reunião de passagem para acompanhamento"]]},
 {id:"silencio",nome:"Cliente sem contato",gatilho:"Mais de 45 dias sem contato registrado",pri:"media",
  when:function(c){return (TODAY-c.ultimoContato)>45*864e5},
  passos:[[0,"Check-in de relacionamento"],[10,"Enviar resumo de uso do mês"]]},
 {id:"promotor",nome:"Promotor e expansão",gatilho:"Faixa Espetacular",pri:"baixa",
  when:function(c){return c.score>=90},
  passos:[[0,"Pedir indicação / depoimento"],[10,"Apresentar plano superior ou novo módulo"]]}];
var appliedPB={};
function pbFor(c){return c.status==="Cancelado"?[]:PLAYBOOKS.filter(function(p){return p.when(c)})}
function applyPB(c,p){
  p.passos.forEach(function(s,i){tasks.push({id:++tid,cli:c.id,tipo:s[1],titulo:s[1]+" · "+c.nome,pri:i===0?p.pri:(p.pri==="critica"?"alta":p.pri),prazo:new Date(TODAY.getTime()+s[0]*864e5),resp:c.csm,origem:"Playbook",pb:p.nome,rr:8950000+tid,status:"A fazer"})});
  appliedPB[c.id+"|"+p.id]=true;
  logs.unshift({cli:c.id,quando:new Date(),campo:"Playbook aplicado",de:"",para:p.nome+" ("+p.passos.length+" tarefas)",origem:"Manual",por:c.csm});
}
export {LEVELS,PILLARS,CURVES,level,TODAY,brl,n,fmtD,fmtDT,clients,trend,byId,tasks,logs,tickets,last90,activities,PLAYBOOKS,CSM,changes};
