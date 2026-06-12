export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: 'symbol required' });

  const key = process.env.ALPACA_API_KEY;
  const secret = process.env.ALPACA_API_SECRET;
  if (!key || !secret) return res.status(500).json({ error: 'API keys not configured' });

  try {
    const headers = {
      'APCA-API-KEY-ID': key,
      'APCA-API-SECRET-KEY': secret,
    };

    const [quoteRes, barRes] = await Promise.all([
      fetch(`https://data.alpaca.markets/v2/stocks/${symbol}/quotes/latest`, { headers }),
      fetch(`https://data.alpaca.markets/v2/stocks/${symbol}/bars/latest?feed=iex`, { headers }),
    ]);

    const [quoteData, barData] = await Promise.all([quoteRes.json(), barRes.json()]);

    res.status(200).json({
      symbol: symbol.toUpperCase(),
      quote: quoteData.quote || null,
      bar: barData.bar || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
