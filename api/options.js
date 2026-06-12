export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { symbol, expiration } = req.query;
  if (!symbol) return res.status(400).json({ error: 'symbol required' });

  const key = process.env.ALPACA_API_KEY;
  const secret = process.env.ALPACA_API_SECRET;
  if (!key || !secret) return res.status(500).json({ error: 'API keys not configured' });

  try {
    const headers = {
      'APCA-API-KEY-ID': key,
      'APCA-API-SECRET-KEY': secret,
    };

    let url = `https://data.alpaca.markets/v1beta1/options/snapshots/${symbol}?limit=100&feed=indicative`;
    if (expiration) url += `&expiration_date=${expiration}`;

    const response = await fetch(url, { headers });
    const data = await response.json();

    const snapshots = data.snapshots || {};
    const contracts = Object.entries(snapshots).map(([sym, snap]) => {
      const parts = sym.match(/([A-Z]+)(\d{6})([CP])(\d+)/);
      if (!parts) return null;
      const [, , dateStr, type, strikeCents] = parts;
      const year = '20' + dateStr.slice(0, 2);
      const month = dateStr.slice(2, 4);
      const day = dateStr.slice(4, 6);
      return {
        symbol: sym,
        type: type === 'C' ? 'call' : 'put',
        strike: parseInt(strikeCents) / 1000,
        expiration: `${year}-${month}-${day}`,
        greeks: snap.greeks || {},
        impliedVolatility: snap.impliedVolatility || null,
        openInterest: snap.openInterest || 0,
        latestQuote: snap.latestQuote || {},
      };
    }).filter(Boolean);

    res.status(200).json({ symbol: symbol.toUpperCase(), contracts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
