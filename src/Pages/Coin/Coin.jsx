import React, { useContext, useEffect, useState } from 'react'
import './Coin.css'
import { useParams } from 'react-router-dom'
import { CoinContext } from '../../context/CoinContext'

const Coin = () => {
  const { coinId } = useParams()
  const { currency } = useContext(CoinContext)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCoin = async () => {
      setLoading(true)
      setError(null)
      try {
        const headers = { accept: 'application/json' }
        const apiKey = import.meta?.env?.VITE_CG_API_KEY
        if (apiKey) headers['x-cg-demo-api-key'] = apiKey
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`, { headers })
        if (!res.ok) throw new Error(`API error ${res.status}`)
        const json = await res.json()
        setData(json)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCoin()
  }, [coinId])

  if (loading) return <div className='coin container'>Loading...</div>
  if (error) return <div className='coin container error'>{error}</div>
  if (!data) return null

  const market = data.market_data
  const c = currency?.name || 'usd'
  const sym = currency?.symbol || '$'

  return (
    <div className='coin container'>
      <div className='coin-header'>
        <img src={data.image?.small} alt={data.name} />
        <h1>{data.name} <span>({data.symbol?.toUpperCase()})</span></h1>
      </div>
      <div className='coin-stats'>
        <div>
          <p className='label'>Current Price</p>
          <p className='value'>{sym}{market?.current_price?.[c]?.toLocaleString?.() ?? '—'}</p>
        </div>
        <div>
          <p className='label'>24h Change</p>
          <p className='value' style={{color: (market?.price_change_percentage_24h ?? 0) >= 0 ? 'green' : 'red'}}>
            {market?.price_change_percentage_24h?.toFixed?.(2)}%
          </p>
        </div>
        <div>
          <p className='label'>Market Cap</p>
          <p className='value'>{sym}{market?.market_cap?.[c]?.toLocaleString?.() ?? '—'}</p>
        </div>
        <div>
          <p className='label'>24h High / Low</p>
          <p className='value'>
            {sym}{market?.high_24h?.[c]?.toLocaleString?.() ?? '—'} / {sym}{market?.low_24h?.[c]?.toLocaleString?.() ?? '—'}
          </p>
        </div>
      </div>
      <div className='coin-desc' dangerouslySetInnerHTML={{__html: data.description?.en?.split('. ').slice(0,2).join('. ') || ''}} />
    </div>
  )
}

export default Coin
