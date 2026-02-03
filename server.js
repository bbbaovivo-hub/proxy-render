import express from "express";
import fetch from "node-fetch";

const app = express();

// Lista de domínios de anúncios comuns que queremos bloquear
const adDomains = [
  "doubleclick.net",
  "googlesyndication.com",
  "adsystem.com",
  "adservice.google.com"
];

function limpar(html) {
  // Remove iframes de anúncios externos
  html = html.replace(/<iframe[^>]*src=["'](https?:\/\/[^"']+)["'][^>]*><\/iframe>/gi, (match, src) => {
    for (let domain of adDomains) {
      if (src.includes(domain)) return ""; // remove iframe de anúncio
    }
    return match; // mantém outros iframes
  });

  // Remove inline event handlers (onclick, onload) que abrem pop-ups
  html = html.replace(/\s+on\w+="[^"]*"/gi, "");

  // Remove meta refresh que tenta redirecionar
  html = html.replace(/<meta[^>]*refresh[^>]*>/gi, "");

  // NÃO remove scripts essenciais do site
  // Mantemos todas as tags <script> para que o player funcione
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
    res.send("Erro ao carregar o site: " + e.message);
  }
});

app.listen(3000, () => console.log("Proxy rodando na porta 3000"));
