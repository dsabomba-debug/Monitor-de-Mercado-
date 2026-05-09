/* =============================================
   PANORAMA DE MERCADO — app.js
   ============================================= */

// ─────────────────────────────────────────────
// CONFIGURAÇÃO
// ─────────────────────────────────────────────

const CONFIG = {
  // 👇 Coloque seu token gratuito do https://brapi.dev aqui
  BRAPI_TOKEN: 'nd4i7finkKbGgXCdNBwAtt',

  // Atualização automática (em milissegundos) — padrão: 60 segundos
  REFRESH_INTERVAL: 60000,

  // Ações que serão buscadas na B3
  ACOES_B3: [
    'PETR4', 'VALE3', 'ITUB4', 'BBDC4', 'BBAS3',
    'ABEV3', 'WEGE3', 'RENT3', 'RADL3', 'MGLU3',
    'EQTL3', 'SUZB3', 'LREN3', 'JBSS3', 'HYPE3',
  ],

  // Criptomoedas (IDs do CoinGecko)
  CRYPTOS: [
    'bitcoin', 'ethereum', 'binancecoin', 'solana',
    'ripple', 'cardano', 'dogecoin', 'tron', 'polkadot', 'chainlink',
  ],
};

// ─────────────────────────────────────────────
// HELPERS DE FORMATAÇÃO
// ─────────────────────────────────────────────

const fmt = {
  brl: (v) => {
    if (v === null || v === undefined || isNaN(v)) return '--';
    return Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },
  brl4: (v) => {
    if (v === null || v === undefined || isNaN(v)) return '--';
    return Number(v).toFixed(4).replace('.', ',');
  },
  pct: (v) => {
    if (v === null || v === undefined || isNaN(v)) return '--';
    const sign = v >= 0 ? '+' : '';
    return sign + Number(v).toFixed(2).replace('.', ',') + '%';
  },
  cap: (v) => {
    if (!v) return '--';
    if (v >= 1e12) return 'R$ ' + (v / 1e12).toFixed(2) + 'T';
    if (v >= 1e9)  return 'R$ ' + (v / 1e9).toFixed(1) + 'B';
    if (v >= 1e6)  return 'R$ ' + (v / 1e6).toFixed(0) + 'M';
    return 'R$ ' + v.toLocaleString('pt-BR');
  },
  hora: (timestamp) => {
    if (!timestamp) return '--';
    return new Date(timestamp * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  },
};

const cls = (v) => (v > 0 ? 'up' : v < 0 ? 'down' : 'neutral');

function badge(v) {
  const c = cls(v);
  const arrow = v > 0 ? '▲' : v < 0 ? '▼' : '–';
  return `<span class="badge ${c}">${arrow} ${fmt.pct(v)}</span>`;
}

// ─────────────────────────────────────────────
// CARDS DE DESTAQUE
// ─────────────────────────────────────────────

function setHighlight(id, value, change) {
  const card = document.getElementById(id);
  if (!card) return;
  card.querySelector('.h-value').textContent = value;
  const chEl = card.querySelector('.h-change');
  chEl.textContent = fmt.pct(change) + ' hoje';
  chEl.className = 'h-change ' + cls(change);
}

// ─────────────────────────────────────────────
// CÂMBIO — AwesomeAPI
// ─────────────────────────────────────────────

const PARES_CAMBIO = [
  { code: 'USD-BRL', nome: 'Dólar Americano',    flag: '🇺🇸' },
  { code: 'EUR-BRL', nome: 'Euro',                flag: '🇪🇺' },
  { code: 'GBP-BRL', nome: 'Libra Esterlina',    flag: '🇬🇧' },
  { code: 'JPY-BRL', nome: 'Iene Japonês',        flag: '🇯🇵' },
  { code: 'CAD-BRL', nome: 'Dólar Canadense',    flag: '🇨🇦' },
  { code: 'AUD-BRL', nome: 'Dólar Australiano',  flag: '🇦🇺' },
  { code: 'CHF-BRL', nome: 'Franco Suíço',        flag: '🇨🇭' },
  { code: 'ARS-BRL', nome: 'Peso Argentino',      flag: '🇦🇷' },
  { code: 'CNY-BRL', nome: 'Yuan Chinês',         flag: '🇨🇳' },
  { code: 'MXN-BRL', nome: 'Peso Mexicano',       flag: '🇲🇽' },
];

async function loadCambio() {
  try {
    const codes = PARES_CAMBIO.map(p => p.code).join(',');
    const res = await fetch(`https://economia.awesomeapi.com.br/json/last/${codes}`);
    const data = await res.json();

    let rows = '';
    for (const par of PARES_CAMBIO) {
      const key = par.code.replace('-', '');
      const d = data[key];
      if (!d) continue;
      const pct  = parseFloat(d.pctChange);
      const bid  = parseFloat(d.bid);
      const ask  = parseFloat(d.ask);
      const low  = parseFloat(d.low);
      const high = parseFloat(d.high);

      rows += `<tr>
        <td>${par.flag} ${par.nome}</td>
        <td>${fmt.brl4(bid)}</td>
        <td>${fmt.brl4(bid)}</td>
        <td>${fmt.brl4(ask)}</td>
        <td>${fmt.brl4(low)}</td>
        <td>${fmt.brl4(high)}</td>
        <td>${badge(pct)}</td>
      </tr>`;
    }
    document.getElementById('tb-cambio').innerHTML = rows;

    // Highlights
    const usd = data['USDBRL'];
    const eur = data['EURBRL'];
    if (usd) setHighlight('hc-dolar', 'R$ ' + fmt.brl4(parseFloat(usd.bid)), parseFloat(usd.pctChange));
    if (eur) setHighlight('hc-euro',  'R$ ' + fmt.brl4(parseFloat(eur.bid)), parseFloat(eur.pctChange));

  } catch (e) {
    document.getElementById('tb-cambio').innerHTML =
      `<tr class="skeleton"><td colspan="7">Erro ao buscar câmbio. Verifique a conexão.</td></tr>`;
    console.error('Erro câmbio:', e);
  }
}

// ─────────────────────────────────────────────
// EMERGENTES — AwesomeAPI
// ─────────────────────────────────────────────

const PARES_EMERGENTES = [
  { code: 'USD-BRL', nome: 'USD/BRL — Real Brasileiro',      flag: '🇧🇷' },
  { code: 'USD-ARS', nome: 'USD/ARS — Peso Argentino',       flag: '🇦🇷' },
  { code: 'USD-MXN', nome: 'USD/MXN — Peso Mexicano',        flag: '🇲🇽' },
  { code: 'USD-CLP', nome: 'USD/CLP — Peso Chileno',         flag: '🇨🇱' },
  { code: 'USD-COP', nome: 'USD/COP — Peso Colombiano',      flag: '🇨🇴' },
  { code: 'USD-TRY', nome: 'USD/TRY — Lira Turca',           flag: '🇹🇷' },
  { code: 'USD-ZAR', nome: 'USD/ZAR — Rand Sul-Africano',    flag: '🇿🇦' },
  { code: 'USD-INR', nome: 'USD/INR — Rúpia Indiana',        flag: '🇮🇳' },
  { code: 'USD-CNY', nome: 'USD/CNY — Yuan Chinês',          flag: '🇨🇳' },
  { code: 'USD-KRW', nome: 'USD/KRW — Won Coreano',          flag: '🇰🇷' },
];

async function loadEmergentes() {
  try {
    const codes = PARES_EMERGENTES.map(p => p.code).join(',');
    const res = await fetch(`https://economia.awesomeapi.com.br/json/last/${codes}`);
    const data = await res.json();

    let rows = '';
    for (const par of PARES_EMERGENTES) {
      const key = par.code.replace('-', '');
      const d = data[key];
      if (!d) continue;
      const pct = parseFloat(d.pctChange);
      const bid = parseFloat(d.bid);
      const ask = parseFloat(d.ask);

      rows += `<tr>
        <td>${par.flag} ${par.nome}</td>
        <td>${fmt.brl4(bid)}</td>
        <td>${fmt.brl4(bid)}</td>
        <td>${fmt.brl4(ask)}</td>
        <td>${badge(pct)}</td>
      </tr>`;
    }
    document.getElementById('tb-emergentes').innerHTML = rows;

  } catch (e) {
    document.getElementById('tb-emergentes').innerHTML =
      `<tr class="skeleton"><td colspan="5">Erro ao buscar emergentes.</td></tr>`;
    console.error('Erro emergentes:', e);
  }
}

// ─────────────────────────────────────────────
// CRIPTOMOEDAS — CoinGecko (gratuito)
// ─────────────────────────────────────────────

async function loadCripto() {
  try {
    const ids = CONFIG.CRYPTOS.join(',');
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&ids=${ids}&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=7d`;
    const res = await fetch(url);
    const data = await res.json();

    let rows = '';
    data.forEach((c, i) => {
      const p24 = c.price_change_percentage_24h || 0;
      const p7  = c.price_change_percentage_7d_in_currency || 0;

      rows += `<tr>
        <td style="color:var(--text3)">${i + 1}</td>
        <td>
          <strong>${c.name}</strong>
          <span class="ticker-name">${c.symbol.toUpperCase()}</span>
        </td>
        <td>R$ ${fmt.brl(c.current_price)}</td>
        <td>${badge(p24)}</td>
        <td class="${cls(p7)}">${fmt.pct(p7)}</td>
        <td style="color:var(--text3)">${fmt.cap(c.market_cap)}</td>
        <td style="color:var(--text3)">${fmt.cap(c.total_volume)}</td>
      </tr>`;
    });
    document.getElementById('tb-cripto').innerHTML = rows;

    // Highlights
    const btc = data.find(c => c.id === 'bitcoin');
    const eth = data.find(c => c.id === 'ethereum');
    if (btc) setHighlight('hc-btc', 'R$ ' + fmt.brl(btc.current_price), btc.price_change_percentage_24h);
    if (eth) setHighlight('hc-eth', 'R$ ' + fmt.brl(eth.current_price), eth.price_change_percentage_24h);

  } catch (e) {
    document.getElementById('tb-cripto').innerHTML =
      `<tr class="skeleton"><td colspan="7">Erro ao buscar criptomoedas. Tente em instantes.</td></tr>`;
    console.error('Erro cripto:', e);
  }
}

// ─────────────────────────────────────────────
// AÇÕES B3 — Brapi.dev
// ─────────────────────────────────────────────

async function loadAcoes() {
  try {
    const tickers = CONFIG.ACOES_B3.join(',');
    const url = `https://brapi.dev/api/quote/${tickers}?token=${CONFIG.BRAPI_TOKEN}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      document.getElementById('tb-acoes').innerHTML =
        `<tr class="skeleton"><td colspan="7">Limite de requisições atingido. 
         <a href="https://brapi.dev" target="_blank">Obtenha seu token gratuito em brapi.dev</a> 
         e insira em CONFIG.BRAPI_TOKEN no app.js</td></tr>`;
      return;
    }

    let rows = '';
    data.results.forEach(s => {
      const chg  = s.regularMarketChange || 0;
      const pct  = s.regularMarketChangePercent || 0;
      const open = s.regularMarketOpen || 0;

      rows += `<tr>
        <td>
          <strong>${s.symbol}</strong>
          <span class="ticker-name">${(s.shortName || '').substring(0, 16)}</span>
        </td>
        <td style="display:none"></td>
        <td>R$ ${fmt.brl(s.regularMarketPrice)}</td>
        <td class="${cls(chg)}">${chg >= 0 ? '+' : ''}${fmt.brl(chg)}</td>
        <td>${badge(pct)}</td>
        <td style="color:var(--text3)">R$ ${fmt.brl(open)}</td>
        <td style="color:var(--text3)">${fmt.hora(s.regularMarketTime)}</td>
      </tr>`;
    });
    document.getElementById('tb-acoes').innerHTML = rows;

  } catch (e) {
    document.getElementById('tb-acoes').innerHTML =
      `<tr class="skeleton"><td colspan="7">Erro ao buscar ações B3.</td></tr>`;
    console.error('Erro ações:', e);
  }
}

// ─────────────────────────────────────────────
// ÍNDICE DXY — estimado via AwesomeAPI (EUR/USD)
// ─────────────────────────────────────────────

async function loadDXY() {
  try {
    const res = await fetch('https://economia.awesomeapi.com.br/json/last/EUR-USD,GBP-USD,JPY-USD');
    const data = await res.json();
    // Aproximação do DXY: 57.6% EUR, 11.9% JPY, 11.9% GBP
    const eur = parseFloat(data['EURUSD']?.bid || 0);
    const dxy = eur > 0 ? (100 * (1 / eur) * 0.576 + 100 * 0.424).toFixed(3) : '--';
    const pct = parseFloat(data['EURUSD']?.pctChange || 0);
    setHighlight('hc-dxy', dxy, -pct);
  } catch(e) {
    console.error('Erro DXY:', e);
  }
}

// ─────────────────────────────────────────────
// TABS
// ─────────────────────────────────────────────

document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.dataset.tab;
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + tabName).classList.add('active');
  });
});

// ─────────────────────────────────────────────
// RELÓGIO E ATUALIZAÇÃO
// ─────────────────────────────────────────────

function updateClock() {
  const now = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
  const el = document.getElementById('update-time');
  if (el) el.textContent = now;
}

async function loadAll() {
  const btn = document.getElementById('btn-refresh');
  if (btn) btn.disabled = true;

  await Promise.allSettled([
    loadCambio(),
    loadEmergentes(),
    loadCripto(),
    loadAcoes(),
    loadDXY(),
  ]);

  updateClock();
  if (btn) btn.disabled = false;
}

// ─────────────────────────────────────────────
// INICIALIZAÇÃO
// ─────────────────────────────────────────────

loadAll();
setInterval(loadAll, CONFIG.REFRESH_INTERVAL);
setInterval(updateClock, 1000);
