import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("🚀 Proxy Render ativo!");
});

app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).send("❌ URL não informada");
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const body = await response.text();

    res.send(body);
  } catch (err) {
    res.status(500).send("Erro no proxy: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log("Proxy rodando na porta", PORT);
});
