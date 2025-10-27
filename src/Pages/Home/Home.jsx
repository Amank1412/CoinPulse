import React, { useContext, useMemo, useState } from 'react';
import './Home.css';
import { CoinContext } from '../../context/CoinContext';
import { Link, useNavigate } from 'react-router-dom';
import { Sparklines, SparklinesLine } from 'react-sparklines';

const Home = () => {
  const { topCoins, allCoins, currency, loading, error } = useContext(CoinContext);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    if (!query.trim()) return topCoins;
    return allCoins.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.symbol.toLowerCase().includes(query.toLowerCase())
    );
  }, [topCoins, allCoins, query]);


  const suggestions = useMemo(() => {
    const base = query.trim() ? allCoins : allCoins; 
    const list = query.trim()
      ? base.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.symbol.toLowerCase().includes(query.toLowerCase()))
      : base;
    return list.slice(0, 100);
  }, [allCoins, query]);

  const firstCoinId = topCoins && topCoins.length > 0 ? topCoins[0].id : null;

  return (
    <div className='home'>
      <div className="hero hero-landing">
  <h1>Track wallet and exchange <br/>simplify your crypto life.</h1>
  <p className="subtitle">Connect your entire wallet to track, buy, swap, and stake your assets.</p>

        <div className="wallet-cards">
          <div className="card">
            <div className="card-ill"><img className="wallet-logo" src="https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png" alt="Binance"/></div>
            <div className="card-title">Binance</div>
            <div className="card-cta">Connect →</div>
          </div>
          <div className="card">
            <div className="card-ill">🦊</div>
            <div className="card-title">MetaMask</div>
            <div className="card-cta">Connect →</div>
          </div>
          
          <div className="card">
            <div className="card-ill">✨</div>
            <div className="card-title">Other</div>
            <div className="card-cta">Connect →</div>
          </div>
        </div>

        <form onSubmit={(e)=>e.preventDefault()} className="search-wrapper hero-search">
          <input
            type="text"
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            onFocus={()=>setOpen(true)}
            onBlur={()=>setTimeout(()=>setOpen(false), 120)}
            placeholder='Search wallet addresses, assets on any blockchain'
          />
          <button type="submit" onMouseDown={(e)=>{ e.preventDefault(); setOpen(true); }}>Search</button>
          {open && suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map(coin => (
                <div
                  key={coin.id}
                  className="suggestion-item"
                  onMouseDown={() => navigate(`/coin/${coin.id}`)}
                >
                  <img src={coin.image} alt={coin.name} />
                  <span className="name">{coin.name}</span>
                  <span className="symbol">{coin.symbol.toUpperCase()}</span>
                </div>
              ))}
            </div>
          )}
        </form>
      </div>

      <div className="crypto-table">
        <div className="crypto-box">
          <div className="table-layout">
          <p>#</p>
          <p>Coins</p>
          <p>Price</p>
          <p>24H Change</p>
          <p>Market Cap</p>
          <p>Price Graph</p>
          </div>
        {loading && <div className="table-row loading">Loading coins...</div>}
        {error && <div className="table-row error">{error}</div>}
        {!loading && !error && topCoins && topCoins.length > 0 && topCoins.slice(0,5).map((coin, idx) => (
          <Link className="table-layout row" key={coin.id} to={`/coin/${coin.id}`}>
            <p>{idx + 1}</p>
            <p style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <img src={coin.image} alt={coin.name} style={{width: '28px', height: '28px'}} />
              {coin.name} <span style={{color: '#888', fontSize: '13px'}}>{coin.symbol.toUpperCase()}</span>
            </p>
            <p>{currency.symbol}{coin.current_price.toLocaleString()}</p>
            <p style={{color: coin.price_change_percentage_24h >= 0 ? '#16a34a' : '#dc2626'}}>
              {coin.price_change_percentage_24h?.toFixed(2)}%
            </p>
            <p>{currency.symbol}{coin.market_cap.toLocaleString()}</p>
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
          <div className="see-more-wrap">
            {
              <button className="see-more" onClick={()=>navigate('/cryptocurrencies')}>See More Coins</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
