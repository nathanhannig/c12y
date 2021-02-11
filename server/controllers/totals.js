const getTotals = (req, res) => {
  const { data } = req.app.locals

  const totals = {
    totalMarketCap: data.totalMarketCap,
    totalVolume24h: data.totalVolume24h,
    totalCoins: Object.keys(data.coins).length,
    btcDominance: data.btcDominance,
  }

  return res.send({
    data: totals,
    lastUpdated: data.lastUpdated,
  })
}

export { getTotals }
