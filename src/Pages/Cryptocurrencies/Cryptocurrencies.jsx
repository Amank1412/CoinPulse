import React, { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CoinContext } from '../../context/CoinContext'
import { Sparklines, SparklinesLine } from 'react-sparklines'
import '../Home/Home.css'

const Cryptocurrencies = () => {
  const { allCoins, loading, error, currency } = useContext(CoinContext)

  const marketSummary = useMemo(() => {
    if (!Array.isArray(allCoins) || allCoins.length === 0) return null

    const totalMarketCap = allCoins.reduce((s, c) => s + (c.market_cap || 0), 0)
    const totalVolume = allCoins.reduce((s, c) => s + (c.total_volume || c.volume || 0), 0)

    
    const prevTotalMarketCap = allCoins.reduce((s, c) => {
      const change = (c.price_change_percentage_24h ?? 0) / 100
      const prev = change !== -1 ? ((c.market_cap || 0) / (1 + change)) : (c.market_cap || 0)
      return s + (isFinite(prev) ? prev : 0)
    }, 0)

    const marketCapChangePct = prevTotalMarketCap > 0 ? ((totalMarketCap - prevTotalMarketCap) / prevTotalMarketCap) * 100 : 0

    
    const btc = allCoins.find(c => c.id === 'bitcoin' || c.symbol === 'btc')
    const btcMarketCap = btc?.market_cap || 0
    const btcDominance = totalMarketCap > 0 ? (btcMarketCap / totalMarketCap) * 100 : 0

    return {
      totalMarketCap,
      totalVolume,
      marketCapChangePct,
      btcDominance,
    }
  }, [allCoins])

  return (
    <div className="home">

      {marketSummary && (
        <div className="market-summary">
          <div className="market-summary-inner">
            <h2>Today's Crypto Prices by Market Cap</h2>
            <p className="market-summary-desc">The worldwide cryptocurrency market capitalization today stands at an estimated {currency?.symbol}{marketSummary.totalMarketCap.toLocaleString()} , seeing a {marketSummary.marketCapChangePct.toFixed(2)}% movement over the last 24 hours. The total cryptocurrency trading volume in the past day is roughly {currency?.symbol}{marketSummary.totalVolume.toLocaleString()}. Bitcoin's market dominance is at about {marketSummary.btcDominance.toFixed(1)}%.</p>

            <div className="metric-cards">
              <div className="metric-card">
                <div className="metric-label">Market Cap</div>
                <div className="metric-value">{currency?.symbol}{marketSummary.totalMarketCap.toLocaleString()}</div>
                <div className="metric-change">▲ {marketSummary.marketCapChangePct.toFixed(2)}%</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Volume 24h</div>
                <div className="metric-value">{currency?.symbol}{marketSummary.totalVolume.toLocaleString()}</div>
                <div className="metric-change">▲ {Math.abs(marketSummary.marketCapChangePct).toFixed(1)}%</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">BTC Dominance</div>
                <div className="metric-value">{marketSummary.btcDominance.toFixed(1)}%</div>
                <div className="metric-change">▲ 0.12%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="crypto-table">
  <div className="crypto-box" style={{maxWidth: '1280px', margin: '30px auto'}}>
          <div className="table-layout header">
            <p>#</p>
            <p>Name</p>
            <p>Price</p>
            <p>24H</p>
            <p>Market Cap</p>
            <p>Chart</p>
          </div>

          {loading && <div className="table-row loading">Loading coins...</div>}
          {error && <div className="table-row error">{error}</div>}

          {!loading && !error && Array.isArray(allCoins) && allCoins.slice(0,100).map((coin, idx) => (
            <Link className="table-layout row" key={coin.id} to={`/coin/${coin.id}`}>
              <p>{idx + 1}</p>
              <p style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <img src={coin.image} alt={coin.name} style={{width: '28px', height: '28px'}} />
                {coin.name} <span style={{color: '#888', fontSize: '13px'}}>{coin.symbol.toUpperCase()}</span>
              </p>
              <p>{currency?.symbol}{coin.current_price?.toLocaleString?.()}</p>
              <p style={{color: (coin.price_change_percentage_24h ?? 0) >= 0 ? '#16a34a' : '#dc2626'}}>
                {coin.price_change_percentage_24h != null ? coin.price_change_percentage_24h.toFixed(2) + '%' : '—'}
              </p>
              <p>{currency?.symbol}{coin.market_cap?.toLocaleString?.()}</p>
              <p className="sparkline-cell">
                {coin.sparkline_in_7d?.price ? (
                  <Sparklines data={coin.sparkline_in_7d.price.slice(-50)} svgWidth={120} svgHeight={30}>
                    <SparklinesLine color={(coin.sparkline_in_7d.price.at(-1) - coin.sparkline_in_7d.price[0]) >= 0 ? '#16a34a' : '#dc2626'} style={{ fill: 'none' }} />
                  </Sparklines>
                ) : (
                  <span style={{color:'#888', fontSize:12}}>—</span>
                )}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Cryptocurrencies
