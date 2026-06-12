export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { symbol, timeframe = '1Day', limit = 30 } = req.query;
  if (!symbol) return res.status(400).json({ error: 'symbol required' });

  const key = process.env.ALPACA_API_KEY;
  const secret = process.env.ALPACA_API_SECRET;
  if (!key || !secret) return res.status(500).json({ error: 'API keys not configured' });

  try {
    const end = new Date().toISOString();
    const start = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();

    const url = `https://data.alpaca.markets/v2/stocks/${symbol}/bars?timeframe=${timeframe}&start=${start}&end=${end}&limit=${limit}&feed=iex&sort=asc`;

    const response = await fetch(url, {
      headers: {
        'APCA-API-KEY-ID': key,
        'APCA-API-SECRET-KEY': secret,
      },
    });

    const data = await response.json();
    res.status(200).json({ symbol: symbol.toUpperCase(), bars: data.bars || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
