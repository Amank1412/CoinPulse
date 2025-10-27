import React, { useContext, useRef } from 'react'
import './Navbar.css'
import { CoinContext } from '../../context/CoinContext'
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const { currency, setCurrency } = useContext(CoinContext)
  const selectRef = useRef(null)

  const bump = () => {
    const el = selectRef.current
    if (el) {
      el.classList.remove('currency-bump')
      void el.offsetWidth
      el.classList.add('currency-bump')
      setTimeout(() => el.classList.remove('currency-bump'), 350)
    }
  }

  const handleCurrencyChange = (e) => {
    const val = e.target.value
    const map = { usd: '$', eur: '€', inr: '₹' }
    setCurrency({ name: val, symbol: map[val] || '$' })
    bump()
  }

  return (
    <>
      <div className='navbar'>
      <Link to="/" className="brand" style={{ textDecoration: 'none' }}>
        <img src={logo} alt="logo" className="brand-logo" />
        <span className="logo-text">CoinPulse</span>
      </Link>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li>Features</li>
        <li>Pricing</li>
        <li><Link to="/cryptocurrencies">Cryptocurrencies</Link></li>
      </ul>
      <div className="nav-right">
        <select
          ref={selectRef}
          value={currency?.name}
          onChange={handleCurrencyChange}
          onFocus={bump}
          onMouseDown={bump}
          onBlur={() => {
            const el = selectRef.current
            if (el) el.classList.remove('currency-bump')
          }}
        >
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="inr">INR</option>
        </select>
        <button>Sign up</button>
      </div>
      </div>
    </>
  )
}

export default Navbar
