# 📊 Panorama de Mercado

App de cotações financeiras em tempo real — Câmbio, Criptomoedas, Ações B3 e Emergentes.

---

## 🚀 Como usar localmente

1. Baixe os 3 arquivos: `index.html`, `style.css`, `app.js`
2. Coloque todos na mesma pasta
3. Abra o `index.html` no navegador — pronto!

---

## 🌐 Como hospedar online GRÁTIS (Vercel)

### Passo 1 — Criar conta no GitHub (se não tiver)
- Acesse: https://github.com
- Clique em "Sign up" e crie sua conta gratuita

### Passo 2 — Criar repositório no GitHub
1. Clique no botão **"+"** no canto superior direito → "New repository"
2. Nome: `panorama-mercado`
3. Deixe como **Public**
4. Clique em **"Create repository"**
5. Siga as instruções para subir os 3 arquivos

### Passo 3 — Hospedar no Vercel
1. Acesse: https://vercel.com
2. Clique em **"Sign up"** → entre com sua conta GitHub
3. Clique em **"Add New Project"**
4. Selecione o repositório `panorama-mercado`
5. Clique em **"Deploy"**
6. Em 1 minuto seu app estará online com uma URL tipo:
   `https://panorama-mercado.vercel.app`

---

## 🔑 Configurações importantes (app.js)

Abra o arquivo `app.js` e localize a seção `CONFIG` no topo:

```javascript
const CONFIG = {
  // Token gratuito do Brapi (para ações B3)
  // Cadastre em: https://brapi.dev
  BRAPI_TOKEN: 'demo',  // ← Troque pelo seu token

  // Intervalo de atualização em milissegundos
  // 60000 = 60 segundos
  REFRESH_INTERVAL: 60000,

  // Ações que serão buscadas
  ACOES_B3: ['PETR4', 'VALE3', 'ITUB4', ...],

  // Criptomoedas (IDs do CoinGecko)
  CRYPTOS: ['bitcoin', 'ethereum', ...],
};
```

### Como obter o token GRATUITO do Brapi:
1. Acesse https://brapi.dev
2. Clique em "Começar Gratuitamente"
3. Crie sua conta
4. Copie seu token
5. Cole em `BRAPI_TOKEN: 'seu-token-aqui'`

---

## 📡 APIs utilizadas (todas gratuitas)

| API | O que faz | Limite gratuito |
|-----|-----------|-----------------|
| [AwesomeAPI](https://economia.awesomeapi.com.br) | Câmbio em tempo real | Sem limite |
| [CoinGecko](https://coingecko.com/api) | Criptomoedas | 10–30 req/min |
| [Brapi.dev](https://brapi.dev) | Ações B3 | 1.000 req/mês (demo) / mais com token grátis |

---

## ⚙️ Como adicionar mais ações

No `app.js`, localize `ACOES_B3` e adicione o ticker:

```javascript
ACOES_B3: [
  'PETR4', 'VALE3', 'ITUB4', 'BBDC4',
  'GGBR4',  // ← Gerdau, por exemplo
  'TOTS3',  // ← TOTVS
],
```

Qualquer ticker da B3 funciona!

---

## 🎨 Como personalizar as cores

No `style.css`, localize `:root` e troque os valores:

```css
:root {
  --bg:     #0a0c0f;    /* fundo principal */
  --accent: #f0c040;    /* cor de destaque (amarelo) */
  --up:     #2ecc71;    /* cor de alta (verde) */
  --down:   #e74c3c;    /* cor de baixa (vermelho) */
}
```

---

## 📱 Funcionalidades

- ✅ Câmbio em tempo real (10 moedas)
- ✅ Dólar x Emergentes (10 pares)
- ✅ Criptomoedas em BRL (10 moedas)
- ✅ Ações B3 (15 ativos)
- ✅ Cards de destaque (Dólar, Euro, BTC, ETH, DXY)
- ✅ Atualização automática a cada 60s
- ✅ Botão de atualização manual
- ✅ Responsivo (funciona no celular)
- ✅ Tema dark profissional

---

## 🔮 Próximas melhorias (fase 2)

- [ ] Índices globais (S&P 500, Nasdaq, Ibovespa)
- [ ] Commodities (Petróleo, Ouro, Prata)
- [ ] Gráficos de variação intraday
- [ ] Notificações de variação
- [ ] Login de usuários
- [ ] Favoritos personalizados

---

Desenvolvido com ❤️ — Dados para fins informativos.
