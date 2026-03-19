export default async function handler(req, res) {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "date required" });

    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    const period1 = Math.floor(start.getTime() / 1000);
    const period2 = Math.floor(end.getTime() / 1000);

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/TQQQ?interval=1d&period1=${period1}&period2=${period2}`;
    const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const data = await response.json();

    const result = data?.chart?.result?.[0];
    const quote = result?.indicators?.quote?.[0];

    return res.status(200).json({
      date,
      open: quote?.open?.[0] ?? null,
      close: quote?.close?.[0] ?? null
    });
  } catch (e) {
    return res.status(500).json({ error: "fetch error", detail: String(e) });
  }
}
