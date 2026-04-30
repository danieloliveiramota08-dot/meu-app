// ================= UTIL =================
function el(id){ return document.getElementById(id); }

function get(k){
try{
return JSON.parse(localStorage.getItem(k)) || [];
}catch(e){
return [];
}
}

function set(k,v){

try{

localStorage.setItem(k, JSON.stringify(v));

}catch(e){

console.error("Erro ao salvar:", e);

}

}

// ================= LOGIN =================
function login(){

let u = el("loginUser").value.trim();
let p = el("loginPass").value.trim();

// ================= ADMIN =================
if(u === "admin" && p === "1234"){

let adminUser = {
nome: "Administrador",
login: "admin",
admin: true
};

set("usuarioLogado", adminUser);

el("loginPage").style.display="none";
el("menuPage").style.display="flex";

ajustarMenu();

return;

}

// ================= USUÁRIO NORMAL =================
db.collection("membros")
.where("login","==",u)
.where("senha","==",p)
.get()
.then((querySnapshot)=>{

if(querySnapshot.empty){
alert("Login inválido");
return;
}

querySnapshot.forEach((doc)=>{

let user = doc.data();

user.admin = false;

set("usuarioLogado", user);

});

el("loginPage").style.display="none";
el("menuPage").style.display="flex";

ajustarMenu();

})
.catch((error)=>{

console.error("Erro no login:", error);

});

}

// ================= ADMIN CHECK =================
function isAdmin(){

let user = get("usuarioLogado");

return user && user.admin === true;

}


// ================= MENU ADMIN =================
function ajustarMenu(){

if(el("adminButtons")){
el("adminButtons").style.display =
isAdmin() ? "block" : "none";
}

}

// ================= CADASTRO =================
function cadastrar(){

let nome = el("nome").value.trim();
let cpf = el("cpf").value.trim();
let nascimento = el("nascimento").value;
let celular = el("celular").value.trim();
let login = el("novoLogin").value.trim();
let senha = el("novaSenha").value.trim();

if(!nome || !login || !senha){
alert("Preencha Nome, Login e Senha");
return;
}

// 🔥 SALVA NO FIREBASE
db.collection("membros").add({

nome: nome,
cpf: cpf,
nascimento: nascimento,
celular: celular,
login: login,
senha: senha,
dataCadastro: firebase.firestore.FieldValue.serverTimestamp()

})
.then(() => {

alert("Cadastro realizado com sucesso! ✅");

// limpa campos
el("nome").value = "";
el("cpf").value = "";
el("nascimento").value = "";
el("celular").value = "";
el("novoLogin").value = "";
el("novaSenha").value = "";

// volta login
voltarLoginTela();

})
.catch((error) => {

console.error("Erro ao salvar:", error);

});

}

// ================= VOLTAR LOGIN =================
function voltarLoginTela(){

el("registerPage").style.display = "none";
el("loginPage").style.display = "flex";

}

// ================= MOSTRAR CADASTRO =================
function showRegister(){

el("loginPage").style.display = "none";
el("registerPage").style.display = "flex";

}

// ================= NAVEGAÇÃO =================

function abrirPagina(p){

el("menuPage").style.display="none";
el("conteudoPage").style.display="flex";

let html = "";

/* ROTAS */

if(p==="membros"){
adminMembros();
return;
}

else if(p==="financeiro"){
financeiro();
return;
}

else if(p==="ebd"){
ebd();
return;
}

else if(p==="quiz"){
html = quiz();
}

else if(p==="pix"){
ofertas();
return;
}

else if(p==="avisos"){
html = avisos();
}

else if(p==="cultos"){
html = cultos();
}

else if(p==="pedidos"){
pedidosOracao();
return;
}

else if(p==="pedidosRecebidos"){
pedidosRecebidos();
return;
}

else if(p==="biblia"){
html = biblia();
}

else if(p==="estudoBiblico"){
html = estudoBiblico();
}

else if(p==="aniversariantes"){
html = aniversariantes();
}

/* MOSTRA NA TELA */

if(html !== ""){
el("conteudoArea").innerHTML = html;
}

}


function voltarMenu(){

el("conteudoPage").style.display="none";

el("menuPage").style.display="flex";

}

// ================= ABRIR MEMBROS =================
function membros(){
  carregarMembros();
}

// ================= ADD MEMBRO =================
function addMembro(){

  let nome = el("nomeMembro").value;
  let telefone = el("telefoneMembro").value;

  if(!nome){
    alert("Digite o nome 👤");
    return;
  }

  salvarMembroFirebase(nome, telefone);

  el("nomeMembro").value = "";
  el("telefoneMembro").value = "";

}

// ================= ADMIN VER MEMBROS =================
function adminMembros(){

  const container = el("conteudoArea");

  container.innerHTML = "<h2>Carregando membros...</h2>";

  db.collection("membros")
    .get()
    .then((querySnapshot) => {

      let html = `<h2>👥 Membros cadastrados</h2>`;

      if(querySnapshot.empty){
        html += "<p>Nenhum membro encontrado.</p>";
      }

      querySnapshot.forEach((doc) => {

        let m = doc.data();

        html += `
          <div style="
            background:#fff;
            padding:12px;
            margin-bottom:10px;
            border-radius:10px;
          ">

            <strong>👤 Nome:</strong> ${m.nome || "-"} <br>
            <strong>🪪 CPF:</strong> ${m.cpf || "-"} <br>
            <strong>🎂 Nascimento:</strong> ${m.nascimento || "-"} <br>
            <strong>📱 Celular:</strong> ${m.celular || "-"} <br>
            <strong>🔑 Login:</strong> ${m.login || "-"} <br>

            <br>

            <button onclick="excluirMembro('${doc.id}')"
              style="
                background:red;
                color:white;
                border:none;
                padding:6px 10px;
                border-radius:6px;
                cursor:pointer;
              ">
              🗑 Excluir
            </button>

          </div>
        `;

      });

      container.innerHTML = html;

    })
    .catch((error) => {

      console.error("Erro ao carregar membros:", error);

      container.innerHTML = `
        <h2>Erro ao carregar membros ❌</h2>
      `;

    });

}

// ================= LISTAR MEMBROS =================
function listarMembros(){

  const container = el("conteudoArea");

  db.collection("membros")
    .get()
    .then((querySnapshot) => {

      let html = `
        <h2>👥 Membros</h2>
      `;

      querySnapshot.forEach((doc) => {

        let m = doc.data();

        html += `
          <div style="background:#fff;padding:10px;margin-bottom:10px;border-radius:8px;">
            <strong>${m.nome}</strong><br>
            <small>${m.telefone}</small>
          </div>
        `;

      });

      container.innerHTML = html;

    });

}

// ================= EDITAR =================
function editarM(i){

let m = get("membros");
if(!Array.isArray(m)) return;

let x = m[i];

el("nome").value = x.nome || "";
el("cpf").value = x.cpf || "";
el("nascimento").value = x.nascimento || "";
el("celular").value = x.celular || "";
el("novoLogin").value = x.login || "";
el("novaSenha").value = x.senha || "";

// 🔥 FORÇA COMO NÚMERO
localStorage.setItem("editMembroIndex", String(i));

alert("Modo edição ativado ✏");
}

// ================= EXCLUIR MEMBRO =================
function excluirMembro(id){

  if(confirm("Deseja excluir este membro?")){

    db.collection("membros")
      .doc(id)
      .delete()
      .then(() => {

        alert("Membro excluído 👤");

        carregarMembros();

      })
      .catch((error) => {

        console.error("Erro ao excluir:", error);

      });

  }

}

// ================= BUSCA =================
function filtrarMembros(){

let termo = el("buscaMembro").value.toLowerCase();
let itens = document.querySelectorAll(".membro-item");

itens.forEach(item=>{
let texto = item.innerText.toLowerCase();
item.style.display = texto.includes(termo) ? "block" : "none";
});
}

// ================= FINANCEIRO =================
function financeiro(){

if(!isAdmin()){
el("conteudoArea").innerHTML="Acesso negado";
return;
}

let f = get("financeiro");

if(!f || !f.h){
f = {
dizimos:0,
ofertas:0,
outros:0,
h:[]
};
}

let total = f.dizimos + f.ofertas + f.outros;

let html = `
<h2>Financeiro</h2>

<div class="card">
<p>Dízimos: R$ ${f.dizimos.toFixed(2)}</p>
<p>Ofertas: R$ ${f.ofertas.toFixed(2)}</p>
<p>Outros: R$ ${f.outros.toFixed(2)}</p>
<b>Total: R$ ${total.toFixed(2)}</b>
</div>

<select id="tipo">
<option value="dizimos">Dízimo</option>
<option value="ofertas">Oferta</option>
<option value="outros">Outro</option>
</select>

<input id="valor" type="number" placeholder="Valor">
<input id="desc" placeholder="Descrição">
<input id="dataFin" type="date">

<button onclick="addFin()">Adicionar</button>

<hr>
<h3>Histórico</h3>
`;

f.h.forEach((x,i)=>{

html += `
<div class="card">

<b>${x.t.toUpperCase()}</b>

<p>Valor: R$ ${x.v.toFixed(2)}</p>

<p>Data: ${x.data || "-"}</p>

<p>Descrição: ${x.d || "-"}</p>

<button onclick="delFin(${i})">
Excluir
</button>

</div>
`;

});

el("conteudoArea").innerHTML = html;

}



// ================= ADD FINANCEIRO =================

function addFin(){

let f = get("financeiro");

if(!f || !f.h){

f = {
dizimos:0,
ofertas:0,
outros:0,
h:[]
};

}

let tipo = el("tipo").value;

let valor = parseFloat(el("valor").value);

let desc = el("desc").value;

let data = el("dataFin").value;

if(isNaN(valor) || valor <= 0){

alert("Digite um valor válido");

return;

}

f[tipo] += valor;

f.h.push({

t: tipo,

v: valor,

d: desc,

data: data

});

set("financeiro", f);

financeiro();

}



// ================= EXCLUIR FINANCEIRO =================

function delFin(i){

let f = get("financeiro");

if(!f || !f.h) return;

f.h.splice(i,1);

// recalcula totais

f.dizimos = 0;
f.ofertas = 0;
f.outros = 0;

f.h.forEach(x=>{

if(x.t==="dizimos") f.dizimos += x.v;

if(x.t==="ofertas") f.ofertas += x.v;

if(x.t==="outros") f.outros += x.v;

});

set("financeiro", f);

financeiro();

}

// ================= OFERTAS (PIX) =================
function ofertas(){

  const container = el("conteudoArea");
  let lista = get("pix_ofertas");

  container.innerHTML = `
    <h2>💰 Ofertas / Contribuições</h2>

    <div id="adminForm" style="display:none;background:#fff;padding:15px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.1);margin-bottom:15px;">
      <h3>🔐 Admin - Gerenciar PIX</h3>

      <input id="pixNome" placeholder="Nome da Igreja / Responsável"
        style="width:100%;padding:10px;margin-bottom:10px;border-radius:8px;border:1px solid #ccc;" />

      <input id="pixBanco" placeholder="Banco"
        style="width:100%;padding:10px;margin-bottom:10px;border-radius:8px;border:1px solid #ccc;" />

      <input id="pixChave" placeholder="Chave PIX"
        style="width:100%;padding:10px;margin-bottom:10px;border-radius:8px;border:1px solid #ccc;" />

      <button onclick="salvarPix()"
        style="padding:10px 15px;background:#4CAF50;color:#fff;border:none;border-radius:8px;cursor:pointer;">
        Salvar 💾
      </button>
    </div>

    <div id="listaPix"></div>
  `;

  renderPix();

  // Simples controle de admin (você pode trocar depois por login real)
  if(isAdmin()){
    el("adminForm").style.display = "block";
  }
}

// ================= SALVAR PIX =================
function salvarPix(){

let nome = el("pixNome").value.trim();
let banco = el("pixBanco").value.trim();
let chave = el("pixChave").value.trim();

if(!nome || !banco || !chave){
alert("Preencha todos os campos!");
return;
}

let data = [{
nome,
banco,
chave
}];

set("pix_ofertas", data);

renderPix();

}

// ================= LISTAR PIX =================
function renderPix(){

let lista = get("pix_ofertas");

if(!lista){
lista = [];
}

let box = el("listaPix");

if(!box) return;

if(lista.length === 0){

box.innerHTML = 
"<p>Nenhuma informação de PIX cadastrada ainda 🙏</p>";

return;

}

let p = lista[0];

box.innerHTML = `
<div style="background:#f9f9f9;padding:15px;border-radius:12px;">

<h3>💰 Dados para Oferta</h3>

<p><strong>Igreja:</strong> ${p.nome}</p>
<p><strong>Banco:</strong> ${p.banco}</p>
<p><strong>PIX:</strong> ${p.chave}</p>

${isAdmin() ? `
<button onclick="editarPix()"
style="margin-top:10px;padding:8px 12px;background:orange;color:#fff;border:none;border-radius:8px;cursor:pointer;">
Editar ✏️
</button>

<button onclick="excluirPix()"
style="margin-top:10px;padding:8px 12px;background:red;color:#fff;border:none;border-radius:8px;cursor:pointer;">
Excluir 🗑️
</button>
` : ""}

</div>
`;

}

// ================= EDITAR =================
function editarPix(){

  let lista = get("pix_ofertas");
  if(lista.length === 0) return;

  let p = lista[0];

  el("pixNome").value = p.nome;
  el("pixBanco").value = p.banco;
  el("pixChave").value = p.chave;

  el("adminForm").style.display = "block";
}

// ================= EXCLUIR =================
function excluirPix(){

  set("pix_ofertas", []);
  renderPix();
}

// ================= AVISOS =================
function avisos(){

const container = el("conteudoArea");

db.collection("avisos")
.orderBy("data", "desc")
.get()
.then((querySnapshot)=>{

let html = `<h2>📢 Avisos</h2>`;

// ADMIN FORM
if(isAdmin()){
html += `
<div class="card">
<input id="tituloAviso" placeholder="Título">
<textarea id="textoAviso" placeholder="Texto"></textarea>
<button onclick="addAviso()">Publicar</button>
</div>
`;
}

if(querySnapshot.empty){
html += `<p>Nenhum aviso ainda</p>`;
}

querySnapshot.forEach((doc)=>{

let a = doc.data();

html += `
<div class="card">
<h3>${a.titulo}</h3>
<p>${a.texto}</p>

${isAdmin() ? `
<button onclick="excluirAviso('${doc.id}')">🗑 Excluir</button>
` : ""}

</div>
`;

});

container.innerHTML = html;

});

}

// ================= ADICIONAR =================
function addAviso(){

let titulo = el("tituloAviso").value.trim();
let texto = el("textoAviso").value.trim();

if(!titulo || !texto){
alert("Preencha todos os campos");
return;
}

db.collection("avisos").add({
titulo: titulo,
texto: texto,
data: new Date().toLocaleString()
})
.then(()=>{
alert("Aviso publicado ✅");
abrirPagina("avisos");
})
.catch((error)=>{
console.error("Erro:", error);
});

}

// ================= EXCLUIR =================
function excluirAviso(id){

if(confirm("Excluir aviso?")){

db.collection("avisos").doc(id).delete()
.then(()=>{
abrirPagina("avisos");
});

}

}

// ================= CULTOS =================
function cultos(){

const container = el("conteudoArea");

db.collection("cultos")
.get()
.then((querySnapshot)=>{

let html = `<h2>📅 Cultos</h2>`;

// ADMIN
if(isAdmin()){
html += `
<div class="card">
<input id="tituloCulto" placeholder="Nome">
<input id="diaCulto" placeholder="Dia">
<input id="horaCulto" placeholder="Hora">
<button onclick="addCulto()">Salvar</button>
</div>
`;
}

if(querySnapshot.empty){
html += `<p>Nenhum culto cadastrado</p>`;
}

querySnapshot.forEach((doc)=>{

let c = doc.data();

html += `
<div class="card">
<h3>${c.titulo}</h3>
<p>📅 ${c.dia}</p>
<p>⏰ ${c.hora}</p>

${isAdmin() ? `
<button onclick="excluirCulto('${doc.id}')">🗑 Excluir</button>
` : ""}

</div>
`;

});

container.innerHTML = html;

});

}

// ================= ADD CULTOS =================
function addCulto(){

let titulo = el("tituloCulto").value;
let dia = el("diaCulto").value;
let hora = el("horaCulto").value;

if(!titulo || !dia || !hora){
alert("Preencha tudo");
return;
}

db.collection("cultos").add({
titulo,
dia,
hora
})
.then(()=>abrirPagina("cultos"));

}

// ================= EXCLUIR =================
function excluirCulto(id){

if(confirm("Excluir culto?")){

db.collection("cultos").doc(id).delete()
.then(()=>abrirPagina("cultos"));

}

}

// ================= PEDIDOS DE ORAÇÃO =================
function pedidosOracao(){

  const container = el("conteudoArea");

  container.innerHTML = `
    <h2>🙏 Pedidos de Oração</h2>

    <div style="background:#fff;padding:15px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.1);margin-bottom:15px;">
      <h3>Enviar pedido</h3>

      <input id="nomePedido"
  placeholder="Seu nome"
  style="width:100%;padding:10px;margin-bottom:10px;border-radius:8px;border:1px solid #ccc;">

      <textarea id="pedidoTexto"
        placeholder="Escreva seu pedido de oração..."
        style="width:100%;height:100px;padding:10px;border-radius:8px;border:1px solid #ccc;">
      </textarea>

      <button onclick="salvarPedido()"
        style="margin-top:10px;padding:10px 15px;background:#4CAF50;color:#fff;border:none;border-radius:8px;cursor:pointer;">
        Enviar 🙏
      </button>
    </div>
  `;

}

// ================= SALVAR PEDIDO =================
function salvarPedidoFirebase(texto){

let nome = el("nomePedido") 
? el("nomePedido").value 
: "Anônimo";

db.collection("pedidos").add({

nome: nome,
texto: texto,
data: new Date().toLocaleString()

})
.then(() => {

alert("Pedido enviado com sucesso 🙏");

// 🔥 NÃO mostra lista
pedidosOracao();

})
.catch((error) => {

console.error("Erro ao salvar:", error);

});

}

// ================= BOTÃO SALVAR PEDIDO =================
function salvarPedido(){

  let texto = el("pedidoTexto").value;

  if(!texto){
    alert("Digite um pedido 🙏");
    return;
  }

  salvarPedidoFirebase(texto);

  el("pedidoTexto").value = "";

}

// ================= LISTAR PEDIDOS =================
function renderPedidos(){

  let pedidos = get("pedidos_oracao");

  // 🔥 CORREÇÃO IMPORTANTE
  if(!Array.isArray(pedidos)){
    pedidos = [];
  }

  let box = el("listaPedidos");

  if(!box) return;

  if(pedidos.length === 0){
    box.innerHTML = "<p>Nenhum pedido de oração ainda 🙏</p>";
    return;
  }

  box.innerHTML = pedidos.map((p,i) => `
    <div style="background:#f9f9f9;padding:12px;margin-bottom:10px;border-radius:10px;">
      <strong>🙏 Pedido:</strong>
      <p>${p.texto}</p>
      <small>${p.data}</small>

      <button onclick="delPedido(${i})"
        style="margin-top:5px;background:red;color:#fff;border:none;border-radius:6px;padding:5px;cursor:pointer;">
        Excluir
      </button>
    </div>
  `).join("");
}

// ================= PEDIDOS RECEBIDOS =================
function pedidosRecebidos(){

  const container = el("conteudoArea");

  db.collection("pedidos")
    .get()
    .then((querySnapshot) => {

      let html = `
        <h2>📋 Pedidos recebidos</h2>
      `;

      querySnapshot.forEach((doc) => {

        let p = doc.data();

        html += `
          <div style="
            background:#fff;
            padding:10px;
            margin-bottom:10px;
            border-radius:8px;
          ">

            <strong>${p.nome || "Sem nome"}</strong><br>

            ${p.texto}

            <br><br>

            <button onclick="excluirPedido('${doc.id}')"
              style="
                background:#e53935;
                color:#fff;
                border:none;
                padding:6px 10px;
                border-radius:6px;
                cursor:pointer;
              ">
              🗑 Excluir
            </button>

          </div>
        `;

      });

      container.innerHTML = html;

    });

}

// ================= MOSTRAR PEDIDOS =================
function carregarPedidos(){

  const container = el("conteudoArea");

  db.collection("pedidos")
    .orderBy("data", "desc")
    .get()
    .then((querySnapshot) => {

      let html = `
        <h2>🙏 Pedidos de Oração</h2>

        <div style="background:#fff;padding:15px;border-radius:12px;margin-bottom:15px;">
          <h3>Enviar pedido</h3>

          <textarea id="pedidoTexto"
            placeholder="Escreva seu pedido de oração..."
            style="width:100%;height:100px;padding:10px;border-radius:8px;border:1px solid #ccc;">
          </textarea>

          <button onclick="salvarPedido()"
            style="margin-top:10px;padding:10px 15px;background:#4CAF50;color:#fff;border:none;border-radius:8px;">
            Enviar 🙏
          </button>
        </div>

        <h3>Pedidos enviados</h3>
      `;

      querySnapshot.forEach((doc) => {

        let p = doc.data();

        html += `
          <div style="background:#fff;padding:10px;margin-bottom:10px;border-radius:8px;">
            <p>${p.texto}</p>
            <small>${p.data}</small>
          </div>
        `;

      });

      container.innerHTML = html;

    });

}

// ================= EXCLUIR PEDIDO =================
function excluirPedido(id){

  if(confirm("Deseja excluir este pedido?")){

    db.collection("pedidos")
      .doc(id)
      .delete()
      .then(() => {

        alert("Pedido excluído 🙏");

        pedidosRecebidos();

      })
      .catch((error) => {

        console.error("Erro ao excluir:", error);

      });

  }

}

// ================= ESTUDO BÍBLICO =================
function estudoBiblico(){

let lista = get("estudosBiblicos");
if(!Array.isArray(lista)) lista = [];

let html = `<h2>📚 Estudo Bíblico</h2>`;

/* ================= ADMIN ================= */
if(isAdmin()){
html += `
<div class="card">
<h3>➕ Novo Estudo</h3>

<input id="estTema" placeholder="Tema do estudo">
<textarea id="estTexto" placeholder="Conteúdo do estudo"></textarea>
<input id="estRef" placeholder="Referência bíblica">

<button onclick="addEstudo()">💾 Salvar Estudo</button>
</div>
`;
}

/* ================= LISTA ================= */
if(lista.length === 0){
html += `<div class="card">📭 Nenhum estudo publicado ainda.</div>`;
}

lista.forEach((e,i)=>{

html += `
<div class="card">
<h3>📖 ${e.tema}</h3>
<p>${e.texto}</p>
<small>📌 ${e.ref || ""}</small>
`;

if(isAdmin()){
html += `
<br><br>
<button onclick="delEstudo(${i})">🗑️ Excluir</button>
`;
}

html += `</div>`;
});

return html;
}

// ================= CARREGAR =================
function carregarEdicaoEstudo(i){

let lista = get("estudosBiblicos");
if(!Array.isArray(lista)) return;

let e = lista[i];

el("estTema").value = e.tema;
el("estTexto").value = e.texto;
el("estRef").value = e.ref || "";

// salva índice como número (CORRETO)
localStorage.setItem("editEstudoIndex", String(i));

// feedback visual
alert("Modo edição ativado ✏️");
}

// ================= SALVAR =================
function addEstudo(){

let lista = get("estudosBiblicos");
if(!Array.isArray(lista)) lista = [];

let tema = el("estTema").value.trim();
let texto = el("estTexto").value.trim();
let ref = el("estRef").value.trim();

if(!tema || !texto){
alert("Preencha todos os campos!");
return;
}

let editIndex = localStorage.getItem("editEstudoIndex");

if(editIndex !== null){

editIndex = parseInt(editIndex); // 🔥 FIX IMPORTANTE

lista[editIndex] = {tema,texto,ref};

localStorage.removeItem("editEstudoIndex");

}else{

lista.push({tema,texto,ref});
}

set("estudosBiblicos", lista);

el("estTema").value = "";
el("estTexto").value = "";
el("estRef").value = "";

// recarrega
abrirPagina("estudoBiblico");
}

// ================= EXCLUIR =================
function delEstudo(i){

let lista = get("estudosBiblicos");
if(!Array.isArray(lista)) lista = [];

lista.splice(i,1);

set("estudosBiblicos", lista);

abrirPagina("estudoBiblico");
}

// ================= BIBLIA =================
function biblia(){

  return `
    <h2>📖 Bíblia Sagrada</h2>

    <div class="card" style="padding:0; overflow:hidden;">

      <div style="padding:10px;background:#4CAF50;color:#fff;text-align:center;">
        Leitura da Bíblia Online
      </div>

      <iframe 
        src="https://bibliaonline.com.br/acf"
        style="width:100%;height:80vh;border:none;">
      </iframe>

    </div>
  `;
}

// ================= QUIZ =================
function quiz(){

const container = el("conteudoArea");

db.collection("quiz")
.get()
.then((querySnapshot)=>{

let html = "<h2>🧠 Quiz Bíblico</h2>";

if(isAdmin()){
html += `
<div class="card">
<h3>➕ Nova Pergunta</h3>

<input id="pergunta" placeholder="Pergunta">

<input id="op1" placeholder="Opção 1">
<input id="op2" placeholder="Opção 2">
<input id="op3" placeholder="Opção 3">
<input id="op4" placeholder="Opção 4">

<input id="correta" placeholder="Resposta correta (1-4)">

<button onclick="addQuiz()">💾 Salvar Pergunta</button>
</div>
`;
}

if(querySnapshot.empty){
html += "<p>Nenhuma pergunta cadastrada</p>";
}

querySnapshot.forEach((doc)=>{

let x = doc.data();

html += `
<div class="card">

<p><b>${x.pergunta}</b></p>

<button onclick="responderQuiz('${doc.id}',1)">
${x.op1}
</button>

<button onclick="responderQuiz('${doc.id}',2)">
${x.op2}
</button>

<button onclick="responderQuiz('${doc.id}',3)">
${x.op3}
</button>

<button onclick="responderQuiz('${doc.id}',4)">
${x.op4}
</button>
`;

if(isAdmin()){
html += `
<br><br>
<button onclick="delQuiz('${doc.id}')">
🗑️ Excluir pergunta
</button>
`;
}

html += `</div>`;
});

html += `
<button onclick="verRanking()">
🏆 Ver Ranking
</button>
`;

container.innerHTML = html;

})
.catch((error)=>{
console.error("Erro ao carregar quiz:", error);
container.innerHTML = "<p>Erro ao carregar quiz ❌</p>";
});

}

/* ================= ADMIN ================= */
if(isAdmin()){

html += `
<div class="card">
<h3>➕ Nova Pergunta</h3>

<input id="pergunta" placeholder="Pergunta">

<input id="op1" placeholder="Opção 1">
<input id="op2" placeholder="Opção 2">
<input id="op3" placeholder="Opção 3">
<input id="op4" placeholder="Opção 4">

<input id="correta" placeholder="Resposta correta (1-4)">

<button onclick="addQuiz()">💾 Salvar Pergunta</button>
</div>
`;

}

/* ================= LISTA ================= */
q.forEach((x,i)=>{

html += `
<div class="card">

<p><b>${x.pergunta}</b></p>

<button onclick="responderQuiz(${i},1)">
${x.op1}
</button>

<button onclick="responderQuiz(${i},2)">
${x.op2}
</button>

<button onclick="responderQuiz(${i},3)">
${x.op3}
</button>

<button onclick="responderQuiz(${i},4)">
${x.op4}
</button>
`;

if(isAdmin()){

html += `
<br><br>

<button onclick="delQuiz(${i})">
🗑️ Excluir pergunta
</button>
`;

}

html += `</div>`;

});

html += `
<button onclick="verRanking()">
🏆 Ver Ranking
</button>
`;

return html;

}

// ================= ADICIONAR PERGUNTA =================
function addQuiz(){

let pergunta = el("pergunta").value;
let op1 = el("op1").value;
let op2 = el("op2").value;
let op3 = el("op3").value;
let op4 = el("op4").value;
let correta = parseInt(el("correta").value);

if(!pergunta || !op1 || !op2 || !op3 || !op4){
alert("Preencha tudo");
return;
}

db.collection("quiz").add({
pergunta, op1, op2, op3, op4, correta
})
.then(()=>abrirPagina("quiz"));

}

// ================= DELETE QUIZ =================
function delQuiz(id){

if(confirm("Excluir pergunta?")){

db.collection("quiz").doc(id).delete()
.then(()=>abrirPagina("quiz"));

}

}

// ================= RESPONDER =================
function responderQuiz(id, resposta){

  db.collection("quiz").doc(id).get()
  .then((doc)=>{

    if(!doc.exists){
      alert("Pergunta não encontrada ❌");
      return;
    }

    let q = doc.data();

    let usuario = get("usuarioLogado");
    let user = usuario ? usuario.login : "anonimo";

    let pontos = get("pontos") || {};

    if(!pontos[user]){
      pontos[user] = 0;
    }

    if(q.correta === resposta){

      pontos[user]++;
      alert("✔ Resposta correta!");

    }else{

      alert("❌ Resposta errada!");

    }

    set("pontos", pontos);

  })
  .catch((error)=>{
    console.error("Erro ao responder:", error);
  });

}

// ================= RANKING (CAMPEONATO) =================
function verRanking(){

let p = JSON.parse(localStorage.getItem("pontos") || "{}");

let lista = [];

for(let u in p){
lista.push({u, pts:p[u]});
}

lista.sort((a,b)=>b.pts-a.pts);

let html = "<h2>🏆 Ranking - Campeonato</h2>";

if(lista.length === 0){
html += "<div class='card'>Nenhum jogador ainda.</div>";
return;
}

/* ================= TABELA ================= */
html += `
<div style="overflow-x:auto;">
<table style="
width:100%;
border-collapse:collapse;
background:#fff;
border-radius:10px;
overflow:hidden;
box-shadow:0 2px 10px rgba(0,0,0,0.1);
">

<thead>
<tr style="background:#4CAF50;color:#fff;">
<th style="padding:10px;">Posição</th>
<th>Jogador</th>
<th>Pontos</th>
</tr>
</thead>

<tbody>
`;

lista.forEach((x,index)=>{

let medalha = "";

if(index === 0) medalha = "🥇";
else if(index === 1) medalha = "🥈";
else if(index === 2) medalha = "🥉";

html += `
<tr style="text-align:center;border-bottom:1px solid #eee;">
<td style="padding:10px;">${medalha} ${index+1}º</td>
<td>${x.u}</td>
<td><b>${x.pts}</b></td>
</tr>
`;
});

html += `
</tbody>
</table>
</div>
`;

/* ================= BOTÃO VOLTAR ================= */
html += `
<br>
<div style="text-align:center;">
<button onclick="abrirPagina('quiz')" 
style="
padding:10px 20px;
background:#4CAF50;
color:#fff;
border:none;
border-radius:10px;
cursor:pointer;
font-size:16px;
">
⬅️ Voltar para o Quiz
</button>
</div>
`;

el("conteudoArea").innerHTML = html;
}

// ================= EBD =================
function ebd(){

let d = get("ebd") || {};

let html = "<h2>EBD</h2>";

if(isAdmin()){
html += `
<input id="tema" value="${d.tema||""}">
<textarea id="aula">${d.aula||""}</textarea>
<textarea id="ref">${d.ref||""}</textarea>
<button onclick="saveEbd()">Salvar</button>
<hr>
`;
}

html += `
<div class="card">
${d.tema||""}
<p>${d.aula||""}</p>
<p>${d.ref||""}</p>
</div>
`;

el("conteudoArea").innerHTML = html;
}

function saveEbd(){
set("ebd",{
tema:el("tema").value,
aula:el("aula").value,
ref:el("ref").value
});
ebd();
}

// ================= ANIVERSARIANTES =================
function aniversariantes(){

  const container = el("conteudoArea");

  let mesAtual = new Date().getMonth() + 1;

  db.collection("membros").get().then((querySnapshot)=>{

    let html = `<h2>🎂 Aniversariantes do Mês</h2>`;

    let encontrou = false;

    querySnapshot.forEach((doc)=>{

      let m = doc.data();

      if(!m.nascimento) return;

      let partes = m.nascimento.split("-");
      let mes = parseInt(partes[1]);

      if(mes === mesAtual){

        encontrou = true;

        html += `
          <div class="card">
            <h3>${m.nome}</h3>
            <p>${m.nascimento}</p>
          </div>
        `;
      }

    });

    if(!encontrou){
      html += `<p>Ninguém faz aniversário este mês</p>`;
    }

    container.innerHTML = html;

  });

}

// ================= LOGOUT =================
function logout(){
location.reload();
}
