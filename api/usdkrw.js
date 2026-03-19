export default async function handler(req, res) {
  try {
    const url = "https://query1.finance.yahoo.com/v8/finance/chart/USDKRW=X?interval=1d&range=1mo";
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    if (!response.ok) {
      return res.status(500).json({ error: "Yahoo response error" });
    }

    const data = await response.json();
    const result = data?.chart?.result?.[0];
    const meta = result?.meta;

    if (!result || !meta) {
      return res.status(500).json({ error: "Invalid Yahoo data" });
    }

    const currentPrice = meta.regularMarketPrice ?? meta.previousClose ?? null;

    return res.status(200).json({
      symbol: "USDKRW",
      currentPrice,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      detail: String(error)
    });
  }
}
