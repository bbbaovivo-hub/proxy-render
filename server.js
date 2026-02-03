import express from "express";
import fetch from "node-fetch";

const app = express();

function limpar(html) {
  html = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  html = html.replace(/<iframe[\s\S]*?<\/iframe>/gi, "");
  html = html.replace(/\s+on\w+="[^"]*"/gi, "");
  html = html.replace(/<meta[^>]*refresh[^>]*>/gi, "");
  return html;
}

app.get("/", (req, res) => {
  res.send(`
    <h2>Proxy online ✅</h2>
    <p>Use assim:</p>
    <code>/proxy?url=https://site.com</code>
  `);
});

app.get("/proxy", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.send("Faltou ?url=");

  try {
    const r = await fetch(url);
    let html = await r.text();
    html = limpar(html);
    res.send(html);
  } catch (e) {
    res.send("Erro ao carregar o site");
  }
});

app.listen(3000, () => console.log("rodando"));
